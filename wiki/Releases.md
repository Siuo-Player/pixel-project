# Downloads e distribuição

## Aplicação web / PWA

A versão online está em https://siuo-player.github.io/pixel-project/. Podes instalá-la a partir do Chrome, Edge ou Safari, sem passar por uma loja e sem pagar.

## Executáveis desktop

Os builds desktop são publicados em [GitHub Releases](https://github.com/Siuo-Player/pixel-project/releases).

Para gerar os executáveis:

1. Abre o separador Actions do repositório.
2. Escolhe **Desktop release**.
3. Clica em **Run workflow**.
4. Usa a tag predefinida `desktop-latest` ou indica uma tag própria, por exemplo `desktop-v0.6.0`.
5. Aguarda os três builds e o job final de publicação.

O release inclui:
- Windows: executável portátil `.exe`.
- Linux: `.AppImage`.
- macOS: `.dmg`.

Cada ficheiro é acompanhado por um SHA-256. Em Windows, compara o hash publicado com:

```powershell
Get-FileHash ".\Pixel Project.exe" -Algorithm SHA256
```

Em Linux/macOS:

```bash
sha256sum "Pixel Project.AppImage"
# ou
shasum -a 256 "Pixel Project.dmg"
```

## Avisos de distribuição gratuita

Os executáveis não são assinados por certificado comercial nem notarizados pela Apple. O Windows pode apresentar o SmartScreen; no macOS, o Gatekeeper pode exigir que abras a app explicitamente pelas definições de segurança. Isso não significa, por si só, que o ficheiro esteja infetado: confirma sempre que o SHA-256 corresponde ao release.

No Linux, torna o AppImage executável:

```bash
chmod +x "Pixel Project.AppImage"
./Pixel\ Project.AppImage
```

A PWA continua a ser a opção mais simples, sem download de executável.

## Iniciar e descarregar pela linha de comandos

Com GitHub CLI autenticado e permissão para executar workflows:

```bash
# 1. Disparar a criação dos executáveis
gh workflow run desktop-release.yml --ref main -f tag=desktop-v0.6.0
gh run watch

# 2. Descarregar os executáveis publicados
gh release download desktop-v0.6.0
```

Para listar e descarregar apenas o executável Windows:

```bash
gh release download desktop-v0.6.0 --pattern "*.exe"
```
