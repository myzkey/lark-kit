import { describe, it, expect } from 'vitest'
import { Client, Domain, LarkAuthError, LarkApiError } from 'lark-kit'

describe('Authentication Integration', () => {
  it('should authenticate with valid credentials', async () => {
    const client = new Client({
      appId: 'valid-app-id',
      appSecret: 'valid-app-secret',
      domain: Domain.Feishu,
    })

    // This should succeed - token will be fetched automatically
    const records = await client.bitable.appTableRecord.list({
      path: { app_token: 'app_test', table_id: 'tbl_test' },
    })

    expect(records.items).toBeDefined()
  })

  it('should throw LarkAuthError with invalid credentials', async () => {
    const client = new Client({
      appId: 'invalid',
      appSecret: 'invalid',
      domain: Domain.Feishu,
    })

    await expect(
      client.bitable.appTableRecord.list({
        path: { app_token: 'app_test', table_id: 'tbl_test' },
      })
    ).rejects.toThrow(LarkAuthError)
  })

  it('should throw LarkApiError when record not found', async () => {
    const client = new Client({
      appId: 'valid-app-id',
      appSecret: 'valid-app-secret',
      domain: Domain.Feishu,
    })

    await expect(
      client.bitable.appTableRecord.get({
        path: { app_token: 'app_test', table_id: 'tbl_test', record_id: 'not_found' },
      })
    ).rejects.toThrow(LarkApiError)
  })
})
