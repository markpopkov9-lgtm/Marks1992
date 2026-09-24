# AI Work System v1.0 — Acceptance

## Готово

- Studio OS MASTER и очищенный Distribution Build.
- JARVIS rules, workflows, QA и локальный-first режим.
- MARK Project Memory и MARK Token Optimizer.
- MARK Image Director, Brand Designer, Deep Research, Legal RU, Content Studio и Project Manager.
- MARK Art Direction, Motion Director и Impeccable QA.
- Git/GitHub, VS Code, Node.js, Codex и Figma workflow.
- Проверка секретов, allowlist Distribution, hashes и автоматические тесты.

## Эксплуатационный статус

Система готова для текущей работы. Внешние интеграции загружаются только под конкретную задачу. Секреты и локальная память не входят в Git или Distribution Build.

## Отложенная проверка

Полный design pipeline будет проверен на первом подходящем реальном интерфейсе. До этого статус design-слоя — configured, not field-validated.

HorizonX не входит в v1.0 и рассматривается позднее только при появлении долгих многоэтапных задач.

## Приёмка

Перед релизом версии 1.0 должны проходить:

```powershell
node scripts/system-check.mjs
node scripts/jarvis.mjs check
node --test tests/distribution.test.mjs
node scripts/release.mjs
```
