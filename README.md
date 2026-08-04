# TravelMate V2 · 旅伴旅行管家

纯前端 App 式旅行管家，可直接部署到 GitHub Pages / Cloudflare Pages。

## 功能
首页、AI 旅行规划、方案 A/B 时间轴、四城景点、美食、复制地址、导航、加入行程、城市探索、好友分享、LocalStorage。

## 部署
直接上传 `index.html` 到 GitHub 仓库即可。

## AI
前端不要直接写入火山方舟 API Key。正式接入建议使用 Cloudflare Worker / Firebase Functions 做安全代理；页面已经预留代理地址设置。
