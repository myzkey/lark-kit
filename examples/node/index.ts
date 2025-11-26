import { Client, Domain } from 'lark-kit'

const client = new Client({
  appId: process.env.LARK_APP_ID!,
  appSecret: process.env.LARK_APP_SECRET!,
  domain: Domain.Feishu, // or Domain.Lark for international
})

async function main() {
  // Example: Create a record in Lark Base (Bitable)
  // Same API structure as official SDK: client.bitable.appTableRecord.create()
  const record = await client.bitable.appTableRecord.create({
    path: {
      app_token: 'YOUR_BASE_APP_TOKEN',
      table_id: 'YOUR_TABLE_ID',
    },
    data: {
      fields: {
        Name: 'John Doe',
        Email: 'john@example.com',
      },
    },
  })
  console.log('Created record:', record)

  // Example: List records
  const records = await client.bitable.appTableRecord.list({
    path: {
      app_token: 'YOUR_BASE_APP_TOKEN',
      table_id: 'YOUR_TABLE_ID',
    },
    params: {
      page_size: 10,
    },
  })
  console.log('Records:', records.items)

  // Example: Send a text message
  // Same API structure as official SDK: client.im.message.create()
  const message = await client.im.message.create({
    params: {
      receive_id_type: 'chat_id',
    },
    data: {
      receive_id: 'YOUR_CHAT_ID',
      msg_type: 'text',
      content: JSON.stringify({ text: 'Hello from lark-kit!' }),
    },
  })
  console.log('Sent message:', message)

  // Or use the convenience method
  const textMessage = await client.im.message.sendText(
    'chat_id',
    'YOUR_CHAT_ID',
    'Hello from lark-kit!'
  )
  console.log('Sent text message:', textMessage)
}

main().catch(console.error)
