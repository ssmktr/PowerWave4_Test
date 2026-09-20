import { NavLink, Outlet } from 'react-router-dom'

const NAV = [
  { to: '/main', label: '메인' },
  { to: '/prayers', label: '나의 기도 제목' },
  { to: '/classmates', label: '반친구' },
]

export default function AppLayout({ user, onLogout }) {
  return (
    <div className="app">
      <header className="nav">
        <div className="nav__inner">
          <div className="brand">
            <span className="brand__mark" aria-hidden="true" />
            <span className="brand__name">PowerWave4</span>
          </div>

          <nav className="nav__menu">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav__link${isActive ? ' is-active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="nav__right">
            <span className="nav__user">{user.name}님</span>
            <button className="btn btn--ghost btn--inline" type="button" onClick={onLogout}>
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="app__body">
        <Outlet />
      </div>

      <footer className="foot">
        <div className="foot__inner">
          <strong className="foot__org">온누리교회 파워웨이브 4부</strong>
          <span className="foot__sep" aria-hidden="true">·</span>
          <span>연락처 : 02-1234-5678</span>
          <span className="foot__sep" aria-hidden="true">·</span>
          <span>Email : powerwave4@example.com</span>
        </div>
      </footer>
    </div>
  )
}
