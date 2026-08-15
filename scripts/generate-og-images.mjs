import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Register Turkish-supported TTF fonts
const fontBoldPath = path.join(process.cwd(), 'assets', 'fonts', 'Inter-Bold.ttf');
const fontRegularPath = path.join(process.cwd(), 'assets', 'fonts', 'Inter-Regular.ttf');

if (fs.existsSync(fontBoldPath)) {
  GlobalFonts.registerFromPath(fontBoldPath, 'InterBold');
}
if (fs.existsSync(fontRegularPath)) {
  GlobalFonts.registerFromPath(fontRegularPath, 'InterRegular');
}

const OUTPUT_DIR = path.join(process.cwd(), 'assets', 'og');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  let lineCount = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > maxWidth && n > 0) {
      lineCount++;
      if (lineCount >= maxLines) {
        ctx.fillText(line.trim() + '...', x, currentY);
        return currentY;
      }
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
  return currentY;
}

function generateOgImage({ title, description, date, badge, slug }) {
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background Gradient
  const bgGradient = ctx.createLinearGradient(0, 0, width, height);
  bgGradient.addColorStop(0, '#18181b');
  bgGradient.addColorStop(1, '#09090b');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // Outer Border Box
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // Top Left Glowing Accent Bar
  ctx.fillStyle = '#4ade80';
  ctx.fillRect(40, 40, 140, 6);

  // Header Section: Avatar + Author Info + Badge
  const headerY = 105;

  // Avatar Circle
  ctx.fillStyle = 'rgba(74, 222, 128, 0.15)';
  ctx.beginPath();
  ctx.arc(105, headerY + 15, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(74, 222, 128, 0.4)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Avatar Letter 'E'
  ctx.fillStyle = '#4ade80';
  ctx.font = 'bold 24px InterBold, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('E', 105, headerY + 16);

  // Author Name & Domain
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px InterBold, sans-serif';
  ctx.fillText('Emre Kayık', 155, headerY + 14);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '18px monospace';
  ctx.fillText('emrekayik.github.io', 155, headerY + 38);

  // Badge (NOT / YAZI / SAYFA)
  ctx.textAlign = 'right';
  ctx.fillStyle = '#4ade80';
  ctx.font = 'bold 20px monospace';
  ctx.fillText(badge.toUpperCase(), width - 80, headerY + 24);

  // Big Quote Mark
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(74, 222, 128, 0.35)';
  ctx.font = 'bold 90px InterBold, serif';
  ctx.fillText('“', 80, 260);

  // Title Text (Supports Turkish Ç, Ğ, I, İ, Ö, Ş, Ü)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px InterBold, sans-serif';
  const finalY = wrapText(ctx, title, 80, 310, width - 160, 58, 2);

  // Green Accent Divider
  const dividerY = Math.min(finalY + 35, 470);
  ctx.fillStyle = '#4ade80';
  ctx.fillRect(80, dividerY, 60, 4);

  // Description / Excerpt Text
  if (description) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.font = '400 22px InterRegular, sans-serif';
    wrapText(ctx, description, 80, dividerY + 35, width - 160, 34, 2);
  }

  // Footer
  const footerY = height - 70;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, footerY - 20);
  ctx.lineTo(width - 80, footerY - 20);
  ctx.stroke();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = '18px monospace';
  ctx.fillText(date || new Date().toLocaleDateString('tr-TR'), 80, footerY + 5);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#4ade80';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('@emrekayik0', width - 80, footerY + 5);

  // Save File
  const buffer = canvas.toBuffer('image/png');
  const filePath = path.join(OUTPUT_DIR, `${slug}.png`);
  fs.writeFileSync(filePath, buffer);
  console.log(`Generated OG Image: ${slug}.png`);
}

function processFiles(dir, defaultBadge) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file.endsWith('.md') || file.endsWith('.html')) {
      const fullPath = path.join(dir, file);
      const content = fs.readFileSync(fullPath, 'utf8');
      const { data, excerpt } = matter(content);

      if (data.title) {
        const title = data.title;
        const description = data.description || excerpt || '';
        const date = data.date ? new Date(data.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
        const badge = data.layout === 'note' ? 'NOT' : (data.layout === 'post' ? 'YAZI' : defaultBadge);
        const slug = data.slug || slugify(title);

        generateOgImage({ title, description, date, badge, slug });
      }
    }
  }
}

// Generate default site OG Image
generateOgImage({
  title: 'Emre Kayık — Notlar, Yazılar & Düşünceler',
  description: 'Yazılım, teknoloji ve kişisel notlar.',
  date: '2026',
  badge: 'SİTE',
  slug: 'default'
});

// Process notes, posts, and main pages
processFiles(path.join(process.cwd(), '_notes'), 'NOT');
processFiles(path.join(process.cwd(), '_posts'), 'YAZI');

console.log('OG Image generation complete with full Turkish character support!');
