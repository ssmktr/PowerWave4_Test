import { useState } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import Classmates from './pages/Classmates'
import FindId from './pages/FindId'
import FindPassword from './pages/FindPassword'
import FreeBoard from './pages/FreeBoard'
import Login from './pages/Login'
import Main from './pages/Main'
import MyPrayers from './pages/MyPrayers'
import Notices from './pages/Notices'
import Signup from './pages/Signup'
import { getSession, logout } from './lib/auth'

export default function App() {
  const [user, setUser] = useState(() => getSession())

  function handleLogout() {
    logout()
    setUser(null)
  }

  return (
    <Routes>
      {/* 로그인 전 화면: 가운데 정렬된 카드 레이아웃 */}
      <Route element={<main className="shell"><Outlet /></main>}>
        <Route
          path="/"
          element={user ? <Navigate to="/main" replace /> : <Login onLogin={setUser} />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/find-id" element={<FindId />} />
        <Route path="/find-password" element={<FindPassword />} />
      </Route>

      {/* 로그인한 계정만 접근 가능 */}
      <Route
        element={
          user ? <AppLayout user={user} onLogout={handleLogout} /> : <Navigate to="/" replace />
        }
      >
        <Route path="/main" element={<Main user={user} />} />
        <Route path="/prayers" element={<MyPrayers user={user} />} />
        <Route path="/classmates" element={<Classmates user={user} />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/board" element={<FreeBoard user={user} />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
