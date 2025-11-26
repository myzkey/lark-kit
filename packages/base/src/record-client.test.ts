import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AppTableRecordClient } from './record-client'
import type { HttpClient, TokenManager } from '@lark-kit/core'
import { LarkApiError } from '@lark-kit/core'

describe('AppTableRecordClient', () => {
  let mockHttpClient: HttpClient
  let mockTokenManager: TokenManager
  let client: AppTableRecordClient

  beforeEach(() => {
    vi.restoreAllMocks()

    mockTokenManager = {
      getTenantAccessToken: vi.fn().mockResolvedValue('test-token'),
    } as unknown as TokenManager

    mockHttpClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    } as unknown as HttpClient

    client = new AppTableRecordClient(mockHttpClient, mockTokenManager)
  })

  describe('create', () => {
    it('should create a record', async () => {
      const mockRecord = {
        record_id: 'rec123',
        fields: { Name: 'Test' },
      }
      vi.mocked(mockHttpClient.post).mockResolvedValue({
        code: 0,
        data: { record: mockRecord },
      })

      const result = await client.create({
        path: { app_token: 'app123', table_id: 'tbl456' },
        data: { fields: { Name: 'Test' } },
      })

      expect(result).toEqual(mockRecord)
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/open-apis/bitable/v1/apps/:app_token/tables/:table_id/records',
        expect.objectContaining({
          headers: { Authorization: 'Bearer test-token' },
          path: { app_token: 'app123', table_id: 'tbl456' },
          data: { fields: { Name: 'Test' } },
        })
      )
    })

    it('should throw LarkApiError on failure', async () => {
      vi.mocked(mockHttpClient.post).mockResolvedValue({
        code: 1254043,
        msg: 'Permission denied',
      })

      await expect(
        client.create({
          path: { app_token: 'app123', table_id: 'tbl456' },
          data: { fields: { Name: 'Test' } },
        })
      ).rejects.toThrow(LarkApiError)
    })
  })

  describe('get', () => {
    it('should get a record by id', async () => {
      const mockRecord = {
        record_id: 'rec123',
        fields: { Name: 'Test' },
      }
      vi.mocked(mockHttpClient.get).mockResolvedValue({
        code: 0,
        data: { record: mockRecord },
      })

      const result = await client.get({
        path: { app_token: 'app123', table_id: 'tbl456', record_id: 'rec123' },
      })

      expect(result).toEqual(mockRecord)
    })
  })

  describe('update', () => {
    it('should update a record', async () => {
      const mockRecord = {
        record_id: 'rec123',
        fields: { Name: 'Updated' },
      }
      vi.mocked(mockHttpClient.put).mockResolvedValue({
        code: 0,
        data: { record: mockRecord },
      })

      const result = await client.update({
        path: { app_token: 'app123', table_id: 'tbl456', record_id: 'rec123' },
        data: { fields: { Name: 'Updated' } },
      })

      expect(result).toEqual(mockRecord)
    })
  })

  describe('delete', () => {
    it('should delete a record', async () => {
      vi.mocked(mockHttpClient.delete).mockResolvedValue({
        code: 0,
        data: { deleted: true, record_id: 'rec123' },
      })

      const result = await client.delete({
        path: { app_token: 'app123', table_id: 'tbl456', record_id: 'rec123' },
      })

      expect(result).toEqual({ deleted: true, record_id: 'rec123' })
    })
  })

  describe('list', () => {
    it('should list records', async () => {
      const mockRecords = [
        { record_id: 'rec1', fields: { Name: 'Test1' } },
        { record_id: 'rec2', fields: { Name: 'Test2' } },
      ]
      vi.mocked(mockHttpClient.get).mockResolvedValue({
        code: 0,
        data: {
          items: mockRecords,
          has_more: false,
          total: 2,
        },
      })

      const result = await client.list({
        path: { app_token: 'app123', table_id: 'tbl456' },
        params: { page_size: 20 },
      })

      expect(result.items).toEqual(mockRecords)
      expect(result.has_more).toBe(false)
      expect(result.total).toBe(2)
    })

    it('should handle pagination', async () => {
      vi.mocked(mockHttpClient.get).mockResolvedValue({
        code: 0,
        data: {
          items: [{ record_id: 'rec1', fields: {} }],
          has_more: true,
          page_token: 'next-page-token',
          total: 100,
        },
      })

      const result = await client.list({
        path: { app_token: 'app123', table_id: 'tbl456' },
      })

      expect(result.has_more).toBe(true)
      expect(result.page_token).toBe('next-page-token')
    })
  })
})
