import { birthdayInfo, calcAge, formatBirth } from '../lib/birthday'

export default function ProfileBox({ user }) {
  const age = calcAge(user.birth)
  const bday = birthdayInfo(user.birth)

  return (
    <section className="profile" aria-label="내 정보">
      <div className="profile__head">
        <div className="profile__avatar" aria-hidden="true">{user.name.slice(-2)}</div>
        <div>
          <p className="profile__name">{user.name}</p>
          <p className="profile__id">@{user.userId}</p>
        </div>
      </div>

      <dl className="profile__list">
        <div>
          <dt>나이</dt>
          <dd>{age === null ? '—' : `만 ${age}세`}</dd>
        </div>
        <div>
          <dt>생일</dt>
          <dd>
            {bday ? bday.label : '—'}
            {bday && (
              <span className={`dday${bday.isToday ? ' dday--today' : ''}`}>
                {bday.isToday ? '오늘!' : `D-${bday.dday}`}
              </span>
            )}
          </dd>
        </div>
        <div>
          <dt>생년월일</dt>
          <dd>{formatBirth(user.birth)}</dd>
        </div>
        <div>
          <dt>연락처</dt>
          <dd>{user.phone || '미입력'}</dd>
        </div>
        <div>
          <dt>이메일</dt>
          <dd className="is-break">{user.email || '미입력'}</dd>
        </div>
      </dl>

      {bday?.isToday && (
        <p className="profile__cake">🎂 생일을 축하합니다!</p>
      )}
    </section>
  )
}
