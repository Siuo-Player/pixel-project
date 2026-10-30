# Catálogo de técnicas avançadas

Este documento cataloga famílias de técnicas a experimentar: retas e continuidade direcional (Hough/Radon), curvas e esqueletização, componentes e topologia, GLCM/LBP/run-length, entropia, informação mútua, autocorrelação, Fourier e wavelets.

**A arquitetura modular, os contratos de entrada/saída, as instâncias reutilizáveis, a inversão contextual, as distribuições por cor e o resolvedor de conflitos estão agora definidos em [MODULAR_TRANSFORMATION_ENGINE.md](MODULAR_TRANSFORMATION_ENGINE.md).** Esse documento é a referência normativa para implementar as técnicas deste catálogo.

## 1. Famílias de detetores

- **Linhas:** perfis direcionais, sequência digital, Transformada de Hough e Transformada de Radon.
- **Curvas:** componentes conectadas, esqueletização, eixo medial, grafo de caminhos e curvatura discreta.
- **Geometria/topologia:** área, perímetro, proporção, excentricidade, convexidade, distância à fronteira, componentes e buracos.
- **Textura:** matriz GLCM, LBP e distribuição de comprimentos de sequência (*run-length*).
- **Informação:** entropia de Shannon, entropia condicional, informação mútua e surpresa.
- **Orientação/repetição:** tensor de estrutura, autocorrelação, Fourier e wavelets.

## 2. Exemplos de regras derivadas

| Nome | Deteção | Interpretação |
|---|---|---|
| Long Stroke | Segmento longo alinhado. | Identidade cromática para traços lineares. |
| Smooth Arc | Caminho com curvatura gradual. | Gradiente discreto ao longo do arco. |
| Corner/Junction | Extremidade, esquina ou ramificação. | Cor de acento para junções. |
| Ring/Loop | Caminho fechado ou região com buraco. | Cores distintas para aro/interior. |
| Thick Stroke | Eixo medial e distância à fronteira. | Diferenciar espessuras. |
| Directional Texture | Orientação dominante de padrões. | Paleta por orientação. |
| Repeating Motif | Periodicidade/autocorrelação. | Identificar ondas, grelhas ou tijolos. |
| Complex Region | Entropia e estrutura geométrica. | Atribuir cores a detalhe/complexidade. |
| Rare Motif | Surpresa estatística combinada com contexto. | Destacar padrões raros sem promover ruído automaticamente. |
| Shape Class | Medidas geométricas e topologia. | Distinguir formas compactas, alongadas, ocas ou ramificadas. |

## 3. Referências técnicas

- [OpenCV — Hough Line Transform](https://docs.opencv.org/4.x/d9/db0/tutorial_hough_lines.html)
- [scikit-image — Hough transforms](https://scikit-image.org/docs/stable/api/skimage.transform.html)
- [scikit-image — Medial axis](https://scikit-image.org/docs/stable/api/skimage.morphology.html)
- [scikit-image — Region measurements](https://scikit-image.org/docs/stable/api/skimage.measure.html)
- [scikit-image — Texture features](https://scikit-image.org/docs/stable/api/skimage.feature.html)
- [Haralick et al. (1973), texture features](https://doi.org/10.1109/TSMC.1973.4309314)
- [Equivariance in image representations](https://pmc.ncbi.nlm.nih.gov/articles/PMC6510825/)
- [Boykov, Veksler & Zabih (2001), graph cuts](https://doi.org/10.1109/34.969114)

Todas as técnicas devem ser implementadas como módulos reutilizáveis, não como condições especiais espalhadas pela interface.
