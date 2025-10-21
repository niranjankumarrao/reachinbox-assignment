# reachinbox-assignment

a backend API that simulates IMAP sync with natural fake data, a rule-based AI categorizer, and Slack/webhook hooks.

## What works (included)
- Backend (Node + Express)
  - `/api/accounts` - returns two sample accounts
  - `/api/emails` - returns paginated, fake emails (last 30 days)
  - `/api/emails/search?q=...&account=...&folder=...` - basic search & filters (in-memory)
  - `/api/notify/slack` (POST) - simulates sending to Slack (logs)
  - CORS enabled for frontend development

- Frontend (React + Vite + TypeScript)
  - Email list (onebox style)
  - Filters by account and category
  - Search input that queries the backend
  - Shows AI category tags (rule-based categorizer values)


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

