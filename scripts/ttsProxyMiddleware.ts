import type { Connect, Plugin } from 'vite'
import https from 'node:https'

function fetchBaiduMp3(text: string, lang: 'zh' | 'en', spd = 3): Promise<Buffer> {
  const speed = Math.min(7, Math.max(1, Math.round(spd)))
  const url =
    `https://fanyi.baidu.com/gettts?lan=${lang}` +
    `&text=${encodeURIComponent(text)}&spd=${speed}&source=web`

  const get = (target: string): Promise<Buffer> =>
    new Promise((resolve, reject) => {
      const req = https.get(
        target,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36',
            Accept: 'audio/mpeg,audio/*;q=0.9,*/*;q=0.8',
          },
          timeout: 8000,
        },
        (res) => {
          if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            get(res.headers.location).then(resolve, reject)
            res.resume()
            return
          }
          const chunks: Buffer[] = []
          res.on('data', (c) => chunks.push(c))
          res.on('end', () => {
            const buf = Buffer.concat(chunks)
            if (!res.statusCode || res.statusCode >= 400 || buf.length < 200) {
              reject(new Error(`upstream ${res.statusCode} size=${buf.length}`))
              return
            }
            const head = buf.slice(0, 1).toString()
            if (head === '{' || head === '[') {
              reject(new Error('upstream returned json'))
              return
            }
            resolve(buf)
          })
        }
      )
      req.on('error', reject)
      req.on('timeout', () => {
        req.destroy()
        reject(new Error('upstream timeout'))
      })
    })

  return get(url)
}

function ttsHandler(req: Connect.IncomingMessage, res: Connect.ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.end()
    return
  }

  try {
    const host = req.headers.host || 'localhost'
    const u = new URL(req.url || '/', `http://${host}`)
    let text = (u.searchParams.get('text') || '').trim().slice(0, 60)
    try {
      text = decodeURIComponent(text)
    } catch {
      /* keep */
    }
    const lang = (u.searchParams.get('lang') || 'zh').toLowerCase().startsWith('en')
      ? 'en'
      : 'zh'
    const spd = Number(u.searchParams.get('spd') || 3)

    if (!text) {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'missing text' }))
      return
    }

    fetchBaiduMp3(text, lang, spd)
      .then((buf) => {
        res.statusCode = 200
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Content-Type', 'audio/mpeg')
        res.setHeader('Cache-Control', 'public, max-age=86400')
        res.end(buf)
      })
      .catch((e) => {
        res.statusCode = 502
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'tts upstream failed', detail: String(e?.message || e) }))
      })
  } catch (e) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: String(e) }))
  }
}

/** 开发/预览：同源 /api/tts 代理百度，供微信从「我的域名」下载后本地缓存播放 */
export function kidlearnTtsProxyPlugin(): Plugin {
  return {
    name: 'kidlearn-tts-proxy',
    configureServer(server) {
      server.middlewares.use('/api/tts', ttsHandler)
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/tts', ttsHandler)
    },
  }
}
