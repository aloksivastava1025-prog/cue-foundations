# One-shot sync for Cue Kit. Fetches latest free-tier rows from
# Cue's Supabase, regenerates the registry + previews, builds to
# verify nothing broke, then commits + pushes to main. Vercel
# picks up the push and deploys in ~3 min.
#
# Usage: double-click this file, OR from any PowerShell:
#   powershell -ExecutionPolicy Bypass -File C:\Users\Peeyush\cue-foundations\sync.ps1

$ErrorActionPreference = 'Stop'

Set-Location "C:\Users\Peeyush\cue-foundations"

Write-Host "==> Switching to Node 22..." -ForegroundColor Cyan
fnm use 22

Write-Host "==> Disabling TLS check for Supabase (Windows cert store gap)..." -ForegroundColor Cyan
$env:NODE_TLS_REJECT_UNAUTHORIZED = "0"

Write-Host "==> Running sync-kit..." -ForegroundColor Cyan
npm run sync-kit

Write-Host "`n==> Done. Vercel is deploying now; live in ~3 min at https://kit.cuedesign.space" -ForegroundColor Green
Read-Host "Press Enter to close"
