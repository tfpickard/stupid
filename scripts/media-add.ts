#!/usr/bin/env bun

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";

const CONTENT_DIR = path.join(process.cwd(), "content/media");

interface MediaInput {
  title: string;
  type: "video" | "image" | "game" | "other";
  source: "sora" | "upload" | "external";
  tags: string[];
  description?: string;
  posterPath?: string;
  srcPath?: string;
  soraUsername?: string;
  soraPrompt?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function generateMdxContent(input: MediaInput): string {
  const now = new Date().toISOString();
  const slug = slugify(input.title);

  const frontmatter = {
    title: input.title,
    createdAt: now,
    type: input.type,
    source: input.source,
    visibility: "public",
    tags: input.tags,
    description: input.description || undefined,
    assets: {
      poster: input.posterPath || undefined,
      src: input.srcPath || undefined,
    },
    sora:
      input.source === "sora"
        ? {
            username: input.soraUsername || "goatspeed",
            prompt: input.soraPrompt || undefined,
          }
        : undefined,
  };

  // Clean undefined values
  const cleanFrontmatter = JSON.parse(JSON.stringify(frontmatter));

  const yamlFrontmatter = Object.entries(cleanFrontmatter)
    .map(([key, value]) => {
      if (typeof value === "string") {
        return `${key}: "${value}"`;
      }
      if (Array.isArray(value)) {
        return `${key}:\n${value.map((v) => `  - ${v}`).join("\n")}`;
      }
      if (typeof value === "object" && value !== null) {
        const nested = Object.entries(value)
          .map(([k, v]) => `  ${k}: ${typeof v === "string" ? `"${v}"` : v}`)
          .join("\n");
        return `${key}:\n${nested}`;
      }
      return `${key}: ${value}`;
    })
    .join("\n");

  return `---
${yamlFrontmatter}
---

Write your content here using MDX.

You can use custom components:

<PromptBlock>
${input.soraPrompt || "Enter your Sora prompt here..."}
</PromptBlock>

<Callout type="info">
This is an info callout. Change type to "warning", "error", or "success".
</Callout>

## Behind the Scenes

Add notes about how this was created, iterations, challenges, etc.
`;
}

async function prompt(rl: readline.Interface, question: string): Promise<string> {
  const answer = await rl.question(`${question}: `);
  return answer.trim();
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("\n🎬 Add New Media Item\n");

  try {
    const title = await prompt(rl, "Title");
    if (!title) {
      console.error("Title is required");
      process.exit(1);
    }

    const type = await prompt(rl, "Type (video/image/game/other) [video]");
    const mediaType = (type || "video") as MediaInput["type"];

    const source = await prompt(rl, "Source (sora/upload/external) [sora]");
    const mediaSource = (source || "sora") as MediaInput["source"];

    const tagsInput = await prompt(rl, "Tags (comma-separated)");
    const tags = tagsInput ? tagsInput.split(",").map((t) => t.trim()) : [];

    const description = await prompt(rl, "Description (optional)");

    const posterPath = await prompt(rl, "Poster image path (optional, e.g., /media/poster.jpg)");
    const srcPath = await prompt(rl, "Media source path (optional, e.g., /media/video.mp4)");

    let soraUsername: string | undefined;
    let soraPrompt: string | undefined;

    if (mediaSource === "sora") {
      soraUsername = await prompt(rl, "Sora username [goatspeed]");
      soraPrompt = await prompt(rl, "Sora prompt (optional)");
    }

    const input: MediaInput = {
      title,
      type: mediaType,
      source: mediaSource,
      tags,
      description: description || undefined,
      posterPath: posterPath || undefined,
      srcPath: srcPath || undefined,
      soraUsername: soraUsername || "goatspeed",
      soraPrompt: soraPrompt || undefined,
    };

    const slug = slugify(title);
    const filename = `${slug}.mdx`;
    const filePath = path.join(CONTENT_DIR, filename);

    if (fs.existsSync(filePath)) {
      console.error(`\n❌ File already exists: ${filename}`);
      process.exit(1);
    }

    if (!fs.existsSync(CONTENT_DIR)) {
      fs.mkdirSync(CONTENT_DIR, { recursive: true });
    }

    const content = generateMdxContent(input);
    fs.writeFileSync(filePath, content, "utf-8");

    console.log(`\n✅ Created: content/media/${filename}`);
    console.log("\nEdit the file to add your content, then run:");
    console.log("  bun run media:validate");
  } finally {
    rl.close();
  }
}

main().catch(console.error);
