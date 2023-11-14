// Generates simplex noise textures

import { createNoise2D } from "simplex-noise";
import { PNG } from "pngjs";

import fs from "fs";

const noise = createNoise2D();

const imWidth = 11;
const imHeight = 5;

// Generate texture
let texture = new Uint8Array(imWidth * imHeight);
for (let y = 0; y < imHeight; y++) {
  for (let x = 0; x < imWidth; x++) {
    const val = noise(x, y);
    const idx = y * imWidth + x;
    const col = Math.floor((val + 1) * 128);
    texture[idx] = col;
  }
}

// Create png
const png = new PNG({ width: imWidth, height: imHeight });

for (let y = 0; y < imHeight; y++) {
  for (let x = 0; x < imWidth; x++) {
    const idx = (y * imWidth + x) * 4;
    const grayVal = texture[y * imWidth + x];
    png.data[idx] = grayVal;
    png.data[idx + 1] = grayVal;
    png.data[idx + 2] = grayVal;
    png.data[idx + 3] = 255;
  }
}

png.pack().pipe(fs.createWriteStream("simplexTexture.png"));
