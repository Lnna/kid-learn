/**
 * CloudBase TTS 代理：服务端拉取百度 gettts，回传 audio/mpeg。
 * 微信可播 tcloudbase.com 域名，不能直链 fanyi.baidu.com。
 */
const https = require('https')

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  }
}

function getQuery(event) {
  return event.queryStringParameters || event.queryString || event.query || {}
}

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
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
          fetchBuffer(res.headers.location).then(resolve, reject)
          res.resume()
          return
        }
        const chunks = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', () => {
          const buf = Buffer.concat(chunks)
          if (!res.statusCode || res.statusCode >= 400 || buf.length < 200) {
            reject(new Error(`upstream ${res.statusCode} size=${buf.length}`))
            return
          }
          // 百度失败时常返回 JSON
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
}

function pickTextLang(event) {
  const q = getQuery(event)
  let text = String(q.text || event.text || '').trim()
  try {
    text = decodeURIComponent(text)
  } catch {
    /* keep */
  }
  text = text.slice(0, 60)
  const lang = String(q.lang || event.lang || 'zh')
    .toLowerCase()
    .startsWith('en')
    ? 'en'
    : 'zh'
  return { text, lang }
}

exports.main = async (event = {}) => {
  const method = (event.httpMethod || event.requestContext?.httpMethod || 'GET').toUpperCase()
  if (method === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders(), body: '' }
  }

  const { text, lang } = pickTextLang(event)
  const isHttp = !!(event.httpMethod || event.requestContext?.httpMethod || event.queryStringParameters)

  if (!text) {
    if (isHttp) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'missing text' }),
      }
    }
    return { ok: false, error: 'missing text' }
  }

  const upstream = `https://fanyi.baidu.com/gettts?lan=${lang}&text=${encodeURIComponent(text)}&spd=3&source=web`

  try {
    const buf = await fetchBuffer(upstream)
    if (!isHttp) {
      return {
        ok: true,
        contentType: 'audio/mpeg',
        audioBase64: buf.toString('base64'),
        bytes: buf.length,
      }
    }
    return {
      statusCode: 200,
      isBase64Encoded: true,
      headers: {
        ...corsHeaders(),
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
      },
      body: buf.toString('base64'),
    }
  } catch (e) {
    const detail = String(e && e.message)
    if (!isHttp) return { ok: false, error: 'tts upstream failed', detail }
    return {
      statusCode: 502,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'tts upstream failed', detail }),
    }
  }
}
