# Decisões e questões em aberto

## Decisões implementadas

| Tema | Decisão atual |
|---|---|
| Fonte | Matriz com transparente, preto e branco. |
| Transparência | Permanece transparente; não é uma cor de paleta. |
| Conversão | Contextual; não existe mapeamento fixo preto/branco → duas cores. |
| Paleta | Rampa discreta, com 4 ou 8 cores nos presets iniciais. |
| Inversão | Trocar preto/branco reflete a proporção contextual e inverte a ordem da paleta. |
| Técnicas | Definições reutilizáveis e instâncias configuráveis separadamente. |
| Saída das técnicas | Distribuição completa pelas cores, com soma 1 por pixel avaliado. |
| Conflitos | Média ponderada das distribuições ou maior confiança individual. |
| Cor final | Uma cor discreta da paleta; sem mistura RGB intermédia. |
| Transformações | Espelhar/rodar altera a matriz original. |
| Persistência | Importar/exportar ficheiro local, sem conta. |
| Testes | TDD e testes de regressão obrigatórios. |

## Por decidir através de experiências

- Que escala e que kernel produzem resultados mais expressivos em média contextual?
- Quão forte deve ser a contribuição das linhas e da entropia?
- Que novas técnicas devem ser adicionadas primeiro: Hough, esqueletização, GLCM ou autocorrelação?
- Quando a fusão por pixel criar fragmentação, que otimização global oferece melhor resultado?
- Como apresentar várias saídas no mesmo espaço de trabalho?
- Que limites de dimensões e número de saídas mantêm a atualização em tempo real?

## Regra de evolução

Não escolher um algoritmo avançado apenas por ser conhecido ou matematicamente interessante. Adicionar uma técnica quando existir uma experiência visual que mostre o que ela acrescenta, testes para as suas propriedades e uma forma compreensível de configurar as suas instâncias.
