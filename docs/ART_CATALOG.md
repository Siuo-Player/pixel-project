# Catálogo de Demonstração de Arte — Antigravity (Google DeepMind)

Este catálogo reúne a coleção de pixel art autoral concebida e desenvolvida por **Antigravity (Google DeepMind)** como demonstração de referência para o motor de conversão contextual do **Pixel Project**.

Cada obra foi desenhada originalmente sob a restrição fundamental do projeto — **apenas preto, branco e transparência na matriz de origem** — acompanhada por **três interpretações coloridas independentes**, calculadas a partir de técnicas combinadas (vizinhança ponderada, dithering ordenado, deteção de arestas, maioria local e gradientes).

---

## Índice das Obras

1. [Farol ao anoitecer (Lighthouse at Dusk)](#1-farol-ao-anoitecer)
2. [Gato sob a lua (Moonlit Cat)](#2-gato-sob-a-lua)
3. [Bosque dos cogumelos (Mushroom Grove)](#3-bosque-dos-cogumelos)
4. [Templo no deserto (Desert Temple)](#4-templo-no-deserto)

---

## 1. Farol ao anoitecer

* **Identificador:** `lighthouse-at-dusk`
* **Autor:** **Antigravity (Google DeepMind)**
* **Dimensões de origem:** 40×40 píxeis
* **Ficheiro de projeto:** [examples/lighthouse-at-dusk.pixelproj](examples/lighthouse-at-dusk.pixelproj)

### Descrição Conceitual
A obra retrata a solidão monumental de um farol costeiro erguido sobre rochedos atlânticos, rodeado pela arrebentação das ondas e por um céu poente salpicado de estrelas. O feixe de luz corta a escuridão, criando um contraste dramático entre a solidez geométrica da torre e a fluidez orgânica das vagas marítimas.

### Interpretações Disponíveis
* **Interpretação 1 (Mar clássico):** 40×40 píxeis, paleta `Ocean` (8 cores). Vizinhança gaussiana combinada com linhas direcionais para enfatizar as correntes marítimas.
* **Interpretação 2 (Bruma pixelizada):** 24×24 píxeis, paleta `Aurora Borealis` (12 cores). Dithering ordenado com votação ponderada, produzindo granulação atmosférica retro.
* **Interpretação 3 (Luz cinematográfica):** 64×64 píxeis, paleta `Spectrum 32` (32 cores). Reamostragem ampliada com máxima confiança sobre entropia local e gradientes, simulando difusão volumétrica de luz.

### Inspirações e Citações Artísticas
* **Paul Signac (1863–1935):** Em particular as obras pontilhistas marinhas como *Concarneau, Calme du soir (Opus 220, 1891)*, pioneiras na ilusão de gradiente contínuo através da justa-posição de pontos de cores puras, o antecessor histórico direto do *dithering* digital.
* **Brandon James Greer:** Estudos modernos de iluminação em grelha reduzida (*Pixel Art Lighting & Atmospheric Dithering*, 2020), especificamente a técnica de escalonamento tonal em objetos cilíndricos e reflexos especulares na água.
* **Deluxe Paint IV & Commodore Amiga:** A paleta clássica de 32 cores e a tradição dos ilustradores da *demoscene* europeia dos anos 90.

---

## 2. Gato sob a lua

* **Identificador:** `moonlit-cat`
* **Autor:** **Antigravity (Google DeepMind)**
* **Dimensões de origem:** 48×36 píxeis
* **Ficheiro de projeto:** [examples/moonlit-cat.pixelproj](examples/moonlit-cat.pixelproj)

### Descrição Conceitual
Um gato preto repousa numa varanda rústica de telhado tradicional japonês, de costas para o observador, contemplando uma enorme lua cheia envolvida por nuvens translúcidas e constelações distantes. A curva sinuosa da cauda e a postura atenta das orelhas capturam um instante de contemplação e serenidade noturna.

### Interpretações Disponíveis
* **Interpretação 1 (Sonho pastel):** 48×36 píxeis, paleta `Pastel Dream` (16 cores). Média ponderada entre vizinhança suave e maioria local, gerando transições aveludadas entre céu e silhueta.
* **Interpretação 2 (Arcade noturno):** 24×18 píxeis, paleta `Vaporwave` (8 cores). Resolução reduzida com padrão dither vincado e linhas direcionais.
* **Interpretação 3 (Neon de 32 cores):** 48×36 píxeis, paleta `Arcade 32` (32 cores). Destaque de arestas afiadas (`edge-aware`) e gradiente radial de iluminação lunar.

### Inspirações e Citações Artísticas
* **Takahashi Shōtei / Hiroaki (1871–1945):** Mestre do movimento *Shin-hanga*, autor da lendária estampa *Cat in the Moonlight (1927)*. A utilização expressiva da silhueta escura contra o disco lunar resplandecente foi a principal referência para o equilíbrio de massa e espaço negativo desta obra.
* **Studio Ghibli / Hayao Miyazaki:** A estética poética e o tratamento da penumbra nos cenários noturnos urbanos de *Kiki's Delivery Service (Majo no Takkyūbin, 1989)*.
* **Yuriy Gusev ("Fool"):** Referência contemporânea em pixel art pelo domínio exemplar de *sub-pixel shifting* e texturas com economia estrita de tons.

---

## 3. Bosque dos cogumelos

* **Identificador:** `mushroom-grove`
* **Autor:** **Antigravity (Google DeepMind)**
* **Dimensões de origem:** 40×40 píxeis
* **Ficheiro de projeto:** [examples/mushroom-grove.pixelproj](examples/mushroom-grove.pixelproj)

### Descrição Conceitual
Uma clareira encantada num bosque milenar, onde cogumelos gigantes com chapéus manchados convivem com folhagens e troncos cobertos de musgo. Esporos e partículas de pólen flutuam suavemente no ar, sugerindo uma atmosfera viva, húmida e intocada pelo homem.

### Interpretações Disponíveis
* **Interpretação 1 (Bosque vivo):** 40×40 píxeis, paleta `Meadow` (12 cores). Realce de entropia local e vizinhança para preservar os pequenos detalhes dos esporos.
* **Interpretação 2 (Conto minimalista):** 20×20 píxeis, paleta `Forest` (4 cores). Estilo portátil com votação de maioria local rígida para criar formas sólidas legíveis em micro-ecrãs.
* **Interpretação 3 (Textura natural):** 40×40 píxeis, paleta `Terrain 32` (32 cores). Dithering e realce de bordos sobre uma vasta rampa de terras, sebes e líquenes.

### Inspirações e Citações Artísticas
* **Mark Ferrari:** Artista pioneiro da LucasArts (*The Secret of Monkey Island*, *Loom*, 1990) e mestre das técnicas de *Color Cycling* e texturas orgânicas em 8 bits. A sua abordagem à renderização de cascas de árvores e folhagem através de clusters pontilhados guiou a matriz dos cogumelos e raízes.
* **Hayao Miyazaki:** O ecossistema vegetal da Floresta Tóxica de *Nausicaä of the Valley of the Wind (Kaze no Tani no Naushika, 1984)*.
* **Richard "DawnBringer" Fhager:** Criador das célebres paletas `DB16` e `DB32` no PixelJoint, referência nos critérios de harmonia espectral e relações de contraste.

---

## 4. Templo no deserto

* **Identificador:** `desert-temple`
* **Autor:** **Antigravity (Google DeepMind)**
* **Dimensões de origem:** 48×40 píxeis
* **Ficheiro de projeto:** [examples/desert-temple.pixelproj](examples/desert-temple.pixelproj)

### Descrição Conceitual
As ruínas colossais de um templo esculpido em arenito erguem-se contra o calor inclemente de um deserto árido. Cactos delineiam o horizonte em primeiro plano, enquanto colunatas clássicas e nichos profundos projetam sombras angulares sobre dunas esculpidas pelo vento.

### Interpretações Disponíveis
* **Interpretação 1 (Areia antiga):** 48×40 píxeis, paleta `Earth Tones` (16 cores). Ponderação por distância inversa e gradientes contínuos de calor desértico.
* **Interpretação 2 (Magma ao pôr do sol):** 24×20 píxeis, paleta `Magma` (12 cores). Votação ponderada com dithering para emular o reflexo ardente do sol no arenito.
* **Interpretação 3 (Cartucho arcade):** 48×40 píxeis, paleta `Classic Arcade 16` (16 cores). Tons vivos e linhas contrastadas evocando os jogos de plataforma e aventura do início dos anos 90.

### Inspirações e Citações Artísticas
* **Jordan Mechner:** Criador do lendário *Prince of Persia (1989)*. A arquitetura austera, os arcos pontiagudos e os ritmos de colunas foram inspirados na precisão minimalista dos palácios persas do jogo original para Apple II e DOS.
* **Sir David Lean (1908–1991):** Diretor de *Lawrence of Arabia (1962)*, cuja cinematografia pioneira de Freddie Young captou a miragem do calor e as sombras límpidas da areia sob sol a pino.
* **Arne Niklas Jansson ("Android Arts"):** Ensaios e paletas Famicube dedicadas a jogos retro e composições desérticas.

---

## Como Abrir e Experimentar no Editor

Todas as quatro obras estão **embutidas diretamente no editor** do Pixel Project:
1. No **ecrã inicial**, clica sobre qualquer um dos cartões na secção **"Projetos de exemplo"**.
2. No **editor**, clica em **Ficheiro → Projetos de exemplo…** ou abre a aba **Comunidade** para explorar o perfil `@antigravity`.
3. Alternativamente, podes importar diretamente os ficheiros fonte correspondentes a partir da pasta [examples/](examples/).
