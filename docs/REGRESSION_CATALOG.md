# Catálogo de regressões e falhas conhecidas

Este catálogo é a memória verificável dos problemas encontrados no Pixel Project. Cada linha liga um comportamento importante a um teste que já existe no repositório. O teste é a proteção; este documento torna fácil descobrir onde está essa proteção.

**Regra:** um bug novo só fica encerrado quando o teste de regressão está no catálogo e passa na CI. Não removas um registo porque a implementação atual funciona.

> O histórico abaixo foi reconstruído a partir dos relatos e das execuções de desenvolvimento disponíveis até 31-10-2026. Quando um relato antigo não está disponível com detalhe suficiente, não se inventa uma causa: regista-se apenas o comportamento que conseguimos verificar.

## Regressões da aplicação e invariantes

| ID | Origem | Comportamento que não pode regressar | Teste de regressão | Nível |
|---|---|---|---|---|
| PX-001 | Bug relatado pelo utilizador | Mudar a cor de desenho não pode desativar a ferramenta de retângulo ou elipse selecionada. | `tests/e2e/multi-output.spec.js` — `shape tools retain their mode when the user changes the paint colour` | E2E |
| PX-002 | Problema de coordenadas corrigido durante o desenvolvimento | O ponteiro deve selecionar o píxel correto com a grelha centrada, zoom e deslocação. | `tests/unit/canvas-coordinates.test.js` — `pointer coordinates map to the correct pixel after centering, zoom and pan` | Unitário |
| PX-003 | Invariante de interação | Cliques fora da área real da arte devem ser ignorados. | `tests/unit/canvas-coordinates.test.js` — `pointer positions outside the artwork are ignored` | Unitário |
| PX-004 | Invariante de validação | Geometria inválida do Canvas não pode produzir índices de píxel inválidos. | `tests/unit/canvas-coordinates.test.js` — `invalid canvas geometry is rejected instead of producing invalid pixel indexes` | Unitário |
| PX-005 | Compatibilidade com projetos antigos | Projetos de versão 1 devem continuar a importar e preencher as dimensões em falta das saídas. | `tests/unit/multi-output-project.test.js` — `version 1 project files remain importable and receive output dimensions` | Unitário |
| PX-006 | Falha de compatibilidade corrigida durante CI | Um projeto legado com uma grelha inferior a 4×4 não pode ser rejeitado apenas porque a criação de projetos novos começa em 4×4. | `tests/unit/multi-output-project.test.js` — `legacy version 1 projects preserve source and output dimensions below the new-project minimum` | Unitário |
| PX-007 | Requisito de múltiplas interpretações | Cada interpretação tem de manter paleta, resolução e técnicas independentes; as definições apresentadas têm de corresponder ao Canvas selecionado. | `tests/e2e/multi-output.spec.js` — `one original supports three independently configurable interpretations` | E2E |
| PX-008 | Limite estrutural do projeto | Um projeto pode ter no máximo três interpretações. | `tests/unit/multi-output-project.test.js` — `a project supports up to three independent outputs with their own palettes, resolutions and techniques` | Unitário |
| PX-009 | Proteção de integridade do projeto | Não é permitido remover a última interpretação; importar/exportar não pode perder as restantes. | `tests/unit/multi-output-project.test.js` — `multi-output projects round-trip and removing an output never removes the last one` | Unitário |
| PX-010 | Independência de dimensões | Saídas que seguem a fonte acompanham as suas dimensões; saídas personalizadas mantêm as próprias dimensões. | `tests/unit/multi-output-project.test.js` — `source-following outputs resize with source transforms while custom outputs remain independent` | Unitário |
| PX-011 | Falha de sincronização corrigida durante desenvolvimento/CI | As dimensões da fonte e de uma saída que a segue devem atualizar ao rodar, desfazer e refazer. | `tests/e2e/multi-output.spec.js` — `source-following output dimensions stay synchronized through rotate, undo and redo` | E2E |
| PX-012 | Pipeline de transformação | Rodar uma matriz não quadrada deve atualizar dimensões e manter a conversão coerente com a nova fonte. | `tests/integration/project-pipeline.test.js` — `rotating the source matrix changes dimensions and project conversion follows it` | Integração |
| PX-013 | Segurança do servidor local | O servidor estático não pode expor ficheiros fora da raiz da aplicação através de caminhos manipulados. | `tests/integration/static-app.test.js` — `static server does not expose paths outside the application root` | Integração |
| PX-014 | Invariante do motor | Píxeis transparentes não entram nas médias contextuais nem recebem propostas de cor. | `tests/unit/engine.test.js` — `transparent pixels are excluded from contextual averages and never receive a proposal` | Unitário |
| PX-015 | Invariante numérico do motor | Distribuições de proposta têm de somar 1, sem valores negativos, infinitos ou NaN. | `tests/unit/engine.test.js` — `every proposal distribution sums to one and contains no negative or non-finite values` | Unitário |
| PX-016 | Integridade dos ficheiros de exemplo | Todos os projetos de exemplo têm de importar e converter as três interpretações independentes. | `tests/unit/examples.test.js` — `every bundled pixel-art example imports with three independent and convertible interpretations` | Unitário |
| PX-017 | Ferramentas de desenho | Linha, retângulo e elipse devem alterar a matriz real, incluindo os modos preenchidos. | `tests/e2e/editor.spec.js` — `shape tools draw lines and filled rectangles and ellipses on the actual source matrix` | E2E |
| PX-018 | Validação de importação | Versões não suportadas e estados inválidos da fonte devem ser rejeitados explicitamente. | `tests/integration/project-pipeline.test.js` — `project import rejects unsupported versions and invalid source states` | Integração |
| PX-019 | Integridade do catálogo de técnicas | O catálogo deve carregar sem erros de sintaxe e expor as técnicas adicionais esperadas. | `tests/unit/advanced-techniques.test.js` — `catalog exposes four additional, conceptually distinct calculation techniques` | Unitário |
| PX-020 | Independência entre documentos | Desenhos de separadores diferentes não podem contaminar-se; undo/redo tem de atuar no documento correto. | `tests/e2e/editor.spec.js` — `multiple document tabs keep independent drawings and support undo/redo and editor palette sizing` | E2E |

