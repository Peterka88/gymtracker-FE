import { Navigate, Outlet } from 'react-router-dom'
import { TOKEN_KEY } from '../api/client.ts'

function ProtectedRoute() {
  const token = localStorage.getItem(TOKEN_KEY)

  if (!token) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute