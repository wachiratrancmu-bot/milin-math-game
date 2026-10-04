// แสดงภาพประกอบของโจทย์
// - อิโมจิล้วน: แต่ละกลุ่ม (คั่นด้วยช่องว่าง) อยู่ในกรอบของตัวเอง ให้นับเป็นกลุ่มละ 10 ได้ง่าย
// - เครื่องหมาย + − = · แสดงเป็นตัวดำเนินการระหว่างกลุ่ม
// - ถ้ามีตัวเลข/ข้อความ จะแสดงเป็นข้อความใหญ่
const EMOJI_ONLY = /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\s+·−=]+$/u
const OPERATORS = new Set(['+', '−', '=', '·'])

/** แยกตัวอักษรตามที่ตาเห็น เพื่อไม่ให้อิโมจิที่ประกอบหลายรหัสถูกตัดกลาง */
function graphemes(s: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    return [...new Intl.Segmenter('th', { granularity: 'grapheme' }).segment(s)].map(
      (x) => x.segment,
    )
  }
  return [...s]
}

export function Visual({ visual }: { visual?: string }) {
  if (!visual) return null

  if (EMOJI_ONLY.test(visual)) {
    const parts = visual.split(/\s+/).filter(Boolean)
    return (
      <div className="visual">
        {parts.map((part, i) => {
          if (OPERATORS.has(part)) {
            return (
              <span key={i} className="op">
                {part}
              </span>
            )
          }
          const items = graphemes(part)
          return (
            // มีกรอบทุกกลุ่มเมื่อภาพมีหลายกลุ่ม (แม้กลุ่มนั้นจะมีชิ้นเดียว) ให้นับได้สม่ำเสมอ
            <span key={i} className={items.length > 1 || parts.length > 1 ? 'objGroup' : undefined}>
              {items.map((ch, j) => (
                <span key={j} className="obj">
                  {ch}
                </span>
              ))}
            </span>
          )
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
