# Desenho técnico inicial

Este documento descreve uma arquitetura proposta para o primeiro protótipo. As decisões assinaladas como propostas podem mudar durante a experimentação.

## 1. Separação fundamental

A aplicação deve separar:

1. **Imagem-fonte:** dados que o utilizador desenhou.
2. **Configuração de conversão:** regra, parâmetros e paleta de cada interpretação.
3. **Resultado convertido:** dados derivados da fonte e da configuração.
4. **Estado da vista:** zoom, deslocação e orientação da apresentação.

O resultado convertido nunca deve substituir nem modificar a imagem-fonte.

## 2. Modelo da imagem-fonte

Cada célula tem um de três estados lógicos:

| Valor | Estado |
|---|---|
| 0 | Transparente |
| 1 | Preto |
| 2 | Branco |

A transparência é ausência de pixel, não uma cor. O conversor deve ignorar células transparentes ou preservá-las como transparentes. Não pode criar cor numa célula transparente no comportamento normal acordado.

A semântica de preto e branco pertence à regra. Uma regra pode tratá-los como dois tipos de região, como foreground/background, ou como cores de entrada independentes.

No primeiro protótipo, um array tipado de bytes é uma representação simples e suficiente. Compactação para 2 bits por célula não é prioritária.

## 3. Modelo de paleta

Uma paleta é uma lista ordenada de cores, por exemplo em formato hexadecimal/RGBA. A quantidade de cores é independente da representação em bits.

A interface deverá permitir escolher uma quantidade e selecionar/criar uma paleta com esse número de entradas. Importa distinguir:
- **quantidade de cores:** número de cores realmente disponíveis na paleta;
- **transparência:** estado separado, não uma entrada normal da paleta.

O modelo poderá guardar também metadados opcionais para cada cor, como papel visual (sombra, base, luz, destaque), mas esses papéis não devem limitar o algoritmo a uma única estratégia.

## 4. Motor de regras

A conversão deve ser uma função ou módulo independente da interface. Recebe:
- dados da imagem-fonte;
- largura e altura;
- definição da regra;
- parâmetros da regra;
- paleta.

Devolve uma grelha de saída ou uma representação intermédia equivalente.

### 4.1 Regras de pixel

Analisam o estado de uma célula e, opcionalmente, dos seus vizinhos (4 ou 8 vizinhos, por exemplo). Podem classificar isolados, contornos, cantos, interiores e fronteiras entre estados.

### 4.2 Regras de área e múltiplas escalas

Uma regra pode reconhecer um padrão com uma dimensão concreta (por exemplo, 2×2, 3×3 ou 5×3) e atribuir uma cor ou padrão de saída à área correspondente.

A arquitetura deve permitir regras de diferentes tamanhos. O objetivo experimental é comparar análise por pixel com reconhecimento de regiões e padrões maiores.

### 4.3 Sobreposição e prioridade

Duas regras podem reconhecer regiões que se sobrepõem. O motor precisa de uma política explícita para resolver conflitos.

Proposta inicial para experimentar:
1. respeitar a prioridade explícita configurada para a regra;
2. em caso de empate, dar preferência ao padrão que cobre mais pixels;
3. em novo empate, preferir a condição mais específica;
4. definir um desempate estável para garantir resultados reproduzíveis.

A preferência do utilizador por regras que cobrem áreas maiores deve ser testada com exemplos. A maior área não deve vencer automaticamente uma regra mais específica se isso destruir um detalhe importante. A política final pode permitir que o utilizador ajuste prioridade e escala.

### 4.4 Etapas de conversão

Uma implementação experimental pode:
1. localizar os padrões candidatos em várias escalas;
2. avaliar as condições das regras;
3. resolver sobreposições e prioridades;
4. atribuir cores da paleta aos pixels abrangidos;
5. preservar transparência.

O formato interno das regras deve ser configurável e versionável, de modo a suportar presets e futuras ferramentas de personalização.

## 5. Várias interpretações

O modelo do projeto não deve conter apenas um objeto de conversão fixo. Deve conter uma coleção de saídas, cada uma com:
- identificador;
- nome;
- referência à regra e respetivos parâmetros;
- paleta;
- resultado derivado/cache.

O primeiro MVP apresenta uma saída. Mais tarde, a interface poderá permitir até três saídas no primeiro passo de expansão, e eventualmente mais se o desempenho e a experiência justificarem.

As saídas partilham a mesma imagem-fonte, mas não partilham obrigatoriamente regras ou paletas. Alterar uma saída não pode alterar as outras.

## 6. Estado da vista e transformações

A vista deve ser separada dos dados da arte. Um estado de câmara comum às telas pode guardar zoom, deslocação e orientação/espelhamento.

As transformações de navegação devem ser sincronizadas para que o mesmo pixel-fonte corresponda ao mesmo ponto visual em todas as telas. O MVP deve começar por zoom e deslocação; orientação/viragem precisa de ser especificada (horizontal, vertical, rotação ou combinação).

Não confundir:
- **transformar a vista:** mudar a forma como a arte é apresentada;
- **transformar os dados:** alterar as coordenadas ou os valores dos pixels da arte.

## 7. Interação com o ponteiro

É preferível usar Pointer Events, em vez de eventos exclusivos do rato, para preparar suporte futuro para toque e caneta.

Comportamento:
1. ao pressionar na tela-fonte, converter a posição para coordenadas de grelha;
2. capturar o ponteiro durante o traço;
3. aplicar a ferramenta ativa ao mover;
4. interpolar entre células quando necessário (por exemplo, com uma linha de Bresenham);
5. terminar o traço ao libertar/cancelar o ponteiro;
6. recalcular a saída afetada.

A transformação de coordenadas deve considerar escala, deslocação e orientação da vista. As dimensões lógicas da grelha não mudam com o zoom.

## 8. Renderização

HTML Canvas é uma opção inicial adequada para renderizar grelhas com arestas nítidas sem criar um elemento HTML por pixel.

A transparência pode ser indicada com um padrão de xadrez, que é apenas visual. A renderização deve desativar suavização para manter o estilo pixel art.

## 9. Configuração e ficheiro de projeto

O projeto deverá poder ser exportado e importado como ficheiro próprio, contendo pelo menos:
- versão do formato;
- dimensões;
- dados da imagem-fonte;
- paletas;
- regras e parâmetros;
- configurações das saídas.

A conversão pode ser recalculada no momento da importação; não é obrigatório guardar a imagem derivada se puder ser reproduzida.

Não existe conta ou backend nesta fase. O ficheiro de projeto é o mecanismo inicial de portabilidade e persistência.

## 10. Stack proposta

Opção inicial:
- TypeScript;
- Vite;
- HTML Canvas;
- testes unitários para o motor de regras.

Começar com processamento local e síncrono. Se conversões maiores bloquearem a interface, considerar Web Workers.

## 11. Testes essenciais

- Grelha vazia gera saída transparente.
- Preto e branco podem ser distinguidos pela regra.
- Transparência nunca é convertida em cor no modo normal.
- Alterar a paleta ou regra não altera a fonte.
- Regras de área tratam corretamente margens e sobreposições.
- Resultados determinísticos permanecem iguais com a mesma entrada e configuração.
- Transformações da vista mantêm o alinhamento entre telas.
- Exportar/importar preserva dados e configurações.
