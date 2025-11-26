import { describe, it, expect } from 'vitest'
import { Client, Domain } from 'lark-kit'

describe('Client Integration', () => {
  const client = new Client({
    appId: 'test-app-id',
    appSecret: 'test-app-secret',
    domain: Domain.Feishu,
  })

  describe('bitable.appTableRecord', () => {
    it('should create a record', async () => {
      const record = await client.bitable.appTableRecord.create({
        path: { app_token: 'app_test', table_id: 'tbl_test' },
        data: { fields: { Name: 'Integration Test' } },
      })

      expect(record.record_id).toBeDefined()
      expect(record.fields).toEqual({ Name: 'Integration Test' })
    })

    it('should get a record', async () => {
      const record = await client.bitable.appTableRecord.get({
        path: { app_token: 'app_test', table_id: 'tbl_test', record_id: 'rec_123' },
      })

      expect(record.record_id).toBe('rec_123')
      expect(record.fields).toBeDefined()
    })

    it('should update a record', async () => {
      const record = await client.bitable.appTableRecord.update({
        path: { app_token: 'app_test', table_id: 'tbl_test', record_id: 'rec_123' },
        data: { fields: { Name: 'Updated Name' } },
      })

      expect(record.record_id).toBe('rec_123')
      expect(record.fields).toEqual({ Name: 'Updated Name' })
    })

    it('should delete a record', async () => {
      const result = await client.bitable.appTableRecord.delete({
        path: { app_token: 'app_test', table_id: 'tbl_test', record_id: 'rec_123' },
      })

      expect(result.deleted).toBe(true)
      expect(result.record_id).toBe('rec_123')
    })

    it('should list records with pagination', async () => {
      const result = await client.bitable.appTableRecord.list({
        path: { app_token: 'app_test', table_id: 'tbl_test' },
        params: { page_size: 20 },
      })

      expect(result.items.length).toBeGreaterThan(0)
      expect(result.has_more).toBe(true)
      expect(result.page_token).toBe('next_page_token')
      expect(result.total).toBe(6)
    })

    it('should fetch next page', async () => {
      const result = await client.bitable.appTableRecord.list({
        path: { app_token: 'app_test', table_id: 'tbl_test' },
        params: { page_token: 'next_page_token' },
      })

      expect(result.has_more).toBe(false)
      expect(result.page_token).toBeUndefined()
    })
  })

  describe('im.message', () => {
    it('should send a text message', async () => {
      const message = await client.im.message.sendText(
        'chat_id',
        'oc_test_chat',
        'Hello from test!'
      )

      expect(message.message_id).toBeDefined()
      expect(message.msg_type).toBe('text')
    })

    it('should create a message with full payload', async () => {
      const message = await client.im.message.create({
        params: { receive_id_type: 'chat_id' },
        data: {
          receive_id: 'oc_test_chat',
          msg_type: 'interactive',
          content: JSON.stringify({ type: 'template', data: {} }),
        },
      })

      expect(message.message_id).toBeDefined()
    })

    it('should reply to a message', async () => {
      const reply = await client.im.message.replyText('msg_original_123', 'This is a reply')

      expect(reply.message_id).toBeDefined()
      expect(reply.parent_id).toBe('msg_original_123')
    })
  })
})
