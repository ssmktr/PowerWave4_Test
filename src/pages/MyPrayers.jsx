import { useState } from 'react'
import { addPrayer, listPrayers, removePrayer, togglePrayer } from '../lib/prayers'

export default function MyPrayers({ user }) {
  const [prayers, setPrayers] = useState(() => listPrayers(user.userId))
  const [text, setText] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return
    setPrayers(addPrayer(user.userId, text))
    setText('')
  }

  const answered = prayers.filter((p) => p.answered).length

  return (
    <div className="page">
      <header className="page__head">
        <h1 className="page__title">나의 기도 제목</h1>
        <p className="page__sub">
          {prayers.length === 0
            ? '기도 제목을 적어보세요.'
            : `전체 ${prayers.length}개 · 응답받은 기도 ${answered}개`}
        </p>
      </header>

      <form className="writer writer--inline" onSubmit={handleSubmit}>
        <input
          className="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="예) 가족의 건강을 위해"
          maxLength={100}
        />
        <button className="btn btn--primary btn--inline" type="submit">추가</button>
      </form>

      {prayers.length === 0 ? (
        <p className="empty">아직 등록된 기도 제목이 없습니다.</p>
      ) : (
        <ul className="prayers">
          {prayers.map((p) => (
            <li key={p.id} className={`prayers__item${p.answered ? ' is-answered' : ''}`}>
              <label className="prayers__check">
                <input
                  type="checkbox"
                  checked={p.answered}
                  onChange={() => setPrayers(togglePrayer(user.userId, p.id))}
                />
                <span className="prayers__text">{p.text}</span>
              </label>
              <span className="prayers__date">{p.date}</span>
              <button
                type="button"
                className="prayers__del"
                onClick={() => setPrayers(removePrayer(user.userId, p.id))}
                aria-label="삭제"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
