export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    const message = String(body?.message || '').trim();
    if (!message) return json({ error: '请输入问题' }, 400);
    if (!env.ARK_API_KEY) return json({ error: '未配置 ARK_API_KEY' }, 500);

    const model = env.ARK_MODEL || 'doubao-seed-1-6-250615';
    const system = `你是“旅伴旅行管家”的旅行规划AI。你要基于用户当前行程上下文回答问题，优先给出可直接执行的时间、地点、交通、地址和调整建议。不要编造已经发生的事实；涉及实时票价、天气、营业时间时明确提示需要实时查询。用户可以要求修改行程，但前端目前先返回建议，不直接改数据。回答中文，简洁、具体。\n当前行程上下文：${JSON.stringify(body?.context || {})}`;

    const upstream = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.ARK_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1600
      })
    });

    const data = await upstream.json();
    if (!upstream.ok) return json({ error: data?.error?.message || 'AI 服务调用失败', detail: data }, upstream.status);
    const reply = data?.choices?.[0]?.message?.content || 'AI 没有返回内容。';
    return json({ reply });
  } catch (e) {
    return json({ error: 'AI 接口异常', detail: String(e) }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}
