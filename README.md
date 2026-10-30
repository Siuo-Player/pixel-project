# Pixel Project

Um editor experimental de pixel art que converte uma imagem-fonte transparente/preto/branco em uma interpretação colorida, através de técnicas configuráveis e paletas discretas.

A ideia central é desenhar com duas cores de entrada e observar como diferentes regras estruturais e paletas reinterpretam o mesmo desenho. A cor de cada pixel depende do contexto, não de um mapeamento fixo entre preto/branco e duas cores.

## Estado do projeto

**Primeiro protótipo executável em desenvolvimento.** Já existe:
- ecrã de criação com dimensões e paletas de 4 ou 8 cores;
- paletas predefinidas e edição das cores;
- tela original e pré-visualização convertida;
- pincel preto, branco e borracha;
- desenho por arrastamento sem falhas;
- zoom e pan partilhados;
- espelhamento e rotação da matriz original;
- instâncias configuráveis de técnicas, incluindo instâncias repetidas;
- média contextual, deteção direcional de linhas e entropia local;
- combinação de propostas por média ponderada ou maior confiança individual;
- importação/exportação de ficheiros de projeto.

A primeira versão apresenta uma interpretação convertida. O modelo de projeto já guarda uma coleção de saídas para permitir várias interpretações no futuro.

## Executar localmente

Requisito: Node.js 20 ou superior. Não é necessário instalar dependências.

~~~bash
npm start
~~~

Abrir http://localhost:4173

Executar a bateria de testes:

~~~bash
npm test
~~~

## Testes e qualidade

A estratégia de desenvolvimento está em [docs/TESTING_STRATEGY.md](docs/TESTING_STRATEGY.md). O projeto usa o test runner integrado no Node.js e GitHub Actions para executar a suite em cada push e pull request.

Uma regressão deve ser transformada primeiro num teste que reproduza o comportamento errado; só depois se corrige a implementação. O teste permanece na suite para impedir que o problema volte.

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

- src/core/: matriz da imagem original, transformações e formato do projeto.
- src/engine/: paletas, técnicas, propostas, resolvedor e conversor.
- src/ui/: matemática de coordenadas e navegação do Canvas.
- tests/unit/: testes de unidades e propriedades.
- tests/integration/: testes do pipeline, persistência e servidor local.
- scripts/: ferramentas de desenvolvimento local.

## Tecnologias

A aplicação inicial usa JavaScript moderno, HTML Canvas e APIs nativas do navegador. Os testes usam Node.js sem dependências externas. A investigação de algoritmos mais avançados pode usar Python, NumPy, SciPy, scikit-image e OpenCV; não é necessário trazer essas bibliotecas para o navegador.

## Ainda não implementado

Várias telas de interpretação visíveis em simultâneo, técnicas Hough/Radon, esqueletização, GLCM/LBP, autocorrelação/Fourier, editor avançado de regras, modo de camadas, otimização global, undo/redo e armazenamento automático.
