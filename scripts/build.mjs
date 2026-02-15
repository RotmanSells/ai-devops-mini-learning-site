import { cp, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');

async function main() {
  await rm(dist, { force: true, recursive: true });
  await mkdir(dist, { recursive: true });

  await cp(join(root, 'index.html'), join(dist, 'index.html'));
  await cp(join(root, 'styles'), join(dist, 'styles'), { recursive: true });
  await cp(join(root, 'app.js'), join(dist, 'app.js'));
  await cp(join(root, 'content.js'), join(dist, 'content.js'));
  await cp(join(root, 'lib'), join(dist, 'lib'), { recursive: true });

  process.stdout.write('Build ok. Папка dist обновлена.\n');
}

await main();
