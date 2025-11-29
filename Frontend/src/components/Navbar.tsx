import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand - Left */}
          <Link to={user?.role === 'Admin' ? '/' : '/tours'} className="flex items-center space-x-2 group flex-shrink-0">
            {/* Logo */}
            <img 
              src="/logo.png" 
              alt="Goldtours Logo" 
              className="h-14 w-auto object-contain group-hover:scale-105 transition-transform"
              onError={(e) => {
                // Fallback if image doesn't load
                console.error('Logo image failed to load')
              }}
            />
          </Link>

          {/* Navigation Links - Center */}
          <div className="hidden md:flex flex-1 justify-center items-center space-x-1 mx-8">
            {user?.role === 'Admin' && (
              <Link
                to="/"
                className={`px-4 py-2 rounded-full font-medium text-sm transition-all whitespace-nowrap ${
                  isActive('/')
                    ? 'bg-primary-100 text-primary-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </Link>
            )}
            <Link
              to="/tours"
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all whitespace-nowrap ${
                isActive('/tours')
                  ? 'bg-primary-100 text-primary-700 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Tours
            </Link>
            <Link
              to="/bookings"
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all whitespace-nowrap ${
                isActive('/bookings')
                  ? 'bg-primary-100 text-primary-700 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Bookings
            </Link>
          </div>

          {/* User Info & Logout - Right */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <div className="hidden sm:flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full border-2 border-primary-200 flex-shrink-0">
                <span className="text-primary-700 font-bold text-sm">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="text-left hidden lg:block">
                <p className="font-semibold text-gray-800 text-sm whitespace-nowrap">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-secondary text-sm px-4 py-2 rounded-full hover:shadow-md transition-all whitespace-nowrap"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
