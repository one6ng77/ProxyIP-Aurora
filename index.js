addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const path = url.pathname

  // 处理 API 路由
  if (path === '/api/scan' || path === '/api/test') {
    return handleAPI(request, path)
  }

  // 处理静态页面请求
  return handleStatic(request)
}

// 处理 API 请求
async function handleAPI(request, path) {
  const method = request.method

  // 处理 POST 请求
  if (method === 'POST') {
    try {
      const body = await request.json()

      // 扫描 API
      if (path === '/api/scan') {
        const region = body.region || 'default' // 默认区域
        const home = body.home || 0 // 家庭宽带参数

        // 调用外部 API 获取代理扫描结果
        const apiResponse = await fetch(`${env.EXTERNAL_API_URL}/scan?region=${region}&home=${home}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${env.PASSWORD}`  // 如果需要认证，可以传递 Token
          }
        })
        
        const data = await apiResponse.json()
        return new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' }
        })
      } 
      
      // 测试代理 API
      else if (path === '/api/test') {
        const ip = body.ip || '0.0.0.0'
        const mode = body.mode || 'stable'

        // 调用外部 API 测试单个代理
        const apiResponse = await fetch(`${env.EXTERNAL_API_URL}/test?ip=${ip}&mode=${mode}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${env.PASSWORD}`
          }
        })
        
        const data = await apiResponse.json()
        return new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' }
        })
      }
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: '无效的请求格式'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }

  // 方法不允许的情况
  return new Response(JSON.stringify({
    success: false,
    error: '方法不允许'
  }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  })
}

// 处理静态页面请求
async function handleStatic(request) {
  const url = new URL(request.url)

  // 如果是根路径或请求 index.html，返回主页面
  if (url.pathname === '/' || url.pathname === '/index.html') {
    return new Response(getHTML(), {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  }

  return new Response('Not Found', { status: 404 })
}

// 返回主页面的 HTML 内容
function getHTML() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ProxyIP Aurora - 代理IP检测工具</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
            margin-top: 40px;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 300;
        }

        .header h2 {
            font-size: 1.2em;
            opacity: 0.9;
            font-weight: 300;
        }

        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 0.9em;
            border-top: 1px solid #e0e0e0;
        }

        .footer-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 10px;
        }

        .footer-link {
            color: #667eea;
            text-decoration: none;
            transition: color 0.3s;
        }

        .footer-link:hover {
            color: #764ba2;
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="header">
                <h1>🔮 ProxyIP Aurora</h1>
                <h2>高效、准确的代理IP检测与验证工具</h2>
            </div>

            <!-- 统计信息、结果表格等内容 -->

        </div>
    </div>
</body>
</html>`;
}
