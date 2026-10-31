# Pesquisa de paletas para pixel art

## 1. Objetivo da pesquisa

Esta pesquisa orienta a organização do catálogo de paletas do Pixel Project. O objetivo não é reproduzir automaticamente bibliotecas existentes, mas perceber:
- que tamanhos de paleta são comuns em pixel art;
- como os catálogos permitem encontrar paletas;
- como uma cor indexada se relaciona com a posição na paleta;
- como avaliar contraste, sequência tonal e identidade cromática.

As decisões de implementação e a lista exata dos presets estão em [PALETTE_CATALOG.md](PALETTE_CATALOG.md). Os critérios de avaliação de cor estão em [COLOR_THEORY_AND_RULES.md](COLOR_THEORY_AND_RULES.md).

## 2. Referências a catálogos e aplicações

### Lospec Palette List

A [Lospec Palette List](https://lospec.com/palette-list/) é uma biblioteca dedicada a paletas de pixel art. A interface permite filtrar pelo número de cores, incluindo mínimo, máximo e quantidade exata. A listagem consultada inclui exemplos com 16 e 32 cores, entre outros tamanhos.

A [API documentada da Lospec](https://api.lospec.com/docs/) expõe filtros `numberOfColors`, `minColors` e `maxColors`, o que confirma que a dimensão da paleta é um atributo útil para navegação e pesquisa.

### Aseprite: cor indexada

A documentação de [Color Mode](https://www.aseprite.com/docs/color-mode/) descreve o modo Indexed: cada pixel referencia um índice da paleta, em vez de guardar uma cor RGB independente. A documentação indica que a paleta pode conter até 256 cores.

A [Color Bar](https://www.aseprite.org/docs/color-bar/) descreve a utilização da barra de cores para selecionar entradas da paleta. Este modelo é compatível com a representação discreta usada pelo Pixel Project.

## 3. Consequências para o Pixel Project

A investigação levou a três decisões:
1. O tamanho da paleta deve ser escolhido explicitamente e estar disponível também dentro do editor.
2. O motor deve trabalhar com N cores, sem assumir que N é 4.
3. O catálogo deve incluir dimensões curtas e mais extensas, para comparar o equilíbrio entre simplicidade e variedade.

A aplicação disponibiliza agora 34 presets: 10 de 4 cores, 8 de 8, 6 de 12, 6 de 16 e 4 de 32 cores.

Os presets atuais são originais do Pixel Project; as fontes acima foram usadas para orientar a organização e o suporte a tamanhos, não como atribuição de autoria das cores.

## 4. Avaliação de qualidade

Um preset deve ser observado:
- como conjunto, para perceber se tem identidade visual coerente;
- em escala de cinzentos, para avaliar a hierarquia de luminosidade;
- em blocos pequenos, para perceber se as cores continuam distinguíveis;
- na imagem convertida, porque o motor pode colocar cores adjacentes que não seriam comparadas apenas pela ordem da amostra.

Não existe uma métrica única que garanta beleza. Diferença percetiva, acessibilidade, contraste figura/fundo e coerência cromática são critérios complementares. Consultar [COLOR_THEORY_AND_RULES.md](COLOR_THEORY_AND_RULES.md) para os critérios detalhados.

## 5. Referências complementares

- [ColorBrewer — Types of color schemes](https://colorbrewer2.org/learnmore/schemes.html): sequenciais, divergentes e qualitativas.
- [Paul Tol — Colour schemes](https://sronpersonalpages.nl/~pault/): esquemas concebidos para maior distinção cromática.
- [CIEDE2000](https://www.cie.co.at/publications/colorimetry-part-6-ciede2000-colour-difference-formula-1): diferença cromática percetiva.
- [W3C CSS Color 4 — OKLab](https://www.w3.org/TR/css-color-4/#ok-lab): espaços de cor percetivamente mais uniformes.
