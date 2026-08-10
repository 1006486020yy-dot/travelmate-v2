# 旅伴旅行管家 · TravelMate

当前版本已经按“我的行程 → 十一福建游 → 方案 A / 方案 B → 横向日期 → 当天详细日程”重构。

## 本次完成
- 我的行程三级结构：我的行程 / 十一福建游 / 方案 A、方案 B
- 日期横向切换：9/28 → 9/29 → 9/30 → 10/1 → 10/2 → 10/3 → 10/4
- 方案 A：福州 + 平潭 + 泉州 + 厦门
- 方案 B：福州 + 平潭 + 厦门
- 日程项统一显示时间、地址、备注
- 日程支持编辑、删除、添加
- 景点、美食、酒店、交通统一支持复制和高德导航
- AI 页面改为聊天式对话界面
- AI 前端调用 `/api/chat`
- 火山方舟 Key 不写进前端，由 Cloudflare Pages Functions 代理

## AI 接口配置
在 Cloudflare Pages 项目的 Settings → Environment variables 中配置：

- `ARK_API_KEY`：你的火山方舟 API Key
- `ARK_MODEL`：你的火山方舟模型 Endpoint ID；如果不配置，代码使用默认模型值

然后重新部署 Pages。

前端请求：

`POST /api/chat`

请求示例：

```json
{
  "message": "把10月2日安排得轻松一点",
  "context": {
    "plan": "方案A",
    "date": "10月2日",
    "route": "泉州海边 → 厦门",
    "day": []
  }
}
```

## 重要
不要把 `ARK_API_KEY` 直接写到 `index.html`。如果 Key 已经在聊天或代码中公开过，建议在火山方舟后台重新生成一个 Key。
