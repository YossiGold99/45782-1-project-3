export interface User {
  id: number
  firstName: string
  lastName: string
  username: string
  email: string
  role: 'User' | 'Admin'
}

export interface Tour {
  id: number
  title: string
  description: string | null
  destination: string
  price: number
  duration: number
  availableSpots: number
  startDate: string | null
  endDate: string | null
  imageUrl: string | null
  isActive: boolean
  likesCount?: number
}

export interface Booking {
  id: number
  userId: number
  tourId: number
  numberOfPersons: number
  totalPrice: number
  bookingDate: string
  status: 'Pending' | 'Confirmed' | 'Cancelled'
  tour?: Tour
  user?: User
}

export interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}
