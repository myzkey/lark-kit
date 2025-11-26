export const Domain = {
  Feishu: 'https://open.feishu.cn',
  Lark: 'https://open.larksuite.com',
} as const

export type DomainType = (typeof Domain)[keyof typeof Domain] | string

export const AppType = {
  SelfBuild: 'self_build',
  ISV: 'isv',
} as const

export type AppTypeType = (typeof AppType)[keyof typeof AppType]

export interface TokenStorage {
  get(key: string): Promise<string | null>
  set(key: string, value: string, ttlSeconds: number): Promise<void>
}

export interface LarkConfig {
  appId: string
  appSecret: string
  domain?: DomainType
  appType?: AppTypeType
  disableTokenCache?: boolean
  storage?: TokenStorage
}

export interface TenantAccessTokenResponse {
  code: number
  msg: string
  tenant_access_token: string
  expire: number
}

export interface LarkResponse<T = unknown> {
  code: number
  msg: string
  data?: T
}

export interface RequestOptions {
  headers?: Record<string, string>
  body?: unknown
  params?: Record<string, string | number | boolean | undefined>
}

export interface IPayload {
  data?: Record<string, unknown>
  params?: Record<string, unknown>
  headers?: Record<string, string>
  path?: Record<string, string>
}

export class InMemoryTokenStorage implements TokenStorage {
  private store = new Map<string, { value: string; expiresAt: number }>()

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key)
    if (!item) return null
    if (Date.now() > item.expiresAt) {
      this.store.delete(key)
      return null
    }
    return item.value
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    })
  }
}
