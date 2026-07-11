import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadWords } from "./services/wordsLoader.js";
import { createCrosswordRouter } from "./routes/crossword.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

const wordsPath = join(__dirname, "data", "words.txt");
const words = loadWords(wordsPath);

app.use("/api/crossword", createCrosswordRouter(words));

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "✅" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});