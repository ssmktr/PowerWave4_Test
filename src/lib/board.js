// 게시판 데이터. MVP라 localStorage에 저장하고, 비어 있으면 샘플 글로 한 번 채운다.

const KEY = 'pw4.board'

const SEED = {
  notice: [
    { id: 'n3', title: '10월 수련회 신청 안내', author: '부장', date: '2026-09-18', body: '10월 17일(토)~18일(일) 양평에서 가을 수련회가 진행됩니다. 신청은 9월 30일까지 각 반 리더에게 해주세요.' },
    { id: 'n2', title: '주일 예배 시간 변경 (9월 셋째 주)', author: '부장', date: '2026-09-12', body: '9월 셋째 주 주일 예배는 오후 2시가 아닌 오후 3시에 시작합니다. 착오 없으시길 바랍니다.' },
    { id: 'n1', title: '파워웨이브 4부 홈페이지가 열렸습니다', author: '관리자', date: '2026-09-01', body: '공지사항과 자유게시판, 기도 제목 나눔 기능을 사용하실 수 있습니다.' },
  ],
  free: [
    { id: 'f3', title: '이번 주 찬양 콘티 공유합니다', author: '김찬양', date: '2026-09-19', body: '이번 주 찬양 순서와 악보 링크 정리했어요. 연습 때 참고해주세요!' },
    { id: 'f2', title: '수련회 같이 가실 분 차량 모집해요', author: '박은혜', date: '2026-09-17', body: '분당에서 출발합니다. 3자리 남았어요. 댓글이나 연락 주세요.' },
    { id: 'f1', title: '첫 인사드립니다 :)', author: '이믿음', date: '2026-09-05', body: '지난주부터 4부 예배 나오고 있습니다. 잘 부탁드려요!' },
  ],
}

function readAll() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // 손상된 값이면 시드로 되돌린다.
  }
  localStorage.setItem(KEY, JSON.stringify(SEED))
  return SEED
}

/** kind: 'notice' | 'free' */
export function listPosts(kind, limit) {
  const posts = readAll()[kind] ?? []
  return limit ? posts.slice(0, limit) : posts
}

export function addPost(kind, { title, body, author }) {
  const all = readAll()
  const post = {
    id: `${kind}-${Date.now()}`,
    title: title.trim(),
    body: body.trim(),
    author,
    date: new Date().toISOString().slice(0, 10),
  }
  const next = { ...all, [kind]: [post, ...(all[kind] ?? [])] }
  localStorage.setItem(KEY, JSON.stringify(next))
  return post
}
