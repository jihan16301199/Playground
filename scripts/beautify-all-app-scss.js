#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Recursively find all .scss files in a directory
 */
function findScssFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findScssFiles(filePath, fileList);
    } else if (file.endsWith('.scss')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Main function
 */
function main() {
  const appDir = path.resolve(__dirname, '../src/app');

  if (!fs.existsSync(appDir)) {
    console.error(`❌ Directory not found: ${appDir}`);
    process.exit(1);
  }

  console.log(`🔍 Scanning for SCSS files in ${appDir}...\n`);

  const scssFiles = findScssFiles(appDir);

  if (scssFiles.length === 0) {
    console.log('⚠️  No SCSS files found in src/app');
    process.exit(0);
  }

  console.log(`Found ${scssFiles.length} SCSS file(s):\n`);

  let successCount = 0;
  let failureCount = 0;

  scssFiles.forEach((file, index) => {
    const relativePath = path.relative(appDir, file);
    const displayPath = `src/app/${relativePath}`;

    try {
      console.log(`[${index + 1}/${scssFiles.length}] Beautifying ${displayPath}...`);
      execSync(`node scripts/beautify-scss.js "${file}"`, { stdio: 'pipe' });
      console.log(`✅ Success\n`);
      successCount++;
    } catch (error) {
      console.log(`❌ Failed: ${error.message}\n`);
      failureCount++;
    }
  });

  console.log('═'.repeat(60));
  console.log(`\n📊 Results:`);
  console.log(`✅ Successfully beautified: ${successCount} file(s)`);
  if (failureCount > 0) {
    console.log(`❌ Failed: ${failureCount} file(s)`);
  }
  console.log(`📁 Total processed: ${scssFiles.length} file(s)\n`);

  process.exit(failureCount > 0 ? 1 : 0);
}

main();
