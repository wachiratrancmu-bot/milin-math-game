import { useCallback, useEffect, useState } from 'react'

// ──────────────────────────────────────────────────────────────
// เส้นทางแบบ hash (#/learn) — ทำงานบน GitHub Pages ได้โดยไม่ต้องตั้งค่าเซิร์ฟเวอร์
// และปุ่มย้อนกลับของเบราว์เซอร์/มือถือใช้งานได้ตามปกติ
// ──────────────────────────────────────────────────────────────

const current = () => window.location.hash.replace(/^#/, '') || '/'

export function useHashRoute(): [string, (to: string) => void] {
  const [route, setRoute] = useState(current)

  useEffect(() => {
    const onChange = () => {
      setRoute(current())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const navigate = useCallback((to: string) => {
    if (current() === to) {
      setRoute(to)
      window.scrollTo({ top: 0 })
    } else {
      window.location.hash = to
    }
  }, [])

  return [route, navigate]
}
