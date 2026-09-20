// 생년월일(YYYY-MM-DD)에서 나이와 생일 정보를 계산한다.
// 'YYYY-MM-DD'를 new Date()에 그대로 넣으면 UTC로 해석되므로 직접 분해해서 로컬 날짜로 만든다.

export function parseBirth(birth) {
  if (!birth) return null
  const [y, m, d] = String(birth).split('-').map(Number)
  if (!y || !m || !d) return null
  const date = new Date(y, m - 1, d)
  // 2월 30일 같은 값이 다음 달로 굴러가는 것을 걸러낸다.
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null
  return date
}

/** 만 나이 */
export function calcAge(birth, today = new Date()) {
  const b = parseBirth(birth)
  if (!b) return null
  let age = today.getFullYear() - b.getFullYear()
  const monthDiff = today.getMonth() - b.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < b.getDate())) age -= 1
  return age
}

/** { label: '1월 15일', dday: 12, isToday: false } */
export function birthdayInfo(birth, today = new Date()) {
  const b = parseBirth(birth)
  if (!b) return null

  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  let next = new Date(start.getFullYear(), b.getMonth(), b.getDate())
  if (next < start) next = new Date(start.getFullYear() + 1, b.getMonth(), b.getDate())

  const dday = Math.round((next - start) / 86_400_000)
  return {
    label: `${b.getMonth() + 1}월 ${b.getDate()}일`,
    dday,
    isToday: dday === 0,
  }
}

export function formatBirth(birth) {
  const b = parseBirth(birth)
  if (!b) return '미입력'
  return `${b.getFullYear()}년 ${b.getMonth() + 1}월 ${b.getDate()}일`
}
