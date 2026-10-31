# Decisões e questões em aberto

## Decisões implementadas

| Tema | Decisão atual |
|---|---|
| Fonte | Matriz com transparente, preto e branco. |
| Transparência | Permanece transparente; não é uma cor de paleta. |
| Conversão | Contextual; não existe mapeamento fixo preto/branco → duas cores. |
| Paletas | 34 presets: 10×4 cores, 8×8, 6×12, 6×16 e 4×32. |
| Dimensão da paleta | Escolhível no ecrã inicial e nas definições do editor. |
| Inversão | Trocar preto/branco reflete a proporção contextual e inverte a ordem da paleta. |
| Técnicas | Definições reutilizáveis e instâncias configuráveis separadamente. |
| Saída das técnicas | Distribuição completa pelas N cores, com soma 1 por pixel avaliado. |
| Conflitos | Média ponderada das distribuições ou maior confiança individual. |
| Cor final | Uma cor discreta da paleta; sem mistura RGB intermédia. |
| Transformações | Espelhar/rodar altera a matriz original. |
| Documentos | Vários projetos independentes em separadores durante a sessão. |
| Histórico | Até 50 snapshots por documento; undo/redo não é partilhado entre separadores. |
| Persistência | Importar/exportar ficheiro local; sem autosave após fechar o browser. |
| Testes | TDD e regressões obrigatórias; Node, integração, contrato UI e Playwright. |

## Limitações conhecidas

- Um documento tem uma imagem-fonte e uma interpretação gerada; várias interpretações simultâneas dentro do mesmo projeto ainda não estão expostas.
- Os documentos abertos ficam em memória. O utilizador tem de exportar para os preservar após fechar/atualizar o browser.
- A personalização altera as cores existentes de um preset; não altera a quantidade de entradas.
- Não há ainda camadas, frames de animação nem importação direta de PNG/JPG ou ficheiros externos de paleta.

## Por decidir através de experiências

- Que escala e que kernel produzem resultados mais expressivos em média contextual?
- Quão forte deve ser a contribuição das linhas e da entropia?
- Que novas técnicas devem ser adicionadas primeiro: Hough, esqueletização, GLCM ou autocorrelação?
- Quando a fusão por pixel criar fragmentação, que otimização global oferece melhor resultado?
- Como apresentar várias interpretações geradas dentro de um mesmo projeto?
- Que estratégia de autosave evita perda de dados sem tornar difícil a recuperação de documentos?
- Que importadores de imagem e formatos de paleta oferecem maior valor para o projeto?

## Regra de evolução

Não escolher um algoritmo avançado apenas por ser conhecido ou matematicamente interessante. Adicionar uma técnica quando existir uma experiência visual que mostre o que ela acrescenta, testes para as suas propriedades e uma forma compreensível de configurar as suas instâncias.
