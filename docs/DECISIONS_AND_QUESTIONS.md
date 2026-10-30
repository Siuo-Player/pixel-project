# Decisões, pressupostos e questões em aberto

Este documento evita que ideias provisórias sejam confundidas com requisitos já decididos. As decisões podem ser revistas depois de experimentar o protótipo.

## 1. Decisões/pressupostos iniciais

| ID | Tema | Pressuposto atual | Estado |
|---|---|---|---|
| D-001 | Estrutura do editor | Duas telas lado a lado, com a fonte à esquerda e o resultado à direita. | Aceite para o MVP |
| D-002 | Entrada | A fonte tem três estados: transparente, preto e branco. | Aceite para o MVP |
| D-003 | Edição | Só a tela esquerda é editável. | Aceite para o MVP |
| D-004 | Atualização | A conversão é recalculada automaticamente após alterações na fonte ou configuração. | Aceite para o MVP |
| D-005 | Dimensões | A grelha é criada antes de entrar no editor. | Aceite para o MVP |
| D-006 | Configuração | Regra e paleta podem ser escolhidas antes de criar o projeto e alteradas dentro dele. | Aceite para o MVP |
| D-007 | Âmbito das opções | As alterações de regra e paleta aplicam-se apenas ao projeto atual. | Aceite para o MVP |
| D-008 | Dados | O resultado convertido é derivado; a fonte nunca é modificada pela conversão. | Aceite para o MVP |
| D-009 | Algoritmo inicial | Começar por experimentar regras baseadas na vizinhança, inspiradas em auto-tiling. | Proposta |
| D-010 | Stack | TypeScript + Vite + Canvas é a opção inicial sugerida. | Por confirmar |

## 2. Questões de produto

### Q-001 — O significado de preto e branco

As duas cores são estados com significado independente, ou representam apenas “pixel ligado” e “pixel desligado”?

**Impacto:** uma regra de vizinhança pode tratar preto e branco como materiais diferentes, ou pode considerar ambos como ocupação e usar a cor apenas como uma propriedade adicional.

### Q-002 — Quantidade de cores de saída

A interface deve apresentar a escolha como profundidade de cor (por exemplo, 4 bits/16 cores e 8 bits/256 cores), como quantidade exata de cores, ou ambas?

**Proposta:** mostrar presets de paleta com a respetiva quantidade de cores e, em detalhes, a profundidade máxima suportada.

### Q-003 — Comportamento dos pixels transparentes

A transparência deve permanecer sempre transparente no resultado, ou algumas regras poderão criar cores em células vazias junto aos contornos?

**Proposta para o MVP:** preservar a transparência. Efeitos que expandam a imagem devem ser opções explícitas futuras.

### Q-004 — Dimensões e limites

Que tamanhos predefinidos devem existir? Qual o máximo de largura, altura e número total de células?

**Impacto:** memória, velocidade de conversão e capacidade de manter a pré-visualização em tempo real.

### Q-005 — Escala e navegação

As duas telas devem fazer zoom e pan em simultâneo? O MVP precisa de zoom ou basta ajustar as telas ao espaço disponível?

### Q-006 — Guardar e exportar

O primeiro protótipo deve apenas manter o desenho enquanto a página está aberta, ou deve guardar projetos localmente? Que formatos devem ser exportados (PNG, formato próprio com regras e paleta, outros)?

### Q-007 — Histórico

Undo/redo é necessário já na primeira versão ou pode ficar para depois de validar o desenho e a conversão?

## 3. Questões técnicas e experimentais

### Q-008 — Vizinhança

A regra inicial considera os quatro vizinhos cardinais ou os oito vizinhos de uma grelha 3×3? A célula central deve influenciar sempre a cor escolhida?

### Q-009 — Estratégia de conversão

Qual produz resultados mais interessantes?
- classificar contornos, cantos e interiores e associar cada caso a cores;
- usar padrões de vizinhança como índices de uma tabela;
- usar regiões conectadas ou distância a contornos;
- combinar várias etapas.

### Q-010 — Autómatos celulares

Os autómatos celulares serão:
- uma transformação estática aplicada uma vez;
- uma simulação com um número definido de iterações;
- uma simulação contínua/animada?

Também é necessário definir como preto, branco e transparência correspondem aos estados do autómato.

### Q-011 — Definição de paleta

As paletas serão conjuntos fixos fornecidos pela aplicação, conjuntos criados pelo utilizador, ou ambos? O utilizador poderá alterar a cor de cada entrada individualmente?

### Q-012 — Editor de regras

No futuro, “editar regras” poderá significar ajustar parâmetros de presets ou construir regras novas através de uma interface visual. A segunda opção é significativamente mais complexa e não faz parte do MVP.

### Q-013 — Escala temporal

Uma regra que depende apenas dos vizinhos pode ser recalculada sempre que um pixel muda. Uma simulação temporal tem estado próprio e exige controlos como iniciar, parar e número de iterações. Estas duas experiências não devem ser misturadas sem uma decisão explícita.

## 4. Experiências que devem orientar as decisões

1. Desenhar formas simples: um pixel isolado, uma linha, um quadrado, um círculo e formas com buracos.
2. Comparar a mesma forma com várias paletas.
3. Comparar vizinhança de 4 e de 8 células.
4. Verificar se as regras preservam a silhueta original.
5. Testar imagens pequenas e maiores para avaliar a atualização em tempo real.
6. Comparar regras estáticas com experiências baseadas em autómatos celulares.

## 5. Critério para fechar uma questão

Uma questão deve ser marcada como decidida quando houver:
- uma escolha concreta;
- uma razão para a escolha;
- evidência de teste ou uma justificação de produto;
- indicação do que muda nos requisitos ou na implementação.
