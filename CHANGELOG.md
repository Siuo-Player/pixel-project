## [0.4.0] - 2026-10-31

- Added independent document tabs, new/close document actions and return-to-home workflow.
- Added per-document undo/redo, including keyboard shortcuts.
- Added line, rectangle, filled rectangle, ellipse, flood-fill and eyedropper tools.
- Added palette-size switching (4/8/12) inside the editor.
- Added File, Edit and View menus.

# Histórico de alterações

## 2026-10-30 — Primeiro protótipo executável

- Criada a aplicação web local com ecrã de configuração e editor de duas telas.
- Implementadas ferramentas de desenho a preto, branco e apagar.
- Implementados Pointer Events, desenho por arrastamento e interpolação Bresenham.
- Implementados zoom e pan partilhados, auto layout, lado a lado e grelha.
- Implementados espelhamento horizontal/vertical e rotações reais da matriz.
- Implementadas paletas iniciais de 4 e 8 cores, incluindo personalização.
- Implementadas técnicas de média contextual, deteção direcional de linhas e entropia local.
- Implementadas instâncias independentes de técnicas e duas estratégias de resolução de propostas.
- Implementada exportação/importação local de projetos.
- Criados testes unitários, de integração e de contrato da UI.
- Adicionada GitHub Actions para executar a suite.
- Testes locais: 34 testes aprovados.

## 2026-10-30 — Motor modular e inversão contextual

- Formalizada a inversão complementar da paleta contextual.
- Separados detetores, instâncias, regras de transformação, propostas e resolvedor.

## 2026-10-30 — Documentação inicial

- Registadas visão, requisitos, desenho técnico e pesquisa de paletas.
## 0.2.0 — Browser automation and visual evidence

- Add Playwright end-to-end tests using Chromium to interact with the real editor.
- Capture PNG screenshots at important workflow checkpoints and attach them to the HTML report.
- Preserve trace, screenshot and video diagnostics when browser tests fail.
- Extend GitHub Actions to run browser tests and upload the evidence artifact.
- Add the Portuguese project requirements file.
## 0.2.1 — Desktop workspace layout regression

- Keep the automatic side-by-side canvas layout stable when the settings list grows.
- Constrain desktop editor panels to the viewport and allow the technique settings panel to scroll independently.
- Add a browser regression assertion for desktop canvas orientation and viewport overflow.
- Fix an off-screen accessibility label that extended the document height and created phantom desktop scrolling.

## 0.3.0 — Paletas de 12 cores e grelha real

- Alargado o seletor de dimensão de paleta para 4, 8 e 12 cores.
- Criadas 13 paletas predefinidas: seis de 4 cores, quatro de 8 cores e três de 12 cores.
- Mantida a correspondência complementar por inversão da ordem de todas as rampas.
- Substituído o checkerboard do viewport por fundo uniforme e transparência desenhada célula a célula dentro da matriz.
- Adicionado contorno explícito da grelha e indicação de que cada célula corresponde a um píxel editável.
- Acrescentados testes unitários, de contrato e de browser para paletas de 12 cores e representação da grelha.
