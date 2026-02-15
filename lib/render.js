/**
 * @param {string} value
 */
function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * @param {string[]} items
 */
function renderPoints(items) {
  const prepared = items.map((item) => `<li>${escapeHtml(item)}</li>`);
  return `<ul>${prepared.join('')}</ul>`;
}

/**
 * @param {{title: string, points: string[]}[]} blocks
 */
function renderBlocks(blocks) {
  return blocks
    .map(
      (block) => `
        <article class="card">
          <h3>${escapeHtml(block.title)}</h3>
          ${renderPoints(block.points)}
        </article>
      `
    )
    .join('');
}

/**
 * @param {{heading: string, blocks: {title: string, points: string[]}[]}} version
 */
export function renderVersion(version) {
  return `
    <section class="story-block" aria-label="${escapeHtml(version.heading)}">
      <h2>${escapeHtml(version.heading)}</h2>
      <div class="cards-grid">${renderBlocks(version.blocks)}</div>
    </section>
  `;
}

/**
 * @param {{title: string, text: string}[]} items
 */
export function renderAdditions(items) {
  const cards = items
    .map(
      (item) => `
        <article class="card tip-card">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
        </article>
      `
    )
    .join('');

  return `<div class="cards-grid">${cards}</div>`;
}

/**
 * @param {string[]} items
 */
export function renderChecklist(items) {
  const rows = items
    .map(
      (item, index) => `
        <label class="check-item" for="step-${index}">
          <input id="step-${index}" type="checkbox" data-step="${index}" />
          <span>${escapeHtml(item)}</span>
        </label>
      `
    )
    .join('');

  return `<div class="checklist">${rows}</div>`;
}

/**
 * @param {{modelSetup: string, mode: string, checklist: string[]}} recommendation
 */
export function renderRecommendation(recommendation) {
  const checklist = recommendation.checklist
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');

  return `
    <article class="recommendation card">
      <h3>Твоя быстрая стратегия</h3>
      <p><strong>Связка моделей:</strong> ${escapeHtml(recommendation.modelSetup)}</p>
      <p><strong>Режим работы:</strong> ${escapeHtml(recommendation.mode)}</p>
      <p><strong>Что делать прямо сейчас:</strong></p>
      <ul>${checklist}</ul>
    </article>
  `;
}
