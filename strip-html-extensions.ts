import { readdir, readFile, stat, writeFile } from 'fs/promises';
import { join } from 'path';

async function findHtmlFiles(dir: string) {
  const htmlFiles: string[] = [];

  async function traverse(currentDir: string ) {
    const items = await readdir(currentDir);

    for (const item of items) {
      const fullPath = join(currentDir, item);
      const stats = await stat(fullPath);

      if (stats.isDirectory()) {
        await traverse(fullPath);
      } else if (stats.isFile() && item.endsWith('.html')) {
        htmlFiles.push(fullPath);
      }
    }
  }

  await traverse(dir);
  return htmlFiles;
}

async function stripHtmlExtensions(filePath: string) {
  let content = await readFile(filePath, 'utf-8');
   content = content.replace(/\/index\.html/g, '');
   content = content.replace(/\.html/g, '');
  await writeFile(filePath, content);
}

const distDir = './dist';

console.log('\n[strip-html-extensions] Stripping .html extensions in HTML files...');
try {
  const htmlFiles = await findHtmlFiles(distDir);

  if (htmlFiles.length === 0) {
    console.log('[strip-html-extensions] No HTML files found in ./dist');
    process.exit(0)
  }

  console.log(`[strip-html-extensions] Found ${htmlFiles.length} HTML files`);

  for (const file of htmlFiles) {
    await stripHtmlExtensions(file);
  }

  console.log('[strip-html-extensions] Done!');
} catch (error) {
  console.error(error);
  process.exit(1);
}