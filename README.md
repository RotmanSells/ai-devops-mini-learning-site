# AI DevOps Mini Guide

Мини-сайт на обычных `HTML/CSS/JS`.

## Что внутри

- Две версии одного текста:
  - "Нормально и четко"
  - "Разжевано для любого"
- Обновленная версия материала по LLM для DevOps
- Мини-консультант по выбору связки моделей
- Чеклист подготовки к собесам

## Локальный запуск

```bash
python3 -m http.server 4173
# открыть http://localhost:4173
```

## Проверки

```bash
npm run lint
npm run typecheck
npm run test
npm run test:integration
npm run test:e2e
npm run build
npm run db:check
npm run rbac:validate
```
