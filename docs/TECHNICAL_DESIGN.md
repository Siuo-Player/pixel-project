# Desenho técnico inicial

Este documento descreve a arquitetura proposta para o primeiro protótipo. A investigação de algoritmos pode usar linguagens e bibliotecas diferentes da aplicação final.

## 1. Separação fundamental

A aplicação deve separar:

1. **Imagem-fonte:** dados que o utilizador desenhou.
2. **Configuração de conversão:** regras, parâmetros, pesos e paleta de cada interpretação.
3. **Resultado convertido:** dados derivados da fonte e da configuração.
4. **Estado da vista:** zoom, deslocação, disposição e ajuste das telas.

O resultado convertido nunca deve substituir nem modificar a imagem-fonte.

## 2. Modelo da imagem-fonte

Cada célula tem um de três estados lógicos:

| Valor | Estado |
|---|---|
| 0 | Transparente |
| 1 | Preto |
| 2 | Branco |

A transparência é ausência de pixel, não uma cor. O conversor deve preservar células transparentes como transparentes.

A semântica de preto e branco pertence à regra. Uma regra pode distingui-los, tratá-los como dois tipos de região ou interpretar ambos como pixels opacos equivalentes.

No primeiro protótipo, um array tipado de bytes é uma representação simples e suficiente. Compactação para 2 bits por célula não é prioritária.

## 3. Modelo de paleta

Uma paleta é uma lista ordenada de cores, por exemplo em formato hexadecimal/RGBA. A quantidade de cores é independente da representação em bits.

A interface permite escolher uma quantidade e selecionar/criar uma paleta com esse número de entradas. Transparência é um estado separado, não uma entrada normal da paleta.

As paletas destinadas a regras simétricas devem definir a correspondência entre papéis de cor (uma involução de saída). Os fundamentos e heurísticas estão em [COLOR_THEORY_AND_RULES.md](COLOR_THEORY_AND_RULES.md).

## 4. Motor de reconhecimento e regras

O motor deve ser independente da interface. Não deve ser implementado como uma sequência fixa de condições sobre os oito vizinhos.

A descrição das famílias de algoritmos, propostas, conflitos e simetria está em [ADVANCED_RULES_AND_ENGINE.md](ADVANCED_RULES_AND_ENGINE.md).

### 4.1 Famílias de detetores

A arquitetura deve permitir módulos independentes para:
- continuidade direcional e linhas;
- curvas, esqueletos, caminhos e junções;
- componentes, contornos, topologia e espessura;
- padrões binários locais e estatísticas de textura;
- entropia, informação mútua e surpresa;
- orientação, periodicidade e análise multiescala.

Nem todos são necessários no MVP. Começamos pelos que são simples de validar em pixel art, mas o modelo não deve limitar o motor a uma janela 3×3.

### 4.2 Pipeline por propostas

O pipeline conceptual é:

1. receber a imagem e a configuração;
2. calcular características reutilizáveis (por exemplo, componentes, orientações e mapas de entropia);
3. executar os detetores;
4. produzir propostas que declaram pixels abrangidos e papel de saída sugerido;
5. calcular evidência/confiança e prioridade;
6. resolver conflitos;
7. criar a imagem de saída e preservar transparência;
8. validar as propriedades de simetria.

Uma proposta não altera diretamente a saída. Isto permite comparar diferentes estratégias de resolução usando exatamente as mesmas deteções.

### 4.3 Contrato de uma proposta

Uma proposta deverá conter, pelo menos:
- identificador da regra;
- conjunto de posições abrangidas;
- papel de saída proposto por posição;
- confiança da correspondência;
- prioridade da regra;
- especificidade e evidências usadas;
- modo de simetria.

A área abrangida é registada, mas não dá prioridade automática.

### 4.4 Resolução de conflitos

A estratégia experimental inicial é consenso ponderado por pixel:
- propostas que recomendam o mesmo papel acumulam suporte;
- limita-se a contribuição repetida de uma mesma família de detetores;
- o papel com maior suporte vence;
- empate é resolvido por prioridade, confiança, especificidade e identificador estável.

