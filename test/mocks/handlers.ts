import { http, HttpResponse } from 'msw'

const BASE_URL = 'https://open.feishu.cn'

// Mock data
export const mockToken = {
  tenant_access_token: 'test-tenant-token-12345',
  expire: 7200,
}

export const mockRecord = {
  record_id: 'rec_mock_001',
  fields: {
    Name: 'Test Record',
    Status: 'Active',
  },
  created_time: 1700000000000,
  last_modified_time: 1700000000000,
}

export const mockMessage = {
  message_id: 'msg_mock_001',
  root_id: '',
  parent_id: '',
  msg_type: 'text',
  create_time: '1700000000000',
  update_time: '1700000000000',
  deleted: false,
  chat_id: 'oc_mock_001',
}

// Handlers
export const handlers = [
  // Auth - Get tenant access token
  http.post(`${BASE_URL}/open-apis/auth/v3/tenant_access_token/internal`, async ({ request }) => {
    const body = (await request.json()) as { app_id: string; app_secret: string }

    if (body.app_id === 'invalid' || body.app_secret === 'invalid') {
      return HttpResponse.json({
        code: 99991663,
        msg: 'app_id or app_secret error',
      })
    }

    return HttpResponse.json({
      code: 0,
      ...mockToken,
    })
  }),

  // Bitable - Create record
  http.post(
    `${BASE_URL}/open-apis/bitable/v1/apps/:app_token/tables/:table_id/records`,
    async ({ request }) => {
      const body = (await request.json()) as { fields: Record<string, unknown> }
      const auth = request.headers.get('Authorization')

      if (!auth?.startsWith('Bearer ')) {
        return HttpResponse.json({ code: 99991401, msg: 'Unauthorized' }, { status: 401 })
      }

      return HttpResponse.json({
        code: 0,
        data: {
          record: {
            record_id: `rec_${Date.now()}`,
            fields: body.fields,
            created_time: Date.now(),
            last_modified_time: Date.now(),
          },
        },
      })
    }
  ),

  // Bitable - Get record
  http.get(
    `${BASE_URL}/open-apis/bitable/v1/apps/:app_token/tables/:table_id/records/:record_id`,
    ({ params }) => {
      if (params.record_id === 'not_found') {
        return HttpResponse.json({
          code: 1254040,
          msg: 'Record not found',
        })
      }

      return HttpResponse.json({
        code: 0,
        data: {
          record: {
            ...mockRecord,
            record_id: params.record_id,
          },
        },
      })
    }
  ),

  // Bitable - Update record
  http.put(
    `${BASE_URL}/open-apis/bitable/v1/apps/:app_token/tables/:table_id/records/:record_id`,
    async ({ request, params }) => {
      const body = (await request.json()) as { fields: Record<string, unknown> }

      return HttpResponse.json({
        code: 0,
        data: {
          record: {
            record_id: params.record_id,
            fields: body.fields,
            last_modified_time: Date.now(),
          },
        },
      })
    }
  ),

  // Bitable - Delete record
  http.delete(
    `${BASE_URL}/open-apis/bitable/v1/apps/:app_token/tables/:table_id/records/:record_id`,
    ({ params }) => {
      return HttpResponse.json({
        code: 0,
        data: {
          deleted: true,
          record_id: params.record_id,
        },
      })
    }
  ),

  // Bitable - List records
  http.get(
    `${BASE_URL}/open-apis/bitable/v1/apps/:app_token/tables/:table_id/records`,
    ({ request }) => {
      const url = new URL(request.url)
      const pageSize = Number(url.searchParams.get('page_size')) || 20
      const pageToken = url.searchParams.get('page_token')

      const items = Array.from({ length: Math.min(pageSize, 3) }, (_, i) => ({
        record_id: `rec_${pageToken ? 'page2_' : ''}${i + 1}`,
        fields: { Name: `Record ${i + 1}` },
      }))

      return HttpResponse.json({
        code: 0,
        data: {
          items,
          has_more: !pageToken,
          page_token: pageToken ? undefined : 'next_page_token',
          total: 6,
        },
      })
    }
  ),

  // Bitable - List fields
  http.get(`${BASE_URL}/open-apis/bitable/v1/apps/:app_token/tables/:table_id/fields`, () => {
    return HttpResponse.json({
      code: 0,
      data: {
        items: [
          { field_id: 'fld001', field_name: 'Name', type: 1, is_primary: true },
          { field_id: 'fld002', field_name: 'Status', type: 3, is_primary: false },
        ],
        has_more: false,
        total: 2,
      },
    })
  }),

  // IM - Send message
  http.post(`${BASE_URL}/open-apis/im/v1/messages`, async ({ request }) => {
    const url = new URL(request.url)
    const receiveIdType = url.searchParams.get('receive_id_type')
    const body = (await request.json()) as {
      receive_id: string
      msg_type: string
      content: string
    }

    if (!receiveIdType) {
      return HttpResponse.json({
        code: 230002,
        msg: 'receive_id_type is required',
      })
    }

    return HttpResponse.json({
      code: 0,
      data: {
        ...mockMessage,
        message_id: `msg_${Date.now()}`,
        msg_type: body.msg_type,
      },
    })
  }),

  // IM - Reply message
  http.post(
    `${BASE_URL}/open-apis/im/v1/messages/:message_id/reply`,
    async ({ request, params }) => {
      const body = (await request.json()) as { msg_type: string; content: string }

      return HttpResponse.json({
        code: 0,
        data: {
          ...mockMessage,
          message_id: `msg_reply_${Date.now()}`,
          parent_id: params.message_id,
          root_id: params.message_id,
          msg_type: body.msg_type,
        },
      })
    }
  ),
]
