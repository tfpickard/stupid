#!/usr/bin/env bun

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { MediaFrontmatterSchema } from "../lib/schema";

const CONTENT_DIR = path.join(process.cwd(), "content/media");
const PUBLIC_DIR = path.join(process.cwd(), "public");

interface ValidationResult {
  filename: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function validateMdxFile(filename: string): ValidationResult {
  const result: ValidationResult = {
    filename,
    valid: true,
    errors: [],
    warnings: [],
  };

  try {
    const filePath = path.join(CONTENT_DIR, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);

    // Validate frontmatter against schema
    try {
      MediaFrontmatterSchema.parse(data);
    } catch (error) {
      result.valid = false;
      if (error instanceof Error) {
        result.errors.push(`Schema validation failed: ${error.message}`);
      }
    }

    // Check if referenced assets exist (for local paths)
    if (data.assets?.poster?.startsWith("/")) {
      const posterPath = path.join(PUBLIC_DIR, data.assets.poster);
      if (!fs.existsSync(posterPath)) {
        result.warnings.push(`Poster file not found: ${data.assets.poster}`);
      }
    }

    if (data.assets?.src?.startsWith("/")) {
      const srcPath = path.join(PUBLIC_DIR, data.assets.src);
      if (!fs.existsSync(srcPath)) {
        result.warnings.push(`Source file not found: ${data.assets.src}`);
      }
    }

    // Check if slug is valid
    const slug = filename.replace(/\.mdx$/, "");
    if (!/^[a-z0-9-]+$/.test(slug)) {
      result.errors.push("Invalid filename: must be lowercase alphanumeric with hyphens only");
      result.valid = false;
    }

    // Check for required fields
    if (!data.title) {
      result.errors.push("Missing required field: title");
      result.valid = false;
    }

    if (!data.createdAt) {
      result.errors.push("Missing required field: createdAt");
      result.valid = false;
    }
  } catch (error) {
    result.valid = false;
    if (error instanceof Error) {
      result.errors.push(`Parse error: ${error.message}`);
    }
  }

  return result;
}

function main() {
  console.log("\n🔍 Validating Media Content\n");

  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`❌ Content directory not found: ${CONTENT_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));

  if (files.length === 0) {
    console.log("📭 No MDX files found in content/media/\n");
    return;
  }

  const results = files.map((file) => validateMdxFile(file));

  let hasErrors = false;

  for (const result of results) {
    if (!result.valid) {
      hasErrors = true;
      console.log(`❌ ${result.filename}`);
      for (const error of result.errors) {
        console.log(`   Error: ${error}`);
      }
    } else if (result.warnings.length > 0) {
      console.log(`⚠️  ${result.filename}`);
      for (const warning of result.warnings) {
        console.log(`   Warning: ${warning}`);
      }
    } else {
      console.log(`✅ ${result.filename}`);
    }
  }

  console.log(`\n📊 Summary: ${results.filter((r) => r.valid).length}/${results.length} valid\n`);

  if (hasErrors) {
    process.exit(1);
  }
}

main();
