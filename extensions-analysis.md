# VS Code Extensions Analysis & Optimization

## 🔴 HIGH IMPACT - TẮT NGAY (Gây lag nghiêm trọng)
- `eamodio.gitlens@17.3.2` - GitLens (rất nặng, scan toàn bộ Git history)
- `wix.vscode-import-cost@3.3.0` - Import Cost (tính toán size bundle realtime)
- `wallabyjs.quokka-vscode@1.0.734` - Quokka (chạy JS realtime)
- `donjayamanne.githistory@0.6.20` - Git History (nặng với repo lớn)
- `felipecaputo.git-project-manager@1.8.2` - Git Project Manager
- `rangav.vscode-thunder-client@2.36.1` - Thunder Client (API testing)

## 🟡 MEDIUM IMPACT - TẮT KHI KHÔNG CẦN
- `ms-azuretools.vscode-docker@2.0.0` - Docker (nếu không dùng Docker)
- `ms-azuretools.vscode-containers@2.1.0` - Remote Containers
- `ms-vscode.live-server@0.4.15` - Live Server (chỉ bật khi cần)
- `ritwickdey.liveserver@5.7.9` - Live Server (duplicate)
- `alefragnani.bookmarks@13.5.0` - Bookmarks
- `streetsidesoftware.code-spell-checker@4.0.47` - Code Spell Checker

## 🟢 CORE EXTENSIONS - GIỮ LẠI
### Java Development
- `redhat.java@1.43.1` ✅
- `vscjava.vscode-java-pack@0.29.2` ✅
- `vscjava.vscode-maven@0.44.0` ✅
- `vmware.vscode-spring-boot@1.63.0` ✅

### React/TypeScript Development  
- `dsznajder.es7-react-js-snippets@4.4.3` ✅
- `burkeholland.simple-react-snippets@1.2.8` ✅
- `dbaeumer.vscode-eslint@3.0.10` ✅
- `esbenp.prettier-vscode@11.0.0` ✅

### Flutter Development
- `dart-code.dart-code@3.114.2` ✅
- `dart-code.flutter@3.114.0` ✅

### GitHub Copilot
- `github.copilot@1.346.0` ✅
- `github.copilot-chat@0.29.1` ✅

## ⚠️ DUPLICATE EXTENSIONS - XÓA 1 TRONG 2
- `ms-vscode.live-server` vs `ritwickdey.liveserver` (chọn 1)
- `mikeburgh.xml-format` vs `redhat.vscode-xml` (chọn redhat)

## 🗑️ UNUSED EXTENSIONS - CÓ THỂ XÓA
- `amandeepmittal.pug@1.0.1` - Pug (không dùng)
- `onecentlin.laravel-blade@1.37.0` - Laravel Blade (không dùng)
- `shufo.vscode-blade-formatter@0.26.1` - Blade Formatter
- `xdebug.php-debug@1.36.1` - PHP Debug (không dùng PHP)
- `devsense.*` - Tất cả PHP extensions (không cần)
- `brapifra.phpserver@3.0.2` - PHP Server
- `bmewburn.vscode-intelephense-client@1.14.4` - PHP IntelliSense
