import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LarkAuthError } from './errors'
import { TokenManager } from './token-manager'
import type { TokenStorage } from './types'

describe('TokenManager', () => {
  let mockStorage: TokenStorage
  let mockFetch: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.restoreAllMocks()
    mockStorage = {
      get: vi.fn(),
      set: vi.fn(),
    }
    mockFetch = vi.fn()
    vi.stubGlobal('fetch', mockFetch)
  })

  it('should return cached token if available', async () => {
    vi.mocked(mockStorage.get).mockResolvedValue('cached-token')

    const manager = new TokenManager('app-id', 'app-secret', mockStorage, 'https://api.example.com')
    const token = await manager.getTenantAccessToken()

    expect(token).toBe('cached-token')
    expect(mockStorage.get).toHaveBeenCalledWith('lark_tenant_access_token:app-id')
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('should fetch new token when cache is empty', async () => {
    vi.mocked(mockStorage.get).mockResolvedValue(null)
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          code: 0,
          tenant_access_token: 'new-token',
          expire: 7200,
        }),
    })

    const manager = new TokenManager('app-id', 'app-secret', mockStorage, 'https://api.example.com')
    const token = await manager.getTenantAccessToken()

    expect(token).toBe('new-token')
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/open-apis/auth/v3/tenant_access_token/internal',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ app_id: 'app-id', app_secret: 'app-secret' }),
      })
    )
  })

  it('should cache token with TTL minus 3 minutes buffer', async () => {
    vi.mocked(mockStorage.get).mockResolvedValue(null)
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          code: 0,
          tenant_access_token: 'new-token',
          expire: 7200, // 2 hours in seconds
        }),
    })

    const manager = new TokenManager('app-id', 'app-secret', mockStorage, 'https://api.example.com')
    await manager.getTenantAccessToken()

    // 7200 seconds - 180 seconds (3 min buffer) = 7020 seconds
    expect(mockStorage.set).toHaveBeenCalledWith(
      'lark_tenant_access_token:app-id',
      'new-token',
      7020
    )
  })

  it('should throw LarkAuthError on non-zero response code', async () => {
    vi.mocked(mockStorage.get).mockResolvedValue(null)
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          code: 99991663,
          msg: 'app_id or app_secret error',
        }),
    })

    const manager = new TokenManager(
      'app-id',
      'wrong-secret',
      mockStorage,
      'https://api.example.com'
    )

    await expect(manager.getTenantAccessToken()).rejects.toThrow(LarkAuthError)
    await expect(manager.getTenantAccessToken()).rejects.toThrow('app_id or app_secret error')
  })
})
