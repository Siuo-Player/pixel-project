# Desenho técnico inicial

Este documento regista uma arquitetura proposta para o primeiro protótipo. Não é ainda uma decisão irreversível sobre framework ou biblioteca.

## 1. Modelo mental

A aplicação deve separar três coisas:

1. **Dados da imagem-fonte:** aquilo que o utilizador desenhou.
2. **Configuração de conversão:** a regra, a paleta e os parâmetros do projeto.
3. **Imagem convertida:** um resultado derivado, que pode ser recalculado sempre que os dados ou a configuração mudam.

A imagem convertida não deve ser usada como fonte para reconstruir o desenho original.

## 2. Estados da imagem-fonte

Cada célula da imagem-fonte tem um de três estados lógicos:

| Valor lógico | Significado |
|---|---|
| 0 | Transparente / vazio |
| 1 | Preto |
| 2 | Branco |

Há apenas duas cores de desenho, mas três estados porque apagar não é o mesmo que pintar de branco.

Do ponto de vista da informação, três estados precisam de pelo menos 2 bits por célula se forem compactados. Na implementação inicial é perfeitamente aceitável guardar um valor por célula num array de bytes; otimizar a memória só fará sentido se for necessário.

## 3. Paleta de saída e profundidade de cor

A paleta de saída é uma lista ordenada de cores. A regra de conversão escolhe um índice dessa lista para cada pixel convertido.

- 4 bits de índice permitem até 16 entradas de paleta.
- 8 bits de índice permitem até 256 entradas.
- Uma paleta pode ter menos entradas do que o limite máximo.

A transparência deve ser tratada como estado/canal próprio, não assumida automaticamente como uma cor visível da paleta. O formato exato de armazenamento e exportação será decidido mais tarde.

## 4. Conversor como função independente

A conversão deve ser implementada como uma função isolada da interface. Em termos conceptuais:

- recebe os dados da imagem-fonte;
- recebe a largura e a altura;
- recebe a configuração da regra;
- recebe a paleta;
- devolve uma grelha/imagem de saída.

A mesma entrada e a mesma configuração devem produzir o mesmo resultado para regras determinísticas.

Esta separação permite testar o algoritmo sem abrir o editor e trocar regras sem reescrever a lógica de desenho.

## 5. Estratégias de conversão a experimentar

### 5.1 Vizinhança inspirada em auto-tiling

Para cada célula, observar o estado da própria célula e dos vizinhos (por exemplo, os oito vizinhos de uma vizinhança 3×3).

A combinação local pode indicar se o pixel está:
- isolado;
- no interior de uma região;
- numa aresta;
- num canto;
- numa linha ou numa curva;
- junto de uma região de outra cor.

A regra pode usar essa classificação para escolher cores diferentes da paleta. Isto é semelhante à ideia de auto-tiling, mas não exige necessariamente sprites ou blocos gráficos pré-desenhados.

É uma boa primeira experiência porque é local, determinística e atualiza-se diretamente quando o utilizador pinta.

### 5.2 Regras inspiradas em autómatos celulares

Um autómato celular atualiza células com base nos estados dos vizinhos. O Jogo da Vida é um exemplo conhecido, mas as suas regras foram concebidas para simular vida, não para colorir uma imagem.

Neste projeto, estas ideias devem ser tratadas como experiências separadas: podem criar padrões, expandir ou suavizar regiões, mas também podem alterar a silhueta original. A imagem-fonte deve permanecer intacta e a experiência deve ser aplicada apenas ao resultado derivado.

Antes de implementar esta opção, será necessário decidir o significado de “célula viva” quando a entrada tem preto, branco e transparência, e se a simulação terá iterações ou será apenas uma regra local estática.

### 5.3 Mapeamento por padrões

Outra hipótese é identificar padrões locais da imagem-fonte e associá-los a cores ou combinações de cores. Uma tabela de regras pode ser editável posteriormente, permitindo que o utilizador crie estilos diferentes.

## 6. Arquitetura da interface proposta

- **Ecrã de criação:** dimensões, preset/regra de conversão e paleta.
- **Área de trabalho:** tela-fonte à esquerda, resultado à direita e ferramentas de desenho.
- **Separador de conversão:** seleção de regra, paleta e parâmetros do projeto atual.

A interface não deve guardar a lógica da conversão dentro dos componentes visuais. A tela apresenta os dados; o conversor calcula o resultado.

## 7. Desenho da interação com o ponteiro

É preferível usar a API de Pointer Events do navegador em vez de depender apenas de eventos de rato. Assim, a mesma lógica poderá futuramente suportar rato, toque e caneta.

Comportamento esperado:

1. Ao pressionar na tela-fonte, identificar a célula e aplicar a ferramenta ativa.
2. Capturar o ponteiro durante o traço, para continuar a receber eventos mesmo se sair da tela.
3. Ao mover enquanto a pressão está ativa, calcular as células atravessadas.
4. Ao libertar ou cancelar o ponteiro, terminar o traço.
5. Atualizar a imagem convertida quando os dados-fonte mudarem.

Para não deixar buracos em movimentos rápidos, deve ser considerado um algoritmo de interpolação entre a célula anterior e a nova célula (por exemplo, uma linha de Bresenham).

A posição do ponteiro deve ser convertida usando as dimensões visuais da tela e as dimensões lógicas da grelha. A escala de apresentação não pode alterar as coordenadas dos dados.

## 8. Apresentação gráfica

Uma opção inicial é usar HTML Canvas para desenhar ambas as telas. É adequado para apresentar grelhas de pixels sem criar um elemento HTML separado para cada célula.

A transparência pode ser indicada com um padrão de xadrez no fundo de apresentação; esse padrão é apenas visual e não faz parte dos dados da imagem.

A renderização deve preservar arestas nítidas e evitar suavização. A aplicação pode redesenhar o resultado quando há alterações, em vez de recalcular continuamente sem necessidade.

## 9. Stack sugerida

Uma opção simples para uma aplicação web local-first é:
- TypeScript para os dados e a lógica;
- Vite para iniciar o projeto e o servidor de desenvolvimento;
- HTML Canvas para as duas telas;
- testes unitários para o conversor.

Esta é uma recomendação inicial, não uma decisão final. A escolha deve ser confirmada quando começarmos a implementação.

## 10. Desempenho e evolução

No MVP, começar com conversão local e síncrona para manter a arquitetura simples. Se grelhas grandes ou regras mais pesadas causarem bloqueios na interface, o conversor poderá passar para um Web Worker.

A configuração deve pertencer ao projeto atual. Não é necessário criar backend ou contas para validar a experiência central.

## 11. Testes essenciais

- Uma grelha vazia deve gerar uma saída transparente.
- Um pixel preto ou branco deve produzir um resultado definido pela regra ativa.
- Pixels transparentes não devem ser confundidos com pixels brancos.
- Alterar a configuração deve recalcular a saída sem modificar a fonte.
- A mesma entrada e configuração determinística devem produzir a mesma saída.
- Coordenadas junto às margens devem mapear para células válidas, sem índices fora da grelha.