O motor deve permitir comparar esta abordagem com a proposta individual de maior confiança, regiões exclusivas e, no futuro, otimização global baseada em energia/graph cuts.

A estratégia anterior de prioridade absoluta da maior área deixa de ser a regra geral. Pode continuar a existir como modo opcional, mas não como pressuposto do motor.

## 5. Simetria preto/branco

Define-se a operação S que troca preto e branco na origem e deixa transparência inalterada. Para regras equivariante, a saída deve satisfazer:

F(S(I)) = T(F(I))

T troca os papéis de saída emparelhados e mantém transparência fixa; aplicar T duas vezes devolve a saída inicial.

Uma regra invariante pode, em alternativa, produzir a mesma saída quando os estados preto/branco são trocados. Ambas são simétricas; o modo fica declarado na regra.

Requisitos:
- detetores geométricos e estatísticos não podem favorecer preto ou branco;
- regras específicas de uma polaridade precisam de uma regra correspondente para a polaridade oposta;
- a prioridade e os desempates não podem depender da identidade literal da cor;
- as paletas equivariante têm de declarar os pares de cores correspondentes;
- testes automáticos verificam a relação de simetria para cada regra e resolvedor.

## 6. Várias interpretações

O modelo do projeto contém uma coleção de saídas, cada uma com:
- identificador e nome;
- regras e respetivos parâmetros;
- paleta e correspondência de papéis;
- estratégia de resolução;
- resultado derivado/cache.

O MVP apresenta uma saída. A primeira expansão visual terá como limite provisório três painéis totais (fonte + até duas saídas). O modelo de dados não deve impor esse limite.

## 7. Estado da vista e disposição automática

A vista é independente dos dados da arte. Guarda zoom, deslocação e o modo de disposição.

A disposição automática usa a dimensão da área disponível:
- **2 painéis:** dividir pelo eixo maior;
- **3 painéis:** reservar metade para a fonte e subdividir a outra metade;
- **4 painéis:** subdividir recursivamente as duas metades.

Ao subdividir uma região, usar o seu próprio eixo maior. Cada imagem usa ajuste proporcional (contain), sem esticar nem cortar pixels.

A interface também oferece disposição manual lado a lado e em grelha. As regras de layout não alteram os dados das imagens.

## 8. Transformações da arte

Espelhamento horizontal, espelhamento vertical e rotação são transformações reais sobre a matriz da imagem-fonte.

A operação produz uma nova matriz, atualiza dimensões quando necessário, substitui os dados-fonte e recalcula todas as saídas. Rotações de 90° e 270° trocam largura e altura.

## 9. Interação com o ponteiro

É preferível usar Pointer Events, em vez de eventos exclusivos do rato, para preparar suporte futuro para toque e caneta.

1. Ao pressionar na tela-fonte, converter a posição para coordenadas de grelha.
2. Capturar o ponteiro durante o traço.
3. Aplicar a ferramenta ativa ao mover.
4. Interpolar entre células quando necessário (por exemplo, com Bresenham).
5. Terminar o traço ao libertar/cancelar o ponteiro.
6. Recalcular as saídas.

## 10. Renderização

HTML Canvas é uma opção inicial adequada para renderizar grelhas com arestas nítidas. A transparência pode ser indicada com um padrão de xadrez, apenas visual. A renderização deve desativar suavização.

## 11. Investigação e bibliotecas

Para prototipagem de algoritmos:
- Python;
- NumPy e SciPy;
- scikit-image;
- OpenCV.

Para a aplicação web:
- TypeScript + Vite;
- Canvas;
- módulos independentes para detetores, regras, paletas e resolvedores.

Algoritmos validados em Python podem ser reimplementados em TypeScript ou compilados para WebAssembly se o desempenho o justificar. O utilizador final não deverá precisar de um serviço remoto para as conversões locais.

## 12. Projeto e exportação

O ficheiro do projeto deverá incluir:
- versão do formato;
- dimensões;
- dados da imagem-fonte;
- paletas e pares de saída;
- regras e parâmetros;
- configurações de todas as interpretações.

A conversão pode ser recalculada na importação. Não é obrigatório guardar os resultados derivados se puderem ser reproduzidos.
