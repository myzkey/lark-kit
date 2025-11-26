import type { TokenManager } from '@lark-kit/core'
import { LarkApiError } from '@lark-kit/core'
import { FileUploadResponseSchema, parseResponse } from '@lark-kit/shared'

const LARK_API_BASE = 'https://open.larksuite.com/open-apis'

export interface UploadParams {
  fileName: string
  fileType: string
  buffer: ArrayBuffer
  parentType?: 'explorer'
  parentNode?: string
}

export interface UploadResult {
  fileToken: string
}

export class DriveClient {
  constructor(private readonly tokenManager: TokenManager) {}

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.tokenManager.getTenantAccessToken()
    return {
      Authorization: `Bearer ${token}`,
    }
  }

  async upload(params: UploadParams): Promise<UploadResult> {
    const { fileName, buffer, parentType, parentNode } = params
    const headers = await this.getAuthHeaders()

    const formData = new FormData()
    formData.append('file_name', fileName)
    formData.append('file', new Blob([buffer]), fileName)
    if (parentType) {
      formData.append('parent_type', parentType)
    }
    if (parentNode) {
      formData.append('parent_node', parentNode)
    }

    const response = await fetch(`${LARK_API_BASE}/drive/v1/files/upload_all`, {
      method: 'POST',
      headers,
      body: formData,
    })

    if (!response.ok) {
      throw new LarkApiError(
        `Upload failed: ${response.status} ${response.statusText}`,
        response.status
      )
    }

    const data = await response.json()
    const parsed = parseResponse(FileUploadResponseSchema, data)

    if (parsed.code !== 0) {
      throw new Error(`Failed to upload file: ${parsed.msg}`)
    }

    return {
      fileToken: parsed.data!.file_token,
    }
  }

  async download(fileToken: string): Promise<ArrayBuffer> {
    const headers = await this.getAuthHeaders()

    const response = await fetch(`${LARK_API_BASE}/drive/v1/files/${fileToken}/download`, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      throw new LarkApiError(
        `Download failed: ${response.status} ${response.statusText}`,
        response.status
      )
    }

    return response.arrayBuffer()
  }
}
