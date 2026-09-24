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

## Плагин Studio OS

Исходники плагина находятся в `plugins/studio-os`, каталог GitHub marketplace — в `.agents/plugins/marketplace.json`. Плагин содержит skills для задач, Distribution Build и Figma handoff. Он версионируется вместе с MASTER; локальные подключения аккаунтов в плагин не входят.

После публикации репозитория подключите marketplace и установите плагин:

```powershell
codex plugin marketplace add markpopkov9-lgtm/Marks1992 --ref main
codex plugin add studio-os@personal
```

Новые skills становятся доступны в следующей задаче Codex.
