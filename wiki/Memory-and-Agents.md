# Memória do projeto e agentes de IA

## Memória versionada do Pixel Project

A memória duradoura do projeto está em [docs/memory](https://github.com/Siuo-Player/pixel-project/tree/main/docs/memory):

- `decisions/`: decisões arquiteturais.
- `gotchas/`: armadilhas e bugs já encontrados.
- `procedures/`: procedimentos repetíveis.
- `sessions/`: notas de trabalho.

A fonte de verdade é Markdown versionado em Git. O catálogo de regressões mantém a ligação entre os bugs e os testes que impedem que regressem.

## ai-memory (opcional)

No Windows com OpenCode nativo, o atalho é `powershell -ExecutionPolicy Bypass -File .\\scripts\\setup-ai-memory.ps1` (depois de obter o código pelo `git clone`). O primeiro setup pede os nomes do workspace/projeto; vê o [guia completo](https://github.com/Siuo-Player/pixel-project/blob/main/docs/memory/procedures/ai-memory-windows.md).


O projeto segue o padrão de memória do [akitaonrails/ai-memory](https://github.com/akitaonrails/ai-memory), mas não copia o seu código. O ai-memory é MIT; a respetiva licença está no repositório original.

No Windows nativo, o procedimento sem Cargo nem Docker está documentado em [ai-memory Windows setup](https://github.com/Siuo-Player/pixel-project/blob/main/docs/memory/procedures/ai-memory-windows.md).

A captura de sessões pode incluir prompts, comandos e caminhos locais. Configura o modo allowlist se quiseres que apenas repositórios com `.ai-memory.toml` sejam capturados.
