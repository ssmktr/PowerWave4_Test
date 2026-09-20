import { Link } from 'react-router-dom'

export default function AuthCard({ title, subtitle, back, wide = false, children }) {
  return (
    <div className={`card${wide ? ' card--wide' : ''}`}>
      <header className="card__head">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true" />
          <span className="brand__name">PowerWave4</span>
        </div>
        <h1 className="card__title">{title}</h1>
        {subtitle && <p className="card__subtitle">{subtitle}</p>}
      </header>

      {children}

      {back && (
        <p className="card__back">
          <Link to={back.to}>{back.label}</Link>
        </p>
      )}
    </div>
  )
}
