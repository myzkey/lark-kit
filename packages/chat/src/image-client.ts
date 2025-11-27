import type { HttpClient, TokenManager } from '@lark-kit/core'
import { LarkApiError } from '@lark-kit/core'
import { UploadImageResponseSchema, parseResponse } from '@lark-kit/shared'

export type ImageType = 'message' | 'avatar'

export class ImageClient {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly tokenManager: TokenManager
  ) {}

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.tokenManager.getTenantAccessToken()
    return {
      Authorization: `Bearer ${token}`,
    }
  }

  /**
   * Upload an image to Lark
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/image/create
   */
  async upload(image: Blob | Buffer, imageType: ImageType = 'message'): Promise<string> {
    const headers = await this.getAuthHeaders()

    const formData = new FormData()
    formData.append('image_type', imageType)
    formData.append('image', image)

    const response = await this.httpClient.post('/open-apis/im/v1/images', {
      headers,
      formData,
    })

    const parsed = parseResponse(UploadImageResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to upload image: ${parsed.msg}`, parsed.code || 0)
    }
    return parsed.data?.image_key ?? ''
  }
}
