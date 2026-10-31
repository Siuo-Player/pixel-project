# Teoria das cores e regras práticas para o Pixel Project

**Objetivo:** transformar investigação sobre cor em critérios concretos para criar, selecionar e avaliar paletas de 4, 8, 12, 16 ou 32 cores no conversor.

Este documento não tenta definir uma fórmula universal de beleza. A investigação mostra tendências e condições úteis, mas o resultado final depende também do desenho, da distribuição espacial das cores, do estilo pretendido e da preferência de quem cria.

## 1. O problema de cor específico do projeto

Neste editor, as cores não são aplicadas livremente por uma pessoa a cada pixel. Um algoritmo atribui cores a pixels ou regiões segundo padrões e regras. Por isso, uma paleta deve ser avaliada de duas maneiras:

1. **Como conjunto:** as cores formam uma identidade visual coerente?
2. **Como sistema de vizinhanças:** as cores que as regras podem colocar lado a lado continuam a funcionar quando aparecem em pequenos blocos, contornos e áreas com proporções diferentes?

Uma paleta que parece agradável como oito amostras alinhadas pode falhar quando duas cores são alternadas pixel a pixel. Inversamente, cores muito distintas podem funcionar bem quando uma delas é usada apenas como pequeno acento.

## 2. O que a investigação permite concluir

### 2.1 Harmonia, preferência e contraste não são a mesma coisa

Schloss e Palmer (2011) mostram que é importante separar três julgamentos: preferência pelo par como um todo, harmonia do par e preferência da cor da figura contra o fundo. No seu estudo, pares com tonalidades mais semelhantes foram, em média, mais preferidos e considerados mais harmoniosos; porém, a preferência pela cor usada como figura aumentou com o contraste de tonalidade em relação ao fundo. Também encontraram influência do contraste de luminosidade.

Isto não significa que todas as paletas devam usar tonalidades próximas. Significa que:
- coerência do conjunto;
- destaque de um objeto contra o fundo;
- diferença entre regiões

são objetivos visuais distintos e podem exigir relações de cor diferentes.

