import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import Banner from '../components/Banner'
import Field from '../components/Field'
import { isUserIdTaken, signUp } from '../lib/auth'
import { formatPhone, passwordStrength, rules } from '../lib/validate'

const EMPTY = {
  userId: '',
  password: '',
  passwordConfirm: '',
  email: '',
  name: '',
  postcode: '',
  address: '',
  addressDetail: '',
  phone: '',
  note: '',
}

const STRENGTH_LABEL = ['매우 약함', '약함', '보통', '안전', '매우 안전']

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [idCheck, setIdCheck] = useState(null) // { ok, message }
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
    if (key === 'userId') setIdCheck(null)
  }

  function validate() {
    const next = {
      userId: rules.userId(form.userId),
      password: rules.password(form.password),
      passwordConfirm: form.password !== form.passwordConfirm ? '비밀번호가 일치하지 않습니다.' : '',
      email: rules.email(form.email),
      name: rules.name(form.name),
      postcode: rules.postcode(form.postcode),
      address: rules.address(form.address),
      phone: rules.phone(form.phone),
    }
    setErrors(next)
    return Object.values(next).every((v) => !v)
  }

  async function handleIdCheck() {
    const message = rules.userId(form.userId)
    if (message) {
      setErrors((prev) => ({ ...prev, userId: message }))
      return
    }
    setIdCheck({ pending: true })
    const taken = await isUserIdTaken(form.userId)
    setIdCheck(
      taken
        ? { ok: false, message: '이미 사용 중인 아이디입니다.' }
        : { ok: true, message: '사용할 수 있는 아이디입니다.' },
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!validate()) return
    if (!idCheck?.ok) {
      setError('아이디 중복확인을 진행해주세요.')
      return
    }

    setBusy(true)
    try {
      await signUp(form)
      navigate('/', {
        replace: true,
        state: { notice: '회원가입이 완료되었습니다. 로그인해주세요.' },
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const strength = passwordStrength(form.password)

  return (
    <AuthCard
      title="회원가입"
      subtitle="필수 정보를 입력해 계정을 만드세요."
      wide
      back={{ to: '/', label: '← 로그인으로 돌아가기' }}
    >
      <Banner tone="error">{error}</Banner>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <Field
          label="아이디"
          htmlFor="su-id"
          required
          error={errors.userId}
          hint={idCheck?.message ?? '영문·숫자·밑줄 4~20자'}
          addon={
            <button
              type="button"
              className="btn btn--outline btn--inline"
              onClick={handleIdCheck}
              disabled={idCheck?.pending}
            >
              중복확인
            </button>
          }
        >
          <input
            id="su-id"
            className="input"
            value={form.userId}
            onChange={(e) => set('userId', e.target.value)}
            autoComplete="username"
            placeholder="powerwave"
          />
        </Field>
        {idCheck?.ok === true && <p className="inline-ok">✓ {idCheck.message}</p>}
        {idCheck?.ok === false && <p className="inline-bad">✕ {idCheck.message}</p>}

        <div className="grid grid--2">
          <Field label="비밀번호" htmlFor="su-pw" required error={errors.password}>
            <input
              id="su-pw"
              className="input"
              type="password"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              autoComplete="new-password"
              placeholder="영문+숫자 8자 이상"
            />
          </Field>

          <Field
            label="비밀번호 확인"
            htmlFor="su-pw2"
            required
            error={errors.passwordConfirm}
          >
            <input
              id="su-pw2"
              className="input"
              type="password"
              value={form.passwordConfirm}
              onChange={(e) => set('passwordConfirm', e.target.value)}
              autoComplete="new-password"
              placeholder="한 번 더 입력"
            />
          </Field>
        </div>

        {form.password && (
          <div className="meter" aria-label={`비밀번호 강도: ${STRENGTH_LABEL[strength]}`}>
            <div className="meter__track">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={`meter__seg${i < strength ? ` is-on lv${strength}` : ''}`} />
              ))}
            </div>
            <span className="meter__label">{STRENGTH_LABEL[strength]}</span>
          </div>
        )}

        <div className="grid grid--2">
          <Field label="이름" htmlFor="su-name" required error={errors.name}>
            <input
              id="su-name"
              className="input"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              autoComplete="name"
              placeholder="홍길동"
            />
          </Field>

          <Field
            label="연락처"
            htmlFor="su-phone"
            required
            error={errors.phone}
            hint="숫자만 입력하면 자동으로 하이픈이 붙습니다."
          >
            <input
              id="su-phone"
              className="input"
              inputMode="numeric"
              value={form.phone}
              onChange={(e) => set('phone', formatPhone(e.target.value))}
              autoComplete="tel"
              placeholder="010-1234-5678"
            />
          </Field>
        </div>

        <Field label="이메일" htmlFor="su-email" required error={errors.email}>
          <input
            id="su-email"
            className="input"
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
          />
        </Field>

        <Field label="우편번호" htmlFor="su-zip" required error={errors.postcode}>
          <input
            id="su-zip"
            className="input input--short"
            inputMode="numeric"
            value={form.postcode}
            onChange={(e) => set('postcode', e.target.value.replace(/\D/g, '').slice(0, 5))}
            autoComplete="postal-code"
            placeholder="06234"
          />
        </Field>

        <Field label="주소" htmlFor="su-addr" required error={errors.address}>
          <input
            id="su-addr"
            className="input"
            value={form.address}
            onChange={(e) => set('address', e.target.value)}
            autoComplete="street-address"
            placeholder="서울특별시 강남구 테헤란로 123"
          />
        </Field>

        <Field label="상세주소" htmlFor="su-addr2">
          <input
            id="su-addr2"
            className="input"
            value={form.addressDetail}
            onChange={(e) => set('addressDetail', e.target.value)}
            placeholder="4층 401호 (선택)"
          />
        </Field>

        <Field label="기타 정보" htmlFor="su-note" hint="가입 경로, 소속, 요청사항 등 (선택)">
          <textarea
            id="su-note"
            className="input input--area"
            rows={3}
            value={form.note}
            onChange={(e) => set('note', e.target.value)}
            placeholder="자유롭게 입력하세요."
          />
        </Field>

        <button className="btn btn--primary" type="submit" disabled={busy}>
          {busy ? '가입 처리 중…' : '가입하기'}
        </button>
      </form>
    </AuthCard>
  )
}
