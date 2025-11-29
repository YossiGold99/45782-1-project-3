import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getTours, createBooking, exportToursCSV, exportToursExcel, likeTour, unlikeTour, checkTourLiked } from '../services/api'
import { Tour, Pagination } from '../types'

const Tours = () => {
  const { user } = useAuth()
  const [tours, setTours] = useState<Tour[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [destination, setDestination] = useState('')
  const [loading, setLoading] = useState(true)
  const [bookingModal, setBookingModal] = useState<{ tour: Tour | null; show: boolean }>({
    tour: null,
    show: false
  })
  const [numberOfPersons, setNumberOfPersons] = useState(1)
  const [likedTours, setLikedTours] = useState<Record<number, boolean>>({})

  useEffect(() => {
    fetchTours()
  }, [page, search, destination])

  useEffect(() => {
    // Check which tours are liked by current user
    const checkLikes = async () => {
      if (!user || tours.length === 0) return
      
      const likedMap: Record<number, boolean> = {}
      for (const tour of tours) {
        try {
          const result = await checkTourLiked(tour.id)
          likedMap[tour.id] = result.liked
        } catch (error) {
          console.error(`Error checking like for tour ${tour.id}:`, error)
        }
      }
      setLikedTours(likedMap)
    }
    
    checkLikes()
  }, [tours, user])

  const fetchTours = async () => {
    setLoading(true)
    try {
      const data = await getTours(page, search, destination, false, 4)
      setTours(data.tours)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching tours:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBook = async () => {
    if (!bookingModal.tour) return

    try {
      await createBooking(bookingModal.tour.id, numberOfPersons)
      alert('Booking created successfully!')
      setBookingModal({ tour: null, show: false })
      setNumberOfPersons(1)
      fetchTours() // Refresh tours to update available spots
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error creating booking')
    }
  }

  const handleExportCSV = () => {
    exportToursCSV()
  }

  const handleExportExcel = () => {
    exportToursExcel()
  }

  const handleLike = async (tourId: number) => {
    try {
      if (likedTours[tourId]) {
        await unlikeTour(tourId)
        setLikedTours((prev: Record<number, boolean>) => ({ ...prev, [tourId]: false }))
        setTours((prev: Tour[]) => prev.map(t => 
          t.id === tourId 
            ? { ...t, likesCount: (t.likesCount || 0) - 1 }
            : t
        ))
      } else {
        await likeTour(tourId)
        setLikedTours((prev: Record<number, boolean>) => ({ ...prev, [tourId]: true }))
        setTours((prev: Tour[]) => prev.map(t => 
          t.id === tourId 
            ? { ...t, likesCount: (t.likesCount || 0) + 1 }
            : t
        ))
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error liking/unliking tour')
    }
  }

  const getImageUrl = (tour: Tour) => {
    if (tour.imageUrl && !tour.imageUrl.includes('example.com')) {
      return tour.imageUrl
    }
    const destinationMap: Record<string, string> = {
      'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop',
      'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop',
      'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop',
      'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=400&fit=crop',
      'rome': 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=600&h=400&fit=crop'
    }
    const dest = tour.destination.toLowerCase()
    for (const key in destinationMap) {
      if (dest.includes(key)) {
        return destinationMap[key]
      }
    }
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop'
  }

  if (loading && tours.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading amazing tours...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 text-white py-16 shadow-lg">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Your Next Adventure</h1>
              <p className="text-xl text-primary-100">Explore breathtaking destinations around the world</p>
            </div>
            {user?.role === 'Admin' && (
              <div className="mt-6 md:mt-0 flex space-x-3">
                <button onClick={handleExportCSV} className="btn btn-outline bg-white text-primary-600 border-white hover:bg-primary-50">
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export CSV
                </button>
                <button onClick={handleExportExcel} className="btn btn-outline bg-white text-primary-600 border-white hover:bg-primary-50">
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Excel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search tours by title or description..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="input pl-10 w-full"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Filter by destination..."
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value)
                  setPage(1)
                }}
                className="input pl-10 w-full"
              />
            </div>
          </div>
        </div>

        {/* Tours Grid */}
        {tours.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 text-gray-600 text-lg">No tours found. Try adjusting your search filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {tours.map((tour) => (
              <div key={tour.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-400 to-accent-400">
                  <img
                    src={getImageUrl(tour)}
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop'
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <div className="bg-white bg-opacity-90 rounded-full px-3 py-1 flex items-center space-x-1 text-sm font-semibold text-red-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      <span>{tour.likesCount || 0}</span>
                    </div>
                  </div>
                  {tour.availableSpots === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">Sold Out</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{tour.title}</h3>
                  <p className="text-primary-600 font-semibold mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {tour.destination}
                  </p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tour.description}</p>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {tour.duration} days
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {tour.availableSpots} spots
                    </div>
                    {tour.startDate && (
                      <div className="flex items-center text-gray-600 col-span-2">
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(tour.startDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl font-bold text-primary-600">${tour.price}</span>
                    <span className="text-gray-500 text-sm ml-1">per person</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleLike(tour.id)}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                        likedTours[tour.id]
                          ? 'bg-red-100 text-red-700 hover:bg-red-200 border-2 border-red-300'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300'
                      }`}
                    >
                      {likedTours[tour.id] ? (
                        <span className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                          Liked
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          Like
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setBookingModal({ tour, show: true })}
                      disabled={tour.availableSpots === 0}
                      className={`flex-1 btn btn-primary ${
                        tour.availableSpots === 0
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:shadow-lg transform hover:scale-105'
                      }`}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-white rounded-lg shadow-md text-gray-700 font-medium">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {bookingModal.show && bookingModal.tour && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setBookingModal({ tour: null, show: false })}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Book Tour</h2>
              <button
                onClick={() => setBookingModal({ tour: null, show: false })}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <h3 className="text-xl font-semibold text-primary-600 mb-4">{bookingModal.tour.title}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Persons
                </label>
                <input
                  type="number"
                  min="1"
                  max={bookingModal.tour.availableSpots}
                  value={numberOfPersons}
                  onChange={(e) => setNumberOfPersons(parseInt(e.target.value) || 1)}
                  className="input w-full"
                />
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Price per person:</span>
                  <span className="font-semibold">${bookingModal.tour.price}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Number of persons:</span>
                  <span className="font-semibold">{numberOfPersons}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Total Price:</span>
                    <span className="text-2xl font-bold text-primary-600">
                      ${(bookingModal.tour.price * numberOfPersons).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setBookingModal({ tour: null, show: false })}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button onClick={handleBook} className="btn btn-primary flex-1">
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tours
