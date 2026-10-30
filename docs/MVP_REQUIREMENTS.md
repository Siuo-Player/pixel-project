# Requisitos do primeiro protótipo (MVP)

## 1. Objetivo

Construir a versão mínima que permita criar uma grelha, desenhar a preto/branco/apagar na imagem-fonte e observar uma interpretação colorida atualizar-se automaticamente. O motor deve nascer modular, preparado para reconhecimento estrutural mais avançado.

## 2. Fluxo do utilizador

1. Abrir a aplicação.
2. Escolher largura e altura da arte.
3. Escolher quantidade de cores, paleta e regra de conversão.
4. Criar o projeto.
5. Ver a tela-fonte e uma tela convertida, ambas vazias.
6. Desenhar a preto ou branco, ou apagar.
7. Observar a conversão atualizar-se em tempo real.
8. Alterar regra, parâmetros ou paleta.
9. Espelhar ou rodar a arte quando necessário.
10. Exportar/importar o projeto.

## 3. Requisitos funcionais

### Configuração e desenho

- **MVP-F01:** definir largura e altura antes de entrar no editor.
- **MVP-F02:** escolher a quantidade de cores da paleta.
- **MVP-F03:** oferecer paletas predefinidas e criação de paletas personalizadas.
- **MVP-F04:** escolher uma regra/preset de conversão.
- **MVP-F05:** criar uma imagem-fonte e uma tela de interpretação com as mesmas dimensões lógicas.
- **MVP-F06:** disponibilizar preto, branco e apagar.
- **MVP-F07:** começar com pixels transparentes.
- **MVP-F08:** permitir pintar com clique e arrastamento, sem falhas em movimentos rápidos.
- **MVP-F09:** terminar corretamente o traço quando o ponteiro é libertado ou cancelado.
- **MVP-F10:** impedir desenho direto na tela convertida.

### Motor de conversão

- **MVP-F11:** recalcular quando a fonte ou configuração mudar.
- **MVP-F12:** preservar todas as células transparentes como transparentes.
- **MVP-F13:** permitir reinterpretar pixels pretos e brancos.
- **MVP-F14:** separar detetores, regras, propostas, paletas e resolvedor de conflitos da interface.
- **MVP-F15:** suportar pelo menos deteção direcional de linhas ou sequências longas da mesma cor.
- **MVP-F16:** estruturar o motor para suportar deteção de curvas, topologia e características estatísticas em fases seguintes.
- **MVP-F17:** não dar prioridade automática a uma proposta apenas por cobrir mais pixels.
- **MVP-F18:** suportar resolução determinística de conflitos entre propostas que abrangem o mesmo pixel.
- **MVP-F19:** assegurar simetria preto/branco em todas as regras disponibilizadas.
- **MVP-F20:** permitir que as regras produzam padrões de cores diferentes dentro de uma área.

### Navegação e transformações

- **MVP-F21:** apresentar pixels sem blur ou interpolação indesejada.
- **MVP-F22:** suportar zoom e deslocação sincronizados.
- **MVP-F23:** ajustar automaticamente as telas à área disponível sem distorcer as imagens.
- **MVP-F24:** oferecer layout automático, lado a lado e em grelha.
- **MVP-F25:** suportar espelhamento horizontal/vertical e rotação 90°, 180° e 270° sobre os dados da fonte.
- **MVP-F26:** recalcular as interpretações depois das transformações; rotações de 90°/270° trocam largura e altura.

### Projetos

- **MVP-F27:** exportar/importar um ficheiro de projeto com fonte, paletas, simetria, regras e parâmetros.
- **MVP-F28:** alterações de regra e paleta pertencem ao projeto atual.
- **MVP-F29:** estruturar dados para várias saídas independentes, embora o MVP apresente apenas uma.

## 4. Critérios de aceitação

1. Fonte e saída começam transparentes.
2. Clique e arrastamento alteram os pixels corretos.
3. Preto, branco e apagar são estados distintos.
4. A transparência mantém-se na saída.
5. A saída atualiza-se após alterações da fonte e da configuração.
6. Linhas/sequências do mesmo estado podem ser reconhecidas para além dos oito vizinhos diretos.
7. Conflitos entre propostas são resolvidos de forma determinística.
8. Trocar preto e branco na fonte produz o resultado simétrico esperado pela regra e pelos pares da paleta.
9. Zoom e deslocação mantêm alinhamento.
10. O layout adapta-se à janela sem distorção.
11. Espelhamento e rotação alteram a matriz da fonte e atualizam o resultado.
12. Um projeto exportado pode ser importado.

## 5. Fora do âmbito do primeiro MVP

- Várias interpretações visíveis simultaneamente (a estrutura fica preparada).
- Todas as famílias avançadas de detetores.
- Otimização global por graph cuts/CRF.
- Criação livre de regras por programação visual.
- Modo em camadas de regras.
- Aprendizagem automática e redes neuronais.
- Contas, autenticação, sincronização e colaboração.
- Animação, camadas e ferramentas avançadas de pixel art.

## 6. Desenvolvimento por etapas

A primeira implementação deve validar o editor, os dados e o contrato modular do motor. Depois adicionam-se detetores um a um, mantendo testes de simetria e de conflitos para cada nova regra.
