# Motor de reconhecimento de estruturas, regras avançadas e conflitos

**Objetivo:** definir como o Pixel Project pode reconhecer estruturas geométricas, padrões e características estatísticas numa imagem binária, e como várias regras podem propor alterações incompatíveis aos mesmos pixels.

Este documento substitui a ideia de que a maior área deve ganhar sempre. O tamanho da área é uma característica da deteção, não uma prioridade automática.

## 1. Princípios de desenho do motor

O motor não deve limitar-se a contar vizinhos próximos. Deve conseguir observar a imagem em diferentes escalas e reconhecer:

- continuidade e orientação;
- linhas, curvas e cruzamentos;
- espessura e forma das regiões;
- componentes conectadas, contornos e buracos;
- repetição, periodicidade e textura;
- regularidade, complexidade e surpresa estatística;
- relações entre padrões locais e estruturas maiores.

Uma regra deve declarar **o que reconhece**, **que evidência considera suficiente**, **que pixels ou região pretende afetar** e **que resultado propõe**.

As regras não devem alterar diretamente a imagem enquanto estão a ser detetadas. Primeiro produzem propostas; depois um sistema separado resolve conflitos e constrói o resultado.

## 2. Famílias de detetores e características

As técnicas abaixo são candidatas para experiências. Não é obrigatório implementar todas no primeiro protótipo.

### 2.1 Retas e continuidade direcional

A pergunta deixa de ser apenas "quantos vizinhos da mesma cor existem?" e passa a ser:

> Existe uma sequência suficientemente longa e alinhada de pixels da mesma cor que atravessa este ponto?

Características possíveis:
- comprimento de sequência em cada direção;
- equilíbrio entre o comprimento antes e depois do ponto;
- orientação predominante;
- continuidade e número de falhas;
- desvio em relação a uma reta;
- existência de linhas que se cruzam.

Técnicas a experimentar:

**Perfis direcionais / digital line scan.** Percorrer direções discretas (horizontal, vertical, diagonais e inclinações adicionais) e medir sequências contínuas da mesma cor. É barato e adequado a imagens pequenas.

**Transformada de Hough.** Cada ponto contribui para linhas candidatas num espaço de parâmetros. Picos no acumulador indicam linhas apoiadas por muitos pontos. A variante probabilística devolve segmentos e admite parâmetros como comprimento mínimo e falha máxima. É útil para reconhecer retas longas, incluindo segmentos com pequenos intervalos.

**Transformada de Radon.** Soma informação ao longo de projeções com diferentes ângulos. Pode revelar orientações dominantes e estruturas lineares numa região maior. É mais global do que uma regra por pixel.

As linhas devem ser detetadas separadamente para as máscaras preta e branca, com exatamente os mesmos parâmetros.

