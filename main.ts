// Entry program for the make.fun bounty "gta6-meme-x-01" (Post a GTA 6 meme on X).
//
// The judged entry is the X post itself: the house reads the post from X and the
// judge sees its first picture and its text. This program's only job is to hand
// the post's address to the gate: it copies POST.json from the repository root
// into the output directory, byte for byte, where the gate reads it.
//
// Run it locally the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand
// in for /bot and /output.

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outputDir, { recursive: true });

const sourcePath = join(botDir, "POST.json");
const targetPath = join(outputDir, "POST.json");

try {
  copyFileSync(sourcePath, targetPath);
} catch (error) {
  console.error(
    `could not copy POST.json from ${sourcePath} to ${targetPath}: ${(error as Error).message}`,
  );
  process.exit(1);
}

// The gate trusts the copy, and the bounty requires two runs to write the same
// bytes, so verify the copy landed byte for byte before reporting success.
const sourceBytes = readFileSync(sourcePath);
const targetBytes = readFileSync(targetPath);
if (!sourceBytes.equals(targetBytes)) {
  console.error(
    `POST.json copy is not byte-identical: ${sourceBytes.length} bytes in, ${targetBytes.length} bytes out`,
  );
  process.exit(1);
}
