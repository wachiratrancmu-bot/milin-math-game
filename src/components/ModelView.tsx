import type { Model } from '../types'

// ──────────────────────────────────────────────────────────────
// ภาพช่วยคิดด้วยกรอบสิบช่อง (ten-frame: Van de Walle et al., 2019)
// - บวก: จำนวนแรกสีน้ำเงิน จำนวนที่สองสีส้ม เติมกรอบแรกให้ครบ 10 ก่อน → เห็นการ "ทำให้ครบ 10"
// - ลบ: ขีดฆ่าจากท้ายสุดย้อนกลับ → เห็นการ "ลบให้เหลือ 10"
// - หลักสิบ: กรอบที่เต็มคือ 1 สิบ ส่วนที่เหลือคือหน่วย
// ──────────────────────────────────────────────────────────────

type Dot = 'a' | 'b' | 'x' | 'empty'

function frames(dots: Dot[]): Dot[][] {
  const count = Math.max(1, Math.ceil(dots.length / 10))
  return Array.from({ length: count }, (_, f) =>
    Array.from({ length: 10 }, (_, i) => dots[f * 10 + i] ?? 'empty'),
  )
}

/**
 * @param reveal false = ไม่บอกผลลัพธ์ในคำบรรยาย (ใช้ในบทเรียนก่อนให้ลองคิด)
 */
function describe(model: Model, reveal: boolean): { dots: Dot[]; caption: string; label: string } {
  switch (model.type) {
    case 'count':
      return {
        dots: Array<Dot>(model.n).fill('a'),
        caption: !reveal
          ? 'กรอบละ 10 ช่อง'
          : model.n > 10
            ? `10 กับอีก ${model.n - 10} คือ ${model.n}`
            : `${model.n}`,
        label: reveal ? `กรอบสิบช่อง แสดงจำนวน ${model.n}` : 'กรอบสิบช่อง',
      }
    case 'place': {
      const tens = Math.floor(model.n / 10)
      const ones = model.n % 10
      return {
        dots: Array<Dot>(model.n).fill('a'),
        caption: reveal ? `${tens} สิบ กับ ${ones} หน่วย` : 'กรอบที่เต็มคือ 1 สิบ',
        label: reveal
          ? `กรอบสิบช่อง แสดง ${model.n} คือ ${tens} สิบ กับ ${ones} หน่วย`
          : 'กรอบสิบช่อง',
      }
    }
    case 'add':
      return {
        dots: [...Array<Dot>(model.a).fill('a'), ...Array<Dot>(model.b).fill('b')],
        caption: reveal
          ? `${model.a} + ${model.b} = ${model.a + model.b}`
          : `${model.a} + ${model.b}`,
        label: reveal
          ? `กรอบสิบช่อง แสดง ${model.a} บวก ${model.b} เท่ากับ ${model.a + model.b}`
          : `กรอบสิบช่อง แสดง ${model.a} บวก ${model.b}`,
      }
    case 'sub':
      return {
        dots: [...Array<Dot>(model.a - model.b).fill('a'), ...Array<Dot>(model.b).fill('x')],
        caption: reveal
          ? `${model.a} − ${model.b} = ${model.a - model.b}`
          : `${model.a} − ${model.b}`,
        label: reveal
          ? `กรอบสิบช่อง แสดง ${model.a} ลบ ${model.b} เท่ากับ ${model.a - model.b}`
          : `กรอบสิบช่อง แสดง ${model.a} ลบ ${model.b}`,
      }
  }
}

export function ModelView({ model, reveal = true }: { model: Model; reveal?: boolean }) {
  const { dots, caption, label } = describe(model, reveal)
  return (
    <figure className="model" role="img" aria-label={label}>
      <div className="frames">
        {frames(dots).map((frame, f) => (
          <div className="frame" key={f}>
            {frame.map((d, i) => (
              <span key={i} className={`cell cell-${d}`}>
                {d === 'x' ? '✕' : ''}
              </span>
            ))}
          </div>
        ))}
      </div>
      <figcaption className="modelCaption">{caption}</figcaption>
      {model.type === 'add' && (
        <div className="legend" aria-hidden="true">
          <span>
            <i className="cell cell-a" /> {model.a}
          </span>
          <span>
            <i className="cell cell-b" /> {model.b}
          </span>
        </div>
      )}
      {model.type === 'sub' && (
        <div className="legend" aria-hidden="true">
          <span>
            <i className="cell cell-x">✕</i> เอาออก {model.b}
          </span>
        </div>
      )}
    </figure>
  )
}
