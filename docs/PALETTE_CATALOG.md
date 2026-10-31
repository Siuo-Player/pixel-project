# Catálogo de paletas do Pixel Project

## 1. Objetivo

A aplicação usa uma paleta discreta: cada pixel opaco da imagem convertida referencia uma entrada da paleta ativa. O número de entradas não é fixo no motor; é determinado por `palette.colors.length`.

O utilizador pode escolher cinco dimensões de paleta: **4, 8, 12, 16 ou 32 cores**. O catálogo atual contém **34 presets**.

| Número de cores | Presets | Uso típico |
|---:|---:|---|
| 4 | 10 | Rampas curtas, ícones e formas simples. |
| 8 | 8 | Sprites pequenos e maior separação tonal. |
| 12 | 6 | Variação cromática contextual moderada. |
| 16 | 6 | Sprites detalhados e sombreamento com mais níveis. |
| 32 | 4 | Rampa extensa e maior diversidade cromática. |
| **Total** | **34** | |

## 2. Presets incluídos

### 4 cores (10)
- Blue ↔ Red
- Grayscale 4
- Forest
- Twilight
- Sakura
- Desert
- Candy
- Ice & Fire
- Moss
- Warm Monochrome

### 8 cores (8)
- Retro 8
- Vaporwave
- Autumn
- Ocean
- Handheld Green
- Lavender
- Copper
- Tropical

### 12 cores (6)
- Aurora Borealis
- Ember
- Deep Sea
- Candy Shop
- Magma
- Meadow

### 16 cores (6)
- Pastel Dream
- Earth Tones
- Fantasy
- Neon Night
- Classic Arcade 16
- Meadow Garden 16

### 32 cores (4)
- Spectrum 32
- Terrain 32
- Arcade 32
- Oceanic 32

Os presets acima são paletas construídas para este projeto. A investigação em Lospec e nas paletas de ferramentas de pixel art serviu para identificar tamanhos e padrões de utilização; não se declara que estes presets sejam cópias ou versões oficiais de paletas externas.

## 3. Comportamento e invariantes

Cada preset contém:
- um identificador estável;
- um nome para a interface;
- uma lista de cores HEX `#RRGGBB`;
- uma correspondência de inversão `mirror`.

Para uma paleta com N cores, a correspondência atual é `mirror[i] = N - 1 - i`. É uma involução: inverter duas vezes recupera o índice original. Ao inverter preto e branco na imagem-fonte, o resultado esperado utiliza o índice espelhado. A transparência não participa neste mapeamento.

O catálogo é validado por testes que verificam:
- quantidade mínima de presets por tamanho;
- identificadores únicos dentro de cada família;
- número de entradas de cada preset;
- cores HEX válidas e sem duplicados dentro da mesma paleta;
- dimensão e reversão exata do mapeamento `mirror`;
- conversão efetiva e complementaridade para 16 e 32 cores.

## 4. Como escolher o tamanho

- **4 cores:** quando a legibilidade em escala muito pequena é prioritária.
- **8 cores:** quando é necessário separar mais estados sem uma paleta demasiado extensa.
- **12 cores:** opção intermédia para variação cromática.
- **16 cores:** para sprites com mais níveis de cor, sombras e destaques.
- **32 cores:** para maior variedade cromática e transições mais ricas.

Mais cores não garantem automaticamente melhor imagem. A distribuição espacial criada pelo motor, a qualidade do desenho-fonte e a escolha do preset continuam a ser determinantes. A comparação deve ser feita sobre o mesmo desenho-fonte e, sempre que possível, com as mesmas técnicas e parâmetros.

## 5. Personalização atual e limitações

O editor permite alterar a cor de cada entrada de um preset. Ainda não permite adicionar/remover entradas individualmente, importar um ficheiro de paleta externo, guardar presets criados como uma biblioteca própria ou editar a ordem de correspondência da inversão.

A mudança de tamanho no editor aplica o preset predefinido desse tamanho:
- 4 → Blue ↔ Red;
- 8 → Retro 8;
- 12 → Aurora Borealis;
- 16 → Pastel Dream;
- 32 → Spectrum 32.

É possível escolher outro preset da mesma dimensão imediatamente depois.

## 6. Referências externas usadas na investigação

- [Lospec Palette List](https://lospec.com/palette-list/) — biblioteca de paletas de pixel art com filtro por número de cores.
- [Lospec API](https://api.lospec.com/docs/) — documenta filtros `numberOfColors`, `minColors` e `maxColors`.
- [Aseprite — Color Mode](https://www.aseprite.com/docs/color-mode/) — descreve o modo Indexed, no qual cada pixel aponta para uma entrada da paleta; a documentação refere até 256 cores.
- [Aseprite — Color Bar](https://www.aseprite.org/docs/color-bar/) — explica a seleção e utilização das entradas da paleta.

Estas fontes justificam o modelo de paleta indexada e os tamanhos estudados. As cores e nomes dos presets do Pixel Project são definidos e mantidos neste repositório.
