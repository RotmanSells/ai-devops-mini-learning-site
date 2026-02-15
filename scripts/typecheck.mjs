import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const ignoredDirs = new Set(['.git', '.npm-cache', 'node_modules', 'dist']);
const checkedExtensions = new Set(['.js', '.mjs']);

/**
 * @param {string} file
 */
function extension(file) {
  const index = file.lastIndexOf('.');
  return index === -1 ? '' : file.slice(index);
}

/**
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
async function collectScripts(dir) {
  /** @type {string[]} */
  const scripts = [];
  const items = await readdir(dir);

  for (const item of items) {
    if (ignoredDirs.has(item)) {
      continue;
    }

    const full = join(dir, item);
    const info = await stat(full);

    if (info.isDirectory()) {
      const nested = await collectScripts(full);
      scripts.push(...nested);
      continue;
    }

    if (checkedExtensions.has(extension(full))) {
      scripts.push(full);
    }
  }

  return scripts;
}

async function main() {
  const scripts = await collectScripts(root);

  for (const script of scripts) {
    const result = spawnSync(process.execPath, ['--check', script], {
      encoding: 'utf8'
    });

    if (result.status === 0) {
      continue;
    }

    process.stderr.write(result.stderr);
    throw new Error(`Typecheck провален в файле ${script}`);
  }

  process.stdout.write(`Typecheck ok. Проверено файлов: ${scripts.length}\n`);
}

await main();
