# Desenho técnico da aplicação

## 1. Arquitetura

A aplicação está separada em quatro partes:

1. **Core:** representação da fonte, operações matriciais, histórico, documentos e formato de projeto.
2. **Engine:** paletas, técnicas, instâncias, propostas, resolvedor e conversor.
3. **UI:** edição e apresentação em Canvas, menus e navegação; não contém as regras matemáticas de conversão.
4. **Tests:** testes unitários, de integração, de contrato e end-to-end.

## 2. Imagem original

Cada célula da origem usa um valor guardado num `Uint8Array`:
- 0: transparente;
- 1: preto;
- 2: branco.

A transparência não é uma cor e nunca recebe uma cor de saída. As células transparentes são apresentadas com um padrão alternado alinhado com a matriz real; o espaço fora da matriz tem fundo uniforme.

## 3. Paletas e dimensão dinâmica

O catálogo está em `src/engine/palettes.js`. Existem 34 presets distribuídos por cinco tamanhos:

| Número de cores | Presets |
|---:|---:|
| 4 | 10 |
| 8 | 8 |
| 12 | 6 |
| 16 | 6 |
| 32 | 4 |

Cada preset possui `id`, `name`, `colors` e `mirror`. Para N cores, a correspondência complementar usa `mirror[i] = N - 1 - i`.

O motor não deve assumir um número fixo de quatro cores:
- as técnicas alocam uma distribuição com `pixelCount * N` valores;
- as propostas declaram a dimensão `colorCount`;
- o resolvedor valida essa dimensão e calcula as probabilidades sobre N entradas;
- o resultado guarda o índice da cor em cada pixel;
- o desenho da imagem convertida resolve esse índice através da paleta ativa.

Os tamanhos 4/8/12/16/32 são opções de interface; a lógica do motor é parametrizada pelo comprimento real da paleta.

## 4. Técnicas e instâncias

Uma definição de técnica é reutilizável. Uma instância contém identificador, parâmetros, peso e estado ativo. O utilizador pode adicionar várias instâncias da mesma técnica.

Técnicas atualmente implementadas:
- **Weighted neighbourhood:** calcula a proporção ponderada de branco numa janela e mapeia o resultado para uma rampa discreta de paleta.
- **Directional lines:** mede sequências contínuas da mesma cor em quatro eixos e usa esse sinal para modificar a distribuição contextual.
- **Local entropy:** calcula entropia binária local e ajusta o contraste contextual.

Cada técnica devolve uma proposta com uma distribuição completa pelas N cores, uma máscara de pixels válidos, dimensões, `colorCount` e peso da instância.

## 5. Fusão de propostas

O resolvedor tem dois modos:

- **Média ponderada:** calcula a média das distribuições de todas as instâncias que avaliam o pixel.
- **Maior confiança individual:** escolhe a distribuição individual com a maior probabilidade máxima, ajustada pelo peso da instância.

A saída escolhe sempre o índice de maior probabilidade. Não mistura canais RGB nem cria cores fora da paleta. Em caso de empate, o desempate depende da polaridade da fonte para preservar a inversão complementar.

## 6. Inversão complementar

A conversão é contextual. Inverter preto/branco na fonte reflete a proporção de branco (`m` passa a `1-m`) e deve refletir a saída na ordem inversa da paleta.

Para qualquer tamanho N:
- a paleta define as cores em ordem de contexto;
- a correspondência de inversão é a ordem inversa;
- a transparência permanece transparente.

Isto não equivale a mapear preto sempre para uma cor e branco sempre para outra. O contexto dos restantes pixels continua a determinar a cor.

## 7. Projeto, documentos e persistência

Um ficheiro `.pixelproj` contém a matriz original, paleta, modo de resolução e uma lista de saídas. Cada saída tem a sua própria paleta, modo de resolução e lista de instâncias de técnicas. Atualmente, a interface apresenta uma saída por projeto.

A aplicação mantém um workspace em memória com vários documentos independentes. Cada documento guarda:
- objeto de projeto e matriz original;
- resultado convertido em cache;
- câmara (zoom e deslocação);
- ferramenta e estado de pintura selecionados;
- histórico de undo/redo.

O módulo `src/core/workspace.js` gere a criação, ativação e fecho dos documentos. `src/core/history.js` guarda snapshots da matriz; o limite atual é 50 estados por documento.

Importar um `.pixelproj` cria um novo separador. Exportar guarda apenas o documento ativo. Ainda não existe autosave do workspace no armazenamento local; fechar/atualizar o browser elimina os documentos não exportados.

