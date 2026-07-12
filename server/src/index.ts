import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadWords } from "./services/wordsLoader.js";
import { createCrosswordRouter } from "./routes/crossword.js";
import type { Grid } from "./types/crossword.js";
import pg from "pg";
import connectPgSimple from "connect-pg-simple";

dotenv.config();

declare module "express-session" {
  interface SessionData {
    currentPuzzle?: Grid;
  }
}

const PgSession = connectPgSimple(session);

const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pgPool.on("error", (err) => {
  console.error("Unexpected error on idle Postgres client", err);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    store: new PgSession({
      pool: pgPool,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "dev-secret-change-later",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60,
    },
  })
);

const wordsPath = join(__dirname, "data", "words.txt");
const words = loadWords(wordsPath);


app.use("/api/crossword", createCrosswordRouter(words));

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "✅" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});