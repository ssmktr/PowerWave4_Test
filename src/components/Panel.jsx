import { Link } from 'react-router-dom'

export default function Panel({ title, to, posts, empty = '등록된 글이 없습니다.', pending = false }) {
  return (
    <section className={`panel${pending ? ' panel--pending' : ''}`}>
      <header className="panel__head">
        <h2 className="panel__title">{title}</h2>
        {to && <Link className="panel__more" to={to}>더보기 →</Link>}
      </header>

      {pending ? (
        <div className="panel__pending">
          <span className="panel__pending-mark" aria-hidden="true">🚧</span>
          <p>준비 중입니다</p>
        </div>
      ) : posts.length === 0 ? (
        <p className="panel__empty">{empty}</p>
      ) : (
        <ul className="panel__list">
          {posts.map((post) => (
            <li key={post.id}>
              <span className="panel__post-title">{post.title}</span>
              <span className="panel__post-date">{post.date.slice(5).replace('-', '.')}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
