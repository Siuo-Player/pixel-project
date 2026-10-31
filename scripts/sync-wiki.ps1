param(
    [string]$Remote = "https://github.com/Siuo-Player/pixel-project.wiki.git"
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$sourceDirectory = Join-Path $repoRoot "wiki"

if (-not (Test-Path (Join-Path $sourceDirectory "Home.md"))) {
    throw "Não encontrei wiki/Home.md. Executa este script a partir de um clone do Pixel Project."
}

$tempDirectory = Join-Path ([System.IO.Path]::GetTempPath()) ("pixel-project-wiki-" + [guid]::NewGuid().ToString("N"))
$wikiDirectory = Join-Path $tempDirectory "wiki"

try {
    New-Item -ItemType Directory -Path $tempDirectory -Force | Out-Null
    Write-Host "A clonar a Wiki do GitHub..."
    git clone $Remote $wikiDirectory
    if ($LASTEXITCODE -ne 0) {
        throw "Não foi possível clonar a Wiki. Se ainda não houver páginas, abre https://github.com/Siuo-Player/pixel-project/wiki/_new e cria a primeira. Se já estiver inicializada, confirma a autenticação Git local e volta a executar este script."
    }

    Write-Host "A sincronizar páginas Markdown..."
    Get-ChildItem -Path $sourceDirectory -Force | ForEach-Object {
        Copy-Item -Path $_.FullName -Destination $wikiDirectory -Recurse -Force
    }

    git -C $wikiDirectory add --all
    if ($LASTEXITCODE -ne 0) { throw "git add falhou." }

    git -C $wikiDirectory diff --cached --quiet
    if ($LASTEXITCODE -eq 0) {
        Write-Host "A Wiki já está atualizada."
        return
    }

    git -C $wikiDirectory commit -m "docs: sync versioned project wiki"
    if ($LASTEXITCODE -ne 0) { throw "git commit falhou. Confirma git config user.name e user.email." }

    git -C $wikiDirectory push origin HEAD
    if ($LASTEXITCODE -ne 0) { throw "git push falhou. Confirma a autenticação GitHub no Git local." }

    Write-Host "Wiki publicada: https://github.com/Siuo-Player/pixel-project/wiki"
}
finally {
    if (Test-Path $tempDirectory) {
        Remove-Item -Path $tempDirectory -Recurse -Force
    }
}