Fonte: [Schloss & Palmer (2011), *Aesthetic response to color combinations: preference, harmony, and similarity*](https://doi.org/10.3758/s13414-010-0027-0) · [texto integral](https://pmc.ncbi.nlm.nih.gov/articles/PMC3037488/).

### 2.2 Não existe uma regra universal baseada na roda das cores

Um estudo publicado em 2026 analisou preferências por pares de 13 tonalidades através de uma tarefa online com 346 respostas. Os resultados variaram consoante a tonalidade e desafiaram regras clássicas demasiado simples; algumas separações de tonalidade próximas do lado oposto da roda foram preferidas em média, mas a preferência continuou dependente das cores concretas.

A conclusão prática não é “usar sempre complementares” nem “evitar complementares”. É testar combinações concretas e não transformar uma regra clássica numa lei.

Fonte: [Forni, Darmon & Benzaquen (2026), *Harmonious color pairings: Insights from human preference and natural hue statistics*](https://doi.org/10.1016/j.isci.2026.116038) · [texto integral](https://pmc.ncbi.nlm.nih.gov/articles/PMC13264017/).

### 2.3 A luminosidade ajuda a manter a leitura

A tonalidade distingue famílias de cor; a luminosidade ajuda a perceber o que está à frente, atrás, em sombra ou em destaque. Uma paleta pode ter cores de tonalidades diferentes e ainda assim ficar confusa se todas tiverem luminosidade semelhante e forem usadas em regiões adjacentes.

Por isso, as paletas devem ser verificadas:
- em cor;
- em escala de cinzentos;
- no tamanho final de visualização;
- em padrões com as cores efetivamente adjacentes.

A escala de cinzentos é um teste de hierarquia luminosa, não uma exigência de que todas as cores sejam distinguíveis apenas pela luminosidade.

### 2.4 Tipos de paleta devem corresponder ao significado das classes

ColorBrewer distingue três famílias úteis:
- **Sequencial:** representa uma ordem ou intensidade; a luminosidade progride normalmente de claro para escuro.
- **Divergente:** representa valores que se afastam de um ponto central; dá destaque ao centro e aos dois extremos.
- **Qualitativa:** representa categorias sem ordem; a tonalidade ajuda a distinguir classes.

A taxonomia foi criada para mapas e visualização de dados, não para pixel art. Vamos usá-la como inspiração para compreender o papel das cores, não como uma receita estética.

Fonte: [ColorBrewer — Types of color schemes](https://colorbrewer2.org/learnmore/schemes.html).

### 2.5 Acessibilidade cromática

Paul Tol publica esquemas pensados para que as cores sejam mais distinguíveis para pessoas com diferentes tipos de visão cromática e para funcionarem em ecrãs e impressão. O trabalho é especialmente útil como fonte de presets qualitativos e como exemplo de que uma paleta deve ser testada para além da visão cromática típica.

Alguns esquemas de Paul Tol têm sete cores qualitativas, outros têm menos ou mais. Não devemos assumir que uma paleta científica será automaticamente a melhor paleta artística, mas pode servir como referência de distinção e acessibilidade.

Fonte: [Paul Tol — Colour schemes and templates](https://sronpersonalpages.nl/~pault/).

## 3. Como representar e comparar cores

### 3.1 Porque não basta comparar RGB

RGB é útil para apresentar e armazenar cores em ecrãs, mas a distância geométrica entre valores RGB não corresponde de forma uniforme à diferença percebida por pessoas.

Não devemos, por exemplo, assumir que duas cores separadas por 20 unidades RGB são sempre tão diferentes como outras duas cores também separadas por 20 unidades.

### 3.2 CIELAB e CIEDE2000

CIELAB representa a cor através de luminosidade (L*) e dois eixos cromáticos (a* e b*). A fórmula CIEDE2000 acrescenta correções para que a diferença numérica se aproxime melhor de diferenças percebidas, incluindo efeitos relacionados com luminosidade, croma e tonalidade.

**Uso previsto no projeto:** detetar cores excessivamente parecidas numa paleta e comparar entradas candidatas. CIEDE2000 não mede beleza, harmonia nem qualidade artística; mede diferença cromática sob condições de referência.

Fonte: [CIE — ISO/CIE 11664-6:2022, CIEDE2000](https://www.cie.co.at/publications/colorimetry-part-6-ciede2000-colour-difference-formula-1).

### 3.3 OKLab e OKLCH

OKLab e a representação polar OKLCH são espaços de cor concebidos para uma organização mais uniforme do ponto de vista percetivo do que RGB. Em OKLCH, uma cor é descrita por:
- **L:** luminosidade;
- **C:** croma/intensidade cromática;
- **H:** tonalidade.

**Uso previsto no projeto:** gerar variações de uma cor base mantendo a tonalidade aproximadamente constante e ajustando luminosidade e croma; construir paletas tonais e análogas; e explorar ajustes controlados.

É necessário verificar se as cores geradas cabem no gamut sRGB do ecrã. Reduzir croma pode ser preferível a cortar canais RGB de forma arbitrária.

Fonte: [W3C — CSS Color Module Level 4, OKLab e OKLCH](https://www.w3.org/TR/css-color-4/#ok-lab).

## 4. Regras de design derivadas para as paletas

As regras desta secção são **heurísticas iniciais do projeto**, derivadas das fontes acima e da natureza do conversor. Não são leis científicas universais.

### Regra P-01 — Não escolher cores apenas pela distância na roda

Não gerar automaticamente uma paleta distribuindo tonalidades em intervalos iguais. Uma paleta pode combinar tonalidades próximas, um acento contrastante ou famílias diferentes, desde que a relação seja testada no contexto da imagem.

### Regra P-02 — Dar à luminosidade uma função

Cada paleta deve ter uma hierarquia de luminosidade intencional. Por exemplo, uma paleta de quatro cores pode incluir:
- uma cor escura para sombra/contorno;
- uma ou duas cores intermédias para base e regiões;
- uma cor clara para luz ou realce.

Esta é uma organização útil, não uma obrigação. Uma paleta qualitativa pode precisar de classes com luminosidades mais próximas e diferenças de tonalidade maiores.

### Regra P-03 — Usar acentos com intenção

Uma cor fortemente contrastante pode ser útil para destacar uma região, mas não deve ser espalhada indiscriminadamente por toda a imagem. O algoritmo deve poder atribuir cores de acento apenas a contornos, pequenos detalhes, pontos isolados ou padrões específicos.

### Regra P-04 — Avaliar pares que ficam realmente adjacentes

Não basta calcular a distância de todas as cores em abstracto. Devemos observar quais os pares que cada regra pode colocar lado a lado. Pares adjacentes frequentes merecem mais atenção do que combinações que nunca aparecem na mesma vizinhança.

### Regra P-05 — Considerar a proporção das áreas

Uma cor de acento pode funcionar bem quando cobre 3% da imagem e dominar demasiado quando cobre 50%. Testar paletas com áreas pequenas, médias e grandes, bem como distribuições desequilibradas.

### Regra P-06 — A paleta de quatro cores deve ser completa por si

A versão de quatro cores não deve ser simplesmente as quatro primeiras cores de uma versão de oito. Deve ter os papéis necessários para produzir um resultado coerente. A versão de oito pode acrescentar tonalidades intermédias, acentos ou categorias extra.

### Regra P-07 — Não depender só da tonalidade

Quando duas regiões têm significado importante e podem tocar-se, tentar assegurar também uma diferença de luminosidade, padrão ou forma. Isto melhora a leitura em escala de cinzentos e em diferentes condições de visão cromática.

### Regra P-08 — Preservar a transparência fora da paleta

Transparência é ausência de pixel. Nunca deve ser incluída como uma cor normal nem ser substituída por uma cor da paleta.

### Regra P-09 — Testar com simulação de visão cromática

Os presets devem ser inspecionados com simulações de deficiências de visão cromática. Não é obrigatório que cada par seja distinguível em todas as condições, mas informação essencial não deve depender exclusivamente de uma distinção vermelho/verde ou de tonalidades semelhantes.

### Regra P-10 — Separar avaliação artística de acessibilidade da interface

Os rácios de contraste WCAG foram concebidos principalmente para legibilidade de texto e conteúdo/interface. Não devem ser aplicados como uma lei estética a cada par de cores da pixel art. A interface do editor (botões, rótulos e controlos) deve cumprir os critérios aplicáveis de acessibilidade; as paletas da arte devem ser avaliadas segundo objetivos visuais próprios.

Fonte: [W3C WAI — Understanding Contrast Minimum](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum).

## 5. Famílias de paletas a oferecer

A primeira biblioteca de presets deve testar pelo menos estas famílias:

| Família | Estrutura | Situação de uso |
|---|---|---|
| Tonal/monocromática | Uma família de tonalidade com níveis de luminosidade e croma diferentes. | Volume, sombra, luz e materiais coerentes. |
| Análoga | Tonalidades próximas, com hierarquia luminosa. | Ambientes naturais e cenas coesas. |
| Análoga + acento | Base análoga e uma cor contrastante usada seletivamente. | Destacar pontos de interesse. |
| Contraste controlado | Famílias mais distintas, com luminosidade planeada. | Separar regiões ou materiais. |
| Qualitativa acessível | Cores distinguíveis, inspiradas em esquemas como os de Paul Tol. | Classificar categorias sem ordem tonal. |
| Retro | Conjunto pequeno escolhido para uma identidade estética específica. | Estilos inspirados em gráficos de videojogos antigos. |

Cada família deve ter uma versão de quatro cores e, quando apropriado, uma de oito cores.

## 6. Regras automáticas para gerar e avaliar candidatos

Quando implementarmos a criação assistida de paletas, o sistema poderá:

1. Escolher uma família de paleta e uma tonalidade base.
2. Criar variações em OKLCH, ajustando L, C e H de forma controlada.
3. Verificar se cada cor cabe no gamut sRGB.
4. Calcular diferenças percetivas entre pares (por exemplo, CIEDE2000 em CIELAB).
5. Sinalizar pares que podem ser demasiado parecidos, sem rejeitar automaticamente a paleta.
6. Simular deficiências de visão cromática e conversão para escala de cinzentos.
7. Avaliar os pares de cores que as regras do conversor realmente colocam lado a lado.
8. Apresentar pré-visualizações na arte de teste para decisão humana.

Não definir limiares universais de CIEDE2000 ou OKLab antes de realizar testes com as paletas e imagens deste projeto. Uma distância maior não significa automaticamente uma combinação melhor.

## 7. Bateria de testes visual

Antes de uma paleta ser promovida a preset, testá-la com:
- um pixel isolado;
- uma linha fina;
- um contorno fechado;
- um quadrado preenchido;
- um círculo;
- uma silhueta com detalhes;
- duas regiões encostadas;
- áreas com proporções muito diferentes.

Comparar:
- imagem em cor;
- imagem em escala de cinzentos;
- simulações de visão cromática;
- tamanho real de visualização e zoom ampliado.

Ao comparar paletas, manter a regra e o desenho constantes. Ao comparar regras, manter a paleta constante. Isto permite perceber se a diferença visual vem da paleta ou do algoritmo.

## 8. Decisão inicial para o desenvolvimento

Para o primeiro conjunto de presets, começar com:
1. uma paleta tonal fria;
2. uma paleta análoga quente;
3. uma paleta análoga com acento moderado;
4. uma paleta retro de alto contraste;
5. uma paleta qualitativa inspirada em Paul Tol, adaptada e testada para pixel art.

O conjunto final deve resultar de pré-visualizações e comparação, não apenas de fórmulas.

## 9. Fontes principais

- Schloss, K. B. & Palmer, S. E. (2011). [Aesthetic response to color combinations: preference, harmony, and similarity](https://doi.org/10.3758/s13414-010-0027-0). *Attention, Perception, & Psychophysics*, 73, 551–571.
- Forni, O., Darmon, A. & Benzaquen, M. (2026). [Harmonious color pairings: Insights from human preference and natural hue statistics](https://doi.org/10.1016/j.isci.2026.116038). *iScience*, 29(6), 116038.
- [ColorBrewer — Types of color schemes](https://colorbrewer2.org/learnmore/schemes.html).
- Tol, P. (2021; página atualizada em 2026). [Colour schemes and templates](https://sronpersonalpages.nl/~pault/).
- CIE. [ISO/CIE 11664-6:2022 — CIEDE2000 Colour-Difference Formula](https://www.cie.co.at/publications/colorimetry-part-6-ciede2000-colour-difference-formula-1).
- W3C. [CSS Color Module Level 4 — OKLab and OKLCH](https://www.w3.org/TR/css-color-4/#ok-lab).
- W3C WAI. [Understanding Success Criterion 1.4.3: Contrast (Minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum).

## 10. Limitações

- Estudos de preferência por pares não garantem que uma paleta completa de quatro ou oito cores seja agradável.
- O estudo de 2026 avaliou combinações específicas de tonalidades em HSL e não todas as dimensões de uma paleta de pixel art.
- Paletas de mapas e gráficos não são automaticamente boas paletas artísticas.
- CIEDE2000 e OKLCH ajudam a descrever relações percetivas; não medem gosto ou qualidade artística.
- A distribuição espacial das cores pelo algoritmo pode alterar radicalmente a perceção da mesma paleta.

Por estas razões, as métricas devem ajudar a gerar e filtrar candidatos, mas a validação final será feita através de testes visuais no próprio Pixel Project.


## Paletas extensas: 16 e 32 cores

As paletas de 16 e 32 cores permitem dividir uma rampa contextual em mais níveis, mas não tornam automaticamente a conversão melhor. Uma sequência com muitos tons próximos pode reduzir a diferença percetível entre células adjacentes; uma sequência com mudanças cromáticas muito abruptas pode produzir padrões fragmentados.

Ao criar ou escolher estes presets:
- verificar a progressão de luminosidade em escala de cinzentos;
- observar as cores em blocos 1×1, 2×2 e 4×4;
- comparar o mesmo desenho com 4, 8, 12, 16 e 32 cores;
- confirmar que as cores continuam distinguíveis em dimensões pequenas;
- avaliar a rampa nos dois sentidos, porque a inversão complementar usa a ordem inversa.

O catálogo concreto e as respetivas limitações estão em [PALETTE_CATALOG.md](PALETTE_CATALOG.md).
