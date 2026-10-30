# Decisões, pressupostos e questões em aberto

Este documento distingue o que já foi acordado do que ainda precisa de ser experimentado.

## 1. Decisões acordadas

| ID | Tema | Decisão | Estado |
|---|---|---|---|
| D-001 | Estrutura | Imagem-fonte e uma ou mais interpretações coloridas. | Acordado |
| D-002 | Entrada | Cada célula pode ser transparente, preta ou branca. | Acordado |
| D-003 | Semântica | O significado de preto/branco pode depender da regra; ambas as cores podem ser reinterpretadas. | Acordado |
| D-004 | Transparência | Células transparentes permanecem transparentes na conversão. | Acordado |
| D-005 | Conversão | Regras por pixel, vizinhança e áreas de tamanhos diferentes. | Acordado |
| D-006 | Resultado de área | Uma regra de área pode gerar um padrão interno (preferido) ou uma cor uniforme. | Acordado |
| D-007 | Sobreposição padrão | A regra que cobre a maior área vence e bloqueia regras menores nas células ocupadas. | Acordado |
| D-008 | Camadas | Modo experimental futuro em que regras grandes podem autorizar zonas específicas para refinamento por regras menores. | Ideia opcional; fora do MVP |
| D-009 | Paletas | O utilizador escolhe a quantidade de cores, incluindo 4 e 8, e seleciona ou cria a paleta. | Acordado |
| D-010 | Paletas padrão | Presets orientados por teoria da cor, perceção e testes visuais. | Acordado |
| D-011 | Regras | Personalização de parâmetros como objetivo próximo; criação livre de regras como objetivo futuro. | Acordado |
| D-012 | Persistência | Sem contas/backend por enquanto; exportação e importação de projetos. | Acordado |
| D-013 | Navegação | Zoom e deslocação sincronizados entre as telas. | Acordado |
| D-014 | Transformações | Espelhamento horizontal/vertical e rotação de 90°, 180° e 270° alteram os dados da imagem. | Acordado |
| D-015 | Várias saídas | O mesmo desenho poderá ter várias interpretações independentes, cada uma com regra e paleta próprias. | Acordado como direção |
| D-016 | Primeiro MVP | Começar com uma saída visível, mas modelar os dados para várias saídas. | Acordado |
| D-017 | Limite futuro | Até três saídas convertidas como primeiro limite a experimentar. | Provisório |
| D-018 | Disposição | Auto layout adaptável, mais opções lado a lado e em grelha. | Acordado |
| D-019 | Auto layout | Com 2 painéis dividir pelo eixo maior; com 3 reservar metade para a fonte e subdividir a outra metade; com 4 subdividir ambas as metades. | Acordado como comportamento inicial |
| D-020 | Stack | TypeScript + Vite + Canvas + testes. | Proposta por confirmar |

## 2. Questões de produto por resolver

### Q-001 — Semântica por regra

Cada regra deverá declarar se distingue preto e branco, trata ambos como pixels preenchidos ou interpreta um deles como espaço negativo. A aplicação não deve assumir uma semântica universal.

### Q-002 — Paletas

- A seleção deve permitir qualquer número razoável de cores ou apenas quantidades predefinidas?
- Deve haver nomes e papéis semânticos opcionais para as cores (sombra, base, luz, acento)?
- Deve ser possível reorganizar a ordem das cores?

### Q-003 — Regras de área

- As dimensões das áreas são fixas por regra ou ajustáveis?
- Uma regra pode reconhecer regiões de qualquer forma ou apenas padrões retangulares?
- As regras aplicam-se uma vez ou podem ser encadeadas em várias etapas?
- Que critérios secundários desempatarão regras que reconhecem áreas do mesmo tamanho?

### Q-004 — Modo em camadas

Se for experimentado, cada regra grande deverá poder declarar explicitamente quais as células/regiões onde regras menores podem atuar. A forma de expressar esta máscara ainda não está definida.

### Q-005 — Várias saídas

- O utilizador pode adicionar/remover saídas no editor?
- O limite de três saídas é suficiente depois de testado o desempenho?
- Todas as saídas partilham sempre a mesma navegação? A proposta atual é sim.

### Q-006 — Tamanhos e desempenho

Que dimensões predefinidas e que limite máximo fazem sentido? Regras de área e várias saídas podem aumentar o custo de conversão.

### Q-007 — Ficheiro de projeto

Deve existir um formato próprio e exportação adicional de PNG para cada saída? A exportação de PNG não preserva regras editáveis, pelo que o formato de projeto continua importante.

### Q-008 — Editor de regras

No nível 2, que parâmetros podem ser alterados sem escrever código? Exemplos: vizinhança, tamanho de padrão, prioridade e cores atribuídas. O nível 3 seria um construtor de regras ou uma linguagem de regras mais avançada.

## 3. Experiências técnicas a realizar

1. Comparar regras por pixel com padrões 2×2, 3×3 e áreas maiores.
2. Criar exemplos em que regras grandes e pequenas se sobrepõem.
3. Testar paletas de 4 e 8 cores com diferentes relações de luminosidade e tonalidade.
4. Verificar as paletas em escala de cinzentos e sob simulação de deficiências de visão cromática.
5. Comparar uma interpretação com três interpretações simultâneas.
6. Medir o tempo de conversão em grelhas de diferentes dimensões.
7. Testar o layout automático em janelas largas, altas e quase quadradas.
8. Testar espelhamento e rotação em grelhas não quadradas.

## 4. Quando fechar uma questão

Uma questão deve ser considerada decidida quando existir:
- uma escolha concreta;
- uma razão para a escolha;
- um teste ou justificação;
- registo do impacto nos requisitos e na implementação.
