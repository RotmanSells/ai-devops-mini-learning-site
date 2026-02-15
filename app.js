import { guideData } from './content.js';
import { buildRecommendation } from './lib/recommendation.js';
import {
  renderAdditions,
  renderChecklist,
  renderRecommendation,
  renderVersion
} from './lib/render.js';
import { validateGuideData } from './lib/schemas.js';

const data = validateGuideData(guideData);

/**
 * @param {string} id
 */
function requireElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Missing element with id: ${id}`);
  }

  return element;
}

const titleElement = requireElement('page-title');
const subtitleElement = requireElement('page-subtitle');
const storyContainer = requireElement('story-container');
const additionsContainer = requireElement('additions-container');
const platformsContainer = requireElement('platforms-container');
const actionPlanList = requireElement('action-plan');
const interviewFocusList = requireElement('interview-focus');
const checklistContainer = requireElement('checklist-container');
const checklistProgress = requireElement('checklist-progress');
const normalButton = requireElement('normal-btn');
const simpleButton = requireElement('simple-btn');
const advisorForm = requireElement('advisor-form');
const advisorResult = requireElement('advisor-result');

let currentMode = 'normal';

function renderStoryMode() {
  storyContainer.innerHTML =
    currentMode === 'normal'
      ? renderVersion(data.normalVersion)
      : renderVersion(data.simpleVersion);

  normalButton.classList.toggle('active', currentMode === 'normal');
  simpleButton.classList.toggle('active', currentMode === 'simple');
}

/**
 * @param {HTMLElement} target
 * @param {string[]} items
 */
function fillList(target, items) {
  target.innerHTML = items.map((item) => `<li>${item}</li>`).join('');
}

function renderPlatforms() {
  const cards = data.platformTips
    .map(
      (platform) => `
        <article class="card">
          <h3>${platform.name}</h3>
          <p>${platform.summary}</p>
        </article>
      `
    )
    .join('');

  platformsContainer.innerHTML = cards;
}

function updateChecklistProgress() {
  const checkboxes = checklistContainer.querySelectorAll('input[type="checkbox"]');
  const checked = [...checkboxes].filter((node) => node instanceof HTMLInputElement && node.checked).length;
  checklistProgress.textContent = `Выполнено ${checked}/${checkboxes.length}`;
}

function renderChecklistPanel() {
  checklistContainer.innerHTML = renderChecklist(data.actionPlan);
  updateChecklistProgress();

  const checkboxes = checklistContainer.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((node) => {
    node.addEventListener('change', () => {
      updateChecklistProgress();
    });
  });
}

function readAdvisorInput() {
  const formData = new FormData(advisorForm);
  return {
    target: String(formData.get('target') ?? ''),
    budget: String(formData.get('budget') ?? ''),
    speed: String(formData.get('speed') ?? '')
  };
}

function bindEvents() {
  normalButton.addEventListener('click', () => {
    currentMode = 'normal';
    renderStoryMode();
  });

  simpleButton.addEventListener('click', () => {
    currentMode = 'simple';
    renderStoryMode();
  });

  advisorForm.addEventListener('submit', (event) => {
    event.preventDefault();

    try {
      const recommendation = buildRecommendation(readAdvisorInput());
      advisorResult.innerHTML = renderRecommendation(recommendation);
    } catch {
      advisorResult.innerHTML =
        '<article class="card"><p>Проверь форму: что-то заполнено некорректно.</p></article>';
    }
  });
}

function init() {
  titleElement.textContent = data.meta.title;
  subtitleElement.textContent = data.meta.subtitle;

  renderStoryMode();
  additionsContainer.innerHTML = renderAdditions(data.additions);
  renderPlatforms();
  fillList(actionPlanList, data.actionPlan);
  fillList(interviewFocusList, data.interviewFocus);
  renderChecklistPanel();
  bindEvents();
}

init();
