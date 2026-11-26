export interface Location {
  id: number
  name: string
  building: string
  floor: number
  status: string
  description: string
}

export interface Page<T> {
  items: T[]
  page: number
  size: number
  totalItems: number
  totalPages: number
}

export interface Ticket {
  id: number
  resourceId: number
  resourceName: string
  description: string
  status: 'OPEN' | 'CLOSED'
}
