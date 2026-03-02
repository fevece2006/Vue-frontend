const TOKEN_KEY = 'jwt_token'
const EVENT_NAME = 'auth:token-changed'

type TokenListener = (token: string | null) => void

const readFromStorage = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

const emitTokenChanged = (token: string | null) => {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent<string | null>(EVENT_NAME, { detail: token }))
}

export const tokenStorage = {
  get(): string | null {
    return readFromStorage()
  },

  set(token: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token)
    } catch {
      // ignore
    }
    emitTokenChanged(token)
  },

  clear(): void {
    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch {
      // ignore
    }
    emitTokenChanged(null)
  },

  subscribe(listener: TokenListener): () => void {
    if (typeof window === 'undefined') return () => undefined

    const handler = (event: Event) => {
      const custom = event as CustomEvent<string | null>
      listener(custom.detail ?? null)
    }

    window.addEventListener(EVENT_NAME, handler)
    return () => window.removeEventListener(EVENT_NAME, handler)
  },
} as const
