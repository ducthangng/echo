"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  Square,
  ArrowLeft,
  Volume2,
  Languages,
  StickyNote,
  Bug,
} from "lucide-react";
import Link from "next/link";
import { SpeakingTask } from "@/src/lib/data";

// --- TypeScript Declaration for Web Speech API ---
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}
// ---------------------------------------------------

interface ShadowingClientProps {
  task: SpeakingTask;
}

const mockCheckPronunciation = (word: string): boolean => {
  return Math.random() > 0.2;
};

const mockTranslate = (text: string): string => {
  return `[Translation of "${text}"]`;
};

const ShadowingClient: React.FC<ShadowingClientProps> = ({ task }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [wordStatuses, setWordStatuses] = useState<
    Record<string, "neutral" | "correct" | "incorrect">
  >({});

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    text: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    text: "",
  });

  // Real-time Transcript & Debug
  const [transcript, setTranscript] = useState<string>("");

  // --- Custom Selection State ---
  const [selectionRange, setSelectionRange] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const currentWordIndexRef = useRef(0);

  const levelConfig: Record<string, { bg: string; text: string }> = {
    Beginner: { bg: "bg-emerald-100", text: "text-emerald-700" },
    Intermediate: { bg: "bg-amber-100", text: "text-amber-700" },
    Advanced: { bg: "bg-rose-100", text: "text-rose-700" },
  };

  const words = task.content.split(/(\s+)/);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  // Hide context menu on global click
  useEffect(() => {
    const handleClick = () =>
      setContextMenu((prev) => ({ ...prev, visible: false }));
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  // --- Helpers ---

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // --- Custom Selection Logic ---

  // Only start selection on LEFT click (button 0)
  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    if (isRecording) return;
    if (e.button !== 0) return;

    setIsSelecting(true);
    setSelectionRange({ start: index, end: index });
  };

  const handleMouseEnter = (index: number) => {
    if (!isSelecting) return;

    setSelectionRange((prev) => {
      if (!prev) return null;
      return { ...prev, end: index };
    });
  };

  const handleMouseUp = () => {
    if (!isSelecting) return;
    setIsSelecting(false);

    // Speak the selected text
    if (selectionRange) {
      const min = Math.min(selectionRange.start, selectionRange.end);
      const max = Math.max(selectionRange.start, selectionRange.end);
      const selectedText = words.slice(min, max + 1).join("");
      if (selectedText.trim()) {
        speakText(selectedText);
      }
    }
  };

  // --- Context Menu Logic (Right Click) ---

  const handleContextMenu = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    let textToUse = "";

    // 1. Check if the right-click happened INSIDE an existing selection
    if (selectionRange) {
      const min = Math.min(selectionRange.start, selectionRange.end);
      const max = Math.max(selectionRange.start, selectionRange.end);

      if (index >= min && index <= max) {
        // Clicked inside selection -> Use the whole selection
        textToUse = words
          .slice(min, max + 1)
          .join("")
          .trim();
      }
    }

    // 2. If not inside selection (or no selection), use just the clicked word
    if (!textToUse) {
      setSelectionRange({ start: index, end: index }); // Update visual selection to single word
      textToUse = words[index];
    }

    if (textToUse) {
      setContextMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        text: textToUse,
      });
    }
  };

  const handleTranslate = () => {
    alert(mockTranslate(contextMenu.text));
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  const handleNoteDown = () => {
    alert(`"${contextMenu.text}" added to notes!`);
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  // --- Recording Logic ---

  const initSpeechRecognition = (): SpeechRecognition | null => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return null;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      // Update state for UI display
      setTranscript(finalTranscript + interimTranscript);
    };
    recognition.onerror = (event) =>
      console.error("Speech recognition error", event.error);
    return recognition;
  };

  const handleStartRecording = async () => {
    try {
      setAudioURL(null);
      audioChunksRef.current = [];
      setTimer(0);
      setWordStatuses({});
      setTranscript(""); // Reset transcript
      setSelectionRange(null);
      currentWordIndexRef.current = 0;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        stream.getTracks().forEach((track) => track.stop());
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
      };

      mediaRecorder.start();
      setIsRecording(true);

      const recognition = initSpeechRecognition();
      if (recognition) {
        recognitionRef.current = recognition;
        recognition.start();
      }

      timerIntervalRef.current = setInterval(
        () => setTimer((prev) => prev + 1),
        1000,
      );

      const actualWords = words.filter((w) => w.trim().length > 0);
      checkIntervalRef.current = setInterval(() => {
        const wordIndex = currentWordIndexRef.current;
        if (wordIndex < actualWords.length) {
          const currentWord = actualWords[wordIndex];
          const isCorrect = mockCheckPronunciation(currentWord);
          const originalIndex = words.indexOf(currentWord);

          setWordStatuses((prev) => ({
            ...prev,
            [originalIndex]: isCorrect ? "correct" : "incorrect",
          }));

          currentWordIndexRef.current++;
        } else {
          if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
        }
      }, 800);
    } catch (err) {
      console.error("Microphone error:", err);
      alert("Could not access microphone.");
    }
  };

  const handleStopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const isHighlighted = (index: number) => {
    if (!selectionRange) return false;
    const min = Math.min(selectionRange.start, selectionRange.end);
    const max = Math.max(selectionRange.start, selectionRange.end);
    return index >= min && index <= max;
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 relative">
      {/* Context Menu Bubble */}
      {contextMenu.visible && (
        <div
          style={{ top: contextMenu.y - 50, left: contextMenu.x }}
          className="fixed z-50 flex items-center gap-1 bg-white shadow-xl rounded-full border border-slate-200 p-1"
        >
          <button
            onClick={handleTranslate}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <Languages className="w-3.5 h-3.5" /> Translate
          </button>
          <div className="w-px h-4 bg-slate-200" />
          <button
            onClick={handleNoteDown}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-600"
          >
            <StickyNote className="w-3.5 h-3.5" /> Note
          </button>
        </div>
      )}

      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-800">{task.title}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-semibold ${levelConfig[task.level].bg} ${levelConfig[task.level].text}`}
              >
                {task.level}
              </span>
              <span className="text-xs text-slate-500">
                {task.wordCount} words
              </span>
            </div>
          </div>
        </div>

        {isRecording && (
          <div className="flex items-center gap-2 text-red-600 font-mono bg-red-50 px-3 py-1 rounded-full border border-red-200">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            <span className="text-sm font-bold">{formatTime(timer)}</span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT: Content (2/3 width) */}
        <div className="lg:w-2/3 w-full h-1/2 lg:h-full overflow-y-auto p-6 lg:p-10 bg-white border-r border-slate-200 relative flex flex-col">
          <div className="absolute top-4 right-4 text-xs text-slate-400 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-full">
            <Volume2 className="w-3 h-3" />
            Drag to highlight & speak
          </div>

          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Read Aloud
          </h2>

          <div
            className="text-xl md:text-2xl leading-relaxed font-lexend select-none flex-1"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {words.map((word, index) => {
              if (!word.trim()) return <span key={index}>{word}</span>;

              const status = wordStatuses[index];
              const highlighted = isHighlighted(index);

              return (
                <span
                  key={index}
                  onMouseDown={(e) => handleMouseDown(e, index)}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onContextMenu={(e) => handleContextMenu(e, index)}
                  className={`
                    cursor-pointer transition-all duration-100 rounded px-0.5
                    ${highlighted ? "bg-indigo-200 text-indigo-900 shadow-sm" : "hover:bg-slate-100"}
                    ${status === "correct" ? "bg-emerald-100 text-emerald-700 font-medium" : ""}
                    ${status === "incorrect" ? "bg-red-100 text-red-600 font-medium underline decoration-wavy decoration-red-300" : ""}
                    ${!highlighted && status === "neutral" ? "text-slate-800" : ""}
                  `}
                >
                  {word}
                </span>
              );
            })}
          </div>

          {/* Debug Output Box */}
          <div className="mt-6 border-t border-slate-200 pt-4">
            <div className="flex items-center gap-2 mb-2 text-slate-500">
              <Bug className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">
                Speech-to-Text Debug Output
              </span>
            </div>
            <div className="bg-slate-100 rounded-lg p-4 min-h-[60px] font-mono text-sm text-slate-600 border border-slate-200">
              {transcript || (
                <span className="text-slate-400 italic">
                  Waiting for speech input...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Image & Controls (1/3 width) */}
        <div className="lg:w-1/3 w-full h-1/2 lg:h-full flex flex-col bg-slate-50 relative">
          <div className="flex-1 relative overflow-hidden">
            <img
              src={task.thumbnail}
              alt="Task visual"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          {audioURL && (
            <div className="absolute bottom-28 left-0 right-0 px-4 z-20">
              <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-slate-200">
                <p className="text-xs text-slate-500 mb-2 font-medium">
                  Your Recording:
                </p>
                <audio src={audioURL} controls className="w-full h-10" />
              </div>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-6 px-4">
            <button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              className={`
                flex items-center justify-center gap-2 px-6 py-3 rounded-full 
                font-bold text-white shadow-xl transition-all duration-200
                focus:outline-none focus:ring-4 focus:ring-offset-2
                ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600 focus:ring-red-400 animate-pulse"
                    : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-400"
                }
              `}
            >
              {isRecording ? (
                <>
                  <Square className="w-5 h-5 fill-current" />
                  Stop Shadowing
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  Start Shadowingssss
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShadowingClient;
