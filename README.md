# Studio OS MASTER
JARVIS управляет задачами, контекстом и QA этой Studio OS. Активный источник правил — эта папка MASTER. Предыдущий каркас JARVIS сохранён отдельно. Материалы иной Studio OS пока не импортированы.

## Структура
- config, AGENTS.md, prompts, workflows — управление.
- knowledge — общая база знаний.
- projects, design, media, marketing — правила рабочих направлений.
- local — приватные проекты, контекст, экспорты и отчёты, исключённые из Git.
- ../Distribution-Build — очищенные версии для передачи.
- dist — внутренняя сборка команды build.

## Запуск
Откройте studio-os.code-workspace в VS Code. Добавьте MASTER как локальный проект в Codex через интерфейс приложения. Требуется Node.js 22+ и Git; npm install не нужен.
```sh
node scripts/jarvis.mjs init
node scripts/jarvis.mjs doctor
node scripts/jarvis.mjs check
node --test tests/distribution.test.mjs
node scripts/release.mjs
```
Release проверяет проект и создаёт новую папку рядом с MASTER. Существующие сборки сохраняются.
Копируйте templates/task.md в local/tasks. Правила Codex: AGENTS.md и .codex/config.toml. Интеграция Figma: design/figma-handoff.md. Настройка ПК: docs/setup.md.
