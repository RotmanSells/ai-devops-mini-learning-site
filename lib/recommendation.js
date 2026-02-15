import { validateAdvisorInput } from './schemas.js';

/**
 * @param {'interviews' | 'job_tasks' | 'freelance'} target
 * @param {'low' | 'medium' | 'high'} budget
 */
function pickModel(target, budget) {
  if (target === 'interviews') {
    return budget === 'high' ? 'GPT Codex + Opus для проверки' : 'Gemini + GPT Codex';
  }

  if (target === 'job_tasks') {
    return budget === 'low' ? 'Gemini (быстрые черновики) + Codex точечно' : 'GPT Codex как основной';
  }

  return budget === 'low' ? 'Gemini как база + Codex на сложные куски' : 'GPT Codex + OpenCode оркестратор';
}

/**
 * @param {'normal' | 'fast'} speed
 */
function pickWorkMode(speed) {
  if (speed === 'fast') {
    return 'Короткие итерации по 20 минут: задача -> черновик -> проверка -> фиксы.';
  }

  return 'Полные итерации по 45 минут: план -> реализация -> тесты -> документация.';
}

/**
 * @param {'interviews' | 'job_tasks' | 'freelance'} target
 */
function pickChecklist(target) {
  if (target === 'interviews') {
    return [
      'Сделай 10 карточек по Linux, сетям, CI/CD и Kubernetes.',
      'Ежедневно прогоняй 2 практических вопроса с объяснением решения вслух.',
      'Тренируй ответы по схеме: контекст -> решение -> риски -> как проверял.'
    ];
  }

  if (target === 'job_tasks') {
    return [
      'На входе в новую репу сразу проси модель построить карту проекта.',
      'Для каждого пайплайна проси режим dry-run и условия rollback.',
      'Все YAML/Terraform проверяй линтерами и тестовым стендом.'
    ];
  }

  return [
    'Выбери нишу заказов: CI/CD, IaC или Kubernetes поддержка.',
    'Собери 3 продуктовых шаблона: playbook, pipeline, terraform-модуль.',
    'Держи SLA общения: отчет по шагам, что сделал агент и что проверил ты.'
  ];
}

/**
 * @param {import('./schemas.js').advisorInputSchema['_input']} input
 */
export function buildRecommendation(input) {
  const parsed = validateAdvisorInput(input);

  return {
    modelSetup: pickModel(parsed.target, parsed.budget),
    mode: pickWorkMode(parsed.speed),
    checklist: pickChecklist(parsed.target)
  };
}
