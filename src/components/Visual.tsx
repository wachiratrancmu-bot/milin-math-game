// แสดงภาพประกอบของโจทย์
// - ถ้าเป็นอิโมจิล้วน จะเด้งทีละตัว
// - ถ้ามีตัวเลข/ข้อความ จะแสดงเป็นข้อความใหญ่
const EMOJI_ONLY = /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\s+·]+$/u

export function Visual({ visual }: { visual?: string }) {
  if (!visual) return null

  if (EMOJI_ONLY.test(visual)) {
    const parts = visual.split(/\s+/).filter(Boolean)
    return (
      <div className="visual">
        {parts.map((part, i) => {
          if (part === '+') return <span key={i} style={{ fontSize: 32, fontWeight: 900 }}>+</span>
          if (part === '·') return <span key={i} style={{ opacity: 0.4 }}>·</span>
          return [...part].map((ch, j) => (
            <span key={`${i}-${j}`} className="obj">{ch}</span>
          ))
        })}
      </div>
    )
  }

  return (
    <div className="visual">
      <div className="visualText">{visual}</div>
    </div>
  )
}
