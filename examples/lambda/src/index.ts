import type { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { Client, Domain } from 'lark-kit'

const client = new Client({
  appId: process.env.LARK_APP_ID!,
  appSecret: process.env.LARK_APP_SECRET!,
  domain: Domain.Feishu,
})

export const handler: APIGatewayProxyHandler = async (event) => {
  const path = event.path
  const method = event.httpMethod

  try {
    if (path === '/records' && method === 'GET') {
      const appToken = event.queryStringParameters?.appToken
      const tableId = event.queryStringParameters?.tableId

      if (!appToken || !tableId) {
        return response(400, { error: 'Missing appToken or tableId' })
      }

      const result = await client.bitable.appTableRecord.list({
        path: { app_token: appToken, table_id: tableId },
        params: { page_size: 20 },
      })

      return response(200, result)
    }

    if (path === '/send' && method === 'POST') {
      const body = JSON.parse(event.body || '{}')

      const message = await client.im.message.create({
        params: { receive_id_type: 'chat_id' },
        data: {
          receive_id: body.chatId,
          msg_type: 'text',
          content: JSON.stringify({ text: body.text }),
        },
      })

      return response(200, message)
    }

    return response(200, { message: 'lark-kit Lambda Example' })
  } catch (error) {
    console.error(error)
    return response(500, { error: 'Internal Server Error' })
  }
}

function response(statusCode: number, body: unknown): APIGatewayProxyResult {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}
