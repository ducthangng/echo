export interface SpeakingTask {
  slug: string;
  title: string;
  thumbnail: string;
  wordCount: number;
  level: string;
  completions: number;
  isCompleted: boolean;
  content: string; // The script the student reads
}

export const tasks: SpeakingTask[] = [
  {
    slug: "ordering-coffee",
    title: "Ordering Coffee at a Cafe",
    thumbnail:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=2122&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Placeholder image
    wordCount: 85,
    level: "Beginner",
    completions: 1240,
    isCompleted: true,
    content:
      "The one natural talent I really want to improve is dancing, specifically, Vietnamese street dance styles that I’ve always felt drawn to. What it is exactly is this instinctive ability to feel the music’s groove and match my body movements to it without overthinking, like... I can freestyle a little when a good song comes on at a party or catch on to choreography faster than most of my friends. To tell you a little bit about when I discovered it, it was back in high school around 2021. For a school talent show, a group of us put together a casual dance routine to a popular K-pop song. Even though I’d never had proper lessons, I just picked up the moves so quickly and felt completely in sync with the beat, so much so that people actually came up afterward saying I looked like I’d been dancing for years.?",
  },
  {
    slug: "job-interview",
    title: "Common Job Interview Questions",
    thumbnail: "https://source.unsplash.com/random/800x450/?office,interview",
    wordCount: 210,
    level: "Intermediate",
    completions: 890,
    isCompleted: false,
    content:
      "Good morning. Thank you for having me. I have been working in the marketing industry for five years, focusing primarily on digital strategy. My greatest strength is my ability to analyze data and translate it into actionable campaigns.",
  },
  {
    slug: "airport-navigation",
    title: "Airport Navigation & Announcements",
    thumbnail: "https://source.unsplash.com/random/800x450/?airport,plane",
    wordCount: 150,
    level: "Intermediate",
    completions: 560,
    isCompleted: false,
    content:
      "Attention passengers. Flight 404 to London is now boarding at Gate 12. Please have your boarding pass and passport ready. We ask that families with small children and passengers requiring special assistance board first.",
  },
  {
    slug: "doctor-visit",
    title: "Describing Symptoms to a Doctor",
    thumbnail: "https://source.unsplash.com/random/800x450/?doctor,hospital",
    wordCount: 180,
    level: "Advanced",
    completions: 320,
    isCompleted: true,
    content:
      "Doctor, I've been having a persistent headache for the last three days. It's mostly on the right side of my head. I've also felt a bit dizzy when I stand up quickly. I've been taking ibuprofen, but it doesn't seem to be helping much.",
  },
];

export function getTaskBySlug(slug: string): SpeakingTask | undefined {
  return tasks.find((task) => task.slug === slug);
}
