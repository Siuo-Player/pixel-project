# Desenho técnico da primeira implementação

## 1. Arquitetura

A aplicação está separada em quatro partes:

1. **Core:** representação da fonte, operações matriciais e formato de projeto.
2. **Engine:** técnicas, instâncias, regras de transformação, propostas e resolução de conflitos.
3. **UI:** edição e apresentação em Canvas, sem conter lógica de conversão.
4. **Tests:** testes unitários, de integração e de contrato da interface.

## 2. Dados da imagem original

Cada célula usa um valor:
- 0: transparente;
- 1: preto;
- 2: branco.

A transparência não é uma cor e nunca recebe uma cor de saída. A matriz é guardada num Uint8Array.

## 3. Técnicas e instâncias

Uma definição de técnica é reutilizável. Uma instância contém identificador, parâmetros, peso, estado ativo e configuração própria. O utilizador pode adicionar várias instâncias da mesma técnica.

Técnicas atualmente implementadas:
- **Weighted neighbourhood:** calcula a proporção ponderada de branco numa janela e mapeia o resultado para uma rampa discreta de paleta.
- **Directional lines:** mede sequências contínuas da mesma cor em quatro eixos e usa esse sinal para modificar a distribuição contextual.
- **Local entropy:** calcula entropia binária local e ajusta o contraste contextual.

Cada técnica devolve uma proposta com uma distribuição completa pelas cores, uma máscara de pixels válidos e o peso da instância.

## 4. Fusão de propostas

O resolvedor tem dois modos:

- **Média ponderada:** calcula a média das distribuições de todas as instâncias que avaliam o pixel.
- **Maior confiança individual:** escolhe a distribuição individual com a maior probabilidade máxima, ajustada pelo peso da instância.

A saída escolhe sempre o índice de maior probabilidade. Não mistura canais RGB nem cria cores fora da paleta. Em caso de empate, o desempate depende da polaridade da fonte para preservar a inversão complementar.

## 5. Inversão complementar

A conversão é contextual. Inverter preto/branco na fonte reflete a característica de proporção de branco (m passa a 1-m) e deve refletir a saída na ordem inversa da paleta.

Para a rampa ordenada usada na primeira versão:
- a paleta define as cores em ordem de contexto preto → branco;
- a correspondência de inversão é a ordem inversa;
- a transparência permanece transparente.

Isto não equivale a mapear preto sempre para uma cor e branco sempre para outra. O contexto dos restantes pixels continua a determinar a cor.

## 6. Projeto e persistência

Um projeto contém a matriz original, paleta, modo de resolução e uma lista de saídas. Cada saída tem a própria paleta, modo de resolução e lista de instâncias de técnicas. O MVP mostra uma saída, mas a estrutura não assume uma única saída.

Os ficheiros .pixelproj são JSON versionado e preservam a origem e a configuração. A imagem convertida é recalculada ao abrir o projeto.

## 7. UI e Canvas

A imagem original e a interpretação são desenhadas em Canvas, com pixels nítidos e fundo axadrezado para indicar transparência.

A conversão da posição do ponteiro para coordenadas da grelha é uma função pura em src/ui/canvas-coordinates.js, testada com zoom e deslocação. O traço usa Bresenham para não deixar falhas durante movimentos rápidos.

Zoom e pan usam uma câmara partilhada. O layout automático divide os dois painéis pelo eixo maior da área de trabalho; os modos lado a lado e grelha também estão disponíveis.

## 8. Transformações da matriz

Espelhamento horizontal, espelhamento vertical e rotações de 90°, 180° e 270° alteram efetivamente a matriz original. Rotações de 90°/270° trocam largura e altura. As saídas são recalculadas depois da operação.

## 9. Executar e testar

- Node.js 20+
- npm start: servidor estático local na porta 4173.
- npm test: testes com Node's built-in test runner.
- GitHub Actions executa npm test em pushes e pull requests.

## 10. Evolução

As próximas técnicas podem ser adicionadas sem alterar a interface:
- linhas Hough/Radon;
- componentes, esqueletização, eixo medial e curvatura;
- GLCM, LBP, run-length e entropia;
- autocorrelação, Fourier e wavelets;
- resolução global por otimização de energia.

A especificação modular detalhada está em [MODULAR_TRANSFORMATION_ENGINE.md](MODULAR_TRANSFORMATION_ENGINE.md).
