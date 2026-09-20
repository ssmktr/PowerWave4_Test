import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import FindId from './pages/FindId'
import FindPassword from './pages/FindPassword'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { getSession, logout } from './lib/auth'

export default function App() {
  const [user, setUser] = useState(() => getSession())

  function handleLogout() {
    logout()
    setUser(null)
  }

  return (
    <main className="shell">
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/home" replace /> : <Login onLogin={setUser} />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/find-id" element={<FindId />} />
        <Route path="/find-password" element={<FindPassword />} />
        <Route
          path="/home"
          element={user ? <Home user={user} onLogout={handleLogout} /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  )
}
