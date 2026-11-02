# ADR-0002 — Identidade de Estúdio e Isolamento Criptográfico (Zero Blast Radius)

- **Estado:** Aceite (02-11-2026)
- **Contexto:** À medida que o Pixel Project ganha contas de utilizador e integração com a comunidade e outros jogos/serviços do ecossistema do estúdio (ex.: RedWar), a reutilização inadvertida de chaves, identificadores ou tokens em múltiplos projetos geraria risco de segurança em cadeia (*blast radius* alargado). O vazamento de uma base de dados num jogo poderia expor as contas do Pixel Project.
- **Decisão:**
  1. Adotar o princípio **Zero Blast Radius** através de **Pairwise Pseudonymous Subject Identifiers (PPID)** alinhados com o **OpenID Connect Core 1.0 (Secção 8)** e **NIST SP 800-63B**.
  2. Implementar o `StudioAuthClient` com `projectSlug: "pixel_project"`, garantindo que:
     $$\text{PlayerID}_{\text{PixelProject}} \neq \text{PlayerID}_{\text{OutroJogo}}$$
  3. Disponibilizar os 3 níveis híbridos de identidade:
     - **Convidado (Guest)**: anónimo, local-first (`px_guest_...`), zero fricção de entrada.
     - **Google OIDC**: identificador derivado sem contacto com palavras-passe e herança do 2FA da Google.
     - **Conta Dedicada Studio**: credencial de estúdio com isolamento estrito.
  4. Garantir a migração transparente e contínua de obras e amigos criados em modo Convidado para o perfil autenticado no momento do login.
  5. Adotar o teto defensivo de **64 KB por payload** e comparação em tempo constante (`constantTimeCompare`) contra timing attacks.
- **Consequências:** Isolamento total do ecossistema de jogos/apps. Mesmo que outro projeto do estúdio sofra intrusão, nenhuma credencial ou identificador do Pixel Project é comprometido.
- **Alternativas rejeitadas:**
  - Identificador global partilhado único em texto claro (rejeitado — violaria compartimentalização e segurança NIST/OWASP).
  - Obrigar registo antes de usar a app (rejeitado — violaria a filosofia local-first e sem atrito do projeto).
- **Referências:** `src/core/auth_client.js`, `src/core/security.js`, `src/core/community.js`, `docs/REGRESSION_CATALOG.md` (`PX-035`, `PX-036`).
