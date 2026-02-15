import test from 'node:test';
import assert from 'node:assert/strict';

import { guideData } from '../../content.js';
import { renderAdditions, renderChecklist, renderVersion } from '../../lib/render.js';
import { validateGuideData } from '../../lib/schemas.js';

test('рендер версии текста содержит заголовок и карточки', () => {
  const parsed = validateGuideData(guideData);
  const html = renderVersion(parsed.normalVersion);

  assert.match(html, /Версия 1: нормально и четко \(от моего имени\)/);
  assert.match(html, /cards-grid/);
  assert.match(html, /Gemini 3\.0/);
});

test('рендер дополнений и чеклиста формирует корректные секции', () => {
  const parsed = validateGuideData(guideData);
  const additions = renderAdditions(parsed.additions);
  const checklist = renderChecklist(parsed.actionPlan);

  assert.match(additions, /Правило №1: не верю ответу без проверки/);
  assert.match(checklist, /input/);
  assert.match(checklist, /data-step="0"/);
});
