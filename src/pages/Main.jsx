import { Link } from 'react-router-dom'
import Panel from '../components/Panel'
import ProfileBox from '../components/ProfileBox'
import { listPosts } from '../lib/board'

export default function Main({ user }) {
  const notices = listPosts('notice', 4)
  const free = listPosts('free', 4)

  return (
    <div className="main">
      <aside className="main__side">
        <ProfileBox user={user} />

        <div className="side-actions">
          <Link className="btn btn--outline" to="/notices">공지사항</Link>
          <Link className="btn btn--outline" to="/board">자유게시판</Link>
        </div>
      </aside>

      <div className="main__grid">
        <Panel title="공지사항" to="/notices" posts={notices} />
        <Panel title="자유게시판" to="/board" posts={free} />
        <Panel title="준비 중" posts={[]} pending />
        <Panel title="준비 중" posts={[]} pending />
      </div>
    </div>
  )
}
