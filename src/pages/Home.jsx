import AuthCard from '../components/AuthCard'

export default function Home({ user, onLogout }) {
  const rows = [
    ['아이디', user.userId],
    ['이름', user.name],
    ['이메일', user.email],
    ['연락처', user.phone],
    ['주소', [`(${user.postcode})`, user.address, user.addressDetail].filter(Boolean).join(' ')],
    ['기타 정보', user.note || '—'],
    ['가입일', new Date(user.createdAt).toLocaleString('ko-KR')],
  ]

  return (
    <AuthCard title={`${user.name}님, 환영합니다`} subtitle="로그인에 성공했습니다." wide>
      <dl className="info">
        {rows.map(([label, value]) => (
          <div className="info__row" key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <button className="btn btn--outline" type="button" onClick={onLogout}>
        로그아웃
      </button>
    </AuthCard>
  )
}
