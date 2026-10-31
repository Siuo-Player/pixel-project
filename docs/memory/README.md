# Memória do projeto (wiki versionada)

Inspirado no projeto [ai-memory](https://github.com/akitaonrails/ai-memory) (licença MIT — apenas seguimos o padrão de trabalho; não usamos o seu código). A **fonte de verdade é texto Markdown versionado em Git**, não uma base de dados opaca. Qualquer agente ou pessoa pode ler, pesquisar e editar estes ficheiros; se a indexação se perder, a memória reconstrói-se a partir dos ficheiros.

## Estrutura

- `decisions/` — decisões arquiteturais (ADR): estado, contexto, decisão, consequências, alternativas rejeitadas. Uma página por decisão, nunca editar o histórico; criar uma nova que substitui a anterior.
- `gotchas/` — armadilhas e bugs confirmados que merecem atenção, mesmo antes de terem teste.
- `procedures/` — passos repetíveis (release, deploy, triagem de issues).
- `sessions/` — notas de sessão: o que foi feito, o que ficou por fazer, decisões tomadas no momento.

## Regras

1. Escrever em Markdown simples, sem depender de ferramentas externas.
2. Manter as páginas pequenas e focadas; ligar com links relativos.
3. Nunca apagar histórico: superseder, não editar.
4. Credenciais e dados sensíveis nunca entram aqui (ver `AGENTS.md`).
5. Antes de uma sessão longa, ler `decisions/` e `gotchas/`; no fim, acrescentar uma nota em `sessions/`.

## Relação com outros documentos

- `docs/REGRESSION_CATALOG.md` — proteção executável (testes). Este wiki explica o **porquê**; o catálogo garante o **comportamento**.
- `docs/TESTING_STRATEGY.md` — como validar.
- `AGENTS.md` — regras de trabalho.

## Publicação na GitHub Wiki

A Wiki do GitHub é um **espelho de leitura**, não uma segunda fonte de verdade. Os ficheiros neste diretório continuam a ser a fonte oficial, versionada e revista em pull requests.

Depois de criares a primeira página `Home` na interface GitHub (necessário para inicializar a Wiki), executa `gh auth setup-git` e `npm run wiki:publish`. O script atualiza apenas as páginas que pertencem ao projeto e não remove páginas adicionais criadas manualmente.
