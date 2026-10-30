# Desenho técnico inicial

Este documento descreve uma arquitetura proposta para o primeiro protótipo. As decisões assinaladas como propostas podem mudar durante a experimentação.

## 1. Separação fundamental

A aplicação deve separar:

1. **Imagem-fonte:** dados que o utilizador desenhou.
2. **Configuração de conversão:** regra, parâmetros e paleta de cada interpretação.
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

A semântica de preto e branco pertence à regra. Uma regra pode tratá-los como dois tipos de região, como foreground/background, ou como cores de entrada independentes.

No primeiro protótipo, um array tipado de bytes é uma representação simples e suficiente. Compactação para 2 bits por célula não é prioritária.

## 3. Modelo de paleta

Uma paleta é uma lista ordenada de cores, por exemplo em formato hexadecimal/RGBA. A quantidade de cores é independente da representação em bits.

A interface permite escolher uma quantidade e selecionar/criar uma paleta com esse número de entradas. Importa distinguir:
- **quantidade de cores:** número de cores realmente disponíveis na paleta;
- **transparência:** estado separado, não uma entrada normal da paleta.

O modelo poderá guardar metadados opcionais para cada cor, como papel visual (sombra, base, luz, destaque), sem obrigar todas as regras a usar essa semântica.

Os fundamentos e heurísticas de geração/validação de paletas estão em [COLOR_THEORY_AND_RULES.md](COLOR_THEORY_AND_RULES.md).

## 4. Motor de regras

A conversão deve ser um módulo independente da interface. Recebe:
- dados da imagem-fonte;
- largura e altura;
- definição da regra;
- parâmetros da regra;
- paleta.

Devolve uma grelha de saída ou uma representação intermédia equivalente.

### 4.1 Regras de pixel

Analisam o estado de uma célula e, opcionalmente, dos seus vizinhos (4 ou 8 vizinhos, por exemplo). Podem classificar isolados, contornos, cantos, interiores e fronteiras entre estados.

### 4.2 Regras de área e múltiplas escalas

Uma regra pode reconhecer um padrão com uma dimensão concreta (por exemplo, 2×2, 3×3 ou 5×3) e atribuir:
- um padrão interno com cores diferentes por posição; ou
- uma única cor uniforme à área.

O motor deve suportar regras com dimensões diferentes. O objetivo é comparar análise por pixel com reconhecimento de regiões e padrões maiores.

### 4.3 Sobreposição e prioridade padrão

Duas regras podem reconhecer regiões sobrepostas. O comportamento acordado para o primeiro motor é:

1. detetar os candidatos a regra/área;
2. ordenar pela área reconhecida, da maior para a menor;
3. quando a área for igual, usar prioridade explícita da regra;
4. em novo empate, usar um desempate determinístico;
5. quando uma regra é aplicada, marcar as células abrangidas como ocupadas/reservadas;
6. regras posteriores não podem substituir células reservadas.

Assim, uma regra 5×5 vence sobre uma regra 2×2 que se sobreponha à mesma região. Isto é uma prioridade absoluta por cobertura, não uma composição de regras.

### 4.4 Modo experimental em camadas

Uma possível extensão, fora do MVP, evita que regras grandes e pequenas tenham de competir diretamente:
- a regra de área maior estabelece a interpretação/base da região;
- a própria regra maior pode declarar uma máscara ou sub-regiões que ficam disponíveis para refinamento;
- regras menores só podem modificar essas zonas explicitamente autorizadas;
- fora dessas zonas, a regra maior continua protegida.

Este modo só existe se for explicitamente selecionado/configurado. Não altera a regra padrão de prioridade absoluta.

### 4.5 Etapas de conversão

Uma implementação experimental pode:
1. localizar os padrões candidatos em várias escalas;
2. avaliar as condições das regras;
3. ordenar e resolver sobreposições;
4. atribuir as cores/padrões às células ocupadas;
5. preservar transparência.

O formato interno das regras deve ser configurável e versionável, de modo a suportar presets e futuras ferramentas de personalização.

## 5. Várias interpretações

O modelo do projeto contém uma coleção de saídas, cada uma com:
- identificador;
- nome;
- referência à regra e respetivos parâmetros;
- paleta;
- resultado derivado/cache.

