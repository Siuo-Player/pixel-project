# ADR-0001 — Test-first obrigatório e catálogo de regressões

- **Estado:** Aceite (31-10-2026)
- **Contexto:** Bugs corrigidos voltavam a aparecer porque não existia proteção permanente. Testes com dados artificiais passavam mas falhavam com projetos reais. O mesmo agente escrevia o código e o teste que o validava.
- **Decisão:** Adoptar o ciclo RED → GREEN → auditoria para cada bug/comportamento verificável; manter um catálogo `PX-NNN` ligado ao nome exato de um teste; exigir CI verde no SHA exato a integrar.
- **Consequências:** Mais tempo inicial por bug, mas menos regressões silenciosas. O catálogo torna fácil descobrir onde está a proteção.
- **Alternativas rejeitadas:** Corrigir sem teste (rejeitado — o bug volta); testes gerados pelo mesmo agente sem revisão independente (rejeitado — risco de teste tautológico).
- **Referências:** `AGENTS.md`, `docs/REGRESSION_CATALOG.md`, `docs/TESTING_STRATEGY.md`.
