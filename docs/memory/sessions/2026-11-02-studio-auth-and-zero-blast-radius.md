# Sessão: 2026-11-02 — Studio Auth, Zero Blast Radius e Salvaguardas Criptográficas

## Contexto & Objetivos
- O utilizador partilhou o Guia Canónico de Arquitetura de Segurança e Decisões de Identidade do estúdio (estabelecido no ecossistema do RedWar).
- O objetivo foi importar os princípios universais para o Pixel Project:
  1. **Zero Blast Radius**: Pairwise Pseudonymous Subject Identifiers (PPID) com `projectSlug: "pixel_project"`.
  2. **Três Níveis de Identidade**: Convidado anónimo, Google OIDC (sem senhas, com 2FA herdado da Google) e Conta Dedicada Studio.
  3. **Migração Transparente de Obras**: Obras e amigos guardados em modo Convidado são preservados ao conectar conta.
  4. **Proteção Contra Timing Attacks e DoS**: Comparação de credenciais em tempo constante (`constantTimeCompare`) e teto de payload de 64 KB (`enforcePayloadSizeLimit`).

## O Que Foi Feito
1. **Registo de Decisão de Arquitetura (ADR):**
   - Criado `docs/memory/decisions/0002-zero-blast-radius-and-studio-identity.md`.
2. **Núcleo de Autenticação e Segurança:**
   - Adicionadas `constantTimeCompare` e `enforcePayloadSizeLimit` em `src/core/security.js`.
   - Criado `src/core/auth_client.js` (`StudioAuthClient`) para o Pixel Project com prefixo isolado `px_`.
   - Atualizado `src/core/community.js` com suporte a migração de sessão e teto de 64 KB no salvamento de arte.
3. **Interface de Utilizador:**
   - Adicionado painel de autenticação no diálogo `#account-dialog` (`index.html`, `src/styles.css`).
   - Adicionados botões para ligar com Google OIDC, criar/entrar em Conta Studio e terminar sessão em `src/main.js`.
4. **Testes (Test-First):**
   - Criado `tests/unit/auth_client.test.js` (6 testes unitários).
   - Adicionado teste E2E em `tests/e2e/community.spec.js` validando upgrade de conta e preservação de biblioteca.
   - Registadas regressões `PX-035` e `PX-036` em `docs/REGRESSION_CATALOG.md`.

## Verificação
- `npm test`: 100/100 testes unitários aprovados.
- `npm run test:e2e`: 21/21 testes E2E aprovados.
- `npm run test:all`: 121/121 testes aprovados sem falhas.
