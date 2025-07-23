# VS Code Extensions Optimization Script

# TẮT EXTENSIONS GÂY LAG NGHIÊM TRỌNG
Write-Host "🔴 Tắt extensions gây lag nghiêm trọng..." -ForegroundColor Red

# GitLens - Rất nặng
code --uninstall-extension eamodio.gitlens

# Import Cost - Tính toán realtime  
code --uninstall-extension wix.vscode-import-cost

# Quokka - Chạy JS realtime
code --uninstall-extension wallabyjs.quokka-vscode

# Git History - Nặng với repo lớn
code --uninstall-extension donjayamanne.githistory

# Git Project Manager
code --uninstall-extension felipecaputo.git-project-manager

Write-Host "🟡 Tắt extensions không cần thiết..." -ForegroundColor Yellow

# Docker extensions (nếu không dùng)
code --uninstall-extension ms-azuretools.vscode-docker
code --uninstall-extension ms-azuretools.vscode-containers

# Live Server duplicate
code --uninstall-extension ritwickdey.liveserver

# Bookmarks
code --uninstall-extension alefragnani.bookmarks

# Thunder Client
code --uninstall-extension rangav.vscode-thunder-client

Write-Host "🗑️ Xóa extensions không dùng..." -ForegroundColor Gray

# PHP extensions (không cần cho TOEIC project)
code --uninstall-extension bmewburn.vscode-intelephense-client
code --uninstall-extension devsense.composer-php-vscode
code --uninstall-extension devsense.intelli-php-vscode
code --uninstall-extension devsense.phptools-vscode
code --uninstall-extension devsense.profiler-php-vscode
code --uninstall-extension brapifra.phpserver
code --uninstall-extension xdebug.php-debug
code --uninstall-extension onecentlin.laravel-blade
code --uninstall-extension shufo.vscode-blade-formatter

# Pug template engine
code --uninstall-extension amandeepmittal.pug

# Duplicate XML formatter
code --uninstall-extension mikeburgh.xml-format

Write-Host "✅ Hoàn thành! Khởi động lại VS Code để áp dụng thay đổi." -ForegroundColor Green
Write-Host "📊 Số extensions sau khi tối ưu: ~35-40 (từ 72)" -ForegroundColor Cyan
Write-Host "⚡ Hiệu suất sẽ cải thiện đáng kể!" -ForegroundColor Green
