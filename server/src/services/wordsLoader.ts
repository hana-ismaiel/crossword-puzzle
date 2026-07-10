import { readFileSync } from "node:fs";

export function loadWords(filePath: string): string[] {
  const contents = readFileSync(filePath, "utf-8");

  return contents
    .split("\n")
    .map((word) => word.trim())
    .filter((word) => word.length > 0);
}