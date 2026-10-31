# Sessão — Wiki, distribuição desktop e ai-memory

- **Data:** 31-10-2026
- **Ramo:** `feat/wiki-and-desktop-distribution`
- **Base:** `46d60b82be88a93853b4162f8cef9ce7a46b1b4a`
- **SHA validado:** `9bf600253269ad7d85c574c6b82b5a10a1272fdb`
- **CI:** [run 41227237215](https://github.com/Siuo-Player/pixel-project/actions/runs/41227237215)

## O que foi confirmado antes de alterar

- A aplicação PWA e o workflow GitHub Pages já existiam. O deploy para `https://siuo-player.github.io/pixel-project/` terminou com sucesso no run 41220905189.
- A licença MIT já existia em `LICENSE` e `package.json`.
- O revisor OpenCode já usa `OPENCODE_API_KEY`, o modelo `opencode/glm-5.3-flash-free` por omissão e `permissions: contents: read`. O run manual 41218020943 executou o passo de revisão (não foi um skip).
- Os quatro bugs de GLM já estavam corrigidos na implementação e tinham testes PX-024 a PX-027. O teste de histórico foi reforçado para alternar entre as duas abas e validar undo e redo em ambas.

## Alterações desta sessão

- O workflow desktop passou a construir Windows/portable EXE, Linux/AppImage e macOS/DMG em três jobs de build separados. Um job de release dependente dos três builds cria ou atualiza uma única release, publica os binários e ficheiros SHA-256. Os builds têm apenas `contents: read`; só o job de publicação tem `contents: write`.
- Electron e electron-builder estão fixados no workflow para tornar o processo reproduzível.
- As páginas de Wiki foram criadas em `wiki/` e versionadas no repositório. `scripts/sync-wiki.ps1` clona a Wiki, copia as páginas e faz push com as credenciais Git locais; não grava tokens no script.
- A Wiki é um repositório separado. A integração disponível nesta sessão não expõe operações de escrita para esse repositório, por isso a publicação efetiva ainda tem de ser feita pelo script no computador local. Se a Wiki nunca foi inicializada, é necessário criar a primeira página pela interface GitHub antes de a clonar.
- O procedimento Windows do ai-memory foi documentado em `docs/memory/procedures/ai-memory-windows.md`. Usa o binário pré-compilado e o instalador PowerShell oficial, sem Cargo/Docker. O Windows nativo é marcado como experimental upstream; quem corre OpenCode dentro de WSL2 deve instalar dentro dessa distribuição.
- O padrão ai-memory foi documentado sem copiar código-fonte/binários/skills do upstream. A licença upstream é MIT.

## TDD e verificação

- Antes da implementação, os testes para a publicação desktop e Wiki falharam porque a matrix macOS/publicação serializada, páginas Wiki e procedimento ai-memory ainda não existiam (RED esperado).
- A implementação foi seguida por um único ajuste do contrato de ordem das chaves YAML, preservando a verificação de dependência do job.
- Resultado final do run 41227237215: 81 unitários/integração e 16 E2E passaram; zero falhas.

## Passos ainda dependentes do utilizador

1. Depois do merge, executar `powershell -ExecutionPolicy Bypass -File .\scripts\sync-wiki.ps1` num clone autenticado do repositório. Inicializar a Wiki pela interface primeiro, se necessário.
2. Para gerar executáveis, abrir Actions → Desktop release → Run workflow. O workflow é manual; os binários só serão publicados depois dessa execução.
3. No Windows nativo, instalar o ai-memory com o procedimento documentado e reiniciar o OpenCode. Não usar comandos Windows se o OpenCode estiver a correr dentro de WSL2.
4. Não é necessário alterar scopes do GitHub ou substituir `OPENCODE_API_KEY` quando o run manual GLM continuar a passar. O modelo gratuito pode deixar de estar disponível sem aviso.
