import { LarkApiError } from './errors'

export interface RequestConfig {
  url: string
  method: string
  headers?: Record<string, string>
  data?: unknown
  params?: Record<string, string | number | boolean | undefined>
  path?: Record<string, string>
}

export type RequestHook = (config: RequestConfig) => void
export type ResponseHook = (config: RequestConfig, response: Response, data: unknown) => void

export interface HttpClientOptions {
  onRequest?: RequestHook
  onResponse?: ResponseHook
}

function fillApiPath(url: string, path?: Record<string, string>): string {
  if (!path) return url
  return url.replace(/:(\w+)/g, (_, key) => path[key] || `:${key}`)
}

function buildQueryString(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return ''
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      searchParams.append(key, String(value))
    }
  }
  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export class HttpClient {
  private readonly baseURL: string
  private onRequest?: RequestHook
  private onResponse?: ResponseHook

  constructor(baseURL: string, options?: HttpClientOptions) {
    this.baseURL = baseURL.replace(/\/$/, '')
    this.onRequest = options?.onRequest
    this.onResponse = options?.onResponse
  }

  async request<T>(config: RequestConfig): Promise<T> {
    const { method, data, params, path, headers: configHeaders } = config

    const filledPath = fillApiPath(config.url, path)
    const queryString = buildQueryString(params)
    const url = filledPath.startsWith('http')
      ? `${filledPath}${queryString}`
      : `${this.baseURL}${filledPath}${queryString}`

    this.onRequest?.(config)

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'lark-kit/1.0.0',
      ...configHeaders,
    }

    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    })

    const responseData = await response.json()

    this.onResponse?.(config, response, responseData)

    if (!response.ok) {
      throw new LarkApiError(
        `Request failed: ${response.status} ${response.statusText}`,
        response.status,
        responseData
      )
    }

    return responseData as T
  }

  async get<T>(url: string, options?: Omit<RequestConfig, 'url' | 'method'>): Promise<T> {
    return this.request<T>({ url, method: 'GET', ...options })
  }

  async post<T>(url: string, options?: Omit<RequestConfig, 'url' | 'method'>): Promise<T> {
    return this.request<T>({ url, method: 'POST', ...options })
  }

  async put<T>(url: string, options?: Omit<RequestConfig, 'url' | 'method'>): Promise<T> {
    return this.request<T>({ url, method: 'PUT', ...options })
  }

  async patch<T>(url: string, options?: Omit<RequestConfig, 'url' | 'method'>): Promise<T> {
    return this.request<T>({ url, method: 'PATCH', ...options })
  }

  async delete<T>(url: string, options?: Omit<RequestConfig, 'url' | 'method'>): Promise<T> {
    return this.request<T>({ url, method: 'DELETE', ...options })
  }
}
