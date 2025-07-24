# VS Code Performance Optimization Script
# Chạy script này khi VS Code bị lag

Write-Host "🚀 VS Code Performance Optimization" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# 1. Clear VS Code temporary files
Write-Host "1. Clearing VS Code temporary files..." -ForegroundColor Yellow
$vscodeTemp = "$env:TEMP\vscode-*"
Get-ChildItem $env:TEMP -Filter "vscode-*" -Force -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "   ✅ Cleared temporary files" -ForegroundColor Green

# 2. Clear Node.js cache
Write-Host "2. Clearing Node.js cache..." -ForegroundColor Yellow
npm cache clean --force 2>$null
Write-Host "   ✅ Cleared Node.js cache" -ForegroundColor Green

# 3. Clear Java compilation cache
Write-Host "3. Clearing Java compilation cache..." -ForegroundColor Yellow
$backendTarget = "C:\Aptech\7. PRJ4\new-project\TOEIC\backend\target"
if (Test-Path $backendTarget) {
    Remove-Item $backendTarget -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   ✅ Cleared Java target directory" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Java target directory not found" -ForegroundColor Yellow
}

# 4. Check current memory usage
Write-Host "4. Current memory usage:" -ForegroundColor Yellow
$totalMem = (Get-CimInstance Win32_OperatingSystem).TotalVisibleMemorySize / 1KB
$freeMem = (Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory / 1KB
$usedMem = $totalMem - $freeMem
$memUsagePercent = [math]::Round(($usedMem / $totalMem) * 100, 1)

Write-Host "   📊 Memory Usage: $memUsagePercent% ($([math]::Round($usedMem/1024,1))GB / $([math]::Round($totalMem/1024,1))GB)" -ForegroundColor Cyan

# 5. Recommendations
Write-Host "5. Performance Recommendations:" -ForegroundColor Yellow
Write-Host "   💡 Close unused browser tabs" -ForegroundColor White
Write-Host "   💡 Restart VS Code: Ctrl+Shift+P → 'Developer: Reload Window'" -ForegroundColor White
Write-Host "   💡 Disable unnecessary VS Code extensions" -ForegroundColor White
Write-Host "   💡 Use 'npm run build' instead of 'npm run dev' for production testing" -ForegroundColor White

Write-Host ""
Write-Host "🎯 Optimization Complete! VS Code should run smoother now." -ForegroundColor Green
Write-Host "🔄 For best results, restart VS Code (Ctrl+Shift+P → 'Developer: Reload Window')" -ForegroundColor Cyan
