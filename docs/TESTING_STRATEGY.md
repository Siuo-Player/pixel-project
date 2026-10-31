# Estratégia de testes e prevenção de regressões

## 1. Princípio obrigatório: test-first

Quando surge um bug, um erro observado ou uma nova exigência comportamental:

1. Escrever um teste que reproduza o comportamento atual ou formalize o comportamento exigido.
2. Executar o teste e confirmar que falha pelo motivo esperado (**RED**).
3. Corrigir a implementação.
4. Executar o teste isoladamente e confirmar que passa (**GREEN**).
5. Executar a suite completa.
6. Refatorar sem alterar o comportamento e voltar a executar os testes.
7. Guardar o teste no repositório como proteção permanente contra regressões.

Não remover um teste só porque a implementação atual não passa. Se o requisito mudar, alterar o teste com a decisão correspondente documentada.

## 2. Tipos de teste

### Testes unitários

Testam uma função ou módulo isolado:
- criação e validação da matriz;
- pintura de pixels e interpolação de linhas;
- espelhamento e rotação;
- transformação das coordenadas do ponteiro;
- validação das paletas, contagem de cores, identificadores e correspondência de inversão;
- conversão contextual para 16 e 32 cores, sem assumir buffers fixos de quatro valores por pixel;
- cálculo das distribuições de cada técnica;
- fusão de propostas e desempates.

### Testes de integração

Testam módulos em conjunto:
- fonte → técnicas → propostas → resolvedor → imagem final;
- exportação e importação de projetos;
- transformação da fonte e recálculo;
- servidor estático e recursos da aplicação.

### Testes de contrato da interface

Confirmam que controlos essenciais continuam presentes e com papéis acessíveis:
- tela editável versus tela gerada;
- ferramentas básicas e geométricas, preenchimento e conta-gotas;
- separadores independentes, criação/fecho de documentos e undo/redo por documento;
- escolha das cinco dimensões de paleta e quantidade de swatches;
- importação/exportação;
- escolha de layout e resolvedor.

### Testes end-to-end no browser

O Playwright executa a aplicação num Chromium real, iniciado automaticamente pelo `webServer` do `playwright.config.js`. Os testes simulam ações de utilizador através de cliques, seleção de controlos e eventos do rato.

O cenário principal verifica:
- abertura do ecrã inicial e criação de projeto;
- desenho real no Canvas a preto, branco e transparência;
- espelhamento e rotação da matriz, incluindo atualização das dimensões;
- alteração de técnicas, paleta, resolvedor, zoom e layout;
- seleção e renderização de paletas de 16 e 32 cores;
- limpeza da imagem;
- exportação e importação de um ficheiro de projeto;
- ausência de erros JavaScript na página.

Existe também uma verificação de viewport móvel e do fluxo vertical do editor.

### Testes de propriedades/invariantes

Verificam propriedades que devem ser sempre verdadeiras:
- transparência nunca recebe uma cor;
- probabilidades são finitas, não negativas e somam 1;
- saída contém apenas índices existentes na paleta;
- espelhar/rodar preserva o número de pixels e atualiza dimensões corretamente;
- inverter preto/branco reflete o resultado pela correspondência da paleta;
- as operações de inversão/rotação têm inversas esperadas.

## 3. Suite local

Instalar dependências JavaScript e o browser uma vez:

~~~bash
npm install
npx playwright install chromium
~~~

Testes unitários e de integração (Node.js):

~~~bash
npm test
~~~

Testes end-to-end (Chromium):

~~~bash
npm run test:e2e
~~~

Abrir o browser durante os testes:

~~~bash
npm run test:e2e:headed
~~~

Depurar interativamente:

~~~bash
npm run test:e2e:debug
~~~

Executar todas as suites:

~~~bash
npm run test:all
~~~

Abrir o relatório HTML:

~~~bash
npm run test:e2e:report
~~~

## 4. Evidência visual e diagnóstico

Cada etapa relevante do cenário end-to-end guarda uma captura PNG em `artifacts/screenshots/`. As imagens também são anexadas ao relatório Playwright.

Em caso de falha, o Playwright conserva screenshot, trace e vídeo em `artifacts/test-results/`. O trace pode ser aberto com:

~~~bash
npx playwright show-trace artifacts/test-results/<ficheiro-trace>.zip
~~~

Os artefactos gerados não devem ser adicionados ao Git: são evidência descartável de cada execução. A GitHub Actions carrega a pasta `artifacts/` como artefacto de workflow, incluindo as capturas e o relatório.

## 5. Integração contínua

O workflow `.github/workflows/ci.yml`:
- instala Node.js e as dependências;
- instala Chromium;
- executa `npm test`;
- executa `npm run test:e2e`;
- publica as capturas, o relatório e os diagnósticos, mesmo quando os testes falham.

O workflow é executado em pushes para `main` e branches `feat/**`, e em pull requests destinados à `main`.

Um commit não deve ser considerado concluído enquanto qualquer suite falhar.

## 6. Registo de bugs e decisões

Cada bug deve originar:
- um teste com nome que descreve o comportamento;
- uma correção;
- confirmação de que o teste passa;
- nota no changelog quando a alteração for relevante.

Cada requisito indicado pelo utilizador que possa ser verificado automaticamente deve ter um teste. Para requisitos visuais ou subjetivos, criar testes de contrato, exemplos de referência ou procedimentos de validação manual, sem fingir que um teste numérico mede gosto artístico.

## 7. Evolução da qualidade

À medida que o motor crescer, acrescentar:
- testes baseados em propriedades e entradas aleatórias;
- testes de desempenho para várias dimensões;
- regressões visuais com imagens de referência e comparação de pixels, quando o resultado puder ser determinístico;
- testes de acessibilidade;
- testes nos browsers Firefox e WebKit;
- fuzzing de ficheiros de projeto importados.

A suite automatizada melhora a cobertura, mas não substitui a avaliação artística e a verificação manual de diferentes dispositivos.


## 7. Testes da versão 0.6

A expansão do editor acrescenta regressões específicas para:
- seleção de ferramenta geométrica independente do estado de pintura;
- seleção contextual da fonte e de cada interpretação;
- máximo de três saídas e impossibilidade de remover a última;
- paletas, dimensões, técnicas e resolvedores independentes por saída;
- reamostragem nearest-neighbour e compatibilidade com projetos versão 1;
- distribuições válidas para as sete técnicas e votação ponderada;
- importação e conversão das quatro artes de exemplo incluídas no repositório.

Os testes das artes de exemplo importam o ficheiro com o mesmo parser usado pela aplicação e executam as três conversões. Assim, os exemplos não são apenas ficheiros de demonstração: são também fixtures de integração do motor.