## 8. Ferramentas de desenho

As ferramentas geométricas e o balde estão em `src/core/drawing-tools.js`:
- retângulo de contorno e preenchido;
- elipse de contorno e preenchida;
- flood fill de quatro vizinhos;
- linha de Bresenham (partilhada com o pincel ao arrastar).

A interface escolhe a ferramenta ativa, recolhe coordenadas através de `pointerToGrid` e aplica as operações à matriz da fonte. As ferramentas não podem pintar o espaço exterior ao retângulo da grelha.

## 9. UI e Canvas

A imagem original e a interpretação são desenhadas em Canvas, com pixels nítidos. `src/ui/canvas-coordinates.js` calcula a geometria de escala/offset e transforma o ponteiro em coordenadas da grelha; a função é pura e testada com zoom e deslocação.

Zoom e pan usam uma câmara partilhada pelas duas vistas do documento. O layout automático adapta-se ao espaço disponível; os modos lado a lado e grelha também estão disponíveis. Os controlos de paleta no editor atualizam imediatamente o projeto e recalculam a interpretação.

## 10. Executar e testar

- Node.js 20+
- `npm start`: servidor estático local na porta 4173.
- `npm test`: testes com o test runner integrado no Node.js.
- `npm run test:e2e`: Playwright/Chromium.
- `npm run test:all`: executa as suites Node e browser.
- GitHub Actions executa `npm test` e `npm run test:e2e` em pushes e pull requests.

## 11. Evolução técnica

Próximas evoluções possíveis:
- persistência automática do workspace;
- camadas e frames de animação;
- importação de PNG/JPG e formatos de paleta externos;
- linhas Hough/Radon;
- componentes, esqueletização, eixo medial e curvatura;
- GLCM, LBP, run-length e entropia;
- autocorrelação, Fourier e wavelets;
- resolução global por otimização de energia.

A especificação modular detalhada está em [MODULAR_TRANSFORMATION_ENGINE.md](MODULAR_TRANSFORMATION_ENGINE.md).


## 9. Uma origem, até três interpretações

Um projeto contém exatamente uma grelha `source` e entre uma e três entradas em `outputs`. Cada saída tem os seus próprios:
- `width` e `height`;
- `palette` com N cores e a sua correspondência complementar `mirror`;
- `techniques`, com instâncias, parâmetros, pesos e estado ativo;
- `resolverMode`.

`convertProject(project, outputId)` reamostra a matriz original para a dimensão pedida através de nearest-neighbour e só depois executa as técnicas dessa saída. A reamostragem não modifica `project.source`. A versão 2 do formato de projeto persiste as dimensões de cada saída; projetos versão 1 continuam a ser importados, herdando a dimensão da origem.

A interface cria dinamicamente os painéis de saída. A seleção de uma tela abre um inspector contextual; a seleção da origem mostra as dimensões e ações da origem, enquanto a seleção de uma saída apresenta apenas a configuração dessa interpretação. As saídas podem ser removidas, mas o projeto mantém sempre pelo menos uma.

## 10. Ferramentas de pintura

`selectedTool` e `paintState` são estados distintos. A ferramenta seleciona a operação geométrica (por exemplo, elipse preenchida); o estado de pintura seleciona preto, branco ou transparência. Assim, mudar a cor não desativa a ferramenta. O conta-gotas atualiza a cor de pintura e regressa à ferramenta previamente selecionada.

## 11. Técnicas implementadas

O catálogo tem sete técnicas:
- **Weighted neighbourhood:** média contextual com kernel espacial selecionável.
- **Directional lines:** deteção de sequências da mesma polaridade e comprimento máximo configurável.
- **Local entropy:** ajuste contextual do contraste pela entropia binária.
- **Local majority:** decisão suavizada baseada num limiar local.
- **Edge-aware contrast:** reforço adaptativo do contraste em regiões com transições frequentes.
- **Directional gradient:** ajuste contextual a partir de diferenças horizontais e verticais.
- **Ordered dithering:** quantização espacial com matriz Bayer 4×4.

## 12. Resolvedores

- **Weighted average:** média das distribuições de probabilidade, ponderada pela importância de cada instância.
- **Highest confidence:** seleciona a proposta individual com maior probabilidade máxima, ajustada pelo peso.
- **Weighted vote:** cada instância ativa vota na sua cor de maior probabilidade; o peso da instância determina a força do voto.
