"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Mic, Square, ArrowLeft, Volume2 } from "lucide-react";
import Link from "next/link";
import { SpeakingTask } from "@/src/lib/data";

interface ShadowingClientProps {
  task: SpeakingTask;
}

// Mock function X: Simulates checking pronunciation
// Returns true (correct) or false (wrong)
const mockCheckPronunciation = (word: string): boolean => {
  // 80% chance of success for mock purposes
  return Math.random() > 0.2;
};

const ShadowingClient: React.FC<ShadowingClientProps> = ({ task }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);

  // State for word statuses: 'neutral' | 'correct' | 'incorrect'
  const [wordStatuses, setWordStatuses] = useState<
    Record<string, "neutral" | "correct" | "incorrect">
  >({});

  // Refs for recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentWordIndexRef = useRef(0);

  // Helper for level colors
  const levelConfig: Record<string, { bg: string; text: string }> = {
    Beginner: { bg: "bg-emerald-100", text: "text-emerald-700" },
    Intermediate: { bg: "bg-amber-100", text: "text-amber-700" },
    Advanced: { bg: "bg-rose-100", text: "text-rose-700" },
  };

  // Split content into words, preserving spaces for rendering
  const words = task.content.split(/(\s+)/);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // --- Text-to-Speech Functions ---

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Stop previous
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for students
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleWordClick = (word: string) => {
    speakText(word);
  };

  const handleSelectionSpeak = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      speakText(selection.toString());
    }
  };

  // --- Recording & Mock Logic ---

  const handleStartRecording = async () => {
    try {
      setAudioURL(null);
      audioChunksRef.current = [];
      setTimer(0);
      setWordStatuses({}); // Reset colors
      currentWordIndexRef.current = 0;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
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

      // 1. Timer Loop
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);

      // 2. Mock "Checking" Loop
      // Simulate the system "listening" and checking words one by one
      checkIntervalRef.current = setInterval(() => {
        const wordIndex = currentWordIndexRef.current;

        // Filter out pure whitespace from our logic
        const actualWords = words.filter((w) => w.trim().length > 0);

        if (wordIndex < actualWords.length) {
          const currentWord = actualWords[wordIndex];
          const isCorrect = mockCheckPronunciation(currentWord);

          // Find the actual index in the original array to handle spaces correctly
          const originalIndex = words.indexOf(currentWord);

          setWordStatuses((prev) => ({
            ...prev,
            [originalIndex]: isCorrect ? "correct" : "incorrect",
          }));

          currentWordIndexRef.current++;
        } else {
          // End of text
          if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
        }
      }, 800); // Check a word every 0.8 seconds
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const handleStopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
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
        <div className="lg:w-2/3 w-full h-1/2 lg:h-full overflow-y-auto p-6 lg:p-10 bg-white border-r border-slate-200 relative">
          {/* Instructions Overlay */}
          <div className="absolute top-4 right-4 text-xs text-slate-400 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-full">
            <Volume2 className="w-3 h-3" />
            Click or highlight text to hear it
          </div>

          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Read Aloud
          </h2>

          {/* Content with Lexend Font */}
          <div
            className="text-xl md:text-2xl leading-relaxed font-lexend select-none"
            onMouseUp={handleSelectionSpeak}
          >
            {words.map((word, index) => {
              // If it's just whitespace, render a space
              if (!word.trim()) return <span key={index}>{word}</span>;

              const status = wordStatuses[index];

              return (
                <span
                  key={index}
                  onClick={() => handleWordClick(word)}
                  className={`
                    cursor-pointer transition-colors duration-300 rounded px-0.5
                    hover:bg-indigo-50
                    ${status === "correct" ? "text-emerald-600 bg-emerald-50 font-medium" : ""}
                    ${status === "incorrect" ? "text-red-500 bg-red-50 font-medium underline decoration-wavy decoration-red-300" : ""}
                    ${status === "neutral" ? "text-slate-800" : ""}
                  `}
                >
                  {word}
                </span>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Image & Controls (1/3 width) */}
        <div className="lg:w-1/3 w-full h-1/2 lg:h-full flex flex-col bg-slate-50 relative">
          {/* Image Section */}
          <div className="flex-1 relative overflow-hidden">
            <img
              src={task.thumbnail}
              alt="Task visual"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          {/* Playback of recorded audio */}
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

          {/* Control Overlay (Bottom) */}
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
                  Start Shadowing
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
