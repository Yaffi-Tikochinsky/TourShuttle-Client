/**
 * The error body every failed API call returns (ProblemDetails, unified on the server in stage 6).
 * `errors` is present on automatic 400 validation responses: field name -> messages.
 */
export interface ProblemDetails {
  type?: string
  title?: string
  status?: number
  detail?: string
  correlationId?: string
  errors?: Record<string, string[]>
}

/** Thrown by the API client for any non-2xx response, or with status 0 when the server cannot be reached. */
export class ApiError extends Error {
  readonly status: number
  readonly detail: string | undefined
  readonly correlationId: string | undefined
  readonly fieldErrors: Record<string, string[]>

  constructor(status: number, title: string, detail?: string, correlationId?: string, fieldErrors: Record<string, string[]> = {}) {
    super(detail ?? title)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
    this.correlationId = correlationId
    this.fieldErrors = fieldErrors
  }

  static async fromResponse(response: Response): Promise<ApiError> {
    let problem: ProblemDetails = {}
    try {
      problem = (await response.json()) as ProblemDetails
    } catch {
      // Not JSON (for example a proxy error page); the status alone still tells the story.
    }
    return new ApiError(
      response.status,
      problem.title ?? response.statusText,
      problem.detail,
      problem.correlationId ?? response.headers.get('X-Correlation-Id') ?? undefined,
      problem.errors ?? {},
    )
  }

  static network(): ApiError {
    return new ApiError(0, 'Network error', 'The server could not be reached.')
  }

  /** A short Hebrew headline for the UI. The server's English `detail` is shown under it. */
  get headline(): string {
    return headlineForStatus(this.status)
  }

  /** The first message for a form field, matching the server's DTO property name case-insensitively. */
  fieldError(field: string): string | undefined {
    const key = Object.keys(this.fieldErrors).find((k) => k.toLowerCase() === field.toLowerCase())
    return key ? this.fieldErrors[key]?.[0] : undefined
  }
}

export function headlineForStatus(status: number): string {
  switch (status) {
    case 0:
      return 'אין חיבור לשרת'
    case 400:
      return 'יש לתקן את הפרטים'
    case 401:
      return 'נדרשת התחברות'
    case 403:
      return 'אין לך הרשאה לפעולה הזו'
    case 404:
      return 'לא מצאנו את מה שחיפשת'
    case 409:
      return 'הפעולה התנגשה עם שינוי אחר'
    default:
      return status >= 500 ? 'תקלה בשרת, נסו שוב בעוד רגע' : 'משהו השתבש'
  }
}

/** Any thrown value as an ApiError, so components handle one error type. */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error
  return new ApiError(-1, 'Unexpected error', error instanceof Error ? error.message : String(error))
}
