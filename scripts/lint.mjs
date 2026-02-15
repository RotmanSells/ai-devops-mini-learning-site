import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const ignoredDirs = new Set(['.git', '.npm-cache', 'node_modules', 'dist']);
const sourceExtensions = new Set(['.js', '.mjs', '.css', '.html', '.json']);

/**
 * @param {string} path
 */
function extension(path) {
  const index = path.lastIndexOf('.');
  return index === -1 ? '' : path.slice(index);
}

/**
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
async function collectFiles(dir) {
  /** @type {string[]} */
  const files = [];
  const items = await readdir(dir);

  for (const item of items) {
    if (ignoredDirs.has(item)) {
      continue;
    }

    const fullPath = join(dir, item);
    const info = await stat(fullPath);

    if (info.isDirectory()) {
      const nested = await collectFiles(fullPath);
      files.push(...nested);
      continue;
    }

    if (sourceExtensions.has(extension(fullPath))) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * @param {string} file
 * @param {string} content
 */
function runRules(file, content) {
  const errors = [];
  const relative = file.replace(`${root}/`, '');
  const skipPatternRules = relative === 'scripts/lint.mjs';

  if (!skipPatternRules && content.includes('console.log(')) {
    errors.push('Запрещен console.log');
  }

  if (!skipPatternRules && content.includes('debugger')) {
    errors.push('Запрещен debugger');
  }

  if (!skipPatternRules && content.includes('TODO')) {
    errors.push('Найден TODO без автора/даты');
  }

  const lines = content.split('\n').length;
  if (lines > 250) {
    errors.push(`Превышен лимит 250 строк: ${lines}`);
  }

  return errors;
}

async function main() {
  const files = await collectFiles(root);
  /** @type {string[]} */
  const findings = [];

  for (const file of files) {
    const content = await readFile(file, 'utf8');
    const errors = runRules(file, content);

    if (errors.length === 0) {
      continue;
    }

    const relative = file.replace(`${root}/`, '');
    findings.push(`${relative}: ${errors.join('; ')}`);
  }

  if (findings.length > 0) {
    throw new Error(`Lint провален:\n${findings.join('\n')}`);
  }

  process.stdout.write(`Lint ok. Проверено файлов: ${files.length}\n`);
}

await main();
