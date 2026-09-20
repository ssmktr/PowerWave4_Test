import { parseBirth } from './birthday.js'

export const rules = {
  userId: (v) => {
    if (!v.trim()) return '아이디를 입력해주세요.'
    if (!/^[a-zA-Z0-9_]{4,20}$/.test(v.trim())) return '영문·숫자·밑줄 4~20자로 입력해주세요.'
    return ''
  },
  password: (v) => {
    if (!v) return '비밀번호를 입력해주세요.'
    if (v.length < 8) return '8자 이상 입력해주세요.'
    if (!/[a-zA-Z]/.test(v) || !/[0-9]/.test(v)) return '영문과 숫자를 모두 포함해주세요.'
    return ''
  },
  // 아이디·비밀번호 찾기에서는 이메일이 반드시 필요하므로 required 버전을 따로 둔다.
  email: (v) => {
    if (!v.trim()) return '이메일을 입력해주세요.'
    return rules.emailOptional(v)
  },
  emailOptional: (v) => {
    if (!v.trim()) return ''
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return '이메일 형식이 올바르지 않습니다.'
    return ''
  },
  name: (v) => {
    if (!v.trim()) return '이름을 입력해주세요.'
    if (v.trim().length < 2) return '2자 이상 입력해주세요.'
    return ''
  },
  phoneOptional: (v) => {
    if (!v.trim()) return ''
    if (!/^01[016789]-\d{3,4}-\d{4}$/.test(v.trim())) return '010-1234-5678 형식으로 입력해주세요.'
    return ''
  },
  birth: (v) => {
    if (!v.trim()) return '생년월일을 입력해주세요.'
    const date = parseBirth(v)
    if (!date) return '올바른 날짜가 아닙니다.'
    if (date > new Date()) return '미래 날짜는 입력할 수 없습니다.'
    if (date.getFullYear() < 1900) return '1900년 이후로 입력해주세요.'
    return ''
  },
  address: (v) => (v.trim() ? '' : '주소를 입력해주세요.'),
  postcode: (v) => {
    if (!v.trim()) return '우편번호를 입력해주세요.'
    if (!/^\d{5}$/.test(v.trim())) return '5자리 숫자로 입력해주세요.'
    return ''
  },
}

export function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length < 4) return digits
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, digits.length - 4)}-${digits.slice(-4)}`
}

export function passwordStrength(v) {
  let score = 0
  if (v.length >= 8) score += 1
  if (v.length >= 12) score += 1
  if (/[a-z]/.test(v) && /[A-Z]/.test(v)) score += 1
  if (/[0-9]/.test(v)) score += 1
  if (/[^a-zA-Z0-9]/.test(v)) score += 1
  return Math.min(score, 4) // 0~4
}
