# Gotcha — O `GITHUB_TOKEN` não consegue criar o site Pages na primeira publicação

- **Sintoma:** o workflow `deploy.yml` falha no passo `actions/configure-pages@v5` com `HttpError: Resource not accessible by integration` (chamada à API `POST /repos/{owner}/{repo}/pages`), mesmo com `pages: write` e `id-token: write` declarados no workflow.
- **Contexto:** a **criação** de um site Pages não é permitida ao token efémero do workflow em repos novos; permitir o site uma única vez resolve. Depois disso o próprio workflow publica normalmente.
- **Corrigido (31-10-2026):** site criado uma vez com a sessão `gh` do utilizador:
  ```powershell
  gh api -X POST repos/Siuo-Player/pixel-project/pages -f build_type=workflow
  ```
  `build_type=workflow` = Source "GitHub Actions" nas Settings → Pages.
- **Regra geral:** quando um workflow de publicação falha na primeira execução com "Resource not accessible by integration" num POST de criação de recurso, ativa o recurso uma vez manualmente com um token de utilizador em vez de endurecer permissões inutilmente.
