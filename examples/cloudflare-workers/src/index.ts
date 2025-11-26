import { Client, Domain, type TokenStorage } from 'lark-kit'

interface Env {
  LARK_APP_ID: string
  LARK_APP_SECRET: string
  LARK_TOKEN_STORE?: KVNamespace
}

// KV-based token storage for Cloudflare Workers
class KVTokenStorage implements TokenStorage {
  constructor(private kv: KVNamespace) {}

  async get(key: string): Promise<string | null> {
    return this.kv.get(key)
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    await this.kv.put(key, value, { expirationTtl: ttlSeconds })
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const storage = env.LARK_TOKEN_STORE ? new KVTokenStorage(env.LARK_TOKEN_STORE) : undefined

    const client = new Client({
      appId: env.LARK_APP_ID,
      appSecret: env.LARK_APP_SECRET,
      domain: Domain.Feishu,
      storage,
    })

    const url = new URL(request.url)

    if (url.pathname === '/records' && request.method === 'GET') {
      const appToken = url.searchParams.get('appToken')
      const tableId = url.searchParams.get('tableId')

      if (!appToken || !tableId) {
        return new Response('Missing appToken or tableId', { status: 400 })
      }

      const result = await client.bitable.appTableRecord.list({
        path: { app_token: appToken, table_id: tableId },
        params: { page_size: 20 },
      })

      return Response.json(result)
    }

    if (url.pathname === '/send' && request.method === 'POST') {
      const body = (await request.json()) as {
        chatId: string
        text: string
      }

      const message = await client.im.message.create({
        params: { receive_id_type: 'chat_id' },
        data: {
          receive_id: body.chatId,
          msg_type: 'text',
          content: JSON.stringify({ text: body.text }),
        },
      })

      return Response.json(message)
    }

    return new Response('lark-kit Cloudflare Workers Example', { status: 200 })
  },
}
