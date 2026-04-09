#!/usr/bin/env node
/**
 * Icon Conversion Script
 * Converts SVG icon files to PNG format required for PWA
 * 
 * Usage:
 * 1. Install dependencies: npm install sharp
 * 2. Run this script: node convert-icons.js
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICONS = [
  {
    input: 'public/icons/icon-192x192.svg',
    outputs: [
      { file: 'public/icons/icon-192x192.png', size: 192 },
      { file: 'public/icons/icon-192x192-maskable.png', size: 192 },
    ],
  },
  {
    input: 'public/icons/icon-512x512.svg',
    outputs: [
      { file: 'public/icons/icon-512x512.png', size: 512 },
      { file: 'public/icons/icon-512x512-maskable.png', size: 512 },
    ],
  },
  {
    input: 'public/favicon.svg',
    outputs: [
      { file: 'public/favicon.png', size: 32 },
    ],
  },
];

async function convertIcons() {
  console.log('🎨 Converting SVG icons to PNG...\n');

  for (const icon of ICONS) {
    const inputPath = path.join(__dirname, icon.input);

    if (!fs.existsSync(inputPath)) {
      console.warn(`⚠️  Input file not found: ${inputPath}`);
      continue;
    }

    for (const output of icon.outputs) {
      const outputPath = path.join(__dirname, output.file);
      const dir = path.dirname(outputPath);

      // Create directory if it doesn't exist
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      try {
        await sharp(inputPath)
          .resize(output.size, output.size, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 },
          })
          .png()
          .toFile(outputPath);

        console.log(`✅ Created: ${output.file} (${output.size}x${output.size})`);
      } catch (error) {
        console.error(`❌ Error creating ${output.file}:`, error.message);
      }
    }
  }

  console.log('\n✨ Icon conversion complete!');
  console.log(
    '📱 Your app is now PWA-ready. Install via browser menu: "Install app" or "Add to Home Screen"'
  );
}

// Run conversion
convertIcons();
