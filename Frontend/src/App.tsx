import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Tours from './pages/Tours'
import Bookings from './pages/Bookings'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import Navbar from './components/Navbar'

function AppRoutes() {
    const { user } = useAuth()

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/"
                    element={
                        <AdminRoute>
                            <>
                                {user && <Navbar />}
                                <Dashboard />
                            </>
                        </AdminRoute>
                    }
                />
                <Route
                    path="/tours"
                    element={
                        <PrivateRoute>
                            <>
                                {user && <Navbar />}
                                <Tours />
                            </>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/bookings"
                    element={
                        <PrivateRoute>
                            <>
                                {user && <Navbar />}
                                <Bookings />
                            </>
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/tours" replace />} />
            </Routes>
        </Router>
    )
}

function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    )
}

export default App
