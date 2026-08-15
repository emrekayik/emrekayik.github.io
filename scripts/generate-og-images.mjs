import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Register full Google Fonts Roboto TTF (with complete Turkish character set)
const fontBoldPath = path.join(
  process.cwd(),
  "assets",
  "fonts",
  "Roboto-Bold.ttf",
);
const fontRegularPath = path.join(
  process.cwd(),
  "assets",
  "fonts",
  "Roboto-Regular.ttf",
);

if (fs.existsSync(fontBoldPath)) {
  GlobalFonts.registerFromPath(fontBoldPath, "RobotoBold");
}
if (fs.existsSync(fontRegularPath)) {
  GlobalFonts.registerFromPath(fontRegularPath, "RobotoRegular");
}

const OUTPUT_DIR = path.join(process.cwd(), "assets", "og");
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function cleanText(str) {
  if (!str) return "";
  return str
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/\{%[^%]*%\}/g, "") // Remove Liquid tags
    .replace(/\{\{[^}]*\}\}/g, "") // Remove Liquid variables
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Markdown link to text
    .replace(/[*_#`~]/g, "") // Markdown symbols
    .replace(/\s+/g, " ") // Collapse spaces
    .trim();
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getJekyllSlug(filePath, data) {
  const basename = path.basename(filePath, path.extname(filePath));
  const postMatch = basename.match(/^\d{4}-\d{2}-\d{2}-(.*)$/);
  if (postMatch) {
    return slugify(postMatch[1]);
  }
  if (data && data.slug) return slugify(data.slug);
  if (data && data.title) return slugify(data.title);
  return slugify(basename);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 2) {
  if (!text) return y;
  const words = text.split(/\s+/);
  let line = "";
  let currentY = y;
  let lineCount = 1;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && n > 0) {
      if (lineCount >= maxLines) {
        ctx.fillText(line.trim() + "...", x, currentY);
        return currentY;
      }
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + " ";
      currentY += lineHeight;
      lineCount++;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
  return currentY;
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function generateOgImage({ title, description, date, badge, slug }) {
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const cleanTitle = cleanText(title);
  const cleanDesc = cleanText(description);

  // 1. Dark Gradient Canvas Background
  const bgGradient = ctx.createLinearGradient(0, 0, width, height);
  bgGradient.addColorStop(0, "#09090b");
  bgGradient.addColorStop(1, "#18181b");
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // 2. Inner Floating Glass Card
  const cardX = 50;
  const cardY = 50;
  const cardW = 1100;
  const cardH = 530;
  const cardR = 24;

  ctx.fillStyle = "#121215";
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, cardR);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Top Left Green Accent Line
  ctx.fillStyle = "#4ade80";
  ctx.fillRect(cardX + cardR, cardY, 100, 4);

  // 3. Header Section (y: 115)
  const headX = 110;
  const headY = 115;

  // Avatar Circle
  ctx.fillStyle = "rgba(74, 222, 128, 0.15)";
  ctx.beginPath();
  ctx.arc(headX, headY, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(74, 222, 128, 0.4)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Avatar Initial
  ctx.fillStyle = "#4ade80";
  ctx.font = "20px RobotoBold, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("E", headX, headY + 1);

  // Author Info
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#ffffff";
  ctx.font = "24px RobotoBold, sans-serif";
  ctx.fillText("Emre Kayık", headX + 36, headY - 1);

  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.font = "16px monospace";
  ctx.fillText("emrekayik.github.io", headX + 36, headY + 20);

  // Category Badge Pill (Right aligned)
  const badgeText = badge.toUpperCase();
  ctx.font = "16px monospace";
  const badgeW = ctx.measureText(badgeText).width + 24;
  const badgeX = cardX + cardW - 60 - badgeW;
  const badgeY = headY - 15;

  ctx.fillStyle = "rgba(74, 222, 128, 0.12)";
  drawRoundedRect(ctx, badgeX, badgeY, badgeW, 30, 15);
  ctx.fill();
  ctx.strokeStyle = "rgba(74, 222, 128, 0.3)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "#4ade80";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(badgeText, badgeX + badgeW / 2, badgeY + 16);

  // 4. Main Title Section (y: 235)
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#ffffff";
  ctx.font = "44px RobotoBold, sans-serif";
  const finalTitleY = wrapText(ctx, cleanTitle, 110, 235, 980, 58, 2);

  // 5. Green Divider Line
  const dividerY = Math.min(finalTitleY + 30, 410);
  ctx.fillStyle = "#4ade80";
  ctx.fillRect(110, dividerY, 60, 4);

  // 6. Subtitle / Description Text
  if (cleanDesc && cleanDesc !== cleanTitle) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "22px RobotoRegular, sans-serif";
    wrapText(ctx, cleanDesc, 110, dividerY + 38, 980, 34, 2);
  }

  // 7. Footer Section (y: 520)
  const footY = cardY + cardH - 45;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(110, footY - 20);
  ctx.lineTo(cardX + cardW - 60, footY - 20);
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  ctx.font = "16px monospace";
  ctx.textAlign = "left";
  ctx.fillText(date || new Date().toLocaleDateString("tr-TR"), 110, footY + 4);

  ctx.fillStyle = "#4ade80";
  ctx.font = "16px monospace";
  ctx.textAlign = "right";
  ctx.fillText("@emrekayik0", cardX + cardW - 60, footY + 4);

  // Save Image
  const buffer = canvas.toBuffer("image/png");
  const filePath = path.join(OUTPUT_DIR, `${slug}.png`);
  fs.writeFileSync(filePath, buffer);
  console.log(`Generated OG Image: ${slug}.png`);
}

function processFiles(dir, defaultBadge) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file.endsWith(".md") || file.endsWith(".html")) {
      const fullPath = path.join(dir, file);
      const content = fs.readFileSync(fullPath, "utf8");
      const { data, excerpt } = matter(content);

      if (data && data.title) {
        const title = data.title;
        const description = data.description || excerpt || "";
        const date = data.date
          ? new Date(data.date).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "";
        const badge =
          data.layout === "note"
            ? "NOT"
            : data.layout === "post"
              ? "YAZI"
              : defaultBadge;
        const slug = getJekyllSlug(fullPath, data);

        generateOgImage({ title, description, date, badge, slug });
      }
    }
  }
}

