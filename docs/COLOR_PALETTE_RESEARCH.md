# Pesquisa inicial: paletas e teoria das cores

**Estado:** pesquisa exploratória para orientar os primeiros presets. Não existe uma fórmula universal que garanta que uma paleta seja bonita em qualquer imagem.

## 1. O problema específico deste projeto

Uma paleta de 4 ou 8 cores tem de fazer mais do que conter cores individualmente agradáveis. As cores irão ser atribuídas por regras a pixels, contornos, interiores e regiões. A forma como aparecem juntas e a frequência/área de cada uma alteram bastante o resultado.

Por isso, a paleta deve ser avaliada em pelo menos três contextos:
1. as cores isoladamente;
2. os pares de cores que podem ficar adjacentes;
3. a composição completa, depois de a regra distribuir as cores pela imagem.

Uma combinação que parece agradável como amostras lado a lado pode não funcionar quando duas cores são alternadas em pequenos pixels ou usadas em proporções muito diferentes.

## 2. O que a investigação sugere

### 2.1 Não existe uma regra universal de harmonia

Schloss e Palmer (2011) distinguem preferência por um par de cores, harmonia do par e preferência pela cor da figura contra o fundo. No seu estudo, preferência e harmonia aumentaram em média com a semelhança de tonalidade, enquanto a preferência pela figura também beneficiou de contraste de tonalidade com o fundo. O contraste de luminosidade também influenciou a preferência.

Referência:
- Schloss, K. B. & Palmer, S. E. (2011). *Aesthetic response to color combinations: preference, harmony, and similarity*. Attention, Perception, & Psychophysics, 73, 551–571.
- https://doi.org/10.3758/s13414-010-0027-0
- https://pmc.ncbi.nlm.nih.gov/articles/PMC3037488/

Um estudo mais recente, publicado em 2026, avaliou preferências por combinações de 13 tonalidades numa experiência online com 346 respostas. Os autores encontraram preferências dependentes da tonalidade e padrões médios de combinação que não se reduzem às regras clássicas. Isto reforça a ideia de que não devemos impor uma regra rígida como “cores complementares são sempre boas” ou “cores próximas são sempre melhores”.

Referência:
- Forni, O., Darmon, A. & Benzaquen, M. (2026). *Harmonious color pairings: Insights from human preference and natural hue statistics*. iScience, 29(6), 116038.
- https://doi.org/10.1016/j.isci.2026.116038
- https://pmc.ncbi.nlm.nih.gov/articles/PMC13264017/

**Implicação:** criar famílias diferentes de paletas e avaliá-las visualmente; não tentar encontrar uma única regra matemática de harmonia.

### 2.2 A luminosidade deve ter uma função clara

A distinção de luminosidade ajuda a preservar hierarquia e leitura, mesmo quando as cores têm tonalidades próximas. Para este projeto, isto é especialmente importante porque regras locais podem colocar cores lado a lado em áreas pequenas.

Uma paleta deve, portanto, ser verificada:
- a cores;
- em escala de cinzentos;
- com a imagem reduzida ao tamanho real de pixel art.

Não se deve confundir este teste artístico com os rácios de contraste WCAG para texto de interfaces; esses rácios têm outro objetivo.

### 2.3 Tipos de paleta dependem do papel das cores

ColorBrewer descreve três famílias úteis:
- **Sequencial:** diferenças ordenadas, normalmente com progressão de luminosidade.
- **Divergente:** dois extremos distintos e uma zona central.
- **Qualitativa:** categorias sem ordem, distinguidas sobretudo pela tonalidade.

Embora ColorBrewer tenha sido criado para visualização de dados e mapas, esta taxonomia pode inspirar os papéis que uma regra atribui às cores.

Referência:
- Cynthia Brewer, ColorBrewer — *Color scheme types*.
- https://colorbrewer2.org/learnmore/schemes.html

### 2.4 Acessibilidade e diferenciação

As paletas de Paul Tol foram desenvolvidas para distinguir cores, incluindo para pessoas com algumas formas de deficiência de visão cromática, e para funcionar em ecrãs e impressão. São uma fonte útil de paletas iniciais, embora tenham sido pensadas sobretudo para gráficos científicos e não especificamente para pixel art.

Referência:
- Paul Tol, *Colour Schemes and Templates*.
- https://sronpersonalpages.nl/~pault/

O projeto deve evitar depender exclusivamente de pares vermelho/verde com luminosidade semelhante para comunicar diferenças essenciais. Quando a distinção entre regiões é importante, também deve existir diferença de luminosidade ou outra pista visual.

## 3. Representação e comparação matemática das cores

### 3.1 Porque não comparar apenas RGB

RGB descreve a mistura de luz nos canais do ecrã; distâncias iguais entre valores RGB não correspondem necessariamente a diferenças visuais iguais para as pessoas.

