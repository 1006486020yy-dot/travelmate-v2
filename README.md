# 旅伴 TravelMate V2.1

手机/iPad 优先的单页旅行 App。

## 部署
直接将 `index.html` 和 `README.md` 上传到 GitHub Pages 的 `main` / `/root`。
Cloudflare Pages 后续可直接部署同一目录。

## 已实现
- 首页独立入口
- 福建方案 A / B 完整时间轴
- 景点按城市
- 美食复制地址、导航、加入行程
- 城市探索
- 好友分享
- 本地 LocalStorage
- 自定义添加行程
- AI 旅行规划前端演示
- 火山方舟 / Firebase / 地图接口预留

## 安全
不要把火山方舟 API Key 直接写进前端。正式接入请使用 Cloudflare Worker 或 Firebase Functions 代理。
