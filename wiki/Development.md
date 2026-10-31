# Desenvolvimento e testes

## Organização

- `src/core/`: matrizes, desenho, transformações, histórico, documentos e formato do projeto.
- `src/engine/`: paletas, técnicas, propostas, resolvedores e conversão.
- `src/ui/`: geometria do Canvas e navegação.
- `tests/unit/`, `tests/integration/`, `tests/e2e/`: testes por camada.
- `docs/memory/`: decisões, gotchas, procedimentos e notas de sessão.
- `docs/REGRESSION_CATALOG.md`: catálogo de problemas conhecidos ligado a testes executáveis.

## Instalar dependências

```powershell
npm install
npx playwright install chromium
```

## Executar a suite

```powershell
npm test
npm run test:e2e
npm run test:all
```

## Regra de engenharia: test-first

Para cada bug ou comportamento novo:

1. Reproduzir o problema com um teste determinístico.
2. Confirmar RED: o teste falha pelo motivo esperado antes de alterar o código.
3. Implementar a correção mínima.
4. Confirmar GREEN no teste específico.
5. Executar `npm run test:all`.
6. Rever o diff e validar na GitHub Actions o SHA exato.
7. Registar a regressão em `docs/REGRESSION_CATALOG.md` e a aprendizagem duradoura em `docs/memory/`.

As instruções completas estão em [AGENTS.md](https://github.com/Siuo-Player/pixel-project/blob/main/AGENTS.md) e [TESTING_STRATEGY.md](https://github.com/Siuo-Player/pixel-project/blob/main/docs/TESTING_STRATEGY.md).
