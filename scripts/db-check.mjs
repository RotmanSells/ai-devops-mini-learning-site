import { readFile } from 'node:fs/promises';
import { z } from 'zod';

const dbConfigSchema = z.object({
  project: z.string().min(3).max(80),
  environment: z.enum(['development', 'staging', 'production']),
  poolSize: z.number().int().min(1).max(30),
  readReplica: z.boolean()
});

async function main() {
  const raw = await readFile('config/db.json', 'utf8');
  const parsedJson = JSON.parse(raw);
  dbConfigSchema.parse(parsedJson);
  process.stdout.write('db:check ok\n');
}

await main();
