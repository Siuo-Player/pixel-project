# Visão do produto

## 1. Ideia

Criar uma aplicação web de pixel art em que o utilizador desenha uma imagem-fonte limitada a preto e branco e observa uma ou mais interpretações coloridas geradas automaticamente.

A aplicação não deve ser apenas um filtro de cor. As regras devem conseguir interpretar a estrutura da imagem — pixels, vizinhanças, contornos, regiões e padrões — e usar essa informação para produzir resultados visuais interessantes.

## 2. Motivação

A ideia parte da transição dos gráficos monocromáticos para os gráficos a cores, incluindo a forma como os videojogos criaram estilos visuais expressivos com paletas reduzidas.

Pergunta central:

> Como podemos transformar uma imagem desenhada com apenas duas cores numa interpretação visual muito mais rica, sem perder a estrutura e a intenção do desenho?

O projeto será simultaneamente:
- um editor simples de pixel art;
- um laboratório de algoritmos de conversão;
- um espaço para experimentar paletas de cores;
- uma forma de comparar várias interpretações do mesmo desenho.

## 3. Imagem-fonte e semântica

A imagem-fonte tem três estados por célula:

| Estado | Significado |
|---|---|
| Transparente | Não existe pixel desenhado. |
| Preto | Pixel desenhado com a cor preta. |
| Branco | Pixel desenhado com a cor branca. |

A transparência é distinta do branco. A conversão pode reinterpretar pixels pretos e brancos, mas nunca deve colorir células transparentes.

O significado de preto e branco depende da regra. A interpretação principal a explorar é que preto e branco podem representar estados diferentes de preenchimento/ausência ou regiões com papéis diferentes. Outras regras poderão tratá-los como cores independentes. Esta flexibilidade pertence à regra, não fica rigidamente codificada na interface.

## 4. Experiência principal

### Antes de entrar no editor

O utilizador:
- escolhe largura e altura da grelha;
- escolhe a quantidade de cores pretendida;
- seleciona uma paleta predefinida ou cria uma;
- escolhe uma regra ou preset de conversão;
- cria o projeto.

### Dentro do editor

A área de trabalho começa com:
- uma tela-fonte editável;
- uma tela de interpretação convertida no primeiro MVP;
- ferramentas preto, branco, apagar, linha, retângulo, elipse, preenchimento e conta-gotas;
- histórico de desfazer/refazer independente por documento;
- controlos de zoom e deslocação sincronizados;
- operações de espelhamento horizontal/vertical e rotação de 90°, 180° e 270° que alteram os pixels da arte;
- definições para alterar técnicas e paletas, incluindo 4, 8, 12, 16 ou 32 cores;
- vários documentos independentes em separadores, com ações para criar, alternar e fechar telas.

A arquitetura representa as interpretações como uma coleção de configurações independentes. O MVP apresenta uma interpretação. A primeira expansão visual terá como limite provisório três painéis no total: a imagem-fonte e até duas interpretações. O modelo de dados não deve impor esse limite e deverá poder suportar mais painéis no futuro.

## 5. Conversão por pixels e por áreas

Uma regra pode atuar sobre:
- um pixel individual;
- uma vizinhança;
- um padrão retangular ou outra área de vários pixels;
- áreas de diferentes dimensões.

Uma regra que reconhece uma área pode gerar um padrão de cores diferentes dentro dessa área (comportamento preferido) ou preenchê-la com uma única cor. Assim, reconhecer uma área não obriga a pintar todos os pixels da mesma maneira.

Quando várias regras se sobrepõem, o comportamento padrão será **prioridade absoluta da regra que reconhece a maior área**: a área fica ocupada/reservada por essa regra e regras menores não a podem substituir. Regras do mesmo tamanho serão desempatas por prioridade explícita e, depois, por uma ordem estável.

Fica como experiência futura um modo em camadas: uma regra grande pode definir uma base e declarar explicitamente zonas onde regras menores podem acrescentar detalhes. Isto não é uma exceção implícita à prioridade; é uma permissão configurada pela própria regra maior.

## 6. Paletas

O utilizador escolhe 4, 8, 12, 16 ou 32 cores e pode:
- selecionar paletas fornecidas pela aplicação;
- criar uma paleta escolhendo as cores individualmente;
- alterar uma paleta no projeto atual.

As paletas predefinidas devem ter identidades visuais intencionais e considerar luminosidade, tonalidade, saturação, contraste figura/fundo, diferenças percetíveis entre cores e acessibilidade. Não devem ser geradas apenas distribuindo cores igualmente pela roda cromática.

As regras práticas estão em [COLOR_THEORY_AND_RULES.md](COLOR_THEORY_AND_RULES.md), e a pesquisa de fontes em [COLOR_PALETTE_RESEARCH.md](COLOR_PALETTE_RESEARCH.md).

## 7. Várias interpretações

Uma imagem-fonte poderá alimentar várias telas convertidas. Cada saída terá:
- identificador e nome;
- a sua própria regra e parâmetros;
- a sua própria paleta;
- o seu próprio resultado derivado.

Alterar uma saída não afeta as outras nem a imagem-fonte.

## 8. Disposição adaptável das telas

O editor deve aproveitar a área disponível e ajustar automaticamente o tamanho e a disposição das telas. Cada imagem mantém a sua proporção e é ajustada à área atribuída sem ser esticada nem cortada.

O modo automático usa divisões recursivas:
- com duas telas (fonte + uma saída), divide a área ao meio pelo eixo maior;
- com três telas, reserva uma metade para a fonte e subdivide a outra metade para as duas saídas;
- com quatro telas, subdivide as duas metades, formando uma composição equilibrada de quatro áreas.

O utilizador também poderá escolher manualmente uma disposição lado a lado ou em grelha. A disposição não altera os pixels da arte.

## 9. Transformações e navegação

Zoom e deslocação são operações de navegação e devem manter-se sincronizados entre as telas.

Espelhar horizontalmente, espelhar verticalmente e rodar a arte são operações sobre os dados: alteram a matriz da imagem-fonte. Depois da transformação, todas as interpretações são recalculadas a partir da fonte transformada. Rotações de 90° e 270° trocam a largura e a altura da grelha.

## 10. Princípios do produto

1. A imagem-fonte é a verdade original e nunca é modificada pelo conversor.
2. Transparência não é branco e nunca é convertida em cor.
3. A conversão é reproduzível quando a regra é determinística.
4. Trocar regra ou paleta não exige redesenhar.
5. Cada interpretação é independente.
6. O motor de conversão é separado da interface.
7. O projeto começa local-first, sem contas ou backend.
8. As telas adaptam-se ao espaço disponível sem distorcer a proporção da arte.

## 11. O que não é objetivo inicial

Contas de utilizador, sincronização na cloud, colaboração, galerias públicas, camadas, animação, importação de imagens e editor visual de regras arbitrárias ficam fora do primeiro protótipo.
