# Gotcha — Histórico de undo/redo partilhado entre abas

- **Estado:** Confirmado pela revisão automática (GLM) em 31-10-2026, pendente de correção.
- **Sintoma:** Desenhar na aba A, mudar para a aba B, premir Ctrl+Z pode substituir a grelha de B por um snapshot de A (por vezes com dimensões diferentes).
- **Causa:** `src/main.js` usa uma variável global `history`; `saveActiveDocumentState`/`loadDocument` guardam/restauram tudo **exceto** o histórico. O campo `history` criado em `src/core/workspace.js` (linha 23) é código morto.
- **Proteção actual:** `PX-020` existe, mas o seu teste não premia undo/redo **depois** de trocar de aba, por isso não deteta o problema.
- **Plano:** Persistir `activeDocument.history` em `saveActiveDocumentState` e restaurá-lo em `loadDocument`; acrescentar teste E2E que desfaz após troca de aba; registar como `PX-024`.
- **Referências:** `src/main.js:40`, `src/main.js:65-93`, `src/core/workspace.js:23`, `tests/e2e/editor.spec.js:264`.
