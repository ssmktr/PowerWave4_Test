// MVP용 가짜 백엔드. 실제 서버 대신 localStorage에 회원 정보를 저장한다.
// 서버를 붙일 때는 이 파일의 함수 본문만 fetch 호출로 바꾸면 된다.

const USERS_KEY = 'pw4.users'
const SESSION_KEY = 'pw4.session'

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))

const NO_MATCH =
  '일치하는 회원 정보가 없습니다. 이메일 없이 가입한 계정은 아이디·비밀번호 찾기를 이용할 수 없습니다.'

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

// 평문 저장을 피하기 위한 최소한의 해싱. 실제 서비스에서는 서버에서 bcrypt/argon2를 써야 한다.
async function hash(password) {
  const bytes = new TextEncoder().encode(`pw4::${password}`)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function isUserIdTaken(userId) {
  await delay(200)
  return readUsers().some((u) => u.userId.toLowerCase() === userId.trim().toLowerCase())
}

export async function signUp(form) {
  await delay()
  const users = readUsers()
  const userId = form.userId.trim()

  if (users.some((u) => u.userId.toLowerCase() === userId.toLowerCase())) {
    throw new Error('이미 사용 중인 아이디입니다.')
  }
  // 이메일은 선택 항목이라 비어 있을 수 있다. 빈 값끼리는 중복으로 보지 않는다.
  const email = form.email.trim()
  if (email && users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('이미 가입된 이메일입니다.')
  }

  const user = {
    userId,
    passwordHash: await hash(form.password),
    email,
    name: form.name.trim(),
    birth: form.birth.trim(),
    postcode: form.postcode.trim(),
    address: form.address.trim(),
    addressDetail: form.addressDetail.trim(),
    phone: form.phone.trim(),
    note: form.note.trim(),
    createdAt: new Date().toISOString(),
  }

  writeUsers([...users, user])
  return publicUser(user)
}

export async function login(userId, password) {
  await delay()
  const user = readUsers().find((u) => u.userId.toLowerCase() === userId.trim().toLowerCase())
  const passwordHash = await hash(password)

  // 아이디 존재 여부를 노출하지 않도록 같은 메시지를 쓴다.
  if (!user || user.passwordHash !== passwordHash) {
    throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.')
  }

  const session = publicUser(user)
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export async function findUserId(name, email) {
  await delay()
  const target = email.trim().toLowerCase()
  // 이메일 없이 가입한 계정이 빈 문자열로 매칭되지 않도록 막는다.
  const user = target
    ? readUsers().find((u) => u.name === name.trim() && u.email && u.email.toLowerCase() === target)
    : null
  if (!user) throw new Error(NO_MATCH)
  return { userId: maskUserId(user.userId), createdAt: user.createdAt }
}

export async function resetPassword(userId, email) {
  await delay()
  const users = readUsers()
  const target = email.trim().toLowerCase()
  const index = target
    ? users.findIndex(
        (u) =>
          u.userId.toLowerCase() === userId.trim().toLowerCase() &&
          u.email &&
          u.email.toLowerCase() === target,
      )
    : -1
  if (index === -1) throw new Error(NO_MATCH)

  const tempPassword = makeTempPassword()
  users[index] = { ...users[index], passwordHash: await hash(tempPassword) }
  writeUsers(users)

  // 실제 서비스라면 메일로 발송한다. MVP에서는 화면에 바로 보여준다.
  return { tempPassword }
}

/** 반친구 목록. 비밀번호와 주소 등 민감한 항목은 빼고 명단에 필요한 것만 넘긴다. */
export async function listClassmates() {
  await delay(250)
  return readUsers()
    .map(({ userId, name, birth, phone, email, createdAt }) => ({
      userId,
      name,
      birth,
      phone,
      email,
      createdAt,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'ko'))
}

function publicUser({ passwordHash, ...rest }) {
  return rest
}

function maskUserId(userId) {
  if (userId.length <= 3) return `${userId[0]}${'*'.repeat(userId.length - 1)}`
  return `${userId.slice(0, userId.length - 3)}***`
}

function makeTempPassword() {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789'
  const picks = crypto.getRandomValues(new Uint32Array(10))
  return Array.from(picks, (n) => chars[n % chars.length]).join('')
}
