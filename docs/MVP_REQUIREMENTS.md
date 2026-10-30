# Requisitos do primeiro protótipo (MVP)

## Objetivo

Construir o editor inicial e um motor modular que demonstre como uma imagem transparente/preto/branco pode gerar uma interpretação de paleta discreta, atualizada automaticamente.

## Configuração e desenho

- **MVP-F01:** definir dimensões da grelha antes de entrar no editor.
- **MVP-F02:** escolher uma quantidade de cores e uma paleta predefinida ou personalizada.
- **MVP-F03:** escolher uma configuração inicial do motor.
- **MVP-F04:** apresentar uma tela-fonte e uma saída convertida.
- **MVP-F05:** disponibilizar preto, branco e apagar.
- **MVP-F06:** permitir clique e arrastamento sem falhas.
- **MVP-F07:** preservar transparência como ausência de pixel.
- **MVP-F08:** impedir edição direta da saída convertida.

## Motor modular

- **MVP-F09:** separar técnica/detetor, instância, regra de transformação e resolvedor.
- **MVP-F10:** permitir instâncias configuráveis independentemente; a arquitetura permite várias instâncias da mesma técnica.
- **MVP-F11:** permitir que uma instância emita características, deteções e propostas para pixels.
- **MVP-F12:** as propostas incluem distribuições completas sobre todas as cores da paleta, somando 1 por pixel.
- **MVP-F13:** permitir abstenção quando uma técnica não tem evidência para um pixel.
- **MVP-F14:** implementar pelo menos uma técnica contextual matricial (ex.: média ponderada por kernel), seguida de quantização para uma paleta discreta.
- **MVP-F15:** implementar pelo menos um detetor estrutural (ex.: continuidade direcional/linha).
- **MVP-F16:** combinar propostas por média ponderada de distribuições.
- **MVP-F17:** escolher sempre uma entrada da paleta; não misturar RGB para criar cores intermédias.
- **MVP-F18:** preservar transparência na saída.
- **MVP-F19:** suportar a inversão complementar preto/branco, com correspondência de cores definida pela paleta.

## Navegação e projeto

- **MVP-F20:** zoom/deslocação sincronizados e layout adaptável.
- **MVP-F21:** espelhamento horizontal/vertical e rotação real da matriz da fonte.
- **MVP-F22:** exportar/importar o projeto com fonte, paletas, instâncias, regras e pesos.
- **MVP-F23:** estruturar os dados para múltiplas saídas independentes, embora o primeiro editor apresente apenas uma.

## Critérios de aceitação

1. A fonte e a saída começam transparentes.
2. Pintar, arrastar e apagar funcionam corretamente.
3. A conversão usa o contexto e não apenas o valor isolado do pixel.
4. Uma média contextual consegue produzir níveis diferentes com uma paleta de 4 ou 8 cores.
5. Técnicas diferentes podem propor cores distintas para o mesmo pixel.
6. O resolvedor combina distribuições completas e escolhe uma cor da paleta.
7. Duas instâncias da mesma técnica com configurações diferentes podem produzir propostas distintas.
8. Inverter preto/branco reflete o resultado através da correspondência de paleta.
9. Nenhum pixel transparente recebe cor.
10. O projeto pode ser exportado e importado.

## Fora do âmbito inicial

- Todas as famílias de detetores avançados.
- Otimização global por graph cuts/CRF.
- Editor visual livre de regras.
- Contas, backend e colaboração.
- Múltiplas saídas visíveis simultaneamente (dados preparados).
