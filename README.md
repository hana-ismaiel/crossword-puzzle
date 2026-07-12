# Crossword Puzzle

A full-stack crossword puzzle web app.

---

## Features

- Randomly generated 13x13 grid - words placed randomly using a custom greedy algorithm
- AI generated clues - every word in the grid gets a clue generated on the fly using the Google Gemini API
- Live per-letter validation of answers
- Puzzles and in-progress guesses are stored via Postgres-backed sessions - maintains progress across sessions

---

## Tech Stack

### Frontend (`/client`)
- React + TypeScript (Vite)
- Axios for API requests
- Plain CSS for styling

### Backend (`/server`)
- Node.js + Express + TypeScript
- `express-session` with `connect-pg-simple` for Postgres-backed session storage (Supabase)
- Google Gemini API (`@google/genai`) for AI-generated clues
- CORS configured with an explicit allowed-origins list and credentialed (cookie-based) requests

---

## Local Development Setup

### Prerequisites
*   [Node.js](https://nodejs.org/)
*   A running PostgreSQL Database instance (e.g., local Postgres or a cloud-hosted Supabase connection)
*   A Google Gemini API key

### Instructions
#### Backend
1. Navigate to the server folder: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file inside the root of your `/server` directory and declare runtime variables:
```
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_jwt_secret_string
GEMINI_API_KEY=your_google_gemini_api_key
PORT=3002
```
4. Run using command `npm run dev` (server will run on `http://localhost:3002`)

#### Frontend
1. Navigate to the client folder: `cd ../client`
2. Install dependencies: `npm install`
3. Create a `.env` file inside the root of your `/client` directory and declare runtime variables:
```
VITE_API_BASE=http://localhost:3002/api/crossword
```
4. Run using command `npm run dev` (app will launch at `http://localhost:5173`)