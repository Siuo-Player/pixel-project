# Pixel Project

Um editor experimental de pixel art com uma imagem-fonte a preto e branco e uma ou mais interpretações coloridas geradas automaticamente.

A ideia central é permitir desenhar com uma paleta de entrada mínima e observar como diferentes regras e paletas conseguem reinterpretar a mesma imagem, preservando a sua estrutura.

## Conceito

- **Imagem-fonte:** o utilizador desenha a preto, branco ou apaga (transparência).
- **Conversão:** regras analisam pixels, vizinhanças e padrões/áreas de vários tamanhos.
- **Saídas:** cada interpretação tem a sua própria regra e paleta. A arquitetura permite várias saídas independentes.
- **Paletas:** o utilizador escolhe a quantidade de cores (por exemplo, 4 ou 8), seleciona paletas predefinidas ou cria uma paleta própria.
- **Configuração:** regras e paletas podem ser escolhidas antes de entrar no editor e alteradas dentro do projeto atual.
- **Visualização:** as telas adaptam-se ao espaço disponível, com opções de disposição automática, lado a lado ou em grelha.

A transparência é um estado distinto e permanece transparente na conversão. Os pixels de entrada pretos e brancos podem ser reinterpretados para outras cores conforme a regra escolhida.

## Documentação

- [Visão do produto](docs/PRODUCT_VISION.md)
- [Requisitos do MVP](docs/MVP_REQUIREMENTS.md)
- [Desenho técnico](docs/TECHNICAL_DESIGN.md)
- [Pesquisa inicial sobre paletas](docs/COLOR_PALETTE_RESEARCH.md)
- [Teoria das cores e regras derivadas para o projeto](docs/COLOR_THEORY_AND_RULES.md)
- [Decisões e questões em aberto](docs/DECISIONS_AND_QUESTIONS.md)
- [Histórico de alterações](CHANGELOG.md)

## Estado atual

**Fase: documentação e definição do protótipo.** Ainda não existe aplicação implementada. As decisões identificadas como propostas ou experimentais serão validadas através de testes.

## Terminologia

- **Pixel-fonte:** célula editável na imagem original.
- **Pixel convertido:** célula pertencente a uma interpretação gerada.
- **Transparência:** ausência de pixel; não é uma terceira cor de desenho.
- **Paleta:** lista de cores disponíveis para uma conversão. A quantidade de cores é uma escolha do utilizador, não uma profundidade de bits.
- **Regra:** instrução que reconhece um pixel, uma vizinhança ou uma área e determina a cor ou o padrão de saída.
- **Saída / interpretação:** uma tela convertida, com configuração própria.
