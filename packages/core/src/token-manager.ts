import { LarkAuthError } from './errors'
import { HttpClient } from './http'
import type { TokenStorage, TenantAccessTokenResponse } from './types'

const TOKEN_CACHE_KEY = 'lark_tenant_access_token'
const TOKEN_BUFFER_MS = 3 * 60 * 1000 // 3 minutes before expiry (same as official SDK)

export class TokenManager {
  private readonly appId: string
  private readonly appSecret: string
  private readonly storage: TokenStorage
  private readonly httpClient: HttpClient

  constructor(appId: string, appSecret: string, storage: TokenStorage, domain: string) {
    this.appId = appId
    this.appSecret = appSecret
    this.storage = storage
    this.httpClient = new HttpClient(domain)
  }

  async getTenantAccessToken(): Promise<string> {
    const cacheKey = `${TOKEN_CACHE_KEY}:${this.appId}`
    const cached = await this.storage.get(cacheKey)

    if (cached) {
      return cached
    }

    return this.refreshTenantAccessToken()
  }

  private async refreshTenantAccessToken(): Promise<string> {
    const response = await this.httpClient.post<TenantAccessTokenResponse>(
      '/open-apis/auth/v3/tenant_access_token/internal',
      {
        data: {
          app_id: this.appId,
          app_secret: this.appSecret,
        },
      }
    )

    if (response.code !== 0) {
      throw new LarkAuthError(`Failed to get tenant access token: ${response.msg}`, response.code)
    }

    const cacheKey = `${TOKEN_CACHE_KEY}:${this.appId}`
    // Expire 3 minutes before actual expiry (same as official SDK)
    const ttlMs = response.expire * 1000 - TOKEN_BUFFER_MS
    const ttlSeconds = Math.floor(ttlMs / 1000)

    await this.storage.set(cacheKey, response.tenant_access_token, ttlSeconds)

    return response.tenant_access_token
  }
}
