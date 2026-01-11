#!/usr/bin/env bun

import fs from "node:fs";
import path from "node:path";
import { buildMediaIndex } from "../lib/content";

const GENERATED_DIR = path.join(process.cwd(), ".generated");
const INDEX_FILE = path.join(GENERATED_DIR, "media-index.json");

function main() {
  console.log("\n🔨 Building Media Index\n");

  try {
    const index = buildMediaIndex();

    if (!fs.existsSync(GENERATED_DIR)) {
      fs.mkdirSync(GENERATED_DIR, { recursive: true });
    }

    fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), "utf-8");

    console.log(`✅ Index built: ${index.length} items`);
    console.log("📝 Written to: .generated/media-index.json\n");

    // Show stats
    const stats = {
      total: index.length,
      byType: {} as Record<string, number>,
      bySource: {} as Record<string, number>,
      totalTags: new Set<string>(),
    };

    for (const item of index) {
      stats.byType[item.type] = (stats.byType[item.type] || 0) + 1;
      stats.bySource[item.source] = (stats.bySource[item.source] || 0) + 1;
      for (const tag of item.tags) {
        stats.totalTags.add(tag);
      }
    }

    console.log("📊 Stats:");
    console.log(`   Total items: ${stats.total}`);
    console.log(`   By type: ${JSON.stringify(stats.byType)}`);
    console.log(`   By source: ${JSON.stringify(stats.bySource)}`);
    console.log(`   Unique tags: ${stats.totalTags.size}\n`);
  } catch (error) {
    console.error("❌ Failed to build index:", error);
    process.exit(1);
  }
}

main();
