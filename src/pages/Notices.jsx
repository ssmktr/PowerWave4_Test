import { useState } from 'react'
import { listPosts } from '../lib/board'

export default function Notices() {
  const [openId, setOpenId] = useState(null)
  const posts = listPosts('notice')

  return (
    <div className="page">
      <header className="page__head">
        <h1 className="page__title">공지사항</h1>
        <p className="page__sub">파워웨이브 4부 공식 안내입니다.</p>
      </header>

      <ul className="posts">
        {posts.map((post) => (
          <li key={post.id} className="posts__item">
            <button
              type="button"
              className="posts__row"
              onClick={() => setOpenId(openId === post.id ? null : post.id)}
              aria-expanded={openId === post.id}
            >
              <span className="posts__title">{post.title}</span>
              <span className="posts__meta">{post.author} · {post.date}</span>
            </button>
            {openId === post.id && <p className="posts__body">{post.body}</p>}
          </li>
        ))}
      </ul>
    </div>
  )
}
