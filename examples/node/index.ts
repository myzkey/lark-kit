import { Client, Domain, FieldType, type Card } from 'lark-kit'

const client = new Client({
  appId: process.env.LARK_APP_ID!,
  appSecret: process.env.LARK_APP_SECRET!,
  domain: Domain.Feishu, // or Domain.Lark for international
})

const BITABLE_APP_TOKEN = process.env.LARK_BITABLE_APP_TOKEN!
const BITABLE_TABLE_ID = process.env.LARK_BITABLE_TABLE_ID!
const CHAT_ID = process.env.LARK_CHAT_ID!

const commands: Record<string, () => Promise<void>> = {
  'bitable:create': async () => {
    const record = await client.bitable.appTableRecord.create({
      path: {
        app_token: BITABLE_APP_TOKEN,
        table_id: BITABLE_TABLE_ID,
      },
      data: {
        fields: {
          Name: 'John Doe',
          Email: 'john@example.com',
        },
      },
    })
    console.log('Created record:', record)
  },

  'bitable:create-field': async () => {
    const fieldName = process.argv[3] || 'NewField'
    const field = await client.bitable.appTableField.create({
      path: {
        app_token: BITABLE_APP_TOKEN,
        table_id: BITABLE_TABLE_ID,
      },
      data: {
        field_name: fieldName,
        type: FieldType.Text,
      },
    })
    console.log('Created field:', field)
  },

  'bitable:fields': async () => {
    const fields = await client.bitable.appTableField.list({
      path: {
        app_token: BITABLE_APP_TOKEN,
        table_id: BITABLE_TABLE_ID,
      },
    })
    console.log('Fields:')
    for (const field of fields.items) {
      console.log(`  - ${field.field_name} (id: ${field.field_id}, type: ${field.type})`)
    }
  },

  'bitable:update-field': async () => {
    const fieldId = process.argv[3]
    const newName = process.argv[4]
    if (!fieldId || !newName) {
      console.log('Usage: pnpm start bitable:update-field <field_id> <new_name>')
      process.exit(1)
    }
    const field = await client.bitable.appTableField.update({
      path: {
        app_token: BITABLE_APP_TOKEN,
        table_id: BITABLE_TABLE_ID,
        field_id: fieldId,
      },
      data: {
        field_name: newName,
      },
    })
    console.log('Updated field:', field)
  },

  'bitable:delete-field': async () => {
    const fieldId = process.argv[3]
    if (!fieldId) {
      console.log('Usage: pnpm start bitable:delete-field <field_id>')
      process.exit(1)
    }
    const result = await client.bitable.appTableField.delete({
      path: {
        app_token: BITABLE_APP_TOKEN,
        table_id: BITABLE_TABLE_ID,
        field_id: fieldId,
      },
    })
    console.log('Deleted field:', result)
  },

  'bitable:list': async () => {
    const records = await client.bitable.appTableRecord.list({
      path: {
        app_token: BITABLE_APP_TOKEN,
        table_id: BITABLE_TABLE_ID,
      },
      params: {
        page_size: 10,
      },
    })
    console.log('Records:', records.items)
  },

  'im:chats': async () => {
    const chats = await client.im.chat.list()
    console.log('Chats (bot is member of):')
    for (const chat of chats.items) {
      console.log(`  - ${chat.name} (chat_id: ${chat.chat_id})`)
    }
    if (chats.items.length === 0) {
      console.log('  (none - add the bot to a group chat first)')
    }
  },

  'im:send': async () => {
    const message = await client.im.message.create({
      params: {
        receive_id_type: 'chat_id',
      },
      data: {
        receive_id: CHAT_ID,
        msg_type: 'text',
        content: JSON.stringify({ text: 'Hello from lark-kit!' }),
      },
    })
    console.log('Sent message:', message)
  },

  'im:send-text': async () => {
    const message = await client.im.message.sendText(
      'chat_id',
      CHAT_ID,
      'Hello from lark-kit!'
    )
    console.log('Sent text message:', message)
  },

  'im:send-card': async () => {
    const card: Card = {
      config: {
        wide_screen_mode: true,
      },
      header: {
        title: {
          tag: 'plain_text',
          content: '🎉 lark-kit カード送信テスト',
        },
        template: 'blue',
      },
      elements: [
        {
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: '**lark-kit** からカードメッセージを送信しました！',
          },
        },
        {
          tag: 'hr',
        },
        {
          tag: 'note',
          elements: [
            {
              tag: 'plain_text',
              content: 'Sent via lark-kit SDK',
            },
          ],
        },
      ],
    }
    const message = await client.im.message.sendCard('chat_id', CHAT_ID, card)
    console.log('Sent card message:', message)
  },
}

async function main() {
  const command = process.argv[2]

  if (!command || !commands[command]) {
    console.log('Usage: pnpm start <command>\n')
    console.log('Available commands:')
    for (const cmd of Object.keys(commands)) {
      console.log(`  ${cmd}`)
    }
    process.exit(1)
  }

  await commands[command]()
}

main().catch(console.error)
