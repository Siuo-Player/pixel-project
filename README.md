# Pixel Project

Editor web de pixel art com conversão contextual de uma imagem de entrada transparente/preto/branco para uma paleta de cores discreta. O motor interpreta vizinhanças e estruturas; não aplica um mapeamento fixo entre preto, branco e duas cores.

## Funcionalidades disponíveis

### Projeto e documentos
- Criar grelhas entre 4×4 e 256×256 píxeis, com um máximo de 65 536 píxeis.
- Abrir vários documentos independentes em separadores.
- Criar uma nova tela, alternar entre telas e fechar uma tela com confirmação de alterações não exportadas.
- Importar um ficheiro `.pixelproj` como um novo documento e exportar o documento ativo.
- Cada separador mantém a sua imagem, configuração de conversão, zoom e histórico.

### Desenho
- Estados da fonte: transparente, preto e branco.
- Pincel, borracha, linha, retângulo, retângulo preenchido, elipse, elipse preenchida, balde de preenchimento e conta-gotas.
- Desenho por arrastamento com interpolação de linha.
- Ferramentas de espelhamento e rotação que alteram a matriz real.
- Desfazer/refazer (até 50 estados por documento).
- Zoom e deslocação partilhados entre a fonte e a pré-visualização.

### Paletas e conversão
- **34 paletas predefinidas**, distribuídas por cinco tamanhos:

| Cores | Paletas |
|---:|---:|
| 4 | 10 |
| 8 | 8 |
| 12 | 6 |
| 16 | 6 |
| 32 | 4 |

- Escolher o tamanho da paleta no ecrã inicial ou dentro do editor.
- Personalizar individualmente as cores de um preset.
- Sete técnicas: vizinhança ponderada, linhas direcionais, entropia local, maioria local, contraste sensível a arestas, gradiente direcional e dithering ordenado.
- Instâncias repetidas de técnicas com parâmetros e pesos independentes.
- Três resolvedores: média ponderada, maior confiança individual e votação ponderada.
- Redimensionamento independente por interpretação, com reamostragem nearest-neighbour da fonte original.
- A saída contém apenas índices válidos da paleta; a transparência nunca é colorida.
- A inversão de preto/branco reflete o papel cromático através da ordem inversa da paleta.

### Interface e atalhos
- Menus **Ficheiro**, **Editar** e **Ver**.
- Layout responsivo, modo lado a lado, grelha e disposição automática.
- `Ctrl/Cmd+Z`: desfazer; `Ctrl/Cmd+Shift+Z` ou `Ctrl/Cmd+Y`: refazer.
- `Ctrl/Cmd+N`: nova tela; `Ctrl/Cmd+S`: exportar; `Ctrl/Cmd+W`: fechar tela.
- Ferramentas: `B` preto, `W` branco, `E` borracha, `L` linha, `R` retângulo, `O` elipse, `G` balde, `I` conta-gotas.

## Projetos de exemplo

A pasta [examples/](examples/) contém quatro projetos importáveis em formato `.pixelproj`. Cada um inclui uma única imagem original e três interpretações, com paletas, resoluções, técnicas e resolvedores diferentes:

| Projeto | Arte | Variações incluídas |
|---|---|---|
| [Farol ao anoitecer](examples/lighthouse-at-dusk.pixelproj) | Farol, ilha e mar | 8, 12 e 32 cores; 24×24 a 64×64 |
| [Gato sob a lua](examples/moonlit-cat.pixelproj) | Gato, lua e estrelas | 8, 16 e 32 cores; dithering e maioria local |
| [Bosque dos cogumelos](examples/mushroom-grove.pixelproj) | Cogumelos e árvores | 4, 12 e 32 cores; minimalista e texturado |
| [Templo no deserto](examples/desert-temple.pixelproj) | Templo, dunas e cactos | 12 e 16 cores; diferentes resoluções e métodos |

Para abrir um exemplo, inicia o editor, clica em **Importar** e escolhe o ficheiro `.pixelproj`. As três interpretações aparecem ligadas à mesma origem.

## Limitações conhecidas

