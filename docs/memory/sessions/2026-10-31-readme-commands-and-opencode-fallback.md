# Sessão — Guia de comandos rápidos no README e fallback de instalação do OpenCode

- **Data:** 31-10-2026
- **Contexto:** Feedback do utilizador após execução de `setup-ai-memory.ps1` e `sync-wiki.ps1`.

## Resumo das alterações
1. `README.md` recebeu uma secção destacada `Guia de comandos rápidos` com tabela de comandos de execução, testes, build/download de releases desktop (`gh workflow run` e `gh release download`), sincronização da Wiki e setup de memória.
2. `scripts/setup-ai-memory.ps1` foi aprimorado para detetar a ausência do comando `opencode` e tentar instalá-lo automaticamente via `npm install --global @opencode/cli@2` quando o npm está presente, com mensagem clara de instalação se faltar.
3. `wiki/Releases.md` foi sincronizado com os mesmos comandos de disparo e download de releases via GitHub CLI.
4. `tests/unit/wiki-publishing.test.js` foi expandido em TDD para validar que o README documenta `gh workflow run desktop-release.yml` e `gh release download`, e que o script de setup referencia `@opencode/cli`.
5. 81 testes unitários e 16 testes E2E Playwright verdes.