## Falhas nos próprios testes ou contratos

Nem todas as falhas de CI significam que o utilizador encontrou um bug na aplicação. Os testes também podem ficar desatualizados ou testar um detalhe errado.

| ID | Origem | Comportamento que não pode regressar | Teste de regressão | Nível |
|---|---|---|---|---|
| PX-021 | Contrato de teste corrigido durante CI | O contrato da interface deve distinguir o Canvas original dos Canvas gerados sem assumir que existe sempre um único Canvas de saída estático. | `tests/integration/ui-contract.test.js` — `editor exposes the original and generated canvases with distinct roles` | Contrato |
| PX-022 | Teste E2E estabilizado durante CI | Os testes de desenho devem calcular os pontos a partir da grelha real, não de coordenadas fixas do viewport. | `tests/e2e/editor.spec.js` — `shape tools draw lines and filled rectangles and ellipses on the actual source matrix` | E2E |
| PX-023 | Lacuna de validação encontrada na auditoria pós-PR #7 | Projetos importados com payload não-objeto ou `resolverMode` desconhecido têm de ser rejeitados no parse, antes de o documento entrar no workspace. | `tests/unit/multi-output-project.test.js` — `project import rejects malformed payloads and unknown resolver modes` | Unitário |
| PX-024 | Bug confirmado pela revisão automática GLM | O histórico de undo/redo é isolado por aba: desfazer numa aba nunca restaura um snapshot desenhado noutra aba. | `tests/e2e/editor.spec.js` — `undo and redo history stays isolated per document tab` | E2E |
| PX-025 | Bug confirmado pela revisão automática GLM | O handler de `#editor-palette` tolera ids que não são preset (paleta personalizada) sem exceção e sem alterar a paleta atual. | `tests/e2e/editor.spec.js` — `selecting the custom palette option keeps the current palette without page errors` | E2E |
| PX-026 | Bug confirmado pela revisão automática GLM | Refazer uma redimensionação da fonte volta a sincronizar os inputs de largura/altura com as dimensões ativas. | `tests/e2e/editor.spec.js` — `redo keeps the dimension inputs in sync after undoing a source resize` | E2E |
| PX-027 | Bug confirmado pela revisão automática GLM, violação de PX-010 | Redimensionar a fonte só atualiza as saídas que seguem a fonte (`followsSourceSize`); saídas com dimensão própria mantêm-se, mesmo que coincidam com o tamanho antigo. | `tests/e2e/multi-output.spec.js` — `resizing the source keeps custom-sized outputs independent` | E2E |
| PX-028 | Falha de CI descoberta no primeiro push do workflow desktop | Nenhum YAML de `.github/workflows/*.yml` pode ter um valor não citado com `": "` embutido (ex.: `ex.: desktop-v0.6.0`); o Actions rejeita o ficheiro e cria um run fantasma falhado em cada push. | `tests/unit/workflows-lint.test.js` — `every workflow YAML value is quoted or free of bare ": " sequences` | Unitário |

## Como adicionar uma entrada

1. Confirma o relato e cria uma reprodução mínima.
2. Escreve e executa o teste antes da correção; regista o resultado RED.
3. Corrige o comportamento e confirma GREEN, seguido de `npm run test:all`.
4. Acrescenta a linha seguinte disponível (`PX-023`, depois `PX-024`, etc.), apontando para o caminho e o nome exato do teste.
5. Não apagues entradas antigas. Se o requisito mudar, documenta a decisão e atualiza o teste com ela.

Os testes de contrato em `tests/unit/engineering-workflow-contract.test.js` verificam que os ficheiros de processo existem e que cada linha aponta para um teste real com esse nome.
