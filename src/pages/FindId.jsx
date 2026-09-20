import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import Banner from '../components/Banner'
import Field from '../components/Field'
import { findUserId } from '../lib/auth'
import { rules } from '../lib/validate'

export default function FindId() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setResult(null)

    const next = { name: rules.name(name), email: rules.email(email) }
    setErrors(next)
    if (next.name || next.email) return

    setBusy(true)
    try {
      setResult(await findUserId(name, email))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthCard
      title="아이디 찾기"
      subtitle="가입할 때 입력한 이름과 이메일을 입력하세요."
      back={{ to: '/', label: '← 로그인으로 돌아가기' }}
    >
      <Banner tone="error">{error}</Banner>

      {result ? (
        <div className="result">
          <p className="result__label">회원님의 아이디</p>
          <p className="result__value">{result.userId}</p>
          <p className="result__meta">
            가입일 {new Date(result.createdAt).toLocaleDateString('ko-KR')}
          </p>
          <div className="actions">
            <Link className="btn btn--primary" to="/">로그인하기</Link>
            <Link className="btn btn--ghost" to="/find-password">비밀번호 찾기</Link>
          </div>
        </div>
      ) : (
        <form className="form" onSubmit={handleSubmit} noValidate>
          <Field label="이름" htmlFor="fi-name" required error={errors.name}>
            <input
              id="fi-name"
              className="input"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })) }}
              placeholder="홍길동"
            />
          </Field>

          <Field label="이메일" htmlFor="fi-email" required error={errors.email}>
            <input
              id="fi-email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })) }}
              placeholder="you@example.com"
            />
          </Field>

          <button className="btn btn--primary" type="submit" disabled={busy}>
            {busy ? '조회 중…' : '아이디 찾기'}
          </button>
        </form>
      )}
    </AuthCard>
  )
}
