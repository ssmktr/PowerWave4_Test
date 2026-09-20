// 다음(카카오) 우편번호 서비스. API 키 없이 쓸 수 있는 공개 스크립트를 필요할 때 한 번만 불러온다.

const SRC = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'

let pending = null

export function loadPostcode() {
  if (window.daum?.Postcode) return Promise.resolve(window.daum.Postcode)
  if (pending) return pending

  pending = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SRC
    script.async = true
    script.onload = () => {
      if (window.daum?.Postcode) resolve(window.daum.Postcode)
      else reject(new Error('주소 검색 서비스를 불러오지 못했습니다.'))
    }
    script.onerror = () => {
      pending = null // 다음 시도에서 다시 받도록 캐시를 비운다.
      reject(new Error('주소 검색 서비스를 불러오지 못했습니다. 네트워크를 확인해주세요.'))
    }
    document.head.appendChild(script)
  })

  return pending
}

/** 검색 결과를 '도로명주소 (법정동, 건물명)' 형태의 한 줄로 조합한다. */
export function composeAddress(data) {
  const useRoad = data.userSelectedType === 'R'
  let address = useRoad ? data.roadAddress : data.jibunAddress

  if (useRoad) {
    const parts = []
    if (data.bname && /[동로가]$/.test(data.bname)) parts.push(data.bname)
    if (data.buildingName) parts.push(data.buildingName)
    if (parts.length) address += ` (${parts.join(', ')})`
  }

  return { postcode: data.zonecode, address }
}
