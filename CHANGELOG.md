# Histórico de alterações

## 2026-10-30 — Teoria das cores e regras de conversão clarificadas

- Criado COLOR_THEORY_AND_RULES.md com teoria relevante, fontes e heurísticas práticas para o projeto.
- Clarificado que regras de área podem gerar um padrão de cores por pixel ou um preenchimento uniforme.
- Definida prioridade absoluta da regra que reconhece a maior área como comportamento padrão para sobreposições.
- Registado um modo em camadas como experiência opcional futura, no qual regras maiores autorizam zonas de refinamento.
- Definidas transformações reais da matriz: espelhamento horizontal/vertical e rotações de 90°, 180° e 270°.
- Clarificado que as transformações alteram a imagem-fonte e obrigam a recalcular as interpretações.
- Definido layout automático recursivo para duas, três e quatro telas, mais opções lado a lado e em grelha.
- Atualizados requisitos do MVP, visão e desenho técnico.

## 2026-10-30 — Requisitos refinados e pesquisa de paletas

- Clarificado que a seleção diz respeito à quantidade de cores (por exemplo, 4 ou 8), não a bits.
- Clarificada a transparência como estado que se mantém transparente na conversão.
- Registado suporte conceptual para regras por pixel e por áreas de diferentes dimensões.
- Definida a seleção e criação de paletas pelo utilizador, acompanhada por presets fundamentados em teoria da cor e testes.
- Definida a exportação/importação de projetos como persistência inicial, sem contas.
- Preparada a arquitetura para várias interpretações independentes.

## 2026-10-30 — Arranque da documentação

- Registada a visão do editor de pixel art com duas telas sincronizadas.
- Definido o âmbito funcional inicial.
- Criada a documentação base do produto, MVP e desenho técnico.
