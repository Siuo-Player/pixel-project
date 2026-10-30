# Pixel Project

Um editor de pixel art com duas vistas sincronizadas: uma imagem-fonte limitada a preto e branco e uma interpretação colorida gerada automaticamente a partir dela.

A ideia central é explorar como uma imagem criada com uma paleta muito reduzida pode ganhar uma aparência mais rica através de regras locais, vizinhanças, auto-tiling e, experimentalmente, autómatos celulares.

## Como funciona a ideia

- **Imagem-fonte (esquerda):** o utilizador desenha apenas a preto, branco ou apaga, deixando o pixel transparente.
- **Interpretação (direita):** a aplicação converte a imagem-fonte em tempo real, usando uma regra e uma paleta de cores selecionadas.
- **Configuração:** antes de criar a arte, o utilizador escolhe as dimensões, a regra de conversão e a paleta inicial. Durante a edição pode abrir um separador para alterar essas definições, apenas no projeto atual.

A transparência é um estado distinto do preto e do branco. Por isso, a imagem-fonte tem três estados lógicos por pixel, embora só existam duas cores de desenho.

## Documentação

- [Visão do produto](docs/PRODUCT_VISION.md) — objetivo, motivação e experiência pretendida.
- [Requisitos do MVP](docs/MVP_REQUIREMENTS.md) — o que a primeira versão deve permitir fazer.
- [Desenho técnico](docs/TECHNICAL_DESIGN.md) — modelo de dados, interação e arquitetura de conversão proposta.
- [Decisões e questões em aberto](docs/DECISIONS_AND_QUESTIONS.md) — pressupostos atuais e assuntos a experimentar.

## Estado do projeto

**Fase atual: documentação e definição do primeiro protótipo.** Ainda não existe uma aplicação implementada. As decisões técnicas indicadas como propostas podem mudar depois dos primeiros testes.

## Terminologia importante

- **Pixel-fonte:** célula editável na imagem da esquerda.
- **Pixel convertido:** célula correspondente na imagem gerada da direita.
- **Paleta de entrada:** preto e branco; a transparência é um estado separado.
- **Paleta de saída:** conjunto de cores usado pela conversão. Por exemplo, 4 bits de índice permitem representar até 16 entradas de paleta e 8 bits até 256.
- **Regra de conversão:** algoritmo que interpreta o pixel e a sua vizinhança para escolher a cor de saída.

O termo “bits” refere-se aqui à profundidade do índice de cor, não à quantidade de cores: 4 bits correspondem a até 16 entradas, e 8 bits a até 256. A representação final da transparência será definida quando forem escolhidos os formatos de exportação.
