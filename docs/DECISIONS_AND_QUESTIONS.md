# Decisões, pressupostos e questões em aberto

Este documento distingue o que já foi acordado do que ainda precisa de ser experimentado.

## 1. Decisões acordadas

| ID | Tema | Decisão | Estado |
|---|---|---|---|
| D-001 | Estrutura | Imagem-fonte à esquerda e interpretação colorida à direita. | Acordado |
| D-002 | Entrada | Cada célula pode ser transparente, preta ou branca. | Acordado |
| D-003 | Semântica | O significado de preto/branco pode depender da regra; a interpretação principal será explorada como estados diferentes de preenchimento. | Acordado, semântica flexível |
| D-004 | Transparência | Células transparentes permanecem transparentes na conversão normal. | Acordado |
| D-005 | Conversão | Podem existir regras por pixel, vizinhança e áreas de tamanhos diferentes. | Acordado |
| D-006 | Sobreposição | Há preferência experimental por regras que cubram áreas maiores. | Acordado como objetivo; desempate a testar |
| D-007 | Paletas | O utilizador escolhe a quantidade de cores, incluindo 4 e 8, e seleciona ou cria a paleta. | Acordado |
| D-008 | Paletas padrão | A aplicação terá opções predefinidas orientadas por teoria da cor e testes visuais. | Acordado |
| D-009 | Regras | Pelo menos personalização de parâmetros; criação livre de regras fica como objetivo futuro. | Acordado |
| D-010 | Persistência | Sem contas/backend por enquanto; suportar exportação e importação de ficheiros de projeto. | Acordado |
| D-011 | Navegação | Zoom e deslocação sincronizados entre as telas. | Acordado |
| D-012 | Virar/inverter | Deve ser sincronizado entre as telas; a operação exata ainda precisa de clarificação. | Parcial |
| D-013 | Várias saídas | O mesmo desenho poderá ter várias interpretações independentes, cada uma com a sua regra e paleta. | Acordado como direção |
| D-014 | Primeiro MVP | Começar com uma saída visível, mas modelar os dados para várias saídas. | Acordado como proposta |
| D-015 | Limite futuro | Até três saídas como primeiro limite a experimentar. | Provisório |
| D-016 | Stack | TypeScript + Vite + Canvas + testes. | Proposta por confirmar |

## 2. Questões de produto por resolver

### Q-001 — Significado operacional de preto e branco

O desenho atual considera que os dois estados podem ser reinterpretados, mas não fixa uma única semântica. A regra deverá declarar se:
- distingue preto de branco;
- considera ambos como pixels ocupados;
- usa um como preenchimento e outro como espaço negativo;
- aplica uma interpretação diferente.

### Q-002 — Paletas

- A seleção deve permitir qualquer número razoável de cores ou apenas quantidades pré-definidas?
- As paletas personalizadas podem ter transparência/alfa em alguma cor, ou a transparência continua sempre a ser um estado independente?
- Deve haver nomes e papéis semânticos para as cores (sombra, base, luz, acento)?
- Deve ser possível reorganizar a ordem das cores?

### Q-003 — Regras de área

- As dimensões das áreas são fixas por regra ou ajustáveis?
- Uma regra pode reconhecer regiões de qualquer forma ou apenas padrões retangulares?
- As regras aplicam-se uma vez ou podem ser encadeadas em várias etapas?
- Como deve ser resolvida a sobreposição entre uma regra grande e outra pequena, mas mais específica?

### Q-004 — Transformações

“Virar” significa espelhar horizontalmente, espelhar verticalmente, rodar 90/180 graus, ou tudo isso? As operações serão apenas transformações da vista ou também poderão alterar os dados da arte?

### Q-005 — Várias saídas

- As telas serão apresentadas lado a lado, em separadores, ou numa grelha?
- O utilizador pode adicionar/remover saídas no editor?
- O limite de três será fixo ou apenas um limite inicial para desempenho/usabilidade?
- Todas as saídas partilham a mesma navegação ou podem ter vistas independentes?

### Q-006 — Tamanhos e desempenho

Que dimensões predefinidas e que limite máximo fazem sentido? Regras de área e várias saídas podem aumentar o custo de conversão.

### Q-007 — Ficheiro de projeto

Deve existir um formato de ficheiro próprio (por exemplo, JSON com dados compactados) e exportação adicional de PNG para cada saída? A exportação de PNG não preserva regras editáveis, pelo que o formato de projeto continua importante.

### Q-008 — Editor de regras

No nível 2, que parâmetros podem ser alterados sem escrever código? Exemplos: vizinhança, tamanho de padrão, prioridade, cores atribuídas, número de iterações e condições. O nível 3 seria um construtor de regras ou uma linguagem de regras mais avançada.

## 3. Experiências técnicas a realizar

1. Comparar regras por pixel com padrões 2×2, 3×3 e áreas maiores.
2. Criar exemplos em que regras grandes e pequenas se sobrepõem.
3. Testar paletas de 4 e 8 cores com diferentes relações de luminosidade e tonalidade.
4. Verificar as paletas em escala de cinzentos e sob simulação de deficiências de visão cromática.
5. Comparar uma interpretação com três interpretações simultâneas.
6. Medir o tempo de conversão em grelhas de diferentes dimensões.

## 4. Quando fechar uma questão

Uma questão deve ser considerada decidida quando existir:
- uma escolha concreta;
- uma razão para a escolha;
- um teste ou justificação;
- registo do impacto nos requisitos e na implementação.
