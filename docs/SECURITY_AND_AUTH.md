# Arquitetura de Segurança e Autenticação Futura

Este documento estabelece o modelo de ameaça, as defesas ativas implementadas no **Pixel Project** e o roteiro arquitetural para suporte futuro a contas de utilizador (incluindo autenticação com a Google e mecanismos modernos sem senhas).

---

## 1. Postura de Segurança e Modelo de Ameaça

O Pixel Project é uma aplicação **100% client-side (local-first)**. Todo o processamento de imagem, conversão contextual e manipulação de estado corre exclusivamente no browser ou na runtime local do utilizador.

### Vetores de Ameaça Mitigados

| Vetor de Risco | Risco Específico | Mitigação Implementada |
|---|---|---|
| **Prototype Pollution** | Ficheiros `.pixelproj` ou JSON maliciosos injetando propriedades em `Object.prototype` (`__proto__`, `constructor`, `prototype`). | `safeJsonParse` com reviver defensivo e `validateSafePayload` recursivo em `src/core/security.js`. |
| **Cross-Site Scripting (XSS)** | Execução de scripts arbitrários através de dados importados ou injeção de tags em nomes de projetos e técnicas. | Content-Security-Policy (CSP) estrita em `index.html` e higienização com `sanitizeText`. |
| **Abuso de Armazenamento Local** | Exceções de quota excedida, falhas em modo navegação anónima/privada ou corrupção de chaves. | Wrapper `createSafeStorage` com deteção de quota, isolamento por prefixo e fallback em memória volátil. |
| **Injeção de Caracteres de Controlo** | Injeção de caracteres de controlo ASCII (`\x00-\x1f`, `\x7f-\x9f`) para truncar ou falsear textos na UI. | Higienização automática com `sanitizeText` em `serializeProject` e `parseProject`. |

---

## 2. Content Security Policy (CSP)

A política de segurança de conteúdo está configurada em `index.html`:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' 'unsafe-inline' https://accounts.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' https://accounts.google.com https://oauth2.googleapis.com; frame-src https://accounts.google.com; object-src 'none'; base-uri 'self';"
/>
```

### Justificação das Diretivas

- **`default-src 'self'`**: Recursos não declarados explicitamente são restritos à mesma origem.
- **`object-src 'none'`**: Bloqueia completamente plugins arcaicos e vulneráveis (Flash, Java, Silverlight).
- **`img-src 'self' data: blob:`**: Permite a renderização de elementos canvas e imagens convertidas em data/blob URLs para exportação PNG/WebP.
- **`https://accounts.google.com` & `https://oauth2.googleapis.com`**: Reserva as permissões necessárias para o Google Identity Services (GIS) One Tap e fluxos OAuth 2.0 PKCE sem necessidade de quebrar a CSP no futuro.

---

## 3. Defesas em Código (`src/core/security.js`)

### Prevenção de Poluição de Protótipos

A função `safeJsonParse` inspeciona cada chave antes de a atribuir:

```javascript
export function safeJsonParse(text) {
  return JSON.parse(text, (key, value) => {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return undefined;
    }
    return value;
  });
}
```

A função `validateSafePayload` verifica de forma profunda objetos e arrays para garantir que nenhuma cadeia de protótipos modificada entra no fluxo de dados do editor.

### Higienização de Texto (`sanitizeText`)

Limpa caracteres de controlo ocultos, espaços redundantes e impõe comprimentos máximos para evitar DoS por exaustão de memória na interface:

```javascript
export function sanitizeText(input, maxLength = 120) {
  if (typeof input !== 'string') return '';
  const cleaned = input.replace(/[\x00-\x1f\x7f-\x9f]/g, '').trim();
  return cleaned.slice(0, maxLength);
}
```

---

## 4. Roteiro para Contas e Autenticação Futura

Para manter o compromisso de **custo zero**, **privacidade local-first** e **segurança máxima**, as contas de utilizador deverão seguir os seguintes padrões quando forem implementadas:

### A. Integração com Google Sign-In (Google Identity Services)

1. **Client-Side OAuth 2.0 com PKCE**:
   - Não requer backend nem servidor dedicado pago.
   - O browser obtém um ID Token JWT assinado pela Google (`https://accounts.google.com`).
   - A biblioteca oficial do Google Identity (`https://accounts.google.com/gsi/client`) é compatível com a CSP pré-configurada.
2. **Zero-Trust Token Management**:
   - Tokens de acesso devem ser efémeros (em memória na sessão da página).
   - O refresh token, se utilizado com backend serverless (ex.: Cloudflare Workers / Supabase Free Tier), deve usar cookies `HttpOnly; Secure; SameSite=Strict`.

### B. Passkeys e WebAuthn (Sem Senha)

- Substituição completa de senhas tradicionais pela API padrão do W3C **WebAuthn** / **FIDO2**.
- O utilizador autentica-se com biometria (Windows Hello, FaceID, TouchID ou chave física de segurança).
- Elimina totalmente riscos de phishing, ataques de dicionário e bases de dados de senhas vazadas.

### C. Sincronização na Nuvem com Encriptação Ponto-a-Ponto (E2EE)

- Se for adicionada sincronização em cloud (ex.: Google Drive API ou backend de sincronização gratuito), os ficheiros de projeto `.pixelproj` deverão ser cifrados **antes de sair do browser** com a **Web Crypto API**:
  - Algoritmo: **AES-GCM (256 bits)**.
  - Derivação de chave: **PBKDF2 / HKDF** a partir de uma passphrase do utilizador ou de credencial derivada da Passkey.
  - Desta forma, mesmo que a conta de armazenamento seja comprometida, as obras e matrizes de píxeis permanecem 100% privadas.
