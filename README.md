# Pixel Project

Um editor experimental de pixel art com uma imagem-fonte a preto e branco e uma ou mais interpretações coloridas geradas automaticamente.

A ideia central é desenhar com duas cores de entrada e observar como diferentes regras estruturais e paletas conseguem reinterpretar a mesma imagem.

## Conceito

- **Imagem-fonte:** pixels transparentes, pretos ou brancos.
- **Conversão:** reconhecimento de retas, curvas, regiões, topologia, texturas, padrões e estatísticas de informação.
- **Simetria:** trocar preto e branco não pode introduzir enviesamento no motor.
- **Conflitos:** regras produzem propostas; um resolvedor combina evidência quando várias regras disputam o mesmo pixel.
- **Saídas:** cada interpretação tem as suas próprias regras e paleta.
- **Paletas:** o utilizador escolhe a quantidade de cores, seleciona presets ou cria paletas personalizadas.
- **Visualização:** telas com layout adaptável, zoom e deslocação sincronizados.

## Documentação

- [Visão do produto](docs/PRODUCT_VISION.md)
- [Requisitos do MVP](docs/MVP_REQUIREMENTS.md)
- [Desenho técnico](docs/TECHNICAL_DESIGN.md)
- [Teoria das cores e regras derivadas](docs/COLOR_THEORY_AND_RULES.md)
- [Motor de reconhecimento, regras avançadas e conflitos](docs/ADVANCED_RULES_AND_ENGINE.md)
- [Pesquisa inicial sobre paletas](docs/COLOR_PALETTE_RESEARCH.md)
- [Decisões e questões](docs/DECISIONS_AND_QUESTIONS.md)
- [Histórico de alterações](CHANGELOG.md)

## Investigação e aplicação

A investigação de algoritmos pode usar Python, NumPy, SciPy, scikit-image e OpenCV. A aplicação web poderá usar TypeScript, Canvas e, quando necessário, WebAssembly. O motor deve permanecer independente da interface.

## Estado atual

**Fase: documentação e desenho técnico.** Ainda não existe aplicação implementada. As famílias de algoritmos são candidatas a testar, não funcionalidades já concluídas.
