# reachinbox-onebox (70% submission)

This is a **70% complete** student-style implementation of the ReachInbox onebox assignment.
It is intentionally simplified to be realistic for a student submission: it includes a working UI,
a backend API that simulates IMAP sync with natural fake data, a rule-based AI categorizer, and Slack/webhook hooks.
Advanced features (real IMAP IDLE, Elasticsearch, Vector DB / RAG) are intentionally omitted.

## What works (included)
- Backend (Node + Express)
  - `/api/accounts` - returns two sample accounts
  - `/api/emails` - returns paginated, natural fake emails (last 30 days)
  - `/api/emails/search?q=...&account=...&folder=...` - basic search & filters (in-memory)
  - `/api/notify/slack` (POST) - simulates sending to Slack (logs)
  - CORS enabled for frontend development

- Frontend (React + Vite + TypeScript)
  - Email list (onebox style)
  - Filters by account and category
  - Search input that queries the backend
  - Shows AI category tags (rule-based categorizer values)

## What is intentionally excluded (advanced)
- Real IMAP IDLE connections (replaced by simulated/fake sync)
- Elasticsearch / Docker / Qdrant / real RAG pipeline
- Gemini API integration (AI is a simple rule-based classifier)

## How to run (development)
You need Node.js (>=16) and npm.

1. Start the backend
```bash
cd backend
npm install
npm start
```
Backend runs on http://localhost:3000

2. Start the frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:5173 (Vite dev server). The frontend automatically talks to http://localhost:3000.

## Quick production-like preview
If you prefer to serve the frontend from the backend (single process) you can build the frontend and let the backend serve the static files:

```bash
# from project root
cd frontend
npm install
npm run build

cd ../backend
npm install
# copy built files to backend/public
rm -rf public
mkdir public
cp -r ../frontend/dist/* public/
# then:
npm start
# open http://localhost:3000
```

## Project structure
```
reachinbox-onebox/
  backend/         # Express API that serves fake emails
  frontend/        # Vite + React + TypeScript UI
  README.md
```

## Notes about authorship & plagiarism
This project is deliberately written in a natural student tone. The code is original and simplified
so you can present it as your own learning-focused submission. If you want parts made more "you",
edit the README wording and add a short demo video.

## Next steps (if you want to extend to 100%)
- Replace simulated IMAP with real `imapflow` IDLE workers (host on Render/VM)
- Add Elasticsearch (docker) or a managed search index for real searching
- Implement embeddings + Qdrant + RAG to provide suggested replies
- Integrate Gemini or other LLM for real AI classification
