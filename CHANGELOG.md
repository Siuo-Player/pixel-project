# Histórico de alterações

## 2026-10-30 — Motor modular e inversão contextual

- Corrigida a interpretação da inversão preto/branco: não é um mapeamento fixo por cor de origem; é uma reflexão contextual do resultado na paleta.
- Formalizada a média contextual normalizada, que passa de m para 1-m ao inverter preto/branco.
- Criado MODULAR_TRANSFORMATION_ENGINE.md.
- Separados detetores, instâncias, regras de transformação, propostas e resolvedor.
- Definido que a mesma técnica pode ser instanciada várias vezes com parâmetros e máscaras diferentes.
- Definidas distribuições completas de probabilidade por pixel, com soma 1, e pesos separados por instância.
- Clarificado o exemplo de fusão probabilística e a diferença entre contar preferências e combinar probabilidades.
- Garantido que a saída final escolhe uma cor discreta da paleta, sem misturas RGB intermédias.
- Explicada a otimização global como rotulagem conjunta para coerência espacial/estrutural.
- Atualizados README, desenho técnico, requisitos e decisões.
