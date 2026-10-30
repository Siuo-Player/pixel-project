# Decisões e questões em aberto

## 1. Decisões acordadas

| ID | Tema | Decisão | Estado |
|---|---|---|---|
| D-001 | Fonte | Matriz com transparente, preto e branco. | Acordado |
| D-002 | Transparência | Não participa como uma cor e permanece transparente. | Acordado |
| D-003 | Paletas | O utilizador escolhe a quantidade, por exemplo 4 ou 8, e seleciona/cria a paleta. | Acordado |
| D-004 | Contexto | A cor de saída depende de vizinhanças e características, não de um mapeamento fixo preto/branco. | Acordado |
| D-005 | Inversão | Inverter preto/branco deve refletir o resultado nos papéis correspondentes da paleta. | Obrigatório |
| D-006 | Modularidade | Técnicas reutilizáveis podem ser instanciadas várias vezes com parâmetros diferentes. | Acordado |
| D-007 | Pipeline | Detetor/caracterizador → regra de transformação → propostas → resolvedor. | Acordado |
| D-008 | Conflitos | Cada proposta inclui uma distribuição completa de probabilidades pelas cores. | Acordado |
| D-009 | Fusão inicial | Média ponderada das distribuições, com pesos por instância. | Proposta inicial |
| D-010 | Cor final | Cada pixel usa exatamente uma cor da paleta; sem mistura RGB intermédia. | Acordado |
| D-011 | Matrizes | Técnicas operam sobre matrizes/arrays; nem todas são operações lineares ou uma única multiplicação matricial. | Acordado |
| D-012 | Otimização global | Considerar futuramente atribuição conjunta de cores para garantir coerência espacial/estrutural. | Ideia futura |
| D-013 | Saídas | Cada interpretação tem as suas instâncias, regras e paleta. | Acordado |

## 2. Inversão complementar

A inversão da fonte troca preto e branco, mas mantém transparência. A interpretação depende dos restantes pixels, pelo que não existe mapeamento fixo entre cada cor de origem e uma cor final.

Para uma característica contextual normalizada de proporção de branco, a inversão transforma m em 1-m. A paleta define a correspondência que reflete essa posição. Em geral, a condição é F(S(I)) = T(F(I)), onde T é uma permutação involutiva das cores/papéis da paleta.

A implementação deve testar esta propriedade para cada técnica, regra e resolvedor.

## 3. Perguntas para resolver quando forem necessárias

- Como devem ser geradas as probabilidades restantes quando uma regra declara uma cor preferida?
- Como calibrar pesos das instâncias com uma galeria de imagens de teste?
- Como definir correspondências de inversão para paletas sem ordem cromática?
- Quando a média ponderada criar fragmentação, qual a função de energia adequada?
- Que parâmetros avançados devem aparecer no editor de regras do utilizador?

## 4. Experiências prioritárias

1. Média contextual com paletas de cinzento, azul/vermelho e outras sequências emparelhadas.
2. Inversão preto/branco da mesma imagem e comparação da saída refletida.
3. Duplicar uma técnica com diferentes kernels, direções ou escalas.
4. Combinar duas instâncias que recomendam a mesma cor e uma que recomenda outra.
5. Testar propostas com distribuições completas em paletas de 2, 4 e 8 cores.
6. Comparar fusão independente por pixel com otimização global.
