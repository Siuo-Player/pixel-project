# Sessão — atalho idempotente para ai-memory e revisão final

- **Data:** 31-10-2026
- **Ramo:** `feat/wiki-and-desktop-distribution`
- **Código validado antes desta nota:** `30f6a274b5addaba85ceafae6ee565e5ea18300c`
- **CI:** [run 41227862798](https://github.com/Siuo-Player/pixel-project/actions/runs/41227862798)

## Alterações finais

- Foi adicionado `scripts/setup-ai-memory.ps1` para instalar o binário oficial Windows se ainda não existir, configurar apenas o OpenCode, aplicar captura `allowlist`, inicializar o marcador do Pixel Project e executar `status` e `doctor`.
- O script exige que o comando `opencode` exista no mesmo ambiente Windows. Se o OpenCode correr em WSL2, usar a sequência Linux na própria distribuição.
- O script é idempotente quanto ao marcador: quando `.ai-memory.toml` já existe, não o tenta criar nem sobrescrever.
- O README, a Wiki de origem e a documentação de memória apontam para o comando de uma linha.
- As entradas PX-029/PX-030 foram colocadas dentro da tabela do catálogo de regressões.
- O procedimento de build local também usa versões fixadas e não altera package-lock.

## Verificação

- O primeiro contrato do atalho falhou porque o teste esperava uma chamada literal a `ai-memory doctor`, mas o script usa deliberadamente uma função que verifica o código de saída (`Invoke-AiMemoryCommand doctor`). O teste foi corrigido para validar a chamada real; nenhuma verificação de comportamento foi removida.
- No SHA `30f6a274...`: 81 testes unitários/de integração e 16 E2E passaram, sem falhas.
- O CI volta a ser executado no commit desta nota antes da PR.
