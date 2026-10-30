# Desenho técnico inicial

A arquitetura deve manter a aplicação web separada do motor modular de conversão. A especificação detalhada dos módulos, propostas, probabilidades, inversão complementar e fusão está em [MODULAR_TRANSFORMATION_ENGINE.md](MODULAR_TRANSFORMATION_ENGINE.md).

## 1. Camadas da aplicação

1. **Imagem-fonte:** matriz com transparente, preto e branco.
2. **Catálogo de técnicas:** definições reutilizáveis de detetores/caracterizadores.
3. **Instâncias de técnicas:** cópias configuradas independentemente de uma técnica.
4. **Regras de transformação:** mapeiam características para distribuições sobre a paleta.
5. **Resolvedor:** combina as distribuições pixel a pixel e escolhe uma cor discreta.
6. **Renderizador:** apresenta a imagem convertida sem alterar os dados.
7. **Interface:** permite desenhar, configurar, escolher paletas e visualizar saídas.

## 2. Contrato modular

Cada instância recebe a fonte, dimensões, máscara de transparência, parâmetros e configuração da regra de transformação. Devolve mapas de características e propostas por pixel. Não altera diretamente a fonte nem a imagem final.

O mesmo módulo pode ser instanciado várias vezes com parâmetros, máscaras, pesos e regras de transformação diferentes.

## 3. Fusão e cores

Cada instância que avalia um pixel deve devolver uma distribuição completa pelas cores da paleta, com soma igual a 1. Uma instância sem evidência pode abster-se nesse pixel.

O resolvedor inicial será uma média ponderada das distribuições; o pixel final recebe a cor com maior probabilidade. As probabilidades não são misturas RGB e não introduzem cores intermédias.

## 4. Inversão complementar

Trocar preto e branco deve refletir a interpretação contextual na paleta. O mapeamento não é uma correspondência fixa entre cada estado de entrada e uma cor de saída.

Para uma média contextual normalizada m, a inversão de todas as cores opacas produz 1-m. A paleta define quais as cores correspondentes sob essa reflexão. As técnicas devem declarar como as suas características se transformam sob inversão.

## 5. Resolução global

Depois da fusão por pixel, uma fase opcional poderá otimizar conjuntamente os rótulos de toda a imagem para reduzir fragmentação e preservar estruturas. Graph cuts e métodos de energia são candidatos, conforme a função de custo usada.

## 6. Matrizes e bibliotecas

Os dados são matrizes/arrays. Convoluções, filtros direcionais, histogramas, coocorrência, autocorrelação e transformadas operam naturalmente sobre matrizes. Esqueletização, topologia e otimização global também recebem matrizes, mas envolvem algoritmos iterativos ou grafos, não apenas multiplicação matricial.

Investigação: Python, NumPy, SciPy, scikit-image e OpenCV.  
Aplicação web: TypeScript, Vite e Canvas; WebAssembly/Workers se o desempenho justificar.

## 7. Estado e apresentação

Cada projeto contém a matriz-fonte e uma coleção de saídas independentes, cada uma com instâncias de técnicas, regras de transformação, paleta, correspondência de inversão e configuração do resolvedor.

A interface suporta zoom e deslocação sincronizados, disposição adaptável e transformações reais da matriz (espelhamento e rotação).
