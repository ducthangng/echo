# 🎙️ IELTS Daily Speaking Practice

A lightweight, full-stack Next.js web application designed for daily IELTS speaking practice. Built for a tight-knit learning group (10-20 students), featuring real-time pronunciation checks and cloud-synced audio submissions.

## 🚀 Tech Stack

* **Framework:** Next.js (App Router), React, TypeScript
* **Styling:** Tailwind CSS, shadcn/ui (for rapid UI component assembly)
* **Database:**
    * **PostgreSQL (AWS RDS):** User data, progress tracking, submission metadata.
    * **MongoDB (Atlas):** Daily reading materials, speaking topics, vocabulary lists.
* **Storage:** AWS S3 (for test mode audio recordings).
* **AI Services:** Whisper (Speech-to-Text) & LLM (Pronunciation Evaluation).

## 🏗️ Architecture & Data Pipeline

The application features a dual-mode learning pipeline:

### 1. Practice Mode (No audio storage)
* **Flow:** User selects a daily topic -> Reads the text -> AI listens and highlights mispronunciations in real-time.
* **Mechanism:** Audio is **not** recorded or uploaded to S3. Audio chunks are streamed directly to the STT engine or processed purely client-side via Web Speech API. 
* **Output:** Instant visual feedback (green/red text highlighting).

### 2. Test/Submission Mode (Recorded)
* **Flow:** User initiates a formal test -> Reads the text -> Finishes -> Submits.
* **Mechanism:** 
    1. Browser records audio via `MediaRecorder` API.
    2. Audio blob is uploaded directly to **AWS S3** via pre-signed URLs.
    3. S3 URL is saved to **AWS RDS** alongside user metadata.
    4. Backend triggers the AI grading pipeline to generate an IELTS-style report.

## 📦 Local Development

```bash
# 1. Clone the repository
git clone [https://github.com/your-username/ielts-speaking-app.git](https://github.com/your-username/ielts-speaking-app.git)

# 2. Install dependencies
pnpm install # or npm / yarn

# 3. Setup environment variables
cp .env.example .env.local
# Fill in your AWS, MongoDB Atlas, and Database credentials

# 4. Run database migrations (e.g., using Prisma or Drizzle)
pnpm db:push

# 5. Start the development server
pnpm dev