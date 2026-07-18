export async function fetchJson(url, options = {}) {
  const response = await fetch(url, options)
  const contentType = response.headers.get('content-type') || ''
  const text = await response.text()

  let payload = null
  if (text) {
    try {
      payload = JSON.parse(text)
    } catch {
      payload = null
    }
  }

  if (!response.ok) {
    if (!payload) {
      if (text.startsWith('<')) {
        throw new Error('The backend API is unavailable. Start the backend server and try again.')
      }
      throw new Error(`Request failed with status ${response.status}`)
    }

    throw new Error(payload.message || 'Request failed')
  }

  if (!payload) {
    throw new Error('The server returned an invalid response.')
  }

  return payload
}