A CIE define CIELAB e a fórmula CIEDE2000 para quantificar diferenças entre cores de forma mais próxima da perceção. Estas ferramentas podem ajudar a detetar cores demasiado parecidas, mas não conseguem decidir sozinhas se uma paleta é bonita.

Referência:
- CIE, *Colorimetry — Part 6: CIEDE2000 Colour-Difference Formula*.
- https://www.cie.co.at/publications/colorimetry-part-6-ciede2000-colour-difference-formula-0

### 3.2 OKLab / OKLCH como espaço de trabalho possível

A especificação CSS Color 4 descreve OKLab e OKLCH como espaços concebidos para maior uniformidade percetiva de luminosidade, tonalidade e croma em comparação com CIE Lab/LCH em vários aspetos. OKLCH é particularmente útil para ajustar uma cor mantendo aproximadamente a tonalidade enquanto se altera luminosidade ou croma.

Referência:
- W3C, *CSS Color Module Level 4*, secção OKLab e OKLCH.
- https://www.w3.org/TR/css-color-4/#ok-lab

**Proposta técnica:** usar OKLCH para gerar/ajustar cores e uma medida de diferença percetiva para identificar entradas muito semelhantes. A escolha final deve ser testada com cores dentro do gamut sRGB.

## 4. Famílias iniciais de paletas a experimentar

Estas são direções visuais para protótipos, não ainda uma lista final de presets.

| Família | Ideia | Uso potencial |
|---|---|---|
| Tonal / monocromática | Uma família de tonalidade com vários níveis de luminosidade e croma. | Sombra, base, luz e detalhe com leitura coesa. |
| Análoga | Tonalidades próximas, com luminosidade bem distribuída. | Ambientes naturais, água, vegetação, céu. |
| Análoga + acento | Base de tonalidades próximas e uma cor de destaque usada com pouca frequência. | Destacar contornos, objetos ou pequenos detalhes. |
| Dividida complementar | Uma família principal e uma zona de contraste escolhida com cuidado, sem repartir tudo em opostos saturados. | Separar figura e fundo ou regiões distintas. |
| Qualitativa | Várias cores facilmente distinguíveis, sem progressão tonal obrigatória. | Regras que classificam regiões em categorias distintas. |
| Retro / restrita | Paleta curta com identidade estética deliberada. | Estilos de videojogo e limitações históricas de hardware. |

## 5. Critérios propostos para aceitar um preset

Cada paleta candidata deve passar por uma pequena bateria de testes:

1. **Identidade:** as cores individuais contribuem para um estilo coerente?
2. **Distinção:** cores usadas em zonas adjacentes são suficientemente distintas?
3. **Luminosidade:** os elementos importantes continuam legíveis em escala de cinzentos?
4. **Proporção:** a paleta funciona quando uma cor ocupa 70% da imagem e outra apenas 5%?
5. **Pequena escala:** continua agradável quando vista como pixel art no tamanho final?
6. **Visão cromática:** as distinções importantes sobrevivem a simulações de deficiência de visão cromática?
7. **Quantidade:** reduzir de 8 para 4 cores mantém uma estrutura visual útil?

## 6. Proposta para o primeiro conjunto de presets

Começar com pelo menos quatro famílias, cada uma em versões de 4 e 8 cores quando fizer sentido:
- tonal fria;
- análoga quente;
- análoga com acento complementar moderado;
- retro de alto contraste.

Além disso, disponibilizar uma paleta qualitativa acessível inspirada em trabalho publicado (por exemplo, Paul Tol), adaptada e testada para o uso do conversor.

A versão de 4 cores não deve ser apenas a primeira metade de uma versão de 8. Deve ser desenhada como uma composição completa: cada cor precisa de um papel útil e não pode depender de entradas que foram removidas.

## 7. Limitações da pesquisa

- Estudos de preferência de pares não garantem resultados para composições com 4 ou 8 cores.
- Estudos feitos em HSL ou em tarefas online podem não representar todos os contextos culturais, ecrãs e tipos de imagem.
- Paletas para mapas e gráficos não são automaticamente boas paletas para pixel art.
- Métricas como CIEDE2000 e OKLab medem diferenças percetivas, não gosto estético.
- A avaliação final terá de combinar fundamentos teóricos com testes em imagens reais do próprio projeto.

## 8. Processo de experimentação recomendado

1. Criar uma pequena galeria de desenhos de teste (pixel isolado, linha, contorno, quadrado, círculo, silhueta e padrão de detalhes).
2. Aplicar todas as paletas candidatas aos mesmos desenhos.
3. Comparar o resultado com regras iguais, para isolar o efeito da paleta.
4. Comparar regras com paleta igual, para isolar o efeito do algoritmo.
5. Guardar capturas e observações no repositório.
6. Só promover uma paleta a preset padrão depois de passar pelos critérios da secção 5.
