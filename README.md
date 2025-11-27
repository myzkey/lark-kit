# lark-kit

Lightweight TypeScript SDK for Lark (Feishu) API.

- Fetch-based (works in Node.js, Cloudflare Workers, etc.)
- Type-safe with full TypeScript support
- Minimal dependencies (only `zod` for validation)

## Installation

```bash
npm install lark-kit
# or
pnpm add lark-kit
```

## Quick Start

```typescript
import { Client, Domain } from 'lark-kit'

const client = new Client({
  appId: process.env.LARK_APP_ID!,
  appSecret: process.env.LARK_APP_SECRET!,
  domain: Domain.Feishu, // or Domain.Lark for international
})
```

## Features

### Bitable (Base)

#### Records

```typescript
// List records
const records = await client.bitable.appTableRecord.list({
  path: { app_token: 'xxx', table_id: 'xxx' },
  params: { page_size: 10 },
})

// Create a record
const record = await client.bitable.appTableRecord.create({
  path: { app_token: 'xxx', table_id: 'xxx' },
  data: { fields: { Name: 'John', Email: 'john@example.com' } },
})

// Get a record
const record = await client.bitable.appTableRecord.get({
  path: { app_token: 'xxx', table_id: 'xxx', record_id: 'xxx' },
})

// Update a record
const record = await client.bitable.appTableRecord.update({
  path: { app_token: 'xxx', table_id: 'xxx', record_id: 'xxx' },
  data: { fields: { Name: 'Jane' } },
})

// Delete a record
await client.bitable.appTableRecord.delete({
  path: { app_token: 'xxx', table_id: 'xxx', record_id: 'xxx' },
})
```

#### Batch Operations

```typescript
// Batch create records
const records = await client.bitable.appTableRecord.batchCreate({
  path: { app_token: 'xxx', table_id: 'xxx' },
  data: {
    records: [
      { fields: { Name: 'John' } },
      { fields: { Name: 'Jane' } },
      { fields: { Name: 'Bob' } },
    ],
  },
})

// Batch update records
const updated = await client.bitable.appTableRecord.batchUpdate({
  path: { app_token: 'xxx', table_id: 'xxx' },
  data: {
    records: [
      { record_id: 'rec_xxx1', fields: { Name: 'John Updated' } },
      { record_id: 'rec_xxx2', fields: { Name: 'Jane Updated' } },
    ],
  },
})

// Batch delete records
const deleted = await client.bitable.appTableRecord.batchDelete({
  path: { app_token: 'xxx', table_id: 'xxx' },
  data: {
    records: ['rec_xxx1', 'rec_xxx2', 'rec_xxx3'],
  },
})
```

#### Fields

```typescript
import { FieldType } from 'lark-kit'

// List fields
const fields = await client.bitable.appTableField.list({
  path: { app_token: 'xxx', table_id: 'xxx' },
})

// Create a field
const field = await client.bitable.appTableField.create({
  path: { app_token: 'xxx', table_id: 'xxx' },
  data: { field_name: 'NewField', type: FieldType.Text },
})

// Update a field
const field = await client.bitable.appTableField.update({
  path: { app_token: 'xxx', table_id: 'xxx', field_id: 'xxx' },
  data: { field_name: 'RenamedField' },
})

// Delete a field
await client.bitable.appTableField.delete({
  path: { app_token: 'xxx', table_id: 'xxx', field_id: 'xxx' },
})
```

**Available Field Types:**

| Type | Value |
|------|-------|
| `FieldType.Text` | 1 |
| `FieldType.Number` | 2 |
| `FieldType.SingleSelect` | 3 |
| `FieldType.MultiSelect` | 4 |
| `FieldType.DateTime` | 5 |
| `FieldType.Checkbox` | 7 |
| `FieldType.Person` | 11 |
| `FieldType.Url` | 15 |
| `FieldType.Attachment` | 17 |

### Messaging (IM)

#### Send Messages

```typescript
// Send a text message (simple)
await client.im.message.sendText('chat_id', 'oc_xxx', 'Hello!')

// Send a text message (full control)
await client.im.message.create({
  params: { receive_id_type: 'chat_id' },
  data: {
    receive_id: 'oc_xxx',
    msg_type: 'text',
    content: JSON.stringify({ text: 'Hello!' }),
  },
})

// Reply to a message
await client.im.message.replyText('om_xxx', 'Reply text')
```

#### Send Card Messages

```typescript
import { type Card } from 'lark-kit'

const card: Card = {
  config: { wide_screen_mode: true },
  header: {
    title: { tag: 'plain_text', content: 'Card Title' },
    template: 'blue',
  },
  elements: [
    { tag: 'div', text: { tag: 'lark_md', content: '**Bold** and `code`' } },
    { tag: 'hr' },
    { tag: 'note', elements: [{ tag: 'plain_text', content: 'Footer' }] },
  ],
}

await client.im.message.sendCard('chat_id', 'oc_xxx', card)
```

#### List Chats

```typescript
// List chats the bot is a member of
const chats = await client.im.chat.list()
for (const chat of chats.items) {
  console.log(`${chat.name} (${chat.chat_id})`)
}
```

## Running Examples

```bash
cd examples/node
cp .env.example .env
# Edit .env with your credentials

pnpm start                      # Show available commands
pnpm start bitable:fields       # List fields
pnpm start bitable:list         # List records
pnpm start im:chats             # List chats
pnpm start im:send-text         # Send a text message
pnpm start im:send-card         # Send a card message
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `LARK_APP_ID` | App ID from Lark Developer Console |
| `LARK_APP_SECRET` | App Secret from Lark Developer Console |
| `LARK_BITABLE_APP_TOKEN` | Bitable app token (from URL) |
| `LARK_BITABLE_TABLE_ID` | Bitable table ID (from URL) |
| `LARK_CHAT_ID` | Chat ID for messaging |

## License

MIT
