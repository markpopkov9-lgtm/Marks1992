# ПК и запуск
Откройте studio-os.code-workspace. После установки программ перезапустите терминал для обновления PATH.

Проверка: git --version, node --version, npm.cmd --version, gh --version.
Базовые команды проекта перечислены в README.md. В PowerShell при блокировке npm.ps1 используйте npm.cmd, не меняя политику выполнения.

## Codex
Добавьте MASTER как локальный проект через интерфейс Codex. Подготовлены AGENTS.md и .codex/config.toml. Проектные настройки применяются для доверенного проекта; политики приложения имеют приоритет. Текущий чат автоматически не переносится.
Источники: https://learn.chatgpt.com/docs/agent-configuration/agents-md и https://learn.chatgpt.com/docs/config-file/config-basic.

## GitHub
Ветка main создана. Перед первым коммитом нужны реальные имя автора и email (допустим GitHub noreply); задавайте их локально для репозитория.
Вход: gh auth login --hostname github.com --git-protocol https --web.
Пользователь входит в браузере. Пароли и токены в чат не отправлять. Адрес remote задаётся локально в Git; для публичного репозитория допускаются только проверенные общие файлы, без local и клиентских материалов. Перед push проверяйте git remote -v и состав коммита.
Источник: https://cli.github.com/manual/gh_auth_login.

## Distribution
node scripts/release.mjs создаёт ../Distribution-Build/build-… без Git-истории и local. Перенесите папку сборки и выполните init на новом ПК. Сканер секретов эвристический и не заменяет ручной просмотр.

## Figma
Соединение проверяется отдельно от прав на файл. Нужна ссылка на файл/фрейм. См. design/figma-handoff.md.
