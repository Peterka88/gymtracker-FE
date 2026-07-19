import { Navigate, Outlet } from 'react-router-dom'
import { TOKEN_KEY } from '../api/client.ts'
import { isTokenExpired } from '../utils/jwt.ts'

function ProtectedRoute() {
  const token = localStorage.getItem(TOKEN_KEY)

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem("name")
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute