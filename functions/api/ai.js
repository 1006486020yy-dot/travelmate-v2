const ARK_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json().catch(() => ({}));
    const message = String(body?.message || '').trim();
    const contextData = body?.context || {};

    if (!message) {
      return json({ error: '请输入问题' }, 400);
    }

    const apiKey = env.ARK_API_KEY;
    const model = env.ARK_MODEL;

    if (!apiKey || !model) {
      return json({
        error: 'AI 尚未配置：请在 Cloudflare Pages → Settings → Environment variables 设置 ARK_API_KEY 和 ARK_MODEL。'
      }, 500);
    }

    const system = `你是“旅伴旅行管家”的旅行规划AI。请使用中文回答，直接、具体、可执行。\n当前用户行程上下文：${JSON.stringify(contextData)}\n如果用户要求修改行程，请给出明确的时间、地点、地址、交通和调整理由；不要编造已经存在于上下文中的事实。`;

    const upstream = await fetch(ARK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1800
      })
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return json({
        error: data?.error?.message || data?.message || `火山方舟请求失败（${upstream.status}）`
      }, upstream.status >= 400 && upstream.status < 600 ? upstream.status : 502);
    }

    const reply = data?.choices?.[0]?.message?.content || 'AI 暂时没有生成回复，请稍后再试。';
    return json({ reply });
  } catch (error) {
    return json({ error: `AI 服务异常：${error?.message || '未知错误'}` }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders()
  });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      ...corsHeaders()
    }
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
}
