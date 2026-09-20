import { useEffect, useState } from 'react'
import { birthdayInfo, calcAge } from '../lib/birthday'
import { listClassmates } from '../lib/auth'

/** 명단에서는 가운데 자리를 가린다. 010-1234-5678 → 010-****-5678 */
function maskPhone(phone) {
  return phone ? phone.replace(/-\d{3,4}-/, '-****-') : '—'
}

export default function Classmates({ user }) {
  const [rows, setRows] = useState(null)

  useEffect(() => {
    listClassmates().then(setRows)
  }, [])

  if (rows === null) {
    return (
      <div className="page">
        <p className="empty">불러오는 중…</p>
      </div>
    )
  }

  return (
    <div className="page">
      <header className="page__head">
        <h1 className="page__title">반친구</h1>
        <p className="page__sub">함께하는 {rows.length}명의 친구들입니다.</p>
      </header>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>이름</th>
              <th>나이</th>
              <th>생일</th>
              <th>연락처</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const age = calcAge(row.birth)
              const bday = birthdayInfo(row.birth)
              const isMe = row.userId === user.userId
              return (
                <tr key={row.userId} className={isMe ? 'is-me' : undefined}>
                  <td>
                    {row.name}
                    {isMe && <span className="tag">나</span>}
                  </td>
                  <td>{age === null ? '—' : `만 ${age}세`}</td>
                  <td>
                    {bday ? bday.label : '—'}
                    {bday?.isToday && <span className="dday dday--today">오늘!</span>}
                  </td>
                  <td className="is-mono">{maskPhone(row.phone)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
