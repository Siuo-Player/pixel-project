# Decisões, pressupostos e questões em aberto

Este documento distingue o que já foi acordado do que ainda precisa de ser experimentado.

## 1. Decisões acordadas

| ID | Tema | Decisão | Estado |
|---|---|---|---|
| D-001 | Imagem-fonte | Células transparentes, pretas ou brancas. | Acordado |
| D-002 | Transparência | Preservada; nunca se converte em cor. | Acordado |
| D-003 | Paletas | Quantidade escolhida pelo utilizador; paletas padrão e personalizadas. | Acordado |
| D-004 | Regra por área | Pode produzir padrão interno ou cor uniforme. | Acordado |
| D-005 | Reconhecimento | O motor deve analisar estruturas para além dos vizinhos diretos. | Acordado |
| D-006 | Famílias de técnicas | Linhas, curvas, topologia, textura, informação e análise multiescala são candidatas. | Acordado como direção |
| D-007 | Conflitos | Área não dá prioridade automática; propostas entram num resolvedor modular. | Acordado |
| D-008 | Resolução inicial | Consenso ponderado por pixel a experimentar primeiro. | Proposta técnica |
| D-009 | Simetria | Trocar preto/branco não pode criar uma assimetria na regra. | Obrigatório |
| D-010 | Saídas | Cada interpretação tem regras e paleta próprias; dados preparados para várias saídas. | Acordado |
| D-011 | Transformações | Espelhar e rodar alteram a matriz da fonte. | Acordado |
| D-012 | Layout | Layout adaptável, automático, lado a lado e em grelha. | Acordado |
| D-013 | Investigação | Python/scikit-image/OpenCV podem ser usados para protótipos; a app final não precisa de depender deles. | Proposta técnica |

## 2. Simetria formal

A imagem-fonte tem três estados: transparente, preto e branco. Definimos uma operação que troca preto e branco e deixa transparência fixa.

Para regras equivariante, inverter a imagem deve trocar os papéis emparelhados da paleta, sem alterar a geometria da saída. Para regras invariantes, a saída deve permanecer exatamente igual. Ambas as formas são simétricas.

A regra e a paleta devem declarar a correspondência de papéis necessária. Os testes automáticos devem verificar a propriedade em cada regra e estratégia de resolução.

## 3. Questões que só precisam de ser decididas quando forem implementadas

- Que famílias de detetores dão resultados visuais mais interessantes em pixel art?
- Quais as escalas de análise que fazem sentido para os tamanhos de arte escolhidos?
- Como calibrar confiança e prioridade sem favorecer padrões grandes ou uma polaridade?
- Quando o consenso por pixel produzir fragmentação, que estratégia de coerência global oferece melhor equilíbrio entre qualidade e desempenho?
- Como expor parâmetros avançados sem tornar a interface incompreensível?

## 4. Experiências prioritárias

1. Reta longa, diagonal, cruzamento e sequência interrompida.
2. Curva suave, canto, loop e ramificação.
3. Formas ocas, componentes separados e traços de espessura variável.
4. Texturas uniformes, periódicas, alternadas e irregulares.
5. Padrões raros em contextos uniformes e em ruído.
6. Casos em que duas ou mais regras propõem cores diferentes para o mesmo pixel.
7. Todos os casos anteriores com preto e branco trocados.

## 5. Critério para fechar uma decisão

Uma questão deve ser considerada decidida quando existir:
- uma escolha concreta;
- uma razão para a escolha;
- um teste ou justificação;
- registo do impacto nos requisitos e na implementação.
