import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from './http'

describe('HttpClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('should build URL with query params', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ code: 0, data: {} }),
    })
    vi.stubGlobal('fetch', mockFetch)

    const client = new HttpClient('https://api.example.com')
    await client.get('/test', { params: { page: 1, limit: 10 } })

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/test?page=1&limit=10',
      expect.objectContaining({ method: 'GET' })
    )
  })

  it('should replace path parameters', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ code: 0, data: {} }),
    })
    vi.stubGlobal('fetch', mockFetch)

    const client = new HttpClient('https://api.example.com')
    await client.get('/apps/:app_token/tables/:table_id', {
      path: { app_token: 'abc123', table_id: 'tbl456' },
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/apps/abc123/tables/tbl456',
      expect.objectContaining({ method: 'GET' })
    )
  })

  it('should throw LarkApiError on non-ok response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: () => Promise.resolve({ code: 99991663, msg: 'token invalid' }),
    })
    vi.stubGlobal('fetch', mockFetch)

    const client = new HttpClient('https://api.example.com')

    await expect(client.get('/test')).rejects.toThrow('Request failed: 401 Unauthorized')
  })
})
