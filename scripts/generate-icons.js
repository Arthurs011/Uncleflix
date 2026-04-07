/**
 * Icon Generator Script
 * Converts the SVG icon to various PNG sizes for Android/iOS PWA
 *
 * Usage:
 *   npm run generate-icons
 *
 * Prerequisites:
 *   npm install sharp
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const iconsDir = path.join(publicDir, 'icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes needed for PWA
const sizes = [
  72, 96, 128, 144, 152, 192, 384, 512
];

// Read SVG
const svgPath = path.join(publicDir, 'uncleflix-icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

console.log('🖼️  Generating PWA icons...');

// Generate PNG for each size
const promises = sizes.map(size =>
  sharp(svgBuffer)
    .resize(size, size, { fit: 'contain', background: { r: 11, g: 15, b: 26 } })
    .png()
    .toFile(path.join(iconsDir, `icon-${size}x${size}.png`))
    .then(() => console.log(`  ✓ Generated icon-${size}x${size}.png`))
    .catch(err => {
      console.error(`  ✗ Failed to generate icon-${size}x${size}.png:`, err.message);
    })
);

Promise.all(promises)
  .then(() => {
    console.log('\n✅ All icons generated successfully!');
    console.log(`📁 Icons saved to: ${iconsDir}`);
  })
  .catch(err => {
    console.error('\n❌ Icon generation failed:', err);
    process.exit(1);
  });
