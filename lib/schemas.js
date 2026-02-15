import { z } from 'zod';

const textSchema = z.string().min(1).max(400);
const pointListSchema = z.array(textSchema).min(1).max(10);

const sectionSchema = z.object({
  title: textSchema,
  points: pointListSchema
});

const metaSchema = z.object({
  title: textSchema,
  subtitle: z.string().min(1).max(500)
});

const versionSchema = z.object({
  heading: textSchema,
  blocks: z.array(sectionSchema).min(1).max(10)
});

const additionSchema = z.object({
  title: textSchema,
  text: z.string().min(1).max(300)
});

const platformSchema = z.object({
  name: textSchema,
  summary: z.string().min(1).max(300)
});

export const guideDataSchema = z.object({
  meta: metaSchema,
  normalVersion: versionSchema,
  simpleVersion: versionSchema,
  additions: z.array(additionSchema).min(1).max(10),
  platformTips: z.array(platformSchema).min(1).max(10),
  actionPlan: pointListSchema,
  interviewFocus: pointListSchema
});

export const advisorInputSchema = z.object({
  target: z.enum(['interviews', 'job_tasks', 'freelance']),
  budget: z.enum(['low', 'medium', 'high']),
  speed: z.enum(['normal', 'fast'])
});

/**
 * @param {import('zod').input<typeof guideDataSchema>} input
 */
export function validateGuideData(input) {
  return guideDataSchema.parse(input);
}

/**
 * @param {import('zod').input<typeof advisorInputSchema>} input
 */
export function validateAdvisorInput(input) {
  return advisorInputSchema.parse(input);
}
