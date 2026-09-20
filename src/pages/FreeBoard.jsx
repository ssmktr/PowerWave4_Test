import { useState } from 'react'
import { addPost, listPosts } from '../lib/board'

export default function FreeBoard({ user }) {
  const [posts, setPosts] = useState(() => listPosts('free'))
  const [openId, setOpenId] = useState(null)
  const [writing, setWriting] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !body.trim()) {
      setError('제목과 내용을 모두 입력해주세요.')
      return
    }
    addPost('free', { title, body, author: user.name })
    setPosts(listPosts('free'))
    setTitle('')
    setBody('')
    setError('')
    setWriting(false)
  }

  return (
    <div className="page">
      <header className="page__head page__head--row">
        <div>
          <h1 className="page__title">자유게시판</h1>
          <p className="page__sub">자유롭게 이야기를 나눠보세요.</p>
        </div>
        <button
          className="btn btn--primary btn--inline"
          type="button"
          onClick={() => setWriting(!writing)}
        >
          {writing ? '취소' : '글쓰기'}
        </button>
      </header>

      {writing && (
        <form className="writer" onSubmit={handleSubmit}>
          {error && <p className="field__msg field__msg--error">{error}</p>}
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
            maxLength={60}
          />
          <textarea
            className="input input--area"
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="내용을 입력하세요."
          />
          <button className="btn btn--primary" type="submit">등록</button>
        </form>
      )}

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
