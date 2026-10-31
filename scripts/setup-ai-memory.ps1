$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

if (-not (Get-Command opencode -ErrorAction SilentlyContinue)) {
    throw "Não encontrei o comando 'opencode'. Instala o OpenCode primeiro e volta a executar este script na mesma instalação Windows/WSL."
}

if (-not (Get-Command ai-memory -ErrorAction SilentlyContinue)) {
    Write-Host "A instalar ai-memory (binário oficial Windows, checksum verificado)..."
    irm https://github.com/akitaonrails/ai-memory/releases/latest/download/install.ps1 | iex
}

$installDirectory = Join-Path $env:LOCALAPPDATA "Programs\ai-memory"
$binary = Join-Path $installDirectory "ai-memory.exe"
if ((Test-Path $binary) -and -not (Get-Command ai-memory -ErrorAction SilentlyContinue)) {
    $env:PATH = "$installDirectory;$env:PATH"
}

if (-not (Get-Command ai-memory -ErrorAction SilentlyContinue)) {
    throw "ai-memory não está no PATH. Fecha e volta a abrir PowerShell; depois executa novamente scripts\setup-ai-memory.ps1."
}

function Invoke-AiMemoryCommand {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Arguments)
    & ai-memory @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "O comando ai-memory $($Arguments -join ' ') terminou com código $LASTEXITCODE."
    }
}

Write-Host "A configurar o servidor local, MCP, hooks e Agent Skills do OpenCode..."
Invoke-AiMemoryCommand setup --yes --agent opencode

Write-Host "A ativar captura em allowlist (só projetos com .ai-memory.toml)..."
Invoke-AiMemoryCommand install-hooks --agent opencode --apply --capture-mode allowlist

$projectMarker = Join-Path $repoRoot ".ai-memory.toml"
if (Test-Path $projectMarker) {
    Write-Host "O marcador .ai-memory.toml já existe; não será sobrescrito."
} else {
    Write-Host "A registar este repositório na allowlist..."
    Invoke-AiMemoryCommand project init
}

Write-Host "A verificar o estado e a configuração..."
Invoke-AiMemoryCommand status
Invoke-AiMemoryCommand doctor

Write-Host ""
Write-Host "Concluído. Reinicia o OpenCode para carregar o plugin/skills MCP atualizados."
Write-Host "A memória e as capturas são locais por omissão; não foi criada nenhuma chave de modelo paga."
