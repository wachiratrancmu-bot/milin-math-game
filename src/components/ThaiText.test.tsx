import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { SettingsProvider } from '../state/SettingsContext'
import { ThaiText } from './ThaiText'

const render = (text: string) =>
  renderToStaticMarkup(
    <SettingsProvider>
      <ThaiText text={text} />
    </SettingsProvider>,
  )

describe('ThaiText', () => {
  it('ไม่ให้ชื่อและคำที่ตัวตัดคำแยกผิดถูกขึ้นบรรทัดใหม่กลางคำ', () => {
    const html = render('มิลินมีสติกเกอร์ 15 แผ่น')
    expect(html).toContain('<span class="nobr">มิลิน</span>')
    expect(html).toContain('<span class="nobr">สติกเกอร์</span>')
  })
  it('ข้อความอื่นแสดงตามเดิมครบทุกตัวอักษร', () => {
    const text = 'มีนก 15 ตัว บินหนีไป 6 ตัว'
    expect(render(text)).toBe(text)
  })
})
