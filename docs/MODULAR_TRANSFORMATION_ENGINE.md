# Motor modular de transformação, fusão de cores e inversão complementar

## 1. Objetivo e correção conceptual

Este documento define a arquitetura para transformar a imagem binária numa imagem de uma paleta discreta, usando várias técnicas independentes que podem ser configuradas e combinadas.

A propriedade pretendida ao inverter preto e branco não é uma correspondência fixa entre cada cor de entrada e uma cor de saída. O resultado de cada pixel depende do contexto: vizinhos, linhas, curvas, textura, forma e outras características.

A propriedade pretendida é uma **inversão complementar do resultado**. Ao trocar preto por branco e branco por preto na imagem-fonte, a interpretação deve trocar para os papéis correspondentes da paleta, mantendo a estrutura e o contexto. Um pixel pode mudar de cor devido à alteração dos restantes pixels da sua vizinhança.

## 2. Da imagem à cor: o modelo de mistura contextual

### 2.1 Codificação da fonte

Para uma formulação matemática simples, cada célula opaca pode ser representada por:

- preto = 0;
- branco = 1;
- transparente = sem valor (não é zero).

Uma técnica pode analisar uma janela em torno de cada pixel e calcular, por exemplo, uma média ponderada:

m(p) = Σ(q ∈ V(p)) w(p,q) · x(q) / Σ(q ∈ V(p)) w(p,q)

Onde:
- p é o pixel a converter;
- V(p) é o conjunto de pixels considerados pela técnica;
- x(q) é 0 para preto e 1 para branco;
- w(p,q) é o peso atribuído a cada posição;
- células transparentes são excluídas do numerador e do denominador.

O peso pode depender da distância, orientação, posição relativa ou de uma característica detetada. O próprio pixel central pode ou não participar.

Este campo m(p) representa a proporção ponderada de branco no contexto. Não é ainda uma cor RGB: é uma medida intermédia que será interpretada através da paleta.

### 2.2 O que acontece ao inverter preto e branco

Se todos os pixels opacos forem invertidos, então x'(q) = 1 - x(q). Com os mesmos pesos e a mesma máscara de transparência:

m'(p) = 1 - m(p)

Logo, a média contextual é refletida em torno de 0,5.

Exemplo com uma janela de nove pixels, usando pesos iguais:

| Contexto | Proporção de branco | Proporção de preto |
|---|---:|---:|
| 3 brancos + 6 pretos | 1/3 | 2/3 |
| 6 brancos + 3 pretos | 2/3 | 1/3 |

Se o primeiro contexto produzir azul e o segundo produzir vermelho, a relação não vem de uma regra fixa «preto → azul» e «branco → vermelho». Vem da proporção de cores no contexto e da correspondência entre posições da paleta.

O mesmo princípio pode ser usado com kernels direcionais, vizinhanças maiores, linhas, curvas e outras características.

### 2.3 Quantização para a paleta

A aplicação não deve gerar cores intermédias livremente. O campo contextual é convertido para uma das entradas discretas da paleta.

Para uma paleta ordenada por uma dimensão contextual, podemos definir uma função Q:

cor(p) = Q(m(p))

A paleta pode ser uma escala de cinzentos, uma transição azul–vermelho, ou outra sequência de cores escolhida pelo utilizador. A função Q escolhe sempre uma entrada existente; não faz mistura RGB entre duas entradas.

Para uma paleta de quatro cores, a sequência pode ter quatro níveis. Para oito cores, pode ter oito níveis. Uma paleta qualitativa sem ordem natural deve declarar explicitamente como se emparelham as cores na operação de inversão.

## 3. Inversão complementar da paleta

### 3.1 A propriedade correta

Seja S a operação que troca preto e branco na origem e deixa a transparência inalterada.

Seja T a operação que reflete os papéis de cor na paleta.

A propriedade desejada é:

F(S(I)) = T(F(I))

Isto é uma forma de equivariância: a transformação aplicada à entrada tem uma transformação correspondente na saída. Não significa que a saída deva permanecer igual.

