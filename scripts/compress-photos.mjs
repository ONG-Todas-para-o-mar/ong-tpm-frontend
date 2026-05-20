import sharp from "sharp";
import { readdir, stat, unlink } from "node:fs/promises";
import { join, extname, basename } from "node:path";

const DIR = "public/assets/photos";
const MAX_WIDTH = 1600;
const QUALITY = 80;

const files = (await readdir(DIR)).filter((f) => /\.jpe?g$/i.test(f));

let totalIn = 0;
let totalOut = 0;

for (const file of files) {
  const inPath = join(DIR, file);
  const outPath = join(DIR, basename(file, extname(file)) + ".webp");

  const { size: inSize } = await stat(inPath);
  totalIn += inSize;

  await sharp(inPath)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(outPath);

  const { size: outSize } = await stat(outPath);
  totalOut += outSize;

  console.log(
    `${file} ${(inSize / 1024 / 1024).toFixed(2)}MB -> ${(outSize / 1024).toFixed(0)}KB`,
  );

  await unlink(inPath);
}

console.log(
  `\nTotal: ${(totalIn / 1024 / 1024).toFixed(1)}MB -> ${(totalOut / 1024 / 1024).toFixed(1)}MB`,
);
