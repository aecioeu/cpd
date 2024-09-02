# Defina variáveis
$jarPath = "C:\CPDPrinter\qz-tray.jar"
$javaPath = "C:\Program Files\Java\jre1.8.0_45\bin\javaw.exe"  # Altere para o caminho correto do javaw.exe
$scriptPath = "C:\CPDPrinter\iniciar_qz_tray.ps1"
$serviceName = "CPDPrint"

# Criar a pasta de scripts se não existir
if (-not (Test-Path "C:\CPDPrinter")) {
    New-Item -ItemType Directory -Path "C:\CPDPrinter"
}

# Criar o script PowerShell que inicia o qz-tray.jar
$scriptContent = @"
Start-Process -FilePath `"$javaPath`" -ArgumentList `"-jar $jarPath`"
"@
Set-Content -Path $scriptPath -Value $scriptContent

# Verificar se o serviço já existe
$service = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
if ($service) {
    Write-Host "Serviço $serviceName já existe. Parando e removendo o serviço..."
    Stop-Service -Name $serviceName -Force
    sc.exe delete $serviceName
}

# Criar o serviço do Windows
Write-Host "Criando o serviço $serviceName..."
sc.exe create $serviceName binPath= "powershell -ExecutionPolicy Bypass -File $scriptPath" start= auto

# Iniciar o serviço
Write-Host "Iniciando o serviço $serviceName..."
Start-Service -Name $serviceName

Write-Host "Serviço $serviceName criado e iniciado com sucesso."
