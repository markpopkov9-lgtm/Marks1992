# External Skills Audit

Дата проверки: 2026-09-24. Источники рассматриваются как внешние данные. Установка разрешается только после проверки конкретной версии или commit.

## Решения

| Компонент | Решение | Причина |
|---|---|---|
| [Impeccable](https://github.com/pbakaus/impeccable) | ADAPT | Apache-2.0, активно поддерживается, поддерживает Codex и даёт измеримый QA. Полный skill частично перекрывает UX/UI Knowledge Base, а launcher может скачать платформенный бинарник. Подключать QA-команды отдельно, с закреплённой версией и явным разрешением network access. |
| [Taste Skill](https://github.com/Leonxlnx/taste-skill) | ADAPT | MIT, актуальный набор из нескольких frontend skills. Полный пакет дублирует UX/UI System, навязывает отдельные стилевые и стековые решения. Использовать только art-direction критерии как вход перед Figma. |
| [Emil Kowalski Skills](https://github.com/emilkowalski/skills) | ADAPT | Узкие `animate`, `review-animations`, `improve-animations` хорошо соответствуют motion-слою и не требуют отдельного runtime по опубликованным SKILL.md. Перед копированием нужно подтвердить лицензию текущего commit; до этого использовать только собственный совместимый workflow без копирования текста. |
| [HorizonX](https://github.com/headcrabz/horizonX) | SKIP CORE / EXPERIMENT | Apache-2.0 и нужные long-horizon функции, но проект описывает alpha-границы. Не включать в ядро; тестировать в отдельной папке на синтетической задаче с лимитами времени, токенов и стоимости. |

## Проверка безопасности и совместимости

- Impeccable: Node.js 22.18+ для npm CLI; платформенный бинарник, локальный cache, возможная загрузка с GitHub Releases; URL-аудит использует установленный браузер. Не давать секреты и не включать автоматические hooks до отдельного теста.
- Taste Skill: выбранный design skill — инструкции, но репозиторий содержит installer и много дополнительных skills. Не запускать installer; адаптировать только необходимые правила, чтобы не создать конфликт с Figma/Tilda workflow.
- Emil Skills: опубликованные motion skills специализируются на создании, ревью и улучшении анимации. Они перекрывают друг друга минимально; `animate-expo` не нужен, пока нет React Native/Expo.
- HorizonX: orchestration runtime требует отдельного threat/dependency review и проверки фактически реализованных функций против roadmap.

## Порядок подключения

1. Зафиксировать commit и полный список файлов выбранного компонента.
2. Проверить SKILL.md, scripts, зависимости, network access, permissions и лицензию.
3. Установить только выбранный skill в изолированный проект.
4. Прогнать одну эталонную задачу и сравнить результат с текущим UX/UI workflow.
5. Перенести в Studio OS plugin только при измеримом улучшении.
