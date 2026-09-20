// 계정별 기도 제목. 'pw4.prayers' 아래에 { [userId]: Prayer[] } 형태로 저장한다.

const KEY = 'pw4.prayers'

function readAll() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeAll(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function listPrayers(userId) {
  return readAll()[userId] ?? []
}

export function addPrayer(userId, text) {
  const all = readAll()
  const prayer = {
    id: `p-${Date.now()}`,
    text: text.trim(),
    answered: false,
    date: new Date().toISOString().slice(0, 10),
  }
  const next = { ...all, [userId]: [prayer, ...(all[userId] ?? [])] }
  writeAll(next)
  return next[userId]
}

export function togglePrayer(userId, id) {
  const all = readAll()
  const list = (all[userId] ?? []).map((p) =>
    p.id === id ? { ...p, answered: !p.answered } : p,
  )
  writeAll({ ...all, [userId]: list })
  return list
}

export function removePrayer(userId, id) {
  const all = readAll()
  const list = (all[userId] ?? []).filter((p) => p.id !== id)
  writeAll({ ...all, [userId]: list })
  return list
}
