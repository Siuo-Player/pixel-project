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

A transparência é distinta do branco. A conversão pode reinterpretar pixels pretos e brancos, mas não deve colorir células transparentes por defeito.

O significado de preto e branco depende da regra. A interpretação principal a explorar é que preto e branco podem representar estados diferentes de preenchimento/ausência ou regiões com papéis diferentes. Outras regras poderão tratá-los como cores independentes. Esta flexibilidade deve pertencer à regra, não estar rigidamente codificada na interface.

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
- uma tela de interpretação convertida;
- ferramentas preto, branco e apagar;
- controlos de zoom e deslocação sincronizados;
- um separador para alterar as regras e paletas do projeto.

O primeiro protótipo terá uma tela de interpretação. A arquitetura deverá, desde o início, representar as saídas como uma coleção de configurações independentes, permitindo adicionar outras interpretações mais tarde (com um limite inicial proposto de três quando essa funcionalidade for ativada).

## 5. Conversão por pixels e por áreas

Uma regra pode atuar sobre:
- um pixel individual;
- uma vizinhança;
- um padrão retangular ou outra área de vários pixels;
- áreas de diferentes dimensões.

A intenção é permitir que a mesma imagem seja interpretada em várias escalas. Por exemplo, uma regra pode reconhecer uma área 2×2 e outra reconhecer uma área 5×3.

Quando várias regras se sobrepõem, o motor precisa de uma política explícita de prioridade. A preferência inicial é dar oportunidade às regras que reconhecem áreas maiores, mas o resultado deve também poder considerar a prioridade configurada e a especificidade do padrão. A política final será validada com exemplos.

## 6. Paletas

O utilizador escolhe a quantidade de cores e pode:
- selecionar paletas fornecidas pela aplicação;
- criar uma paleta escolhendo as cores individualmente;
- alterar uma paleta no projeto atual.

As paletas predefinidas devem ter identidades visuais intencionais e não ser geradas apenas distribuindo cores igualmente pela roda cromática. Devem considerar luminosidade, tonalidade, saturação, contraste figura/fundo e diferenças perceptíveis entre cores.

As paletas poderão representar diferentes tipos de relação:
- harmonias de tonalidades próximas;
- paletas tonais com vários níveis de luminosidade;
- paletas com uma cor de destaque;
- paletas de contraste mais forte;
- paletas de categorias visualmente distintas;
- paletas retro inspiradas em limitações históricas de hardware.

A pesquisa inicial e os critérios propostos estão em [COLOR_PALETTE_RESEARCH.md](COLOR_PALETTE_RESEARCH.md).

## 7. Várias interpretações

Uma imagem-fonte poderá vir a alimentar várias telas convertidas. Cada saída terá:
- a sua própria regra e parâmetros;
- a sua própria paleta;
- o seu próprio resultado derivado.

Alterar uma saída não deve afetar as outras nem a imagem-fonte. A primeira versão terá apenas uma saída visível, mas a estrutura de dados não deve assumir que existe sempre exatamente uma.

## 8. Transformações e navegação

As telas devem manter uma relação espacial coerente. Zoom e deslocação devem ser sincronizados entre a imagem-fonte e as interpretações. Virar/inverter a vista deve igualmente manter o alinhamento.

É necessário distinguir transformação da vista (navegação e apresentação) de transformação real dos pixels (alterar a arte). O MVP deve começar por sincronizar a vista; operações destrutivas sobre os dados poderão ser decididas separadamente.

## 9. Princípios do produto

1. A imagem-fonte é a verdade original e nunca é modificada pelo conversor.
2. Transparência não é branco e não é convertida em cor.
3. A conversão é reproduzível quando a regra é determinística.
4. Trocar regra ou paleta não exige redesenhar.
5. Cada interpretação é independente.
6. O motor de conversão é separado da interface.
7. O projeto começa local-first, sem contas ou backend.

## 10. O que não é objetivo inicial

Contas de utilizador, sincronização na cloud, colaboração, galerias públicas, camadas, animação, importação de imagens, editor visual de regras completas e edição manual do resultado ficam fora do primeiro protótipo.
