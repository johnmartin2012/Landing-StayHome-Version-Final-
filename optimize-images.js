const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ASSETS = path.join(__dirname, 'assets');
const QUALITY = 85;

async function sizeOf(p) {
  try { return fs.statSync(p).size; } catch { return 0; }
}

function kb(bytes) { return (bytes / 1024).toFixed(1) + ' KB'; }

async function convert(src, dest, opts = {}) {
  const { width, quality = QUALITY } = opts;
  const pipeline = sharp(src);
  if (width) pipeline.resize({ width, withoutEnlargement: true });
  await pipeline.webp({ quality }).toFile(dest);
}

async function run() {
  const results = [];

  // ── logo.png → logo.webp ──────────────────────────────────
  {
    const src = path.join(ASSETS, 'logo.png');
    const dest = path.join(ASSETS, 'logo.webp');
    await convert(src, dest);
    results.push({ file: 'logo.png', before: sizeOf(src), after: sizeOf(dest), dest: 'logo.webp' });
  }

  // ── hero-bg.png → 4 responsive WebP sizes ─────────────────
  for (const w of [480, 768, 1280, 1920]) {
    const src = path.join(ASSETS, 'hero-bg.png');
    const dest = path.join(ASSETS, `hero-bg-${w}.webp`);
    await convert(src, dest, { width: w });
    results.push({ file: `hero-bg.png → ${w}w`, before: sizeOf(src), after: sizeOf(dest), dest: `hero-bg-${w}.webp` });
  }

  // ── eddie-portrait.png → WebP ─────────────────────────────
  {
    const src = path.join(ASSETS, 'eddie-portrait.png');
    const dest = path.join(ASSETS, 'eddie-portrait.webp');
    await convert(src, dest);
    results.push({ file: 'eddie-portrait.png', before: sizeOf(src), after: sizeOf(dest), dest: 'eddie-portrait.webp' });
  }

  // ── gallery-1..5.png → 1280w + 768w WebP ─────────────────
  for (let i = 1; i <= 5; i++) {
    const src = path.join(ASSETS, `gallery-${i}.png`);
    for (const w of [768, 1280]) {
      const dest = path.join(ASSETS, `gallery-${i}-${w}.webp`);
      await convert(src, dest, { width: w });
      results.push({ file: `gallery-${i}.png → ${w}w`, before: sizeOf(src), after: sizeOf(dest), dest: `gallery-${i}-${w}.webp` });
    }
  }

  // ── Print results ─────────────────────────────────────────
  console.log('\n  Image Optimization Results');
  console.log('  ' + '─'.repeat(68));
  console.log(`  ${'Source'.padEnd(28)} ${'Before'.padStart(10)} ${'After'.padStart(10)} ${'Saved'.padStart(8)}   Output`);
  console.log('  ' + '─'.repeat(68));
  let totalBefore = 0, totalAfter = 0;
  for (const r of results) {
    const saved = r.before - r.after;
    const pct = r.before ? Math.round((saved / r.before) * 100) : 0;
    console.log(`  ${r.file.padEnd(28)} ${kb(r.before).padStart(10)} ${kb(r.after).padStart(10)} ${(pct + '%').padStart(7)}   ${r.dest}`);
    totalBefore += r.before;
    totalAfter += r.after;
  }
  const totalSaved = totalBefore - totalAfter;
  const totalPct = Math.round((totalSaved / totalBefore) * 100);
  console.log('  ' + '─'.repeat(68));
  console.log(`  ${'TOTAL'.padEnd(28)} ${kb(totalBefore).padStart(10)} ${kb(totalAfter).padStart(10)} ${(totalPct + '%').padStart(7)}\n`);
}

run().catch(err => { console.error(err); process.exit(1); });
