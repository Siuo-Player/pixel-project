# Requisitos do primeiro protótipo (MVP)

## 1. Objetivo

Construir a versão mínima que permita criar uma grelha, desenhar a preto/branco/apagar na imagem-fonte e observar uma interpretação colorida atualizar-se automaticamente.

## 2. Fluxo do utilizador

1. Abrir a aplicação.
2. Escolher largura e altura da arte.
3. Escolher quantidade de cores, paleta e regra de conversão.
4. Criar o projeto.
5. Ver a imagem-fonte e uma tela convertida, ambas vazias.
6. Desenhar a preto ou branco, ou apagar.
7. Observar a conversão atualizar-se em tempo real.
8. Alterar a regra, os parâmetros ou a paleta no separador de conversão.
9. Exportar o projeto para um ficheiro e importá-lo posteriormente.

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
- **MVP-F18:** suportar pelo menos uma regra que analise pixels e vizinhos; a arquitetura deve permitir regras que analisem áreas de dimensões variáveis.

### Navegação e apresentação

- **MVP-F19:** apresentar pixels sem blur ou interpolação indesejada.
- **MVP-F20:** suportar zoom e deslocação sincronizados nas duas telas.
- **MVP-F21:** manter o alinhamento espacial entre fonte e resultado quando a vista é ampliada ou deslocada.
- **MVP-F22:** suportar inversão/viragem sincronizada da vista, depois de clarificado se a primeira versão precisa de espelhamento horizontal, vertical ou ambos.

### Projetos e configurações

- **MVP-F23:** exportar e importar um ficheiro de projeto que contenha a imagem-fonte, paletas e configuração de conversão.
- **MVP-F24:** guardar as alterações de paleta e regra apenas no projeto atual.
- **MVP-F25:** estruturar os dados para permitir várias saídas independentes no futuro, embora o MVP apresente apenas uma.

## 4. Critérios de aceitação

1. O utilizador cria uma grelha com dimensões escolhidas.
2. A imagem-fonte e a tela convertida começam transparentes.
3. Clique e arrastamento alteram os pixels corretos na fonte.
4. Preto, branco e apagar são estados distintos.
5. Os pixels transparentes continuam transparentes na saída.
6. A saída atualiza-se após alterações na fonte ou configuração.
7. Alterar a configuração não altera a imagem-fonte.
8. Zoom e deslocação mantêm fonte e resultado alinhados.
9. Um projeto exportado pode ser importado e recupera imagem e configuração.

## 5. Fora do âmbito do primeiro MVP

- Várias telas convertidas visíveis simultaneamente (a arquitetura fica preparada).
- Contas, autenticação e sincronização remota.
- Colaboração ou publicação de galerias.
- Edição direta do resultado convertido.
- Editor visual para criar algoritmos arbitrários.
- Simulação contínua de autómatos celulares.
- Camadas, animação e ferramentas avançadas de pixel art.
- Importação de imagens externas.

## 6. Nota de implementação

Os limites de tamanho de grelha, o conjunto inicial de paletas e o conjunto inicial de regras ainda precisam de ser escolhidos através de testes de desempenho e avaliação visual.
