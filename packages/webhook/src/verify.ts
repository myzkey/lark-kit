/**
 * Verify webhook signature from Lark
 * @see https://open.feishu.cn/document/ukTMukTMukTM/uYDNxYjL2QTM24iN0EjN/event-subscription-configure-/encrypt-key-encryption-configuration-case
 */
export async function verifySignature(
  timestamp: string,
  nonce: string,
  encryptKey: string,
  body: string,
  signature: string
): Promise<boolean> {
  const content = timestamp + nonce + encryptKey + body
  const encoder = new TextEncoder()
  const data = encoder.encode(content)

  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

  return hashHex === signature
}

/**
 * Decrypt encrypted event body
 * @see https://open.feishu.cn/document/ukTMukTMukTM/uYDNxYjL2QTM24iN0EjN/event-subscription-configure-/encrypt-key-encryption-configuration-case
 */
export async function decryptEvent(encryptKey: string, encrypt: string): Promise<string> {
  const key = await deriveKey(encryptKey)
  const encryptedData = base64ToArrayBuffer(encrypt)

  // First 16 bytes are IV
  const iv = encryptedData.slice(0, 16)
  const ciphertext = encryptedData.slice(16)

  const decrypted = await crypto.subtle.decrypt({ name: 'AES-CBC', iv }, key, ciphertext)

  const decoder = new TextDecoder()
  const decryptedText = decoder.decode(decrypted)

  // Remove PKCS7 padding
  const padLength = decryptedText.charCodeAt(decryptedText.length - 1)
  return decryptedText.slice(0, -padLength)
}

async function deriveKey(encryptKey: string) {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(encryptKey)
  const hashBuffer = await crypto.subtle.digest('SHA-256', keyData)

  return crypto.subtle.importKey('raw', hashBuffer, { name: 'AES-CBC' }, false, ['decrypt'])
}

function base64ToArrayBuffer(base64: string): Uint8Array {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}
