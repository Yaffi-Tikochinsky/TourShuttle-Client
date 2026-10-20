import { ApiError } from '@/lib/errors'
import { sessionStore } from '@/lib/session'

/** Empty in development (Vite proxies /api); the deployed API's URL in a production build. */
const BASE_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface RequestOptions {
  body?: unknown
  query?: Record<string, string | number | boolean | undefined | null>
  /** Lets a component cancel the request when it unmounts or the input changes. */
  signal?: AbortSignal
}

/**
 * The one place that talks HTTP. Every request:
 * - carries the JWT when someone is signed in,
 * - turns any error body into an ApiError (one error type for the whole UI),
 * - ends the session on a 401, since the token expired or was rejected.
 */
async function request<T>(method: HttpMethod, path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'

  const token = sessionStore.getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(BASE_URL + path + toQueryString(options.query), {
      method,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: options.signal,
    })
  } catch (error) {
    // A cancelled request is not a failure: let the caller ignore it.
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw ApiError.network()
  }

  // Only a request that carried a token can mean "your session is over"; a failed login is just a 401.
  if (response.status === 401 && token) sessionStore.end('expired')

  if (!response.ok) throw await ApiError.fromResponse(response)
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

function toQueryString(query: RequestOptions['query']): string {
  if (!query) return ''
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value))
  }
  const text = params.toString()
  return text ? `?${text}` : ''
}

export const http = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'body'>) => request<T>('GET', path, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>('POST', path, { ...options, body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>('PUT', path, { ...options, body }),
  delete: <T = void>(path: string, options?: RequestOptions) => request<T>('DELETE', path, options),
}
