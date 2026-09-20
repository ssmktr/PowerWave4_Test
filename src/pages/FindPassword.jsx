import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import Banner from '../components/Banner'
import Field from '../components/Field'
import { resetPassword } from '../lib/auth'
import { rules } from '../lib/validate'

export default function FindPassword() {
  const [userId, setUserId] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setResult(null)

    const next = { userId: rules.userId(userId), email: rules.email(email) }
    setErrors(next)
    if (next.userId || next.email) return

    setBusy(true)
    try {
      setResult(await resetPassword(userId, email))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthCard
      title="비밀번호 찾기"
      subtitle="아이디와 이메일을 확인해 임시 비밀번호를 발급합니다."
      back={{ to: '/', label: '← 로그인으로 돌아가기' }}
    >
      <Banner tone="error">{error}</Banner>

      {result ? (
        <div className="result">
          <p className="result__label">임시 비밀번호</p>
          <p className="result__value result__value--mono">{result.tempPassword}</p>
          <p className="result__meta">
            실제 서비스에서는 이메일로 발송됩니다. 로그인 후 비밀번호를 변경하세요.
          </p>
          <div className="actions">
            <Link className="btn btn--primary" to="/">로그인하기</Link>
          </div>
        </div>
      ) : (
        <form className="form" onSubmit={handleSubmit} noValidate>
          <Field label="아이디" htmlFor="fp-id" required error={errors.userId}>
            <input
              id="fp-id"
              className="input"
              value={userId}
              onChange={(e) => { setUserId(e.target.value); setErrors((p) => ({ ...p, userId: '' })) }}
              placeholder="powerwave"
            />
          </Field>

          <Field label="이메일" htmlFor="fp-email" required error={errors.email}>
            <input
              id="fp-email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })) }}
              placeholder="you@example.com"
            />
          </Field>

          <button className="btn btn--primary" type="submit" disabled={busy}>
            {busy ? '확인 중…' : '임시 비밀번호 발급'}
          </button>
        </form>
      )}
    </AuthCard>
  )
}
