# Requisitos do MVP — estado de implementação

Este documento distingue as funcionalidades existentes das que continuam planeadas. O estado corresponde ao código da aplicação, não apenas à visão futura.

## Implementado

### Projeto e documentos
- Criar grelhas com largura/altura escolhidas entre 4 e 256, com máximo de 65 536 células.
- Manter vários documentos independentes em separadores durante a sessão.
- Criar, alternar, retomar e fechar documentos; pedir confirmação quando há alterações por exportar.
- Importar ficheiros `.pixelproj` como um novo documento e exportar o documento ativo.
- Cada documento guarda em memória o projeto, até três interpretações, a câmara e o histórico.

### Desenho e navegação
- Tela-fonte editável com os estados transparente, preto e branco.
- Pincel, borracha, linha, retângulo, retângulo preenchido, elipse, elipse preenchida, balde de preenchimento e conta-gotas.
- Desenho por clique e arrastamento, com interpolação Bresenham.
- A ferramenta geométrica e a cor/estado de pintura podem ser alterados independentemente.
- Desfazer/refazer por documento, com limite de 50 snapshots.
- Espelhamento horizontal/vertical e rotação real da matriz.
- Zoom/pan sincronizados; layout automático, lado a lado, grelha e adaptação móvel.
- Fundo exterior uniforme e padrão de transparência alinhado com as células reais.

### Paletas e conversão
- 34 paletas predefinidas: 10 de 4 cores, 8 de 8, 6 de 12, 6 de 16 e 4 de 32 cores.
- Escolher o tamanho da paleta no ecrã inicial ou dentro do editor.
- Personalizar as entradas de cor de um preset.
- Sete técnicas: vizinhança ponderada, linhas direcionais, entropia local, maioria local, contraste sensível a arestas, gradiente direcional e dithering ordenado.
- Instâncias repetidas da mesma técnica com parâmetros e pesos independentes.
- Propostas com distribuições completas e três resolvedores: média ponderada, maior confiança individual e votação ponderada.
- Um projeto tem uma origem e até três interpretações; cada uma tem paleta, resolução, técnicas e resolvedor independentes.
- Redimensionamento nearest-neighbour por interpretação, sem alterar a grelha de origem.
- Saída limitada às entradas discretas da paleta.
- Inversão preto/branco complementar, com transparência preservada.

### Interface e qualidade
- Menus Ficheiro, Editar e Ver.
- Atalhos de teclado para documentos, histórico, exportação e ferramentas.
- Importação/exportação de projeto.
- Testes unitários, de integração, de contrato e end-to-end em Chromium.
- GitHub Actions executa as suites e publica evidências visuais.

## Preparado na arquitetura, mas ainda não implementado

- Gravação automática e recuperação dos documentos após reiniciar o browser.

- Camadas editáveis, com ordem, visibilidade e bloqueio.
- Animação por frames, pré-visualização e exportação GIF/spritesheet.
- Importação de PNG/JPG e conversão automática para a matriz do projeto.
- Importação/exportação direta de formatos externos de paleta (PAL, ASE, GPL, HEX).
- Ferramentas de seleção, recorte, copiar/colar, balde com tolerância e pincéis configuráveis.
- Técnicas Hough/Radon, esqueletização, topologia, GLCM/LBP, autocorrelação e Fourier.
- Regras em camadas, otimização global de coerência e editor visual de regras.

## Critérios de aceitação

1. Transparente, preto e branco são estados distintos.
2. A transparência nunca é convertida em cor.
3. As cinco dimensões suportadas no UI são 4, 8, 12, 16 e 32.
4. Cada família oferece várias paletas e todas as entradas são HEX de seis dígitos.
5. A inversão da fonte reflete o índice de cor pela correspondência inversa da paleta.
6. Cada técnica produz probabilidades finitas, não negativas e normalizadas para todas as cores.
7. A saída contém apenas índices válidos na paleta ativa.
8. Documentos diferentes mantêm grelhas, paletas, câmara e histórico independentes.
9. Undo/redo restaura snapshots sem partilhar buffers mutáveis.
10. Desenho por ferramentas geométricas e preenchimento respeita os limites da grelha.
11. Importação/exportação preserva a fonte e as configurações do projeto.
12. A seleção da tela mostra apenas as configurações dessa tela.
13. Uma alteração da paleta ou das técnicas de uma interpretação não altera as restantes.
14. A origem pode ter até três interpretações calculadas com parâmetros e resoluções diferentes.
15. Suites Node e Playwright passam localmente e no CI.
