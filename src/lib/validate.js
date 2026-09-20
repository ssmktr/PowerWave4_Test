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
  email: (v) => {
    if (!v.trim()) return '이메일을 입력해주세요.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return '이메일 형식이 올바르지 않습니다.'
    return ''
  },
  name: (v) => {
    if (!v.trim()) return '이름을 입력해주세요.'
    if (v.trim().length < 2) return '2자 이상 입력해주세요.'
    return ''
  },
  phone: (v) => {
    if (!v.trim()) return '연락처를 입력해주세요.'
    if (!/^01[016789]-\d{3,4}-\d{4}$/.test(v.trim())) return '010-1234-5678 형식으로 입력해주세요.'
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
