# Pixel Project

Um editor experimental de pixel art que converte uma imagem-fonte transparente/preto/branco em uma ou mais interpretações coloridas, através de técnicas configuráveis e paletas discretas.

## Ideia central

O resultado de cada pixel depende do contexto e das estruturas reconhecidas: vizinhanças, médias ponderadas, linhas, curvas, regiões, texturas e características estatísticas. Não existe uma correspondência fixa entre preto/branco e duas cores de saída.

- **Imagem-fonte:** pixels transparentes, pretos ou brancos.
- **Técnicas modulares:** módulos reutilizáveis que podem ser instanciados várias vezes com parâmetros diferentes.
- **Regras de transformação:** interpretam características e produzem distribuições de probabilidade sobre as cores da paleta.
- **Fusão:** um resolvedor combina propostas quando várias técnicas afetam o mesmo pixel.
- **Inversão complementar:** trocar preto/branco na fonte reflete o resultado através da correspondência definida na paleta.
- **Paleta discreta:** cada pixel final recebe uma das cores disponíveis; não são criadas cores intermédias por mistura RGB.
- **Saídas:** cada interpretação tem configuração própria.

## Documentação

- [Visão do produto](docs/PRODUCT_VISION.md)
- [Requisitos do MVP](docs/MVP_REQUIREMENTS.md)
- [Desenho técnico](docs/TECHNICAL_DESIGN.md)
- [Teoria das cores e regras derivadas](docs/COLOR_THEORY_AND_RULES.md)
- [Motor de reconhecimento avançado](docs/ADVANCED_RULES_AND_ENGINE.md)
- [Motor modular de transformação e fusão](docs/MODULAR_TRANSFORMATION_ENGINE.md)
- [Pesquisa de paletas](docs/COLOR_PALETTE_RESEARCH.md)
- [Decisões e questões](docs/DECISIONS_AND_QUESTIONS.md)
- [Histórico de alterações](CHANGELOG.md)

## Tecnologias

A investigação pode usar Python, NumPy, SciPy, scikit-image e OpenCV. A aplicação web pode usar TypeScript, Vite, Canvas e WebAssembly quando necessário. O motor permanece independente da interface.

## Estado atual

**Fase: documentação e desenho técnico.** Ainda não existe aplicação implementada.
