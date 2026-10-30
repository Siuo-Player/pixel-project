# Requisitos do primeiro protótipo (MVP)

## 1. Objetivo

Construir a versão mínima que permita criar uma grelha, desenhar a preto/branco/apagar na imagem-fonte e observar uma interpretação colorida atualizar-se automaticamente.

## 2. Fluxo do utilizador

1. Abrir a aplicação.
2. Escolher largura e altura da arte.
3. Escolher quantidade de cores, paleta e regra de conversão.
4. Criar o projeto.
5. Ver a tela-fonte e uma tela convertida, ambas vazias.
6. Desenhar a preto ou branco, ou apagar.
7. Observar a conversão atualizar-se em tempo real.
8. Alterar a regra, os parâmetros ou a paleta no separador de conversão.
9. Espelhar ou rodar a arte quando necessário.
10. Exportar o projeto para um ficheiro e importá-lo posteriormente.

## 3. Requisitos funcionais

### Configuração inicial

- **MVP-F01:** permitir definir largura e altura antes de entrar no editor.
- **MVP-F02:** permitir escolher a quantidade de cores da paleta.
- **MVP-F03:** oferecer algumas paletas predefinidas.
- **MVP-F04:** permitir criar uma paleta personalizada com cores escolhidas pelo utilizador.
- **MVP-F05:** permitir selecionar uma regra/preset de conversão.
- **MVP-F06:** criar uma imagem-fonte e uma tela de interpretação com as mesmas dimensões lógicas.

### Desenho da imagem-fonte

- **MVP-F07:** disponibilizar preto, branco e apagar.
- **MVP-F08:** começar com todos os pixels transparentes.
- **MVP-F09:** permitir pintar com clique e arrastamento.
- **MVP-F10:** não deixar falhas no traço quando o ponteiro se move rapidamente.
- **MVP-F11:** terminar o traço corretamente quando o ponteiro é libertado ou cancelado, mesmo fora da tela.
- **MVP-F12:** impedir desenho direto na tela convertida.

### Conversão

- **MVP-F13:** recalcular o resultado quando a imagem-fonte muda.
- **MVP-F14:** recalcular o resultado quando a regra, parâmetros ou paleta mudam.
- **MVP-F15:** preservar todas as células transparentes como transparentes.
- **MVP-F16:** permitir que pixels-fonte pretos e brancos sejam mapeados para qualquer cor da paleta.
- **MVP-F17:** separar a lógica de conversão dos componentes da interface.
- **MVP-F18:** suportar pelo menos uma regra que analise pixels e vizinhos; a arquitetura permite regras de área com dimensões variáveis.
- **MVP-F19:** permitir que uma regra de área atribua um padrão de cores diferentes ou uma cor uniforme à área reconhecida.
- **MVP-F20:** aplicar prioridade absoluta à regra que reconhece a maior área; regras menores não substituem pixels já ocupados por essa regra.

### Navegação e apresentação

- **MVP-F21:** apresentar pixels sem blur ou interpolação indesejada.
- **MVP-F22:** suportar zoom e deslocação sincronizados nas telas.
- **MVP-F23:** manter o alinhamento espacial entre fonte e resultado quando a vista é ampliada ou deslocada.
- **MVP-F24:** adaptar automaticamente a disposição das telas à área de trabalho, preservando a proporção de cada imagem.
- **MVP-F25:** oferecer, além do modo automático, pelo menos uma disposição lado a lado e uma disposição em grelha.
- **MVP-F26:** suportar espelhamento horizontal, espelhamento vertical e rotação de 90°, 180° e 270° sobre os dados da imagem-fonte.
- **MVP-F27:** recalcular as interpretações depois de uma transformação dos dados; rotações de 90°/270° trocam largura e altura.

### Projetos e configurações

- **MVP-F28:** exportar e importar um ficheiro de projeto que contenha imagem-fonte, paletas e configuração de conversão.
- **MVP-F29:** guardar alterações de paleta e regra apenas no projeto atual.
- **MVP-F30:** estruturar os dados para várias saídas independentes, embora o MVP apresente apenas uma.

## 4. Critérios de aceitação

1. O utilizador cria uma grelha com dimensões escolhidas.
2. A imagem-fonte e a tela convertida começam transparentes.
3. Clique e arrastamento alteram os pixels corretos na fonte.
4. Preto, branco e apagar são estados distintos.
5. Os pixels transparentes continuam transparentes na saída.
6. A saída atualiza-se após alterações na fonte ou configuração.
7. Alterar a configuração não altera a imagem-fonte.
8. Regras por área podem gerar padrões internos de várias cores ou preenchimento uniforme.
9. A regra de maior área bloqueia regras menores quando há sobreposição.
10. Zoom e deslocação mantêm fonte e resultado alinhados.
11. O layout adapta-se ao tamanho disponível sem distorcer as imagens.
12. Espelhamento e rotação alteram a matriz da fonte e atualizam o resultado.
13. Um projeto exportado pode ser importado e recupera imagem e configuração.

## 5. Fora do âmbito do primeiro MVP

- Várias telas convertidas visíveis simultaneamente (a arquitetura fica preparada).
- Contas, autenticação e sincronização remota.
- Colaboração ou publicação de galerias.
- Edição direta do resultado convertido.
- Editor visual para criar algoritmos arbitrários.
- Modo de regras em camadas, em que regras maiores permitem refinamentos de regras menores.
- Simulação contínua de autómatos celulares.
- Camadas, animação e ferramentas avançadas de pixel art.
- Importação de imagens externas.

## 6. Nota de implementação

Os limites de tamanho de grelha, o conjunto inicial de paletas e o conjunto inicial de regras ainda precisam de ser escolhidos através de testes de desempenho e avaliação visual.
