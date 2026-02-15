import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

test('build создает dist и ключевые файлы', () => {
  const run = spawnSync(process.execPath, ['scripts/build.mjs'], { encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);

  assert.equal(existsSync('dist/index.html'), true);
  assert.equal(existsSync('dist/styles/base.css'), true);
  assert.equal(existsSync('dist/styles/components.css'), true);
  assert.equal(existsSync('dist/app.js'), true);

  const html = readFileSync('dist/index.html', 'utf8');
  assert.match(html, /id="advisor-form"/);
  assert.match(html, /type="importmap"/);
  assert.match(html, /app\.js/);
});