Fontes:
- [OpenCV — Hough Line Transform](https://docs.opencv.org/4.x/d9/db0/tutorial_hough_lines.html)
- [scikit-image — Straight line Hough transform](https://scikit-image.org/docs/stable/auto_examples/edges/plot_line_hough_transform.html)
- [scikit-image — Transform module, including Hough and Radon](https://scikit-image.org/docs/stable/api/skimage.transform.html)

### 2.2 Curvas, caminhos e continuidade suave

Para uma curva, a sequência da mesma cor não precisa de manter uma direção constante. É importante saber se os pontos formam um caminho que muda de direção de forma coerente.

Técnicas candidatas:

**Componentes conectadas.** Agrupar pixels da mesma cor que se tocam, usando uma definição explícita de conectividade (4 ou 8 vizinhos). Permite encontrar regiões, caminhos separados e junções.

**Esqueletização (skeletonization).** Reduzir uma região espessa a uma estrutura central fina, tentando preservar conectividade e topologia. O resultado pode ser representado como um grafo:
- grau 1: extremidade de um caminho;
- grau 2: continuação normal;
- grau 3 ou superior: junção ou ramificação.

**Eixo medial e transformada de distância.** Encontrar o centro estrutural de uma região e medir a distância à fronteira. Além do percurso central, obtém-se uma estimativa da espessura local da forma.

**Códigos de cadeia e curvatura discreta.** Representar o caminho por movimentos entre pixels e medir alterações de direção. Permite distinguir, por exemplo, uma linha reta, uma curva suave, uma esquina brusca e uma sequência irregular.

Exemplos de regras possíveis:
- curva que passa por um pixel e mantém uma variação de direção limitada;
- arco com determinado comprimento e curvatura aproximada;
- caminho fechado;
- extremidade, esquina ou ramificação;
- curva que mantém espessura semelhante ao longo do percurso.

Em pixel art, a esqueletização pode produzir pequenas ramificações indesejadas, sobretudo em diagonais e formas muito pequenas. É necessário testar a conectividade e a remoção de ramificações curtas antes de confiar no esqueleto como verdade geométrica.

Fontes:
- [scikit-image — Skeletonization example](https://scikit-image.org/docs/stable/auto_examples/edges/plot_skeleton.html)
- [scikit-image — Medial axis and morphology](https://scikit-image.org/docs/stable/api/skimage.morphology.html)

### 2.3 Geometria, regiões e topologia

Uma regra pode reconhecer uma região como objeto, não apenas avaliar cada pixel isoladamente.

Características úteis:
- área e perímetro;
- largura e altura da caixa envolvente;
- proporção entre largura e altura;
- centroide;
- orientação e momentos geométricos;
- excentricidade (alongamento);
- circularidade/compactação;
- convexidade;
- número de componentes;
- número de buracos;
- distância à fronteira;
- espessura local.

**Topologia** descreve propriedades como conectividade e buracos, que se mantêm mesmo quando a forma sofre certas deformações. Em 2D, o número de Euler é:

χ = componentes - buracos

Isto permite distinguir uma região sólida de um anel ou de duas partes separadas, mesmo quando têm áreas semelhantes.

Fontes:
- [scikit-image — Region measurements and Euler number](https://scikit-image.org/docs/stable/api/skimage.measure.html)
- [scikit-image — Morphology and distance transforms](https://scikit-image.org/docs/stable/api/skimage.morphology.html)

### 2.4 Textura e padrões binários locais

Nem todos os padrões são formas geométricas claras. Uma região pode ser reconhecida pela distribuição e relação entre pixels.

**Matriz de coocorrência de níveis de cinzento (GLCM).** Conta com que frequência pares de valores aparecem separados por uma distância e direção. A partir dessa matriz podem calcular-se:
- contraste;
- dissimilaridade;
- homogeneidade;
- energia;
- correlação;
- entropia.

Para a imagem do projeto, a versão inicial pode usar estados preto, branco e, quando relevante, transparência. Também podemos calcular as estatísticas apenas sobre os pixels opacos, para que a quantidade de transparência não domine a medição.

**Padrões binários locais (LBP).** Codificam comparações entre uma célula central e amostras à sua volta. Histograms de padrões ajudam a caracterizar texturas e configurações locais. Para este projeto, devemos adaptar o descritor para relações de igualdade/diferença entre estados, em vez de introduzir uma ordem artificial entre preto e branco.

**Run-length features.** Medem a distribuição de sequências contínuas de uma mesma cor por direção. São especialmente adequadas para distinguir:
- riscas longas;
- pontos isolados;
- padrões alternados;
- blocos compactos;
- texturas com muitos segmentos curtos.

Fontes:
- [Haralick et al. (1973) — Textural Features for Image Classification](https://doi.org/10.1109/TSMC.1973.4309314)
- [scikit-image — GLCM and texture properties](https://scikit-image.org/docs/stable/api/skimage.feature.html)
- [scikit-image — Local Binary Pattern example](https://scikit-image.org/docs/stable/auto_examples/features_detection/plot_local_binary_pattern.html)

### 2.5 Teoria da informação e estatísticas locais

A teoria da informação pode ajudar a medir se uma região é uniforme, variada, previsível ou invulgar.

Para uma janela com estados s, a entropia de Shannon é:

H(X) = -Σ p(s) log₂ p(s)

Onde p(s) é a proporção de cada estado na janela.

Interpretação prática:
- entropia baixa: a janela é dominada por um estado ou padrão muito regular;
- entropia alta: existe maior variedade de estados;
- entropia intermédia: podem existir regiões organizadas com mistura de estados.

Outras métricas:

**Entropia condicional.** Mede quanta incerteza resta sobre um pixel quando conhecemos outro pixel ou uma direção de vizinhança. Pode ajudar a identificar estruturas previsíveis e repetições.

**Informação mútua.** Mede quanto conhecimento de um estado ou posição reduz a incerteza de outro. Pode revelar dependências espaciais e padrões recorrentes.

I(X;Y) = H(X) + H(Y) - H(X,Y)

**Surpresa / auto-informação.** Um padrão raro tem surpresa:

I(x) = -log₂ p(x)

Pode ser interessante para reconhecer detalhes raros ou motivos invulgares. Um padrão raro não é automaticamente significativo: também pode ser ruído.

**Entropia direcional.** Calcular estatísticas em direções distintas pode distinguir riscas horizontais, verticais, diagonais e texturas sem orientação dominante.

A entropia mede diversidade estatística, não qualidade artística. Uma imagem aleatória pode ter entropia elevada sem possuir qualquer estrutura útil. Estas métricas devem ser combinadas com deteção geométrica e de continuidade.

Fontes:
- [scikit-image — Local entropy filter](https://scikit-image.org/docs/stable/api/skimage.filters.rank.html)
- [scikit-image — GLCM entropy and texture statistics](https://scikit-image.org/docs/stable/api/skimage.feature.html)

### 2.6 Orientação, frequência e repetição

Outras experiências possíveis:

**Tensor de estrutura.** Resume a orientação dominante e a coerência local dos gradientes. Pode distinguir regiões com orientação forte (por exemplo, uma textura de riscas) de regiões sem direção dominante.

**Autocorrelação.** Compara uma região com versões deslocadas dela própria. Picos em determinados deslocamentos indicam repetição espacial.

**Transformadas de Fourier e wavelets.** Ajudam a encontrar periodicidade, escala e orientação de padrões. Podem ser excessivas para o primeiro protótipo, mas são candidatas úteis para reconhecer grelhas, riscas e texturas repetitivas.

Fonte:
- [scikit-image — Structure tensor and feature extraction](https://scikit-image.org/docs/stable/api/skimage.feature.html)

## 3. Exemplos de regras mais interessantes

As seguintes regras são propostas para a futura biblioteca. Não são todas simples limiares sobre contagens locais.

| Nome provisório | O que reconhece | Possível interpretação |
|---|---|---|
| Long Stroke | Uma sequência da mesma cor que atravessa um ponto, com elevada continuidade e alinhamento. | Uma cor para linhas estruturais e outra para linhas secundárias. |
| Smooth Arc | Um caminho da mesma cor com curvatura gradual e poucas quebras. | Aplicar cores progressivas ao longo da curva. |
| Corner / Junction | Esquinas, extremidades, cruzamentos e ramificações num esqueleto. | Destacar junções e mudanças de direção. |
| Ring / Loop | Um caminho fechado ou uma região com um buraco. | Criar contornos, brilho interior ou preenchimento especial. |
| Thick Stroke | Um eixo medial com distância à fronteira relativamente constante ou variável. | Distinguir traços finos e grossos. |
| Directional Texture | Uma região com orientação dominante, medida por sequências ou estatísticas direcionais. | Aplicar uma família de cores segundo a orientação. |
| Repeating Motif | Padrões que se repetem a deslocamentos regulares. | Dar identidade própria a tijolos, tecidos, grelhas ou ondas. |
| Complex Region | Uma região com entropia elevada, mas estrutura geométrica coerente. | Reservar cores de detalhe para zonas complexas. |
| Rare Motif | Um padrão com auto-informação elevada, validado por geometria e contexto. | Dar destaque a detalhes raros, evitando destacar ruído automaticamente. |
| Shape Class | Uma componente com proporção, excentricidade, circularidade ou topologia específicas. | Diferenciar objetos compactos, alongados, ocos ou ramificados. |

Uma regra poderá combinar várias características. Por exemplo, uma curva pode exigir:
- continuidade de uma cor;
- comprimento mínimo;
- curvatura suave;
- ausência de ramificações no segmento;
- contexto de uma região com determinada espessura.

Isto é muito mais expressivo do que uma simples condição com contagem de vizinhos.

## 4. Como as regras propõem alterações

Cada correspondência encontrada gera uma **proposta** (proposal), sem alterar diretamente o resultado.

Uma proposta deve conter:
- identificador da regra;
- conjunto de pixels abrangidos;
- cor/papel da paleta proposto para cada pixel;
- confiança da correspondência;
- prioridade definida pelo utilizador;
- especificidade do padrão;
- características e evidências que justificam a deteção;
- informação necessária para verificar a simetria preto/branco.

Uma proposta pode cobrir uma linha, uma curva, uma região ou apenas um pixel. Várias propostas podem abranger o mesmo pixel.

A área abrangida não dá prioridade automática. É um dado útil para explicar e avaliar uma regra, não o critério universal para escolher o vencedor.

## 5. Resolução de conflitos

### 5.1 Porque não basta escolher a maior área

Uma reta pode ser longa e pouco específica, enquanto uma pequena junção pode ser altamente distintiva. Uma regra de textura pode abranger uma região grande, mas uma regra de curva pode reconhecer um traço essencial no interior dessa região.

A área não representa necessariamente importância, qualidade ou confiança.

### 5.2 Evidência usada para decidir

Cada proposta pode ser avaliada através de:
- **prioridade da regra:** importância escolhida pelo utilizador;
- **confiança:** quão bem os dados correspondem ao padrão esperado;
- **especificidade:** quão distintivo é o padrão;
- **suporte estrutural:** confirmação por outros detetores;
- **coerência contextual:** compatibilidade com a região e com as estruturas vizinhas.

Estes componentes devem ser registados separadamente, para podermos explicar por que razão uma proposta ganhou.

Não usar automaticamente a área ou o número de pixels afetados como multiplicador de prioridade.

### 5.3 Estratégia inicial: consenso ponderado por pixel

Para o primeiro motor experimental:

1. Todos os detetores geram propostas.
2. Cada proposta indica que papel de cor pretende atribuir a cada pixel abrangido.
3. Para cada pixel, agregam-se os pesos das propostas que recomendam cada papel de saída.
4. Para evitar que várias deteções quase idênticas da mesma regra dominem, limita-se a contribuição de cada família de detetores.
5. Escolhe-se o papel com maior suporte.
6. Em empate, aplica-se a prioridade da regra, depois a confiança, especificidade e um identificador estável.

O resultado é determinístico. A quantidade de pixels abrangidos por uma proposta não lhe dá vantagem automática.

### 5.4 Outras estratégias a experimentar

O motor deve manter a resolução de conflitos modular:

- **Highest confidence:** vence a proposta individual mais forte para cada pixel.
- **Weighted consensus:** várias deteções independentes podem reforçar o mesmo resultado.
- **Largest region first (modo opcional):** reproduz a decisão inicial de deixar a maior área reconhecida vencer; fica disponível para comparação, mas não é o comportamento padrão.
- **Exclusive region:** uma proposta é aplicada como unidade e reserva toda a sua região, desde que passe os critérios de seleção.
- **Layered rules:** uma regra pode autorizar explicitamente regras menores em sub-regiões.
- **Global/coherent optimization:** escolher os rótulos de todos os pixels em conjunto, equilibrando evidência local, coerência das formas e continuidade de padrões.

Não temos de escolher uma estratégia para sempre. O primeiro motor deve permitir comparar pelo menos as duas primeiras.

### 5.5 Otimização global como evolução

Um modelo de campos aleatórios de Markov ou uma formulação de energia pode representar o problema:

E(Y) = Σₚ Dₚ(Yₚ) + λΣ₍ₚ,ᵩ₎ Vₚ,ᵩ(Yₚ,Yᵩ) + μC(Y)

Onde:
- Yₚ é o papel de cor escolhido para o pixel p;
- Dₚ representa a evidência das propostas naquele pixel;
- Vₚ,ᵩ representa compatibilidade entre pixels vizinhos;
- C(Y) representa coerência de estruturas maiores, como linhas, curvas ou áreas reconhecidas.

A compatibilidade não deve simplesmente suavizar tudo. Deve permitir descontinuidades importantes em contornos, junções e mudanças estruturais.

Graph cuts e métodos relacionados conseguem aproximar a minimização de certas funções de energia usadas em visão computacional. Não garantem solução global para qualquer formulação, e a adequação depende da forma dos termos de energia.

Fonte:
- Boykov, Veksler & Zabih (2001), [Fast Approximate Energy Minimization via Graph Cuts](https://doi.org/10.1109/34.969114).

Esta evolução poderá ser interessante quando a votação por pixel criar resultados fragmentados ou incoerentes.

## 6. Simetria obrigatória entre preto e branco

Esta é uma propriedade do motor, não apenas uma opção estética.

### 6.1 Troca de polaridade

Definir a operação S sobre a imagem-fonte:
- transparente permanece transparente;
- preto passa a branco;
- branco passa a preto.

S(transparent) = transparent

S(black) = white

S(white) = black

Aplicar a operação duas vezes deve recuperar a imagem inicial:

S(S(I)) = I

### 6.2 Condição de simetria da conversão

A saída utiliza uma paleta com papéis correspondentes. Definimos uma operação T que troca os papéis de cor emparelhados e mantém a transparência.

A condição desejada é:

F(S(I)) = T(F(I))

Ou seja, ao trocar preto e branco na origem, a estrutura da interpretação mantém-se e os papéis de cor correspondentes também trocam.

A operação T deve ser uma involução:

T(T(c)) = c

Para paletas de 4 ou 8 cores, podemos criar pares de papéis de saída. Numa paleta com número ímpar de cores, podem existir papéis neutros que ficam fixos sob T.

### 6.3 Dois comportamentos válidos

- **Equivariância (modo padrão):** ao trocar preto e branco, os papéis de saída emparelhados trocam também. Preserva a distinção entre as duas cores de origem sem favorecer uma delas.
- **Invariância:** ao trocar preto e branco, a saída permanece exatamente igual. Adequado a regras que usam apenas a geometria/ocupação e ignoram a identidade das duas cores.

Uma regra deve declarar qual dos dois comportamentos usa. Ambos são simétricos; a escolha depende da intenção visual.

### 6.4 Consequências para os detetores

- Uma regra de reta aplica-se de forma idêntica a linhas pretas e brancas.
- Uma regra de curva não pode ter parâmetros diferentes apenas por a curva ser preta ou branca.
- Uma regra que procura padrões específicos deve incluir o padrão com as cores trocadas.
- Métricas como entropia, continuidade e forma devem ser calculadas de modo independente da identidade absoluta preto/branco.
- Se um descritor depende de valores numéricos (0/1), a permutação de preto e branco não pode alterar arbitrariamente o resultado.
- O sistema de desempate não pode preferir preto a branco nem usar a cor literal para escolher a regra vencedora.

### 6.5 Paletas personalizadas

Uma paleta usada por uma regra equivariante precisa de definir correspondências entre papéis de saída. Ao criar uma paleta personalizada, o utilizador poderá:
- emparelhar as cores manualmente;
- indicar cores neutras que permanecem fixas;
- consultar uma pré-visualização de uma conversão e da versão com preto/branco invertidos.

Uma regra simétrica não deve ser aceite como regra normal se não tiver uma correspondência de saída válida.

## 7. Testes automáticos obrigatórios

O motor terá testes que verificam propriedades, não apenas imagens específicas.

1. **Transparência:** nenhuma proposta pode colorir um pixel-fonte transparente.
2. **Simetria:** gerar uma imagem aleatória; converter; inverter preto/branco; converter novamente; confirmar a relação F(S(I)) = T(F(I)).
3. **Dupla inversão:** inverter duas vezes recupera a origem.
4. **Conflito:** propostas de diferentes regras sobre o mesmo pixel são resolvidas sempre da mesma forma.
5. **Independência da área:** aumentar a área de uma proposta não aumenta automaticamente a sua prioridade.
6. **Repetibilidade:** a mesma origem, regras, parâmetros e paleta produzem a mesma saída.
7. **Linhas:** horizontais, verticais, diagonais, segmentos interrompidos e cruzamentos.
8. **Curvas:** arcos, círculos, cantos, ramificações e caminhos de espessura variável.
9. **Topologia:** componentes separados, regiões ligadas, buracos e anéis.
10. **Estatística:** regiões uniformes, padrões periódicos, texturas mistas e ruído.

Os testes de simetria devem ser executados para todos os detetores e estratégias de resolução, não apenas para o conversor completo.

## 8. Bibliotecas e estratégia de implementação

O projeto pode usar linguagens diferentes para investigação e para a aplicação final.

### Investigação de algoritmos

Recomendação:
- Python;
- NumPy e SciPy para matrizes, estatística e operações numéricas;
- scikit-image para Hough/Radon, GLCM, LBP, esqueletização, morfologia, entropia e análise de regiões;
- OpenCV para deteção de linhas, contornos e operações de visão computacional.

Esta combinação permite experimentar rapidamente detetores e comparar resultados sem os misturar com a interface.

### Aplicação web

Manter a interface desacoplada do motor. A opção inicial continua a ser:
- TypeScript + Vite;
- Canvas para apresentar a pixel art;
- módulos independentes para detetores, regras, paletas e resolução de conflitos.

Depois de uma técnica ser validada em Python, podemos:
- reimplementá-la em TypeScript para execução direta no browser;
- ou compilá-la para WebAssembly, se desempenho ou complexidade justificarem.

Não é necessário carregar toda a biblioteca científica para o browser. A investigação pode usar Python; o utilizador final não precisa de instalar Python para usar a aplicação web.

## 9. Sequência de experiências recomendada

1. Implementar perfis direcionais e deteção de sequências.
2. Implementar componentes conectadas, esqueletização e caminhos.
3. Adicionar detetores de curvas, retas e junções.
4. Acrescentar medidas de região, espessura e topologia.
5. Adicionar entropia, coocorrência, run-length e LBP.
6. Implementar propostas e resolução de conflitos por pixel.
7. Executar os testes de simetria em todas as regras.
8. Comparar resultados em imagens de teste simples e complexas.
9. Experimentar otimização global apenas quando os conflitos reais justificarem a complexidade.

A prioridade será obter regras interpretáveis, reproduzíveis e visualmente interessantes antes de introduzir aprendizagem automática ou modelos mais difíceis de explicar.
