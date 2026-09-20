import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import Banner from '../components/Banner'
import Field from '../components/Field'
import { login } from '../lib/auth'

export default function Login({ onLogin }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const notice = location.state?.notice

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!userId.trim() || !password) {
      setError('아이디와 비밀번호를 모두 입력해주세요.')
      return
    }

    setBusy(true)
    try {
      const user = await login(userId, password)
      onLogin(user)
      navigate('/main', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthCard title="로그인" subtitle="PowerWave4 계정으로 시작하세요.">
      <Banner tone="success">{notice}</Banner>
      <Banner tone="error">{error}</Banner>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <Field label="아이디" htmlFor="login-id">
          <input
            id="login-id"
            className="input"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            autoComplete="username"
            placeholder="아이디를 입력하세요"
          />
        </Field>

        <Field label="비밀번호" htmlFor="login-pw">
          <input
            id="login-pw"
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="비밀번호를 입력하세요"
          />
        </Field>

        <button className="btn btn--primary" type="submit" disabled={busy}>
          {busy ? '확인 중…' : '로그인'}
        </button>
      </form>

      <div className="divider"><span>또는</span></div>

      <div className="actions">
        <Link className="btn btn--outline" to="/signup">회원가입</Link>
        <div className="actions__row">
          <Link className="btn btn--ghost" to="/find-id">아이디 찾기</Link>
          <Link className="btn btn--ghost" to="/find-password">비밀번호 찾기</Link>
        </div>
      </div>
    </AuthCard>
  )
}
