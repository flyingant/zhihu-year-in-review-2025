#!/usr/bin/env node

/**
 * Cleanup script to remove non-production files from the out folder
 * Removes:
 * - All .txt files (debug/text exports)
 * - All __next._*.txt files (Next.js debug files)
 * - storybook/ directory (development tool, not needed in production)
 */

const fs = require('fs');
const path = require('path');

const outDir = path.join(process.cwd(), 'out');

function removeProductionFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory ${dir} does not exist, skipping cleanup.`);
    return;
  }

  let removedFiles = 0;
  let removedDirs = 0;

  function removeDir(dirPath) {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
      removedDirs++;
      console.log(`Removed directory: ${path.relative(process.cwd(), dirPath)}`);
    }
  }

  function walkDir(currentPath) {
    const files = fs.readdirSync(currentPath);

    for (const file of files) {
      const filePath = path.join(currentPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        // Remove storybook directory (development tool)
        if (file === 'storybook') {
          removeDir(filePath);
        } else {
          walkDir(filePath);
        }
      } else {
        // Remove all .txt files (debug/text exports, including __next._*.txt)
        if (file.endsWith('.txt')) {
          fs.unlinkSync(filePath);
          removedFiles++;
          console.log(`Removed: ${path.relative(process.cwd(), filePath)}`);
        }
      }
    }
  }

  walkDir(outDir);

  const totalRemoved = removedFiles + removedDirs;
  if (totalRemoved > 0) {
    console.log(
      `\n✓ Cleanup complete: Removed ${removedFiles} file(s) and ${removedDirs} directory/directories.`
    );
  } else {
    console.log('✓ No unnecessary files found to clean up.');
  }
}

removeProductionFiles(outDir);