function processRootDir() {
  const files = fs.readdirSync(process.cwd());
  for (const file of files) {
    if (file.endsWith(".html") || file.endsWith(".md")) {
      const fullPath = path.join(process.cwd(), file);
      const content = fs.readFileSync(fullPath, "utf8");
      const { data, excerpt } = matter(content);

      if (data && data.title) {
        const title = data.title;
        const description =
          data.description ||
          excerpt ||
          "Emre Kayık — Kişisel web sitesi, notlar ve projeler.";
        const date = "2026";
        const badge = "SAYFA";
        const rawSlug = path.basename(file, path.extname(file));
        const slug = getJekyllSlug(fullPath, data);

        if (rawSlug === "index") {
          generateOgImage({
            title: "Emre Kayık — Notlar, Yazılar & Düşünceler",
            description: "Yazılım, teknoloji ve kişisel notlar.",
            date,
            badge: "SİTE",
            slug: "default",
          });
          generateOgImage({
            title: "Emre Kayık — Notlar, Yazılar & Düşünceler",
            description: "Yazılım, teknoloji ve kişisel notlar.",
            date,
            badge: "SİTE",
            slug: "index",
          });
        } else {
          generateOgImage({ title, description, date, badge, slug });
        }
      }
    }
  }
}

// Process default site OG Image
generateOgImage({
  title: "Emre Kayık — Notlar, Yazılar & Düşünceler",
  description: "Yazılım, teknoloji ve kişisel notlar.",
  date: "2026",
  badge: "SİTE",
  slug: "default",
});

// Process collections
processFiles(path.join(process.cwd(), "_notes"), "NOT");
processFiles(path.join(process.cwd(), "_posts"), "YAZI");
processFiles(path.join(process.cwd(), "_projects"), "PROJE");

// Process root pages
processRootDir();

console.log("All OG Images generated with 100% Jekyll slug alignment!");
