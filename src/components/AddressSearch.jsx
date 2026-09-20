import { useEffect, useRef, useState } from 'react'
import { composeAddress, loadPostcode } from '../lib/postcode'

/** 다음 우편번호 검색을 모달 안에 embed 한다. */
export default function AddressSearch({ onSelect, onClose, onUnavailable }) {
  const boxRef = useRef(null)
  const [error, setError] = useState('')

  // 콜백이 매 렌더마다 새로 만들어져도 embed가 다시 실행되지 않도록 ref로 붙든다.
  const handlers = useRef({ onSelect, onClose, onUnavailable })
  handlers.current = { onSelect, onClose, onUnavailable }

  useEffect(() => {
    let cancelled = false

    loadPostcode()
      .then((Postcode) => {
        if (cancelled || !boxRef.current) return
        new Postcode({
          oncomplete: (data) => {
            handlers.current.onSelect(composeAddress(data))
            handlers.current.onClose()
          },
          width: '100%',
          height: '100%',
        }).embed(boxRef.current, { autoClose: false })
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') handlers.current.onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="주소 검색">
      <button type="button" className="modal__backdrop" onClick={onClose} aria-label="닫기" />
      <div className="modal__panel">
        <header className="modal__head">
          <h2 className="modal__title">주소 검색</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="닫기">
            ✕
          </button>
        </header>

        {error ? (
          <div className="modal__error">
            <p>{error}</p>
            <button
              type="button"
              className="btn btn--outline"
              onClick={() => {
                onUnavailable()
                onClose()
              }}
            >
              주소 직접 입력하기
            </button>
          </div>
        ) : (
          <div className="modal__embed" ref={boxRef} />
        )}
      </div>
    </div>
  )
}
