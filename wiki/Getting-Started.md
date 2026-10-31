# Instalar e começar a usar

## Usar online

Abre [Pixel Project](https://siuo-player.github.io/pixel-project/). Não é necessário criar conta, instalar Node.js ou iniciar um servidor.

## Instalar como aplicação

A partir do site:

- **Windows, macOS e Linux:** no Chrome ou Edge, usa o ícone Instalar na barra de endereço.
- **Android:** menu do browser → Adicionar ao ecrã principal.
- **iPhone/iPad:** Safari → Partilhar → Adicionar ao ecrã principal.

A primeira abertura precisa de rede. Depois de a aplicação e os recursos serem guardados pelo service worker, a shell principal pode abrir offline.

## Abrir um projeto de exemplo

1. Abre o editor.
2. Escolhe Importar.
3. Seleciona um ficheiro `.pixelproj` da pasta [examples](https://github.com/Siuo-Player/pixel-project/tree/main/examples).
4. Clica numa tela para ajustar a respetiva configuração.

Cada projeto de exemplo contém uma origem e até três interpretações.

## Executar a partir do código-fonte

Requisitos: Node.js 20 ou superior e npm.

```powershell
git clone https://github.com/Siuo-Player/pixel-project.git
cd pixel-project
npm install
npm start
```

Abre http://localhost:4173.
