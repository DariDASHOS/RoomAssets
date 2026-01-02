// frontend/src/store/db.ts
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const API_BASE = import.meta.env.PROD
  ? 'https://roomassets.onrender.com/api'
  : 'http://localhost:3000/api'



export type Room = {
  id: string
  name: string
  capacity: number
  features: string[]
  createdAt?: string
}

export type Asset = {
  id: string
  name: string
  inventoryCode?: string
  status?: string
  createdAt?: string
}

export type Booking = {
  id: string
  resourceType: 'room' | 'asset'
  resourceId: string
  title: string
  start: string
  end: string  
  notes?: string
  createdAt?: string
}

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {}

  if (opts.body != null) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'omit',
    ...opts,
    headers: {
      ...headers,
      ...(opts.headers as Record<string, string> | undefined),
    },
  })

  if (res.status === 204) {
    return undefined as unknown as T
  }

  const text = await res.text()
  const body = text && text.length ? JSON.parse(text) : null

  if (!res.ok) {
    const msg = (body && (body.detail || body.message)) || res.statusText || `HTTP ${res.status}`
    throw new Error(msg)
  }

  return body as T
}

export async function listRooms(): Promise<Room[]> {
  return request<Room[]>('/rooms', { method: 'GET' })
}

export async function listAssets(): Promise<Asset[]> {
  return request<Asset[]>('/assets', { method: 'GET' })
}

export async function listBookings(): Promise<Booking[]> {
  return request<Booking[]>('/bookings', { method: 'GET' })
}

export async function createBooking(b: Booking): Promise<Booking> {
  return request<Booking>('/bookings', {
    method: 'POST',
    body: JSON.stringify(b),
  })
}

export async function updateBooking(b: Booking): Promise<Booking> {
  return request<Booking>(`/bookings/${encodeURIComponent(b.id)}`, {
    method: 'PUT',
    body: JSON.stringify(b),
  })
}

export async function deleteBooking(id: string): Promise<void> {
  return request<void>(`/bookings/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}

export async function importAll(data: {
  rooms?: Room[]
  assets?: Asset[]
  bookings?: Booking[]
}): Promise<void> {
  const safePost = async (path: string, payload: any) => {
    try {
      await request(path, { method: 'POST', body: JSON.stringify(payload) })
    } catch (err) {
      const message = (err as Error).message || String(err)
      if (message.includes('Not Found') || message.includes('404')) {
        return
      }
      console.error(`importAll: failed POST ${path}:`, err)
      throw err
    }
  }

  if (Array.isArray(data.rooms)) {
    for (const r of data.rooms) {
      await safePost('/rooms', r)
    }
  }

  if (Array.isArray(data.assets)) {
    for (const a of data.assets) {
      await safePost('/assets', a)
    }
  }

  if (Array.isArray(data.bookings)) {
    for (const b of data.bookings) {
      try {
        await createBooking(b)
      } catch (err) {
        const message = (err as Error).message || String(err)
        if (message.includes('Not Found') || message.includes('404')) {
          await safePost('/bookings', b)
        } else {
          console.error('importAll: failed creating booking', err)
          throw err
        }
      }
    }
  }
}

console.log('PROD:', import.meta.env.PROD)
console.log('API_BASE:', API_BASE)
