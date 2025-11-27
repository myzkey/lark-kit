import type { HttpClient, TokenManager } from '@lark-kit/core'
import { LarkApiError } from '@lark-kit/core'
import { UploadFileResponseSchema, parseResponse } from '@lark-kit/shared'

export type FileType = 'opus' | 'mp4' | 'pdf' | 'doc' | 'xls' | 'ppt' | 'stream'

export class FileClient {
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
   * Upload a file to Lark
   * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/file/create
   */
  async upload(file: Blob | Buffer, fileName: string, fileType: FileType): Promise<string> {
    const headers = await this.getAuthHeaders()

    const formData = new FormData()
    formData.append('file_type', fileType)
    formData.append('file_name', fileName)
    formData.append('file', file)

    const response = await this.httpClient.post('/open-apis/im/v1/files', {
      headers,
      formData,
    })

    const parsed = parseResponse(UploadFileResponseSchema, response)
    if (parsed.code !== 0) {
      throw new LarkApiError(`Failed to upload file: ${parsed.msg}`, parsed.code || 0)
    }
    return parsed.data?.file_key ?? ''
  }
}
