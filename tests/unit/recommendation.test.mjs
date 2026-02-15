import test from 'node:test';
import assert from 'node:assert/strict';

import { guideData } from '../../content.js';
import { buildRecommendation } from '../../lib/recommendation.js';
import { validateGuideData } from '../../lib/schemas.js';

test('buildRecommendation выдает план под собесы', () => {
  const result = buildRecommendation({
    target: 'interviews',
    budget: 'high',
    speed: 'fast'
  });

  assert.match(result.modelSetup, /Codex/i);
  assert.match(result.mode, /20 минут/);
  assert.equal(result.checklist.length, 4);
});

test('buildRecommendation отклоняет некорректные входные данные', () => {
  assert.throws(
    () =>
      buildRecommendation({
        target: 'unknown',
        budget: 'high',
        speed: 'fast'
      }),
    /Invalid enum value/
  );
});

test('guideData проходит zod-валидацию', () => {
  const parsed = validateGuideData(guideData);
  assert.equal(parsed.actionPlan.length > 0, true);
  assert.equal(parsed.meta.title.length > 0, true);
});
