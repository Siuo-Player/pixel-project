# Requisitos do MVP — estado de implementação

## Implementado no primeiro protótipo

- Criar grelhas com largura/altura escolhidas (limites atuais: 4–256 por eixo e 65 536 pixels no total).
- Escolher paleta predefinida de 4 ou 8 cores.
- Personalizar as cores de uma paleta.
- Duas telas com a mesma grelha lógica: original editável e interpretação gerada.
- Ferramentas preto, branco e apagar.
- Pintura por clique e arrastamento, com interpolação Bresenham.
- Transparência preservada na conversão.
- Zoom e pan sincronizados.
- Espelhamento horizontal/vertical e rotação real da matriz.
- Três técnicas configuráveis: média contextual, linhas direcionais e entropia local.
- Instâncias repetidas da mesma técnica com parâmetros independentes.
- Propostas por pixel com distribuições completas pelas cores.
- Resolvedores média ponderada e maior confiança individual.
- Paleta discreta: a saída contém apenas cores da paleta.
- Importação/exportação do ficheiro .pixelproj.
- Testes unitários e de integração executados por GitHub Actions.

## Preparado na arquitetura, mas ainda não visível/implementado

- Várias telas convertidas no editor (modelo suporta várias saídas independentes).
- Técnicas Hough/Radon, esqueletização, topologia, GLCM/LBP, autocorrelação e Fourier.
- Modo de regras em camadas.
- Otimização global de coerência.
- Criador visual de regras avançadas.

## Critérios de aceitação verificados

1. As telas começam transparentes.
2. Preto, branco e apagar são estados distintos.
3. A pintura por arrastamento preenche as células entre eventos do ponteiro.
4. Transparência não é convertida em cor.
5. A conversão é contextual e pode usar mais do que um vizinho direto.
6. Diferentes técnicas podem concorrer pela cor do mesmo pixel.
7. Cada proposta válida distribui 100% da sua probabilidade pela paleta.
8. A fusão ponderada normaliza novamente as probabilidades.
9. A cor final é uma entrada discreta da paleta.
10. Inverter preto/branco reflete a interpretação pela ordem inversa da paleta.
11. Transformações da matriz preservam pixels e atualizam dimensões.
12. Exportação/importação preserva a fonte e as configurações.
13. Os testes locais e o CI devem passar.
