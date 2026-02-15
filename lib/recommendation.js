import { validateAdvisorInput } from './schemas.js';

/**
 * @param {'interviews' | 'job_tasks' | 'freelance'} target
 * @param {'low' | 'medium' | 'high'} budget
 */
function pickModel(target, budget) {
  if (target === 'interviews') {
    if (budget === 'high') {
      return 'Мой выбор: Codex как основной + Opus как второй ревьюер + Gemini для быстрых объяснений.';
    }

    return 'Мой выбор: Gemini для скорости + Codex для практики и исправления решений.';
  }

  if (target === 'job_tasks') {
    if (budget === 'low') {
      return 'Мой выбор: Gemini на черновики + точечные сессии Codex на критичные куски.';
    }

    return 'Мой выбор: Codex как основная рабочая модель, Gemini как быстрый ассистент по контексту.';
  }

  if (budget === 'low') {
    return 'Мой выбор: Gemini как база + Codex на ключевые коммерческие задачи.';
  }

  return 'Мой выбор: Codex + OpenCode оркестратор, а Opus подключаю на сложные ревью.';
}

/**
 * @param {'normal' | 'fast'} speed
 */
function pickWorkMode(speed) {
  if (speed === 'fast') {
    return 'Я работаю короткими спринтами по 20 минут: задача -> черновик -> проверка -> фиксы -> итог.';
  }

  return 'Я работаю полным циклом по 45 минут: анализ -> план -> реализация -> тесты -> документация.';
}

/**
 * @param {'interviews' | 'job_tasks' | 'freelance'} target
 */
function pickChecklist(target) {
  if (target === 'interviews') {
    return [
      'Готовлю 10 вопросов по Linux/сетям/Kubernetes и отвечаю вслух.',
      'Решаю 1 практический кейс в день: CI/CD, Terraform или Ansible.',
      'Каждый ответ строю по схеме: контекст -> решение -> риски -> как проверял.',
      'Фиксирую слабые темы и повторяю их через 48 часов.'
    ];
  }

  if (target === 'job_tasks') {
    return [
      'На входе в новую репу прошу карту проекта и список рисков.',
      'Для каждого пайплайна требую dry-run, rollback-план и критерии успеха.',
      'Все YAML/Helm/Terraform прогоняю через валидации до деплоя.',
      'После задач сохраняю рабочие шаблоны в личную базу.'
    ];
  }

  return [
    'Выбираю одну коммерческую нишу: CI/CD, IaC или Kubernetes support.',
    'Собираю 3 пакетных оффера с четким результатом для клиента.',
    'Показываю клиенту отчет по шагам: что сделал ИИ и что проверил я.',
    'Держу предсказуемый процесс: сроки, контроль качества, пост-поддержка.'
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