- As telas abertas são mantidas em memória durante a sessão. Ainda não existe gravação automática após fechar ou atualizar o browser; exporta os documentos para os conservar.
- Cada projeto tem uma imagem original e até três interpretações coloridas em simultâneo. Cada interpretação dispõe de paleta, número de cores, resolução, técnicas e resolvedor próprios.
- A configuração é contextual: clica na imagem original para ajustar a grelha de origem ou numa interpretação para alterar apenas essa saída.
- As ferramentas de forma e a cor de desenho são independentes; podes mudar de preto para branco sem voltar a selecionar a elipse ou o retângulo.
- Não existem ainda camadas, animação por frames, importação direta de PNG/JPG, seleção/recorte, nem importação direta de ficheiros PAL/ASE/GPL.
- A personalização atual altera as cores de um preset; não adiciona nem remove entradas da paleta.

## Executar localmente

Requisitos: Node.js 20 ou superior e npm.

```powershell
npm install
npx playwright install chromium
npm start
```

Abrir [http://localhost:4173](http://localhost:4173).

## Publicar e instalar (tudo gratuito)

### App online — GitHub Pages

A app é publicada em **https://siuo-player.github.io/pixel-project/** pelo workflow `deploy.yml`, que corre automaticamente a cada push na `main` (só envia os ficheiros de que a app precisa — sem docs, testes nem artefactos).

### Instalar como aplicação (PWA, sem loja e sem taxas)

A app é uma PWA válida (manifest + service worker com suporte offline) e instala-se a partir do próprio browser:

| Ambiente | Como instalar |
|---|---|
| Windows/macOS/Linux (Chrome ou Edge) | Abrir o site → ícone **Instalar** na barra de morada → fica como app nativa, funciona offline e aparece no menu de apps |
| Android (Chrome) | Menu ⋮ → **Adicionar ao ecrã principal** |
| iOS/iPadOS (Safari) | Partilhar → **Adicionar ao ecrã principal** |
| macOS (Safari) | Ficheiro → **Adicionar à doca** |

### Executável desktop autónomo — GitHub Releases

Se precisares de um ficheiro executável para distribuir diretamente (sem loja e sem pagamento), o GitHub Releases hospeda-os de graça:

1. GitHub → **Actions** → **Desktop release** → **Run workflow** (indicar a tag, ex.: `desktop-v0.6.0`).
2. São construídos **.exe portátil para Windows**, **AppImage para Linux** e **.dmg para macOS**.
3. Só depois dos três builds terminarem, um job separado publica os binários e os respetivos hashes SHA-256 no release indicado.
4. Qualquer pessoa descarrega diretamente da página [Releases](https://github.com/Siuo-Player/pixel-project/releases) — sem lojas nem contas.
5. Os executáveis não são assinados nem notarizados (isso exigiria certificados/contas pagos); Windows/macOS podem mostrar avisos de primeira execução. Confirma o SHA-256 publicado antes de abrir o ficheiro.

Os builds usam Electron 45.2.1 e electron-builder 26.18.0, fixados no workflow. O job de build tem apenas leitura do repositório; só o job final recebe contents: write para publicar o release.

Alternativa local (opcional, no teu PC): `npm install --no-save --package-lock=false electron@45.2.1 electron-builder@26.18.0` e depois `npx electron-builder --win --publish never`. O Chromium do Electron é descarregado apenas nesta etapa — não faz parte do `npm install` normal do projeto.

Nota: a ligação para a PWA aparece nas notas do release no workflow `desktop-release.yml`; se o nome de utilizador do GitHub mudar, ajusta-a nesse ficheiro.

## Licenças

- **Este projeto: MIT** (ver [`LICENSE`](LICENSE)) — uso, modificação, distribuição e comercialização permitidos, sem qualquer custo. A única obrigação é manter o aviso de copyright.
- **Dependências em runtime (o que é distribuído): nenhuma.** O código da app não carrega bibliotecas externas nem CDNs.
- **Ferramentas de desenvolvimento** (não distribuídas com a app): Playwright (Apache-2.0); Electron e electron-builder (MIT), opcionais e instaladas apenas quando construis executáveis.
- **Ícones e assets**: gerados pelo próprio projeto (imagem desenhada por código, em `scripts/build-icons.mjs`) — sem arte de terceiros.
- **Processo de engenharia**: inspirado no [ai-memory](https://github.com/akitaonrails/ai-memory) (licença MIT do autor Fabio Akita) — seguimos o padrão de wiki versionada em `docs/memory/`; não usa código desse projeto.

## Testes

```powershell
npm test
npm run test:e2e
npm run test:all
```

Outros comandos úteis:
- `npm run test:e2e:headed`: executar com Chromium visível.
- `npm run test:e2e:debug`: abrir o modo de depuração do Playwright.
- `npm run test:e2e:report`: abrir o relatório HTML da última execução.

Os testes de browser geram capturas em `artifacts/screenshots/`. Em caso de falha, o Playwright guarda screenshots, traces e vídeos em `artifacts/test-results/`. A GitHub Actions executa ambas as suites e publica os artefactos de evidência.

## Documentação

- [Requisitos funcionais e técnicos](requisitos.txt)
- [Estado de implementação do MVP](docs/MVP_REQUIREMENTS.md)
- [Visão do produto](docs/PRODUCT_VISION.md)
- [Arquitetura técnica](docs/TECHNICAL_DESIGN.md)
- [Catálogo de paletas disponíveis](docs/PALETTE_CATALOG.md)
- [Pesquisa de paletas e referências externas](docs/COLOR_PALETTE_RESEARCH.md)
- [Teoria das cores e regras de avaliação](docs/COLOR_THEORY_AND_RULES.md)
- [Motor modular de transformação e fusão](docs/MODULAR_TRANSFORMATION_ENGINE.md)
- [Técnicas avançadas planeadas](docs/ADVANCED_RULES_AND_ENGINE.md)
- [Estratégia de testes](docs/TESTING_STRATEGY.md)
- [Decisões e questões em aberto](docs/DECISIONS_AND_QUESTIONS.md)
- [Histórico de alterações](CHANGELOG.md)

## Organização do código

- `src/core/`: grelha, transformações, histórico, workspace de documentos e formato de projeto.
- `src/engine/`: catálogo de paletas, técnicas, propostas, resolvedor e conversor.
- `src/ui/`: coordenadas e navegação do Canvas.
- `assets/icons/`: ícones da PWA gerados por `scripts/build-icons.mjs`.
- `tests/unit/`, `tests/integration/`, `tests/e2e/`: testes por camada.
- `scripts/`: servidor local, build do site (Pages) e gerador de ícones.
- `desktop/`: wrapper Electron opcional, empacotado com `electron-builder.yml`.
- `artifacts/`: evidências geradas pelos testes; não são ficheiros-fonte do projeto.

## Processo de engenharia e prevenção de regressões

Antes de alterar código, qualquer agente deve ler [`AGENTS.md`](AGENTS.md). Bugs e falhas conhecidos ficam ligados a testes reais em [`docs/REGRESSION_CATALOG.md`](docs/REGRESSION_CATALOG.md). O ciclo obrigatório é: escrever o teste, confirmar RED, corrigir, confirmar GREEN, executar `npm run test:all` e verificar CI no SHA exato.


## GitHub Wiki — documentação navegável

A [Wiki do projeto](https://github.com/Siuo-Player/pixel-project/wiki) tem páginas para começar, desenvolver, descarregar e compreender a memória dos agentes. As páginas-fonte também vivem em `wiki/` no repositório, para serem revistas e versionadas com o código.

Depois de a Wiki estar inicializada no GitHub, sincroniza-a a partir de PowerShell:

```powershell
git pull origin main
powershell -ExecutionPolicy Bypass -File .\scripts\sync-wiki.ps1
```

Se a Wiki ainda não tiver nenhuma página, abre [Criar a primeira página](https://github.com/Siuo-Player/pixel-project/wiki/_new), cria e guarda `Home`, e volta a executar o comando.
