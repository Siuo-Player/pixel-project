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
- validação de paletas;
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
- ferramentas preto, branco e apagar;
- importação/exportação;
- escolha de layout e resolvedor.

### Testes de propriedades/invariantes

Verificam propriedades que devem ser sempre verdadeiras:
- transparência nunca recebe uma cor;
- probabilidades são finitas, não negativas e somam 1;
- saída contém apenas índices existentes na paleta;
- espelhar/rodar preserva o número de pixels e atualiza dimensões corretamente;
- inverter preto/branco reflete o resultado pela correspondência da paleta;
- as operações de inversão/rotação têm inversas esperadas.

## 3. Suite local

O projeto usa o test runner integrado no Node.js, sem dependências de teste externas.

~~~bash
npm test
~~~

O modo de desenvolvimento dos testes é:

~~~bash
npm run test:watch
~~~

## 4. Integração contínua

O workflow .github/workflows/ci.yml executa npm test:
- em cada push para main e para branches feat/**;
- em pull requests destinados à main.

Um commit não deve ser considerado concluído enquanto a suite falhar.

## 5. Registo de bugs e decisões

Cada bug deve originar:
- um teste com nome que descreve o comportamento;
- uma correção;
- confirmação de que o teste passa;
- nota no changelog quando a alteração for relevante.

Cada requisito indicado pelo utilizador que possa ser verificado automaticamente deve ter um teste. Para requisitos visuais ou subjetivos, criar testes de contrato, exemplos de referência ou procedimentos de validação manual, sem fingir que um teste numérico mede gosto artístico.

## 6. Evolução da qualidade

À medida que o motor crescer, acrescentar:
- testes baseados em propriedades e entradas aleatórias;
- testes de desempenho para várias dimensões;
- testes de regressão visual com imagens de referência;
- testes de acessibilidade e interação real no browser;
- fuzzing de ficheiros de projeto importados.

A suite atual é uma primeira base, não substitui testes visuais completos em diferentes browsers e dispositivos.
