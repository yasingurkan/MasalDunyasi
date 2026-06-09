# Zamanlanmis masal onarimi — Gorev Zamanlayici tarafindan calistirilir.
# Docker'i bekler, DB'yi baslatir, ONLY_PROBLEMATIC=1 rewrite'i kosar, loglar.
$ErrorActionPreference = "Continue"
Set-Location "C:\Projects\MasalDunyasi"
$log = "C:\Projects\MasalDunyasi\.scheduled-repair.log"
"=== Onarim basladi: $(Get-Date -Format s) ===" | Out-File $log -Encoding utf8

# 1) Docker daemon hazir mi? Degilse Docker Desktop'i baslat ve bekle (en cok 5 dk)
docker info *> $null
if ($LASTEXITCODE -ne 0) {
    Start-Process "$env:ProgramFiles\Docker\Docker\Docker Desktop.exe"
    $deadline = (Get-Date).AddMinutes(5)
    do {
        Start-Sleep -Seconds 5
        docker info *> $null
    } until ($LASTEXITCODE -eq 0 -or (Get-Date) -gt $deadline)
}
docker info *> $null
if ($LASTEXITCODE -ne 0) { "Docker baslatilamadi, cikiliyor." | Out-File $log -Append -Encoding utf8; exit 1 }

# 2) DB container'i ayakta ve saglikli olana kadar bekle
docker compose up -d db 2>&1 | Out-File $log -Append -Encoding utf8
$deadline = (Get-Date).AddMinutes(2)
do {
    Start-Sleep -Seconds 3
    docker compose exec -T db pg_isready -U masaluser *> $null
} until ($LASTEXITCODE -eq 0 -or (Get-Date) -gt $deadline)

# 3) Onarimi calistir (bozuk masallari tarar ve yeniden yazar)
$env:DATABASE_URL = ((Get-Content .env | Where-Object { $_ -match "^DATABASE_URL=" }) -replace '^DATABASE_URL=','' -replace '"','')
$env:ONLY_PROBLEMATIC = "1"
npx ts-node --project tsconfig.seed.json scripts/rewrite-all-stories.ts 2>&1 | Out-File $log -Append -Encoding utf8

# 4) Duzeltilen masallari production (Neon/Vercel) DB'ye senkronla
"--- Prod senkronu basliyor ---" | Out-File $log -Append -Encoding utf8
Remove-Item Env:ONLY_PROBLEMATIC -ErrorAction SilentlyContinue
npx ts-node --project tsconfig.seed.json scripts/sync-stories-prod.ts 2>&1 | Out-File $log -Append -Encoding utf8

"=== Onarim + senkron bitti: $(Get-Date -Format s) ===" | Out-File $log -Append -Encoding utf8
