# Design Layer v1.0

Рабочая последовательность:

`Project Memory → Token Optimizer → UX/UI System → MARK Art Direction → Figma → Impeccable QA → MARK Motion Director → Codex implementation → Browser QA`

## Taste / Art Direction

`mark-art-direction` адаптирует роль Taste Skill к существующей Studio OS. Полный внешний пакет не устанавливается: он дублирует UX/UI Knowledge Base и содержит стилевые предположения, которые не должны автоматически менять бренд или стек.

## Motion

`mark-motion-director` покрывает выбор, спецификацию и ревью motion. Текст внешних Emil Kowalski Skills не копируется, пока не подтверждена лицензия закреплённой версии. Для React Native/Expo отдельный слой пока не подключается.

## Impeccable QA

Impeccable подключается только в project scope и без hooks. Его launcher может использовать платформенный бинарник и сетевую загрузку, поэтому установка и обновление выполняются как отдельное осознанное действие. После установки `mark-impeccable-qa` использует его только для реализованного интерфейса и сверяет вывод с правилами Studio OS.

Локальная установка `.agents/skills/impeccable` и рабочее состояние `.impeccable` исключены из Git. В репозитории остаются только правила интеграции и закреплённая команда установки.

Рекомендуемая установка из корня MASTER:

```powershell
npx --yes impeccable@4.1.0 install -y --providers=codex --scope=project --no-hooks
```

Перед будущим обновлением повторите аудит новой версии.
