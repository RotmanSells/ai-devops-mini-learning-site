import { readFile } from 'node:fs/promises';
import { z } from 'zod';

const roleSchema = z.object({
  name: z.string().min(3).max(40),
  permissions: z
    .array(z.string().regex(/^[a-z]+:[a-z]+$/))
    .min(1)
    .max(20)
});

const policySchema = z
  .object({
    roles: z.array(roleSchema).min(1)
  })
  .superRefine((value, ctx) => {
    const names = new Set();

    value.roles.forEach((role, index) => {
      if (names.has(role.name)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Дублируется роль: ${role.name}`,
          path: ['roles', index, 'name']
        });
      }

      names.add(role.name);
    });
  });

async function main() {
  const raw = await readFile('config/rbac.json', 'utf8');
  const parsedJson = JSON.parse(raw);
  policySchema.parse(parsedJson);
  process.stdout.write('rbac:validate ok\n');
}

await main();
