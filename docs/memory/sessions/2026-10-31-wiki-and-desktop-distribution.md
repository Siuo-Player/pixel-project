# Sessão 31-10-2026 — Wiki do GitHub e distribuição desktop gratuita

## Estado confirmado antes das alterações
- O GitHub Pages já estava ativo e a publicação mais recente do `main` terminou com sucesso: run `41220905189`, commit `46d60b82`.
- A PWA já tinha manifest, ícones e service worker; `tests/e2e/application-shell.spec.js` verifica o contrato de instalação e cache offline.
- A licença do Pixel Project já é MIT. O README atribui corretamente a inspiração do padrão de memória ao `akitaonrails/ai-memory` (MIT, Fabio Akita) e declara que não reutilizamos código do projeto.
- A key `OPENCODE_API_KEY` já tinha sido testada com sucesso no workflow GLM; não ampliar permissões do `GITHUB_TOKEN` para a revisão read-only.

## Trabalho desta sessão
- Adicionado `scripts/publish-wiki.mjs` e `npm run wiki:publish`. O script espelha `AGENTS.md`, o catálogo de regressões e as páginas em `docs/memory/{decisions,gotchas,procedures,sessions}` para a GitHub Wiki.
- A Wiki é apenas um espelho; os Markdown versionados no repositório continuam a ser a fonte de verdade. O script só faz stage das páginas que gere e não apaga páginas adicionais.
- A GitHub Wiki ainda precisa da sua primeira página `Home` criada na interface GitHub. Depois, autenticar o Git via `gh auth setup-git` e executar `npm run wiki:publish`.
- Refeito `.github/workflows/desktop-release.yml`: Windows `portable` x64 para um único `.exe`; Linux `AppImage` x64 para um único ficheiro. Builds separados por runner, artifacts separados e um job final que cria/atualiza o GitHub Release.
- O workflow desktop é manual (`workflow_dispatch`) para não publicar releases em cada push. A publicação da primeira release ainda requer executar Actions → Desktop release → Run workflow.
- Acrescentados testes de contrato para os formatos desktop e o sincronizador da Wiki.

## Limites e cautelas
- GitHub Pages e runners standard GitHub Actions são gratuitos neste repositório público.
- O Windows portable é unsigned; o SmartScreen pode mostrar aviso. Não prometer ausência de alertas sem certificado de assinatura pago.
- AppImage é um executável Linux portátil; alguns ambientes podem precisar de permissões de execução (`chmod +x`).
- Ainda não foi criado conteúdo na Wiki porque a página inicial tem de ser inicializada pela UI. Não confundir a existência do sincronizador com uma Wiki já publicada.
- A revisão OpenCode não requer scopes extra de GitHub; `OPENCODE_API_KEY` é a autenticação do fornecedor/modelo e `GITHUB_TOKEN` é read-only.

## Próximos passos
1. Terminar CI no SHA exato da branch.
2. Integrar a PR.
3. O utilizador cria a página Wiki `Home` uma vez e executa `gh auth setup-git; npm run wiki:publish`.
4. O utilizador executa manualmente o workflow Desktop release para gerar os dois binários e publicá-los.
