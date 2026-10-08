# 会意官网

电脑优先的响应式静态官网：顶部导航、大幅产品展示、功能介绍、四页截图、使用步骤和下载区。保留手机适配，使用会意自己的配色、图标和界面素材。无需 npm 安装或外部 CDN。

## 本地查看

在 Android 项目根目录运行：

```powershell
node scripts/website-server.cjs
```

打开 http://127.0.0.1:4180/ 。原 APP 预览仍在端口 4173。

## 网站内容

- index.html / styles.css / desktop.css / app.js：电脑官网、功能展示、安装指南、常见问题、隐私及下载说明。
- assets/：本地图标与界面示意图，不依赖第三方图床。
- downloads/huiyi-1.3.apk：实际 Android 1.3 测试版安装包，8776167 字节。
- downloads/release.json：安装包版本、大小、最低系统要求和 SHA-256。
- .nojekyll：静态发布标记。

页面所有资源与下载链接均使用相对路径，支持 GitHub Pages 项目子路径。功能图片为网页 UI 预览的界面示意，并非手机实机截图。

## 发布到 GitHub Pages

部署包解压后，将 index.html、styles.css、desktop.css、app.js、assets、downloads 和 .nojekyll 放在网站仓库根目录。不要再嵌套一层 website 文件夹。

在 GitHub 仓库 Settings → Pages 中选择从分支部署，选择 main 分支的 / (root)。发布完成后，使用 GitHub 返回的网站地址查看官网和下载 APK。若使用其他静态托管服务，同样上传这些文件即可。

当前尚未上传任何公网仓库或绑定域名。没有在页面中填写虚构的官网地址或下载地址。

## 更新 APK

替换 downloads 下的安装文件后，同时更新 release.json 的版本、文件名、大小与 SHA-256，以及 index.html 和 app.js 中对应的版本文字与下载路径。先执行下面的验证，确保文件下载完整。

## 验证

在 Android 项目根目录执行：

```powershell
node scripts/verify-website.cjs
```

验证真实 APK 下载及 SHA-256 一致性、HEAD/Range 请求、仓库子路径部署、桌面与 320px 手机布局、平板、横屏、弹窗、键盘标签切换及减少动画设置。

## 当前安装包

目前提供已有项目生成的 debug 测试包，官网已标注测试版。首次生成内容需在 APP 内配置 DeepSeek API Key。完整会议录音转写未接入，系统语音输入适合短句或要点。

## 扫码下载

二维码在浏览器本地生成，地址为当前网站下的 downloads/huiyi-1.3.apk，支持 GitHub Pages 项目子路径。localhost、127.0.0.1 和 file 预览时不生成误导性的二维码，而是提示需要公网发布。已对生成二维码进行实际解码验证。

二维码库来自 https://github.com/kazuhikoarase/qrcode-generator ，MIT 许可保存在 assets/qrcode-LICENSE.txt。二维码解码仅用于测试，使用 scripts/vendor/jsQR.js，其许可文件一同保存。
