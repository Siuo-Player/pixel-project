# Instalar ai-memory no Windows para OpenCode

Procedimento preparado para Windows x64 com OpenCode a correr como processo nativo do Windows. Se o teu OpenCode corre dentro de WSL2, executa o caminho Linux dentro da própria distribuição WSL2; não mistures caminhos Windows e WSL.


## Instalação automatizada (um comando)

Fecha o OpenCode antes de começar e abre PowerShell normal na pasta do projeto:

```powershell
Set-Location C:\Users\ASUS\Documents\pixel-project
powershell -ExecutionPolicy Bypass -File .\scripts\setup-ai-memory.ps1
```

O script instala o binário oficial se necessário, verifica que o comando OpenCode existe, executa `setup`, muda os hooks para allowlist, cria o marcador deste repositório se ainda não existir e verifica o servidor. A criação do marcador pede apenas os nomes de workspace e projeto; um marcador existente nunca é sobrescrito. No fim, reabre o OpenCode.

O script não lê nem guarda chaves de API e não configura um modelo pago. A allowlist é uma opção global para esta instalação do ai-memory: os outros checkouts só passam a ser capturados quando também forem inicializados com `ai-memory project init`.

## Instalação nativa (sem Cargo e sem Docker)

Abre PowerShell normal, sem privilégios de administrador. O instalador descarrega o binário Windows pré-compilado e verifica o SHA-256 antes de o instalar.

```powershell
irm https://github.com/akitaonrails/ai-memory/releases/latest/download/install.ps1 | iex
ai-memory setup --yes --agent opencode
```

O setup inicializa a área local, prepara o serviço para arrancar no início de sessão do Windows e instala a integração do agente escolhido. A instalação é por utilizador e não necessita de pagar uma conta nem de instalar Rust/Cargo.

Se o comando `ai-memory` não for reconhecido logo depois do instalador, fecha e volta a abrir o PowerShell para atualizar o PATH.

## Associar a memória ao Pixel Project

Executa estes comandos a partir da raiz do repositório:

```powershell
Set-Location C:\Users\ASUS\Documents\pixel-project

# Configuração global: só os projetos que se registarem explicitamente são capturados.
ai-memory install-hooks --agent opencode --apply --capture-mode allowlist

# Cria .ai-memory.toml para este repositório (o comando pede confirmação dos nomes).
ai-memory project init

# Verifica a instalação e o servidor local.
ai-memory status
ai-memory doctor
```

Escolhe um nome de workspace e projeto que reconheças, por exemplo `personal` e `pixel-project`. O comando não deve substituir um marcador já existente.

**Atenção ao allowlist:** é uma política global da instalação local. Só os repositórios com o marcador `.ai-memory.toml` serão capturados pelos hooks. É a opção mais conservadora para privacidade; acrescenta marcadores aos outros projetos apenas quando quiseres incluí-los. Para voltar ao modo normal de captura, consulta `ai-memory install-hooks --help` e a documentação oficial antes de alterar a política.

Depois de terminar, reinicia o OpenCode. O serviço local usa a base de dados na pasta de dados do utilizador (normalmente `%LOCALAPPDATA%\ai-memory`). O fluxo básico de captura, pesquisa FTS e memória não exige uma chave LLM paga; as funções que chamam modelos são opcionais.

## Se usares OpenCode dentro de WSL2

Executa dentro da distribuição WSL onde o OpenCode está instalado:

```bash
curl -fsSL https://github.com/akitaonrails/ai-memory/releases/latest/download/install.sh | sh
ai-memory setup --yes --agent opencode
cd /mnt/c/Users/ASUS/Documents/pixel-project
ai-memory install-hooks --agent opencode --apply --capture-mode allowlist
ai-memory project init
ai-memory status
```

## Licenças e proveniência

- [ai-memory](https://github.com/akitaonrails/ai-memory) é distribuído sob licença **MIT** ([LICENSE original](https://github.com/akitaonrails/ai-memory/blob/main/LICENSE)).
- O Pixel Project também usa MIT ([LICENSE do projeto](../../../LICENSE)).
- Este repositório adota o padrão de wiki Markdown e a ideia de hooks/memória persistente, mas **não copia código-fonte, binários nem skills** do ai-memory. Assim, não há código externo do ai-memory incorporado nesta aplicação.

A instalação nativa Windows é marcada como **Experimental** na matriz de suporte upstream; consulta sempre a documentação mais recente em [docs/windows.md](https://github.com/akitaonrails/ai-memory/blob/main/docs/windows.md). A referência oficial dos comandos está em [docs/install.md](https://github.com/akitaonrails/ai-memory/blob/main/docs/install.md).
