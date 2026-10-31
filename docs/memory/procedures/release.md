# Procedimento — Release

1. Confirmar que `npm run test:all` passa localmente.
2. Confirmar que a GitHub Actions está verde no SHA exato a lançar.
3. Atualizar a versão em `package.json` e o `BUILD` em `index.html` (rodapé).
4. Atualizar `CHANGELOG.md`.
5. Criar tag anotada `vX.Y.Z` e publicar release no GitHub.
6. Para a app instalável (PWA), regenerar o service worker e o manifest antes do deploy.
