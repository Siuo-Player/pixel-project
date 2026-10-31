# Sessão 31-10-2026 — Auditoria pós-PR #7 e revisão GLM

## Feito
- Secret `OPENCODE_API_KEY` verificado e testado ponta-a-ponta (run 41218020943, **success em 7m16s**).
- Workflow do revisor endurecido (permissions read-only, CLI pinada a major 2, cache, concurrency, timeout 15 min, actions v7).
- Bug real corrigido: `parseProject` rejeita payload não-objeto e `resolverMode` desconhecido (`PX-023`).
- Numeração duplicada em `TESTING_STRATEGY.md` corrigida; PX-016 corrigido; catálogo exige IDs contíguos.
- CI no SHA `84e73d6` verde em 39s, sem aviso de Node 20.
- Criado wiki de memória versionada em `docs/memory/` (padrão ai-memory).

## Revisão GLM (run 41218020943) — bugs confirmados
1. **Alto** — histórico undo/redo partilhado entre abas (ver gotcha 0001).
2. **Médio** — selecionar "Paleta personalizada" em `#editor-palette` pode lançar `RangeError` não apanhado.
3. **Baixo** — `redoAction` não chama `refreshSelectedDimensionInputs()`.
4. **Médio** — `applySourceSize` redimensiona saídas personalizadas que coincidam com o tamanho antigo da fonte (contradiz PX-010).

## Próximos passos sugeridos
- Corrigir os 4 bugs acima em TDD (PX-024…PX-027) — aguardar confirmação do utilizador.
- Adicionar `LICENSE` (MIT recomendado) e publicar como PWA.
- Instalar `ai-memory` (requer Rust/cargo) se se quiser memória automática entre sessões; até lá, manter este wiki à mão.
