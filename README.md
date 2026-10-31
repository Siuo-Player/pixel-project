# Pixel Project

Um editor experimental de pixel art que converte uma imagem-fonte transparente/preto/branco numa interpretação colorida, através de técnicas configuráveis e paletas discretas.

A ideia central é desenhar com duas cores de entrada e observar como diferentes regras estruturais e paletas reinterpretam o mesmo desenho. A cor de cada pixel depende do contexto, não de um mapeamento fixo entre preto/branco e duas cores.

## Estado do projeto

**Primeiro protótipo executável em desenvolvimento.** Já existe:
- ecrã de criação com dimensões e paletas de 4, 8 ou 12 cores;
- 13 paletas predefinidas (6 de 4 cores, 4 de 8 cores e 3 de 12 cores) e edição das cores;
- tela original e pré-visualização convertida, com transparência desenhada por célula real e contorno da grelha editável;
- pincel preto, branco e borracha, linha, retângulo, retângulo preenchido, elipse, elipse preenchida, balde de preenchimento e conta-gotas;
- vários documentos independentes em separadores, com criação e fecho de telas;
- histórico de desfazer/refazer por documento e atalhos de teclado (B, W, E, L, R, O, G e I para ferramentas);
- alteração do tamanho da paleta (4, 8 ou 12 cores) diretamente no editor;
- menus de Ficheiro, Editar e Ver, com ações de exportação, importação, limpeza e navegação;
- desenho por arrastamento sem falhas;
- zoom e pan partilhados;
- espelhamento e rotação da matriz original;
- instâncias configuráveis de técnicas, incluindo instâncias repetidas;
- média contextual, deteção direcional de linhas e entropia local;
- combinação de propostas por média ponderada ou maior confiança individual;
- importação/exportação de ficheiros de projeto;
- testes unitários e de integração com Node.js;
- testes de browser com Chromium e capturas de ecrã automáticas.

Cada separador mantém o seu próprio desenho, paleta, zoom, técnicas e histórico. Os projetos continuam a ser exportados individualmente em `.pixelproj`.

## Requisitos

Os requisitos funcionais e técnicos estão documentados em [requisitos.txt](requisitos.txt).

## Executar localmente

Requisitos: Node.js 20 ou superior e npm. A instalação inicial também instala Playwright, usado nos testes de browser.

~~~powershell
npm install
npx playwright install chromium
npm start
~~~

Abrir http://localhost:4173

## Testes

Testes unitários e de integração:

~~~powershell
npm test
~~~

Testes end-to-end com Chromium (o Playwright inicia automaticamente o servidor local):

~~~powershell
npm run test:e2e
~~~

Abrir uma janela Chromium visível durante os testes:

~~~powershell
npm run test:e2e:headed
~~~

Executar tudo:

~~~powershell
npm run test:all
~~~

Abrir o relatório HTML da última execução:

~~~powershell
npm run test:e2e:report
~~~

Os testes de browser usam a interface real: criam um projeto, desenham no Canvas, trocam ferramentas, transformam a matriz, alteram as configurações e testam exportação/importação. As capturas são guardadas em `artifacts/screenshots/`. O Playwright guarda também relatório, trace e vídeo quando um teste falha, em `artifacts/`.

Na GitHub Actions, o workflow executa os testes unitários e de browser e publica o conjunto de evidências como artefacto descarregável, mesmo quando algum teste falha.

## Desenvolvimento orientado a testes

A estratégia está em [docs/TESTING_STRATEGY.md](docs/TESTING_STRATEGY.md). Um bug deve ser reproduzido por um teste antes de se alterar a implementação (RED → GREEN), e o teste de regressão permanece na suite.

## Documentação

- [Visão do produto](docs/PRODUCT_VISION.md)
- [Requisitos do MVP](docs/MVP_REQUIREMENTS.md)
- [Desenho técnico](docs/TECHNICAL_DESIGN.md)
- [Teoria das cores e regras derivadas](docs/COLOR_THEORY_AND_RULES.md)
- [Motor de reconhecimento avançado](docs/ADVANCED_RULES_AND_ENGINE.md)
- [Motor modular de transformação e fusão](docs/MODULAR_TRANSFORMATION_ENGINE.md)
- [Estratégia de testes](docs/TESTING_STRATEGY.md)
- [Pesquisa de paletas](docs/COLOR_PALETTE_RESEARCH.md)
- [Decisões e questões](docs/DECISIONS_AND_QUESTIONS.md)
- [Histórico de alterações](CHANGELOG.md)

## Organização do código

- `src/core/`: matriz da imagem original, transformações e formato do projeto.
- `src/engine/`: paletas, técnicas, propostas, resolvedor e conversor.
- `src/ui/`: matemática de coordenadas e navegação do Canvas.
- `tests/unit/`: testes de unidades e propriedades.
- `tests/integration/`: testes do pipeline, persistência e servidor local.
- `tests/e2e/`: cenários reais de browser e interação.
- `scripts/`: ferramentas de desenvolvimento local.
- `artifacts/screenshots/`: capturas da execução dos testes (geradas localmente).

## Tecnologias

A aplicação usa JavaScript moderno, HTML Canvas e APIs nativas do navegador. Os testes de lógica usam o test runner integrado no Node.js; os testes end-to-end usam Playwright/Chromium. A investigação de algoritmos mais avançados pode usar Python, NumPy, SciPy, scikit-image e OpenCV; não é necessário trazer essas bibliotecas para o navegador.

## Ainda não implementado

Várias telas de interpretação visíveis em simultâneo, técnicas Hough/Radon, esqueletização, GLCM/LBP, autocorrelação/Fourier, editor avançado de regras, modo de camadas, otimização global, undo/redo e armazenamento automático.
