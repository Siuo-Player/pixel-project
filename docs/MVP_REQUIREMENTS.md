# Requisitos do primeiro protótipo (MVP)

## 1. Objetivo

Construir a versão mínima que permita criar uma grelha, desenhar a preto e branco na tela esquerda e observar a conversão automática na tela direita, em tempo real.

O sucesso do MVP mede-se pela qualidade e fluidez desta experiência central — não pela quantidade de ferramentas de edição disponíveis.

## 2. Fluxo do utilizador

1. O utilizador abre a aplicação.
2. No ecrã inicial, escolhe a largura e a altura da arte.
3. Escolhe uma regra de conversão e uma paleta de saída, inicialmente através de presets.
4. Cria o projeto.
5. O editor apresenta duas telas vazias e transparentes.
6. O utilizador seleciona preto, branco ou borracha.
7. Ao pressionar o rato sobre um pixel da tela esquerda, esse pixel muda para o estado selecionado.
8. Enquanto mantém o botão pressionado e arrasta, os pixels atravessados são pintados.
9. Ao alterar a imagem-fonte, a tela direita é recalculada e atualizada automaticamente.
10. No separador de conversão, o utilizador pode trocar a regra, a paleta ou os parâmetros do projeto; a tela direita atualiza-se sem alterar a imagem-fonte.

## 3. Requisitos funcionais

### Configuração e criação

- **MVP-F01:** permitir definir a largura e a altura da grelha antes de entrar no editor.
- **MVP-F02:** permitir escolher uma regra de conversão inicial.
- **MVP-F03:** permitir escolher uma paleta de saída inicial.
- **MVP-F04:** criar duas telas com as mesmas dimensões lógicas.
- **MVP-F05:** iniciar ambas as telas vazias; a transparência deve ser visível através de um padrão de xadrez ou representação equivalente.

### Desenho da imagem-fonte

- **MVP-F06:** disponibilizar as ferramentas preto, branco e apagar.
- **MVP-F07:** permitir pintar um pixel com um clique/pressão.
- **MVP-F08:** permitir pintar continuamente ao arrastar com o botão pressionado.
- **MVP-F09:** terminar corretamente o traço quando o botão é libertado, mesmo que o ponteiro saia da área da tela.
- **MVP-F10:** impedir a edição direta da tela convertida.
- **MVP-F11:** converter a posição do ponteiro para a célula correta da grelha, independentemente do zoom visual ou da escala de apresentação.

### Conversão e apresentação

- **MVP-F12:** atualizar automaticamente o resultado quando a imagem-fonte muda.
- **MVP-F13:** usar a regra e a paleta atualmente selecionadas.
- **MVP-F14:** manter os pixels-fonte transparentes transparentes no resultado inicial, salvo se uma regra futura declarar explicitamente outro comportamento.
- **MVP-F15:** mostrar o resultado com pixels nítidos, sem interpolação que introduza cores intermédias.
- **MVP-F16:** permitir trocar a regra e a paleta dentro do editor.
- **MVP-F17:** aplicar as alterações de configuração apenas ao projeto atual.

## 4. Requisitos de interação

- A interface deve deixar claro qual a tela editável.
- A ferramenta ativa deve estar visualmente identificada.
- O cursor deve indicar a célula que será alterada, quando possível.
- Um traço contínuo não deve deixar buracos entre células quando o ponteiro se move rapidamente.
- O editor deve funcionar com rato e, por usar eventos de ponteiro, ficar preparado para suporte futuro de toque e caneta.
- A tela direita deve atualizar sem obrigar o utilizador a carregar num botão de conversão.

## 5. Critérios de aceitação

O MVP pode ser considerado funcional quando:

1. É possível criar uma grelha com dimensões escolhidas antes de entrar no editor.
2. As duas telas começam transparentes e apresentam a mesma grelha lógica.
3. Um clique na tela esquerda altera apenas o pixel correspondente.
4. Um arrastamento pinta todos os pixels atravessados pelo traço, sem depender de o botão voltar a ser pressionado.
5. Preto, branco e apagar produzem os três estados de entrada esperados.
6. A tela direita reage a cada alteração da tela esquerda.
7. Trocar de paleta ou regra altera a imagem convertida, mas não altera os dados da imagem-fonte.
8. A tela direita não aceita pintura direta.
9. Os pixels são apresentados sem blur ou mistura indesejada de cores.

## 6. Fora do âmbito do MVP

Ficam adiados:
- contas de utilizador, servidor e partilha online;
- galerias públicas e colaboração;
- camadas, seleção, preenchimento, texto e ferramentas avançadas;
- animação e simulação temporal contínua;
- edição manual da imagem convertida;
- importação de imagens externas;
- exportação para múltiplos formatos;
- histórico completo, undo/redo e autosave persistente (a decidir após validar o protótipo);
- editor visual para criar regras totalmente novas.

## 7. Nota sobre dimensões

As dimensões são definidas em pixels lógicos, não em pixels físicos do monitor. Os limites máximos e os tamanhos predefinidos ainda não estão fixados. Devem ser escolhidos depois de testar o custo de conversão e apresentação em grelhas de vários tamanhos.