O primeiro MVP apresenta uma saída. A primeira expansão visual terá como limite provisório três painéis no total (fonte + até duas saídas). O modelo de dados deverá suportar mais interpretações sem exigir uma alteração estrutural.

As saídas partilham a mesma imagem-fonte, mas não partilham obrigatoriamente regras ou paletas. Alterar uma saída não pode alterar as outras.

## 6. Estado da vista e disposição automática

A vista é independente dos dados da arte. Guarda zoom, deslocação e o modo de disposição.

A disposição automática usa a dimensão da área disponível:
- **2 painéis:** dividir pelo eixo maior (esquerda/direita quando a largura é maior; cima/baixo quando a altura é maior);
- **3 painéis:** reservar metade para a fonte e subdividir a outra metade em duas regiões para as interpretações;
- **4 painéis:** subdividir recursivamente as duas metades para obter quatro regiões equilibradas.

Ao subdividir uma região, usar o seu próprio eixo maior. Cada imagem deve ser apresentada com ajuste proporcional (*contain*), sem esticar ou cortar os pixels.

A interface também deverá oferecer escolha manual entre lado a lado e grelha. As regras de layout não alteram as coordenadas ou os dados das imagens.

## 7. Transformações da arte

Espelhamento horizontal, espelhamento vertical e rotação são transformações reais sobre a matriz da imagem-fonte.

A operação deve:
1. produzir uma nova matriz com os pixels reorganizados;
2. atualizar largura/altura quando a rotação trocar os eixos;
3. substituir os dados-fonte pela matriz transformada;
4. recalcular todas as saídas derivadas.

As rotações de 90° e 270° trocam largura e altura; 180° mantém as dimensões. Não se deve transformar apenas a imagem renderizada, deixando os dados antigos escondidos.

A transformação pode ser descrita por matrizes/permutação de coordenadas. Uma operação de undo pode ser adicionada para permitir recuperar transformações, mas não é requisito inicial já acordado.

## 8. Interação com o ponteiro

É preferível usar Pointer Events, em vez de eventos exclusivos do rato, para preparar suporte futuro para toque e caneta.

Comportamento:
1. ao pressionar na tela-fonte, converter a posição para coordenadas de grelha;
2. capturar o ponteiro durante o traço;
3. aplicar a ferramenta ativa ao mover;
4. interpolar entre células quando necessário (por exemplo, com uma linha de Bresenham);
5. terminar o traço ao libertar/cancelar o ponteiro;
6. recalcular a saída afetada.

A transformação de coordenadas deve considerar escala e deslocação da vista. As dimensões lógicas da grelha não mudam com o zoom.

## 9. Renderização

HTML Canvas é uma opção inicial adequada para renderizar grelhas com arestas nítidas sem criar um elemento HTML por pixel.

A transparência pode ser indicada com um padrão de xadrez, que é apenas visual. A renderização deve desativar suavização para manter o estilo pixel art.

## 10. Configuração e ficheiro de projeto

O projeto deverá poder ser exportado e importado como ficheiro próprio, contendo pelo menos:
- versão do formato;
- dimensões;
- dados da imagem-fonte;
- paletas;
- regras e parâmetros;
- configurações das saídas.

A conversão pode ser recalculada no momento da importação; não é obrigatório guardar a imagem derivada se puder ser reproduzida.

Não existe conta ou backend nesta fase. O ficheiro de projeto é o mecanismo inicial de portabilidade e persistência.

## 11. Stack proposta

Opção inicial:
- TypeScript;
- Vite;
- HTML Canvas;
- testes unitários para o motor de regras.

Começar com processamento local e síncrono. Se conversões maiores bloquearem a interface, considerar Web Workers.

## 12. Testes essenciais

- Grelha vazia gera saída transparente.
- Preto e branco podem ser distinguidos pela regra.
- Transparência nunca é convertida em cor.
- Alterar a paleta ou regra não altera a fonte.
- Regras de área podem emitir padrões e preenchimentos uniformes.
- Regras maiores bloqueiam regras menores sobrepostas no modo padrão.
- O modo em camadas, quando for criado, só permite refinamento nas zonas autorizadas.
- Resultados determinísticos permanecem iguais com a mesma entrada e configuração.
- Transformações da matriz mantêm os pixels esperados e trocam dimensões quando necessário.
- Layouts adaptáveis preservam proporção e não cortam a arte.
- Exportar/importar preserva dados e configurações.
