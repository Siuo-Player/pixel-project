# Visão do produto

## 1. Ideia

Criar uma aplicação web de pixel art inspirada em editores como o Pixilart, mas com uma diferença fundamental: o utilizador desenha numa tela limitada a preto e branco e vê, em paralelo, uma segunda tela que interpreta automaticamente esse desenho com uma paleta de cores mais rica.

A aplicação não pretende simplesmente colorir aleatoriamente uma imagem. O objetivo é experimentar regras que usem a estrutura da imagem — os pixels próximos, os contornos, os padrões e a relação entre regiões — para produzir uma interpretação visual coerente.

## 2. Motivação

A ideia parte da transição histórica dos gráficos monocromáticos para gráficos com mais cores, incluindo a forma como os videojogos tiraram partido de paletas limitadas e de padrões visuais para criar mundos reconhecíveis.

O projeto deve permitir investigar esta pergunta:

> Como podemos transformar uma imagem originalmente desenhada com apenas duas cores em algo visualmente mais rico, sem perder a estrutura e a intenção do desenho?

A aplicação será simultaneamente:
- um editor simples de pixel art;
- uma demonstração visual de algoritmos de conversão;
- um espaço de experimentação com paletas e regras configuráveis.

## 3. Experiência principal

A experiência começa antes de abrir o editor. O utilizador define o tamanho da grelha e escolhe uma configuração inicial de conversão. Depois entra num espaço de trabalho com duas telas lado a lado.

### Tela esquerda — imagem-fonte

- Começa completamente transparente.
- Só permite desenhar a preto ou a branco.
- Tem uma ferramenta de apagar, que repõe a transparência.
- É a única tela onde se desenha diretamente.
- A grelha representa o mundo de pixels real, independentemente do tamanho visual com que é apresentada no ecrã.

### Tela direita — interpretação convertida

- Começa vazia e transparente.
- É calculada automaticamente a partir da tela esquerda.
- Atualiza-se enquanto o utilizador desenha.
- Não é editável diretamente no MVP.
- Usa uma paleta e uma regra de conversão selecionadas pelo utilizador.

As duas telas devem representar as mesmas dimensões lógicas, para que seja fácil relacionar cada pixel-fonte com o resultado correspondente.

## 4. Configuração antes e durante a edição

### Antes de entrar no editor

O ecrã de criação de projeto deve permitir:
- escolher a largura e a altura da grelha;
- selecionar uma regra ou preset de conversão;
- selecionar uma paleta de saída;
- consultar uma breve descrição do efeito esperado;
- criar o projeto com essas definições.

### Dentro do editor

Deve existir uma área ou separador de configuração da conversão. O utilizador poderá experimentar outras regras, paletas e parâmetros sem ter de apagar ou recriar o desenho.

Estas alterações são locais ao projeto atual. Não devem alterar automaticamente as configurações de outros projetos nem criar uma configuração global partilhada.

## 5. Princípios do produto

1. **A imagem-fonte é a verdade original.** A conversão nunca deve destruir nem modificar o desenho de entrada.
2. **A conversão deve ser reproduzível.** Com a mesma imagem, paleta e parâmetros, uma regra determinística deve produzir o mesmo resultado.
3. **A relação entre entrada e saída deve ser visível.** As duas telas devem manter dimensões lógicas e alinhamento equivalentes.
4. **Experimentar deve ser fácil.** Trocar de regra ou paleta deve atualizar a pré-visualização sem exigir um novo desenho.
5. **Começar pequeno.** O primeiro protótipo deve validar o ciclo desenhar → converter → visualizar antes de adicionar funcionalidades de editor avançado.

## 6. Público e utilização

O projeto destina-se a pessoas interessadas em pixel art, jogos, gráficos retro e experimentação visual. Também serve como estudo técnico de representação de imagens, vizinhanças, paletas e algoritmos locais.

## 7. O que não é o objetivo inicial

A primeira versão não pretende competir com editores completos de pixel art. Não precisa inicialmente de camadas, animação, colaboração online, contas, publicação de galerias ou edição direta do resultado convertido.

Essas possibilidades podem ser consideradas depois de o mecanismo central demonstrar resultados interessantes.