A investigação sobre equivariância distingue precisamente uma transformação na entrada da transformação correspondente na representação de saída. Ver [Understanding Image Representations by Measuring Their Equivariance and Equivalence](https://pmc.ncbi.nlm.nih.gov/articles/PMC6510825/) e [Imaging With Equivariant Deep Learning](https://doi.org/10.1109/MSP.2022.3209850).

### 3.2 Correspondência dos papéis de saída

Cada paleta usada neste modo tem de declarar uma operação de espelhamento. Essa operação deve ser involutiva:

T(T(c)) = c

Exemplos:
- preto ↔ branco;
- cinzento escuro ↔ cinzento claro;
- azul ↔ vermelho;
- verde escuro ↔ amarelo claro, se essa for a correspondência escolhida pelo autor da paleta;
- uma cor neutra central pode corresponder a si própria.

Para uma paleta ordenada em gradiente, a correspondência automática pode inverter a ordem: índice 0 ↔ índice N-1, índice 1 ↔ índice N-2, etc. Para paletas sem ordem, o utilizador ou o autor do preset define os pares.

### 3.3 Importante: não fixar uma cor por estado de entrada

Uma regra não pode dizer apenas «se o pixel central é preto, pinta verde; se é branco, pinta vermelho» e ignorar o contexto. Isso falharia o objetivo da mistura contextual.

A regra deve usar as características do pixel e da sua vizinhança para calcular a posição contextual na paleta. Ao inverter toda a origem, as características sensíveis à polaridade são trocadas/refletidas e a cor escolhida passa para o papel de paleta correspondente.

### 3.4 Tipos de características

As técnicas podem produzir características de dois tipos:

- **Invariantes à polaridade:** geometria da região opaca, comprimento de uma linha, orientação, curvatura, número de buracos e algumas medidas de textura. Mantêm o valor ao trocar preto e branco.
- **Equivariantes à polaridade:** proporção de branco/preto, média contextual, balanço de polaridade e histogramas com os canais preto/branco trocados. Têm uma transformação conhecida quando a fonte é invertida.

O módulo deve declarar como as suas saídas se transformam. Não basta esperar que uma propriedade de simetria apareça por acaso.

### 3.5 Teste obrigatório

Para cada regra e composição de técnicas:

1. gerar ou selecionar uma imagem I;
2. converter I;
3. inverter preto/branco, mantendo transparência;
4. converter S(I);
5. aplicar T ao primeiro resultado;
6. verificar que corresponde ao segundo resultado.

A propriedade tem de ser verificada com tolerância zero para os índices de cor, desde que as regras sejam determinísticas.

## 4. Arquitetura modular: técnica, instância, regra e proposta

Uma técnica não deve ser um bloco monolítico nem modificar diretamente a imagem final.

### 4.1 Definição de técnica

Uma definição de técnica é um módulo reutilizável, por exemplo:
- deteção de retas por Hough;
- perfis direcionais;
- esqueletização;
- análise de curvatura;
- matriz GLCM;
- cálculo de entropia;
- autocorrelação;
- média contextual por kernel.

A definição contém o algoritmo, os parâmetros aceites e o tipo das características que consegue produzir.

### 4.2 Instância de técnica

O utilizador pode adicionar a mesma técnica várias vezes. Cada instância possui:
- identificador próprio;
- técnica base;
- parâmetros próprios;
- escalas/janelas/direções;
- máscara ou região onde atua;
- regra de transformação associada;
- peso de contribuição;
- ativada/desativada.

Exemplo: três instâncias da mesma técnica de deteção de linhas:
- uma procura linhas longas horizontais;
- outra procura diagonais mais curtas;
- outra permite pequenas interrupções.

Podem produzir transformações diferentes e afetar pixels diferentes, embora utilizem o mesmo módulo base.

### 4.3 Separar deteção de interpretação

A arquitetura deve separar:

1. **Detetor/caracterizador:** calcula características ou encontra estruturas.
2. **Regra de transformação:** interpreta essas características e produz uma distribuição de probabilidade pelas cores da paleta.
3. **Resolvedor:** combina as propostas de todas as instâncias e escolhe a cor final por pixel.

Isto permite reutilizar um detetor com diferentes regras de transformação. Também permite combinar vários detetores numa única regra mais sofisticada.

### 4.4 Contrato conceptual do módulo

Entrada:
- imagem-fonte e dimensões;
- máscara de transparência;
- parâmetros da instância;
- características auxiliares, se necessárias;
- configuração da regra de transformação;
- paleta e correspondência de inversão.

Saída:
- mapas de características e/ou deteções;
- propostas por pixel;
- distribuição completa pelas cores para cada pixel abrangido;
- confiança/evidência;
- região afetada;
- explicação da deteção;
- transformação de polaridade esperada.

Nenhum módulo altera a fonte nem escreve diretamente na saída.

## 5. Matrizes: o que pode e o que não pode ser matricial

A imagem será armazenada como matrizes/arrays. Muitas técnicas podem ser expressas por operações matriciais ou sobre matrizes:

- convoluções e correlações com kernels;
- médias ponderadas e filtros direcionais;
- somas acumuladas e imagens integrais;
- histogramas e coocorrência;
- transformadas de Hough com acumuladores;
- autocorrelação e Fourier;
- mapas de distância e mapas de características.

Outras técnicas são operações iterativas ou combinatórias:
- esqueletização;
- cálculo topológico;
- construção de grafos de caminhos;
- procura de componentes conectadas;
- otimização global sobre rótulos.

Estas também recebem matrizes e devolvem matrizes, máscaras, grafos ou propostas. Não precisam de ser uma única multiplicação de matrizes.

A regra arquitetural é: **todas as técnicas operam sobre dados matriciais e devolvem dados estruturados, sem depender da interface**. Não é necessário fingir que todos os algoritmos são transformações lineares.

## 6. Distribuições por cor e fusão de propostas

### 6.1 Cada técnica tem de distribuir 100%

Para um pixel p e uma técnica k, a técnica devolve uma distribuição sobre todas as N cores:

P(k,p,c) ≥ 0

Σ(c=1..N) P(k,p,c) = 1

Se uma técnica atribui 45% ao laranja, os restantes 55% têm de ser distribuídos pelas outras cores. Não podem desaparecer da conta.

Uma técnica que não consegue avaliar um pixel pode declarar «sem proposta» (abstenção). Isso é diferente de uma proposta com confiança baixa.

### 6.2 Peso da instância

Cada instância tem um peso w(k) não negativo. O peso representa a importância/reliabilidade relativa da instância no resolvedor; não é a confiança que a técnica atribui a uma cor específica.

A combinação inicial será uma média ponderada das distribuições (linear opinion pool):

P(c|p) = Σ(k) w(k) · P(k,p,c) / Σ(k) w(k)

O resultado é novamente uma distribuição válida que soma 1.

Este método é conhecido como *linear opinion pool* ou média de probabilidades. É uma forma simples e transparente de combinar previsões probabilísticas; os pesos devem refletir a confiança relativa nas fontes e não ser confundidos com as probabilidades emitidas por cada uma. Ver [The Royal Society — Aggregating probabilistic predictions](https://doi.org/10.1098/rsif.2022.0659).

### 6.3 Exemplo com duas cores

Consideremos três técnicas e apenas duas cores, laranja e vermelho:

| Técnica | Laranja | Vermelho |
|---|---:|---:|
| A | 45% | 55% |
| B | 62% | 38% |
| C | 8% | 92% |

Com pesos iguais:
- laranja: 45 + 62 + 8 = 115;
- vermelho: 55 + 38 + 92 = 185.

Dividindo pelo total de 300:
- laranja = 38,3%;
- vermelho = 61,7%.

Portanto, com distribuições completas e pesos iguais, **o vermelho ganha**. A contagem apenas das cores favoritas (45 + 62 contra 92) daria laranja, mas ignoraria as probabilidades contrárias que as técnicas também emitiram. Isso não seria uma fusão de distribuições completas.

O laranja pode ganhar se as instâncias A e B forem consideradas mais fiáveis do que C. Por exemplo, com pesos 1, 1 e 0,1:
- apoio ponderado ao laranja = 45 + 62 + 0,8 = 107,8;
- apoio ponderado ao vermelho = 55 + 38 + 9,2 = 102,2.

Após normalização, o laranja fica ligeiramente acima de 50%.

Com três ou mais cores, a distribuição dos restantes 1-x também tem de ser indicada pela técnica. Não se pode inferi-la apenas a partir da cor favorita.

### 6.4 A confiança e o peso são diferentes

- **Distribuição/confiança por pixel:** que cores são plausíveis neste pixel, segundo a instância?
- **Peso da instância:** quanto devemos confiar globalmente nessa instância relativamente às outras?
- **Abstenção:** esta instância não tem evidência suficiente para participar neste pixel.

Mais tarde, os pesos podem ser calibrados com desenhos de teste e resultados esperados. Para já, serão parâmetros visíveis e documentados.

### 6.5 Decisão final sem criar cores intermédias

Depois da fusão, escolher o índice da paleta com maior probabilidade:

cor_final(p) = argmax(c) P(c|p)

A probabilidade é uma representação interna de incerteza/apoio. Não é opacidade, não é mistura RGB e não cria uma cor intermédia. O pixel final usa exatamente uma das cores da paleta.

A saída deve continuar estritamente limitada ao número de cores escolhido pelo utilizador.

### 6.6 Estratégias alternativas para comparar

A arquitetura deve permitir trocar o resolvedor:
- maior probabilidade final;
- maior proposta individual;
- média ponderada de distribuições;
- combinação logarítmica de probabilidades, com cuidado para probabilidades nulas;
- otimização global da imagem;
- regras exclusivas ou em camadas.

A média ponderada é a primeira opção experimental, não uma decisão irreversível.

## 7. Regras em camadas e paletas discretas

As regras em camadas podem:
- definir uma base por região;
- acrescentar propostas para detalhes;
- criar máscaras que permitem ou bloqueiam técnicas posteriores.

No entanto, as camadas não misturam canais RGB nem criam tons entre entradas. Cada proposta refere-se a entradas discretas da paleta. No final, cada pixel opaco recebe apenas uma entrada.

Pode haver estatísticas ou médias contínuas durante o cálculo, mas o passo de quantização transforma o resultado numa cor existente da paleta.

## 8. O que significa otimização global

A fusão por pixel decide cada pixel usando as propostas que o afetam. Isto pode criar ruído visual: por exemplo, uma linha quase toda laranja pode ter um pixel vermelho isolado porque uma técnica local discordou nesse ponto.

A otimização global considera simultaneamente os rótulos de todos os pixels.

Cada pixel p recebe um rótulo z(p) que corresponde a uma cor da paleta. Pode-se definir uma energia:

E(z) = Σ(p) D(p,z(p)) + λ Σ((p,q)) V(p,q,z(p),z(q)) + μ C(z)

- D é o custo de escolher uma cor, baseado nas probabilidades das técnicas. Uma opção é D(p,c) = -log(P(c|p) + ε).
- V define relações desejadas entre pixels próximos, sem eliminar contornos importantes.
- C avalia coerência de estruturas maiores, como a continuidade de uma linha ou curva detetada.
- λ e μ controlam o equilíbrio entre evidência local e coerência espacial/estrutural.

O algoritmo escolhe uma imagem completa que equilibra as evidências. Pode preservar uma linha laranja contínua mesmo quando um pixel isolado recebeu uma proposta vermelha ligeiramente mais forte. Mas deve respeitar uma mudança de cor quando existe evidência estrutural para ela.

Graph cuts e métodos de minimização de energia são ferramentas conhecidas para problemas de rotulagem de pixels. Só são aplicáveis a certas formulações e, em problemas multiclasse, podem produzir aproximações em vez de garantirem sempre o mínimo global. Ver [Boykov, Veksler & Zabih (2001)](https://doi.org/10.1109/34.969114) e [Kolmogorov & Zabih — What Energy Functions can be Minimized via Graph Cuts?](https://ecommons.cornell.edu/entities/publication/ecb4fdf6-8b52-4d60-856b-5db3764fb8b1).

A otimização global é uma evolução, não um requisito para o primeiro protótipo.

## 9. Testes obrigatórios

1. **Inversão da fonte:** inverter preto/branco deve refletir a saída segundo a correspondência de paleta definida.
2. **Contexto:** uma alteração noutros pixels pode mudar a cor do pixel avaliado.
3. **Transparência:** nunca entra como preto nem como branco; não recebe cor.
4. **Distribuições:** a soma das probabilidades de cada instância e pixel é 1.
5. **Abstenção:** uma técnica que não avalia um pixel não adiciona votos artificiais.
6. **Fusão:** a média ponderada preserva uma distribuição que soma 1.
7. **Peso:** alterar o peso de uma instância altera a sua influência, não a distribuição interna que ela emitiu.
8. **Paleta discreta:** a saída contém apenas cores da paleta.
9. **Reutilização:** duas instâncias da mesma técnica, com parâmetros diferentes, podem produzir propostas diferentes.
10. **Determinismo:** a mesma imagem e configuração produzem a mesma saída.
11. **Matriz:** operações de espelhamento/rotação preservam estados e dimensões esperadas.
12. **Coerência global:** quando o resolvedor global for implementado, testar linhas, contornos, junções e mudanças de região.

## 10. Bibliotecas e implementação

### Investigação

A investigação pode usar Python:
- NumPy e SciPy para arrays, filtros, kernels e estatísticas;
- scikit-image para morfologia, esqueletização, Hough/Radon, GLCM, LBP, medidas de região e entropia;
- OpenCV para linhas, contornos, operações de imagem e alternativas de implementação;
- bibliotecas de otimização/graph para experiências de rotulagem global.

A documentação do scikit-image descreve o eixo medial e o mapa de distâncias, calculados a partir de uma imagem binária. Isso pode ser reutilizado por diferentes instâncias de regras de espessura/curvatura: [scikit-image medial axis](https://scikit-image.org/docs/stable/api/skimage.morphology.html).

### Aplicação

A primeira versão web pode usar TypeScript + Vite + Canvas. Cada técnica deve ser uma definição registada num catálogo; as instâncias e parâmetros ficam guardados no projeto.

Se uma técnica Python for demasiado complexa para reimplementar, podemos estudar WebAssembly ou um worker local. O objetivo é não depender de um servidor remoto para a conversão de um desenho.

## 11. Sequência recomendada

1. Construir o contrato de instância e proposta.
2. Construir média contextual por kernel e quantização em paleta.
3. Implementar a correspondência de inversão da paleta e os testes.
4. Implementar fusão por distribuição ponderada.
5. Adicionar um detetor direcional de linhas.
6. Permitir duplicar e configurar instâncias do mesmo detetor.
7. Adicionar esqueletização/curvatura, região e textura.
8. Comparar fusão por pixel com otimização global quando existirem conflitos reais.

O primeiro objetivo é ter um motor modular e explicável, não acumular dezenas de algoritmos sem uma arquitetura comum.


## 11. Independência em relação ao número de cores

A implementação atual tem presets de 4, 8, 12, 16 e 32 cores. O contrato das técnicas e do resolvedor é genérico: para N entradas, cada pixel opaco tem uma distribuição de N probabilidades, armazenada num segmento de comprimento N.

Nenhum detetor ou resolvedor deve assumir quatro canais por pixel. A dimensão é comunicada por `palette.colors.length` e pelo campo `colorCount` das propostas. Esta regra é importante para que uma nova dimensão de paleta não exija reescrever os algoritmos.

A correspondência de inversão atual é a reversão do índice `i → N - 1 - i`. Qualquer futura paleta não ordenada terá de definir explicitamente uma correspondência compatível e testável.
