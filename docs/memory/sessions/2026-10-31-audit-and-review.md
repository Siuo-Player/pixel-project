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

## Correção dos 4 bugs (TDD, PX-024…PX-027)
- Todos corrigidos com teste E2E RED→GREEN (`tests/e2e/editor.spec.js`, `tests/e2e/multi-output.spec.js`); commit `117f909`.
- Histórico de undo/redo agora é guardado/restaurado por documento; handler de paleta pessoal tolera ids não-preset; Redo sincroniza inputs de dimensões; redimensionamento da fonte só afeta saídas com `followsSourceSize`.

## Distribuição gratuita (PWA + Pages + Releases)
- App instalável: `manifest.webmanifest`, `sw.js` (cache offline `pixel-project-shell-v1`), ícones gerados por `scripts/build-icons.mjs` em `assets/icons/`; testado por `tests/e2e/application-shell.spec.js`.
- Servidor local ganhou MIME types para `.webmanifest`, `.png` e `.ico` (bug descoberto pelo novo teste).
- `index.html` usa caminhos relativos (`./src/...`) — funciona em `file://` (Electron) e em subcaminhos do Pages.
- Deploy: `.github/workflows/deploy.yml` → GitHub Pages com `scripts/build-site.mjs` (cópia mínima em `artifacts/site`); contrato testado em `tests/unit/deploy-workflow.test.js`.
- Executáveis opcionais: `desktop/main.cjs` + `electron-builder.yml` + `.github/workflows/desktop-release.yml` (manual, win portable + linux AppImage; electron/builder instalam com `--no-save` em CI).
- `LICENSE` MIT (2026 Siuo-Player); `package.json` com `license`, `main` e scripts `build:site`/`build:icons`.
- README com secções "Publicar e instalar" (URL https://siuo-player.github.io/pixel-project/) e "Licenças".
- Suite final: 76 unitários + 16 E2E, verdes.

## Próximos passos pendentes
- O wiki do GitHub precisa da primeira página criada pela UI (limitação do GitHub) antes de poder ser populado a partir de `docs/memory/`; `--enable-wiki` já foi corrido.
- Instalar `ai-memory` (instalador nativo Windows, sem Rust) se se quiser memória automática entre sessões.
