# MARK PROJECT MEMORY

Центральное краткое состояние проекта хранится в `local/project-state.json` и не попадает в Git или Distribution Build. Публичная структура полей хранится в `templates/project-state.json`.

Обновляйте память после принятого решения, завершённого этапа, изменения ограничения или следующего действия. Не копируйте туда переписку, большие документы, секреты и промежуточные рассуждения.

Команды:

```powershell
npm run memory:init
npm run memory:show
node scripts/memory.mjs set currentStage "GitHub Skills audit"
node scripts/memory.mjs set nextActions '["Audit Impeccable","Audit Taste","Audit Motion"]'
```

# MARK TOKEN OPTIMIZER

Перед задачей загружайте краткое состояние, затем только нужные файлы:

```powershell
npm run context -- AGENTS.md design/figma-handoff.md
```

Контекст ограничивается бюджетом из `config/jarvis.json`. Для больших документов сначала ищите нужные разделы, затем передавайте только выбранные фрагменты. Уже обработанные источники повторно не загружайте, если их версия и задача не изменились.
