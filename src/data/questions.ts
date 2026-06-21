import type { Question, Topic } from '../types'

// ──────────────────────────────────────────────────────────────
// คลังข้อสอบ — เน้นระดับ ป.1 ตามใบสอบเก็บคะแนนท้ายบทที่ 1
// จำนวนส่วนใหญ่อยู่ในขอบเขต 0–100 เหมาะกับเด็ก ป.1–2
// แต่ละหัวข้อมีทั้งแบบ "กากบาท" (choice) และ "เติมคำตอบ" (fill)
// ──────────────────────────────────────────────────────────────

/** ชื่อหัวข้อภาษาไทย (ใช้แสดงผลทั่วทั้งแอป) */
export const TOPIC_NAMES: Record<Topic, string> = {
  place: 'จำนวนและค่าประจำหลัก',
  compare: 'การเปรียบเทียบจำนวน',
  expand: 'การกระจายจำนวน',
  order: 'การเรียงลำดับจำนวน',
  part: 'ส่วนรวม–ส่วนย่อย',
  rank: 'การบอกอันดับ',
  pattern: 'แบบรูปของจำนวน',
}

/** อิโมจิประจำหัวข้อ */
export const TOPIC_ICONS: Record<Topic, string> = {
  place: '🔢',
  compare: '⚖️',
  expand: '🧩',
  order: '🚂',
  part: '🍎',
  rank: '🏁',
  pattern: '🌈',
}

/** น้ำหนักข้อสอบตามใบสอบจริง (ใช้เป็นค่าเริ่มต้นในการสุ่มชุด) */
export const EXAM_BLUEPRINT: Record<Topic, number> = {
  place: 3,
  compare: 2,
  expand: 2,
  order: 4,
  part: 5,
  rank: 4,
  pattern: 1,
}

export const LEVEL_NAMES = {
  easy: 'เริ่มต้น',
  medium: 'เก่งขึ้น',
  hard: 'ท้าทาย',
} as const

export const QUESTION_BANK: Question[] = [
  // ── จำนวนและค่าประจำหลัก (place) ───────────────────────────
  { id: 'place-1', topic: 'place', level: 'easy', kind: 'choice', text: 'จำนวน 14 มีเลขในหลักสิบกี่สิบ', small: 'ดูตัวเลขด้านซ้าย', visual: '🔟 ⭐⭐⭐⭐', answer: '1', choices: ['1', '4', '10', '14'], hint: 'หลักสิบอยู่ด้านซ้ายของจำนวนสองหลัก', explain: '14 คือ 1 สิบ กับ 4 หน่วย' },
  { id: 'place-2', topic: 'place', level: 'easy', kind: 'choice', text: 'จำนวน 18 มีเลขในหลักหน่วยเท่าไร', small: 'ดูตัวเลขด้านขวาสุด', visual: '18', answer: '8', choices: ['1', '8', '10', '18'], hint: 'หลักหน่วยคือตัวเลขขวาสุด', explain: '18 มีหลักหน่วยเป็น 8' },
  { id: 'place-3', topic: 'place', level: 'easy', kind: 'choice', text: '1 สิบ กับ 6 หน่วย เขียนเป็นจำนวนใด', small: 'รวมหลักสิบและหลักหน่วย', visual: '🔟 ⭐⭐⭐⭐⭐⭐', answer: '16', choices: ['10', '6', '16', '61'], hint: '1 สิบ คือ 10 แล้วบวก 6', explain: '10 + 6 = 16' },
  { id: 'place-4', topic: 'place', level: 'easy', kind: 'fill', text: 'จำนวน 25 มีเลขในหลักสิบกี่สิบ', small: 'พิมพ์ตัวเลขหลักสิบ', visual: '25', answer: '2', hint: 'ตัวเลขด้านซ้ายคือหลักสิบ', explain: '25 คือ 2 สิบ กับ 5 หน่วย' },
  { id: 'place-5', topic: 'place', level: 'medium', kind: 'choice', text: 'จำนวน 47 มีเลขในหลักสิบกี่สิบ', small: 'พิจารณาหลักสิบ', visual: '47', answer: '4', choices: ['4', '7', '40', '47'], hint: 'ตัวเลขด้านซ้ายคือหลักสิบ', explain: '47 คือ 4 สิบ กับ 7 หน่วย' },
  { id: 'place-6', topic: 'place', level: 'medium', kind: 'choice', text: 'จำนวน 63 มีเลขในหลักหน่วยเท่าไร', small: 'พิจารณาหลักหน่วย', visual: '63', answer: '3', choices: ['3', '6', '30', '60'], hint: 'หลักหน่วยคือตัวเลขขวาสุด', explain: '63 มีหลักหน่วยเป็น 3' },
  { id: 'place-7', topic: 'place', level: 'medium', kind: 'choice', text: '5 สิบ กับ 8 หน่วย เขียนเป็นจำนวนใด', small: 'รวมสิบและหน่วย', visual: '5 สิบ + 8 หน่วย', answer: '58', choices: ['13', '50', '58', '85'], hint: '5 สิบ คือ 50', explain: '50 + 8 = 58' },
  { id: 'place-8', topic: 'place', level: 'medium', kind: 'fill', text: 'จำนวน 70 มีเลขในหลักหน่วยเท่าไร', small: 'พิมพ์ตัวเลขหลักหน่วย', visual: '70', answer: '0', hint: 'หลักหน่วยของ 70 คือ 0', explain: '70 คือ 7 สิบ กับ 0 หน่วย' },
  { id: 'place-9', topic: 'place', level: 'medium', kind: 'choice', text: 'จำนวนใดเท่ากับ 6 สิบ 2 หน่วย', small: 'เลือกจำนวนที่ถูกต้อง', visual: '6 สิบ 2 หน่วย', answer: '62', choices: ['26', '60', '62', '26'], hint: '6 สิบ คือ 60 แล้วบวก 2', explain: '60 + 2 = 62' },
  { id: 'place-10', topic: 'place', level: 'easy', kind: 'fill', text: 'จำนวน 30 มีเลขในหลักสิบกี่สิบ', small: 'พิมพ์ตัวเลขหลักสิบ', visual: '30', answer: '3', hint: '30 คือ 3 สิบ', explain: '30 มี 3 สิบ กับ 0 หน่วย' },

  // ── การเปรียบเทียบจำนวน (compare) ──────────────────────────
  { id: 'compare-1', topic: 'compare', level: 'easy', kind: 'choice', text: '12 ◯ 15', small: 'เลือกเครื่องหมายที่ถูกต้อง', visual: '🐊', answer: '<', choices: ['<', '>', '=', '≠'], hint: '12 น้อยกว่า 15 ปากจระเข้หันไปทางจำนวนมาก', explain: '12 < 15' },
  { id: 'compare-2', topic: 'compare', level: 'easy', kind: 'choice', text: '20 ◯ 19', small: 'เลือกเครื่องหมายที่ถูกต้อง', visual: '🐊', answer: '>', choices: ['>', '<', '=', '≠'], hint: '20 มากกว่า 19', explain: '20 > 19' },
  { id: 'compare-3', topic: 'compare', level: 'easy', kind: 'choice', text: '17 ◯ 17', small: 'เลือกเครื่องหมายที่ถูกต้อง', visual: '⚖️', answer: '=', choices: ['=', '>', '<', '≠'], hint: 'ถ้าจำนวนเท่ากัน ใช้เครื่องหมาย =', explain: '17 = 17' },
  { id: 'compare-4', topic: 'compare', level: 'medium', kind: 'choice', text: '72 ◯ 68', small: 'เลือกเครื่องหมายที่ถูกต้อง', visual: '72 ◯ 68', answer: '>', choices: ['>', '<', '=', '≠'], hint: 'เปรียบเทียบหลักสิบก่อน', explain: '72 มากกว่า 68' },
  { id: 'compare-5', topic: 'compare', level: 'medium', kind: 'choice', text: '45 ◯ 54', small: 'เลือกเครื่องหมายที่ถูกต้อง', visual: '45 ◯ 54', answer: '<', choices: ['<', '>', '=', '≠'], hint: '4 สิบ น้อยกว่า 5 สิบ', explain: '45 < 54' },
  { id: 'compare-6', topic: 'compare', level: 'easy', kind: 'choice', text: 'จำนวนใดมากกว่า 16', small: 'เลือกจำนวนที่มากกว่า 16', visual: 'มากกว่า 16', answer: '18', choices: ['12', '15', '16', '18'], hint: 'มากกว่า หมายถึงมีค่ามากกว่าเดิม', explain: '18 มากกว่า 16' },
  { id: 'compare-7', topic: 'compare', level: 'medium', kind: 'choice', text: 'จำนวนใดน้อยที่สุด', small: 'เลือกจำนวนที่น้อยที่สุด', visual: '56  65  49  74', answer: '49', choices: ['56', '65', '49', '74'], hint: 'เปรียบเทียบหลักสิบก่อน', explain: '49 มี 4 สิบ จึงน้อยที่สุด' },
  { id: 'compare-8', topic: 'compare', level: 'medium', kind: 'choice', text: 'จำนวนใดมากที่สุด', small: 'เลือกจำนวนที่มากที่สุด', visual: '31  68  86  59', answer: '86', choices: ['31', '68', '86', '59'], hint: 'เปรียบเทียบหลักสิบก่อน', explain: '86 มากที่สุด' },
  { id: 'compare-9', topic: 'compare', level: 'medium', kind: 'choice', text: 'จำนวนใดอยู่ระหว่าง 30 และ 40', small: 'เลือกคำตอบ', visual: '30 < ◯ < 40', answer: '36', choices: ['29', '30', '36', '42'], hint: 'ต้องมากกว่า 30 และน้อยกว่า 40', explain: '36 อยู่ระหว่าง 30 และ 40' },
  { id: 'compare-10', topic: 'compare', level: 'easy', kind: 'fill', text: 'จำนวนที่มากกว่า 9 อยู่หนึ่ง คือจำนวนใด', small: 'พิมพ์คำตอบ', visual: '9 → ?', answer: '10', hint: 'นับเพิ่มอีก 1', explain: '9 + 1 = 10' },

  // ── การกระจายจำนวน (expand) ────────────────────────────────
  { id: 'expand-1', topic: 'expand', level: 'easy', kind: 'choice', text: '13 กระจายจำนวนได้อย่างไร', small: 'แยกเป็นสิบและหน่วย', visual: '13 = ◯ + ◯', answer: '10+3', choices: ['10+3', '1+3', '30+1', '13+0'], hint: '13 มี 1 สิบ และ 3 หน่วย', explain: '13 = 10 + 3' },
  { id: 'expand-2', topic: 'expand', level: 'easy', kind: 'fill', text: '10 + 9 = ◯', small: 'พิมพ์ผลรวม', visual: '10 + 9', answer: '19', hint: '10 รวมกับ 9', explain: '10 + 9 = 19' },
  { id: 'expand-3', topic: 'expand', level: 'medium', kind: 'choice', text: '86 กระจายจำนวนได้อย่างไร', small: 'แยกเป็นสิบและหน่วย', visual: '86 = ◯ + ◯', answer: '80+6', choices: ['80+6', '8+6', '60+8', '86+0'], hint: '86 มี 8 สิบ และ 6 หน่วย', explain: '86 = 80 + 6' },
  { id: 'expand-4', topic: 'expand', level: 'medium', kind: 'fill', text: '70 + 4 = ◯', small: 'พิมพ์ผลรวม', visual: '70 + 4', answer: '74', hint: '70 รวมกับ 4', explain: '70 + 4 = 74' },
  { id: 'expand-5', topic: 'expand', level: 'medium', kind: 'choice', text: 'จำนวนใดกระจายได้เป็น 40 + 7', small: 'เลือกจำนวนที่ถูกต้อง', visual: '40 + 7', answer: '47', choices: ['407', '74', '47', '40'], hint: '40 รวมกับ 7', explain: '40 + 7 = 47' },
  { id: 'expand-6', topic: 'expand', level: 'easy', kind: 'choice', text: '15 กระจายจำนวนได้อย่างไร', small: 'แยกเป็นสิบและหน่วย', visual: '15 = ◯ + ◯', answer: '10+5', choices: ['10+5', '1+5', '50+1', '15+0'], hint: '15 มี 1 สิบ 5 หน่วย', explain: '15 = 10 + 5' },
  { id: 'expand-7', topic: 'expand', level: 'medium', kind: 'fill', text: '50 + 6 = ◯', small: 'พิมพ์ผลรวม', visual: '50 + 6', answer: '56', hint: '50 รวมกับ 6', explain: '50 + 6 = 56' },
  { id: 'expand-8', topic: 'expand', level: 'medium', kind: 'choice', text: '90 + 9 = ◯', small: 'รวมจำนวน', visual: '90 + 9', answer: '99', choices: ['90', '91', '99', '909'], hint: '90 รวมกับ 9', explain: '90 + 9 = 99' },

  // ── การเรียงลำดับจำนวน (order) ──────────────────────────────
  { id: 'order-1', topic: 'order', level: 'easy', kind: 'choice', text: 'เรียงจำนวน 8  3  6 จากน้อยไปมาก', small: 'เลือกลำดับที่ถูกต้อง', visual: '🚂 8 · 3 · 6', answer: '3, 6, 8', choices: ['3, 6, 8', '8, 6, 3', '6, 3, 8', '3, 8, 6'], hint: 'เริ่มจากจำนวนที่น้อยที่สุด', explain: '3 น้อยสุด ตามด้วย 6 และ 8' },
  { id: 'order-2', topic: 'order', level: 'easy', kind: 'choice', text: 'เรียงจำนวน 11  18  15 จากมากไปน้อย', small: 'เลือกลำดับที่ถูกต้อง', visual: '🚂 11 · 18 · 15', answer: '18, 15, 11', choices: ['18, 15, 11', '11, 15, 18', '15, 18, 11', '18, 11, 15'], hint: 'เริ่มจากจำนวนที่มากที่สุด', explain: '18 มากสุด ตามด้วย 15 และ 11' },
  { id: 'order-3', topic: 'order', level: 'medium', kind: 'choice', text: 'เรียงจำนวน 24  42  18  36 จากน้อยไปมาก', small: 'เลือกลำดับที่ถูกต้อง', visual: '24 · 42 · 18 · 36', answer: '18, 24, 36, 42', choices: ['18, 24, 36, 42', '42, 36, 24, 18', '24, 18, 36, 42', '18, 36, 24, 42'], hint: 'เริ่มจากจำนวนที่น้อยที่สุด', explain: '18 < 24 < 36 < 42' },
  { id: 'order-4', topic: 'order', level: 'medium', kind: 'choice', text: 'เรียงจำนวน 91  77  86  69 จากมากไปน้อย', small: 'เลือกลำดับที่ถูกต้อง', visual: '91 · 77 · 86 · 69', answer: '91, 86, 77, 69', choices: ['91, 86, 77, 69', '69, 77, 86, 91', '86, 91, 77, 69', '91, 77, 86, 69'], hint: 'เริ่มจากจำนวนที่มากที่สุด', explain: '91 > 86 > 77 > 69' },
  { id: 'order-5', topic: 'order', level: 'easy', kind: 'fill', text: 'เลขที่อยู่ระหว่าง 6 กับ 8 คือเลขใด', small: 'พิมพ์คำตอบ', visual: '6 · ◯ · 8', answer: '7', hint: 'นับต่อจาก 6', explain: '6, 7, 8 → คือ 7' },
  { id: 'order-6', topic: 'order', level: 'easy', kind: 'fill', text: 'เลขถัดไปจาก 19 คือเลขใด', small: 'พิมพ์คำตอบ', visual: '19 → ◯', answer: '20', hint: 'นับเพิ่มอีก 1', explain: '19 + 1 = 20' },
  { id: 'order-7', topic: 'order', level: 'medium', kind: 'choice', text: 'เรียงจำนวน 60  16  6  61 จากน้อยไปมาก', small: 'เลือกลำดับที่ถูกต้อง', visual: '60 · 16 · 6 · 61', answer: '6, 16, 60, 61', choices: ['6, 16, 60, 61', '61, 60, 16, 6', '16, 6, 60, 61', '6, 60, 16, 61'], hint: 'เลขหลักเดียวน้อยกว่าเลขสองหลัก', explain: '6 < 16 < 60 < 61' },
  { id: 'order-8', topic: 'order', level: 'medium', kind: 'choice', text: 'เรียงจำนวน 99  9  90  19 จากมากไปน้อย', small: 'เลือกลำดับที่ถูกต้อง', visual: '99 · 9 · 90 · 19', answer: '99, 90, 19, 9', choices: ['99, 90, 19, 9', '9, 19, 90, 99', '90, 99, 19, 9', '99, 19, 90, 9'], hint: 'เลขสองหลักมากกว่าเลขหลักเดียว', explain: '99 > 90 > 19 > 9' },
  { id: 'order-9', topic: 'order', level: 'easy', kind: 'fill', text: 'เลขก่อนหน้า 10 คือเลขใด', small: 'พิมพ์คำตอบ', visual: '◯ → 10', answer: '9', hint: 'นับถอยหลังจาก 10', explain: '10 − 1 = 9' },
  { id: 'order-10', topic: 'order', level: 'medium', kind: 'choice', text: 'เรียงจำนวน 35  53  33  55 จากน้อยไปมาก', small: 'เลือกลำดับที่ถูกต้อง', visual: '35 · 53 · 33 · 55', answer: '33, 35, 53, 55', choices: ['33, 35, 53, 55', '55, 53, 35, 33', '35, 33, 53, 55', '33, 53, 35, 55'], hint: 'ดูหลักสิบก่อน แล้วดูหลักหน่วย', explain: '33 < 35 < 53 < 55' },

  // ── ส่วนรวม–ส่วนย่อย (part) ─────────────────────────────────
  { id: 'part-1', topic: 'part', level: 'easy', kind: 'choice', text: 'มีดาว 5 ดวง ได้เพิ่ม 3 ดวง มีทั้งหมดกี่ดวง', small: 'นำมารวมกัน', visual: '⭐⭐⭐⭐⭐ + ⭐⭐⭐', answer: '8', choices: ['2', '5', '8', '9'], hint: 'ได้เพิ่ม หมายถึงบวก', explain: '5 + 3 = 8' },
  { id: 'part-2', topic: 'part', level: 'easy', kind: 'choice', text: 'มีลูกอม 9 เม็ด กินไป 4 เม็ด เหลือกี่เม็ด', small: 'หาจำนวนที่เหลือ', visual: '🍭🍭🍭🍭🍭🍭🍭🍭🍭', answer: '5', choices: ['4', '5', '9', '13'], hint: 'เหลือ มักใช้การลบ', explain: '9 − 4 = 5' },
  { id: 'part-3', topic: 'part', level: 'easy', kind: 'fill', text: '6 + ◯ = 10', small: 'พิมพ์จำนวนที่หายไป', visual: '6 + ◯ = 10', answer: '4', hint: 'ใช้ 10 ลบ 6', explain: '10 − 6 = 4' },
  { id: 'part-4', topic: 'part', level: 'easy', kind: 'choice', text: 'ส่วนรวมคือ 10 ส่วนย่อยหนึ่งคือ 7 อีกส่วนคือเท่าไร', small: 'หาส่วนย่อยที่เหลือ', visual: '10 = 7 + ◯', answer: '3', choices: ['2', '3', '7', '17'], hint: '10 − 7', explain: '10 − 7 = 3' },
  { id: 'part-5', topic: 'part', level: 'easy', kind: 'fill', text: '8 + 2 = ◯', small: 'พิมพ์ผลบวก', visual: '8 + 2', answer: '10', hint: '8 เพิ่มอีก 2', explain: '8 + 2 = 10' },
  { id: 'part-6', topic: 'part', level: 'medium', kind: 'fill', text: '23 + 15 = ◯', small: 'พิมพ์ผลบวก', visual: '23 + 15', answer: '38', hint: 'บวกหลักหน่วยก่อน แล้วบวกหลักสิบ', explain: '23 + 15 = 38' },
  { id: 'part-7', topic: 'part', level: 'medium', kind: 'choice', text: '48 − 16 = ◯', small: 'หาผลลบ', visual: '48 − 16', answer: '32', choices: ['22', '32', '34', '64'], hint: 'ลบหลักหน่วยก่อน แล้วลบหลักสิบ', explain: '48 − 16 = 32' },
  { id: 'part-8', topic: 'part', level: 'medium', kind: 'choice', text: 'มีส้ม 25 ผล ซื้อเพิ่ม 12 ผล มีทั้งหมดกี่ผล', small: 'นำมารวมกัน', visual: '25 + 12', answer: '37', choices: ['13', '35', '37', '47'], hint: 'ซื้อเพิ่ม หมายถึงบวก', explain: '25 + 12 = 37' },
  { id: 'part-9', topic: 'part', level: 'medium', kind: 'choice', text: 'มีดินสอ 36 แท่ง ให้เพื่อน 14 แท่ง เหลือกี่แท่ง', small: 'หาจำนวนที่เหลือ', visual: '36 − 14', answer: '22', choices: ['20', '22', '24', '50'], hint: 'ให้ไปแล้วเหลือน้อยลง ใช้ลบ', explain: '36 − 14 = 22' },
  { id: 'part-10', topic: 'part', level: 'medium', kind: 'fill', text: '29 + ◯ = 40', small: 'พิมพ์จำนวนที่หายไป', visual: '29 + ◯ = 40', answer: '11', hint: 'ใช้ 40 ลบ 29', explain: '40 − 29 = 11' },
  { id: 'part-11', topic: 'part', level: 'easy', kind: 'fill', text: '10 − 7 = ◯', small: 'พิมพ์ผลลบ', visual: '10 − 7', answer: '3', hint: 'นับถอยหลังจาก 10 ลง 7', explain: '10 − 7 = 3' },
  { id: 'part-12', topic: 'part', level: 'medium', kind: 'choice', text: 'มีเงิน 75 บาท ใช้ไป 25 บาท เหลือเงินกี่บาท', small: 'หาจำนวนเงินที่เหลือ', visual: '75 − 25', answer: '50', choices: ['40', '50', '55', '100'], hint: 'ใช้ไปแล้วเงินลดลง', explain: '75 − 25 = 50' },
  { id: 'part-13', topic: 'part', level: 'medium', kind: 'fill', text: 'แม่มีไข่ 18 ฟอง ซื้อเพิ่ม 12 ฟอง รวมเป็นกี่ฟอง', small: 'พิมพ์ผลรวม', visual: '18 + 12', answer: '30', hint: 'ซื้อเพิ่มใช้การบวก', explain: '18 + 12 = 30' },
  { id: 'part-14', topic: 'part', level: 'easy', kind: 'choice', text: 'มีนก 7 ตัว บินมาเพิ่ม 2 ตัว มีนกกี่ตัว', small: 'นำมารวมกัน', visual: '🐦🐦🐦🐦🐦🐦🐦 + 🐦🐦', answer: '9', choices: ['5', '8', '9', '10'], hint: 'บินมาเพิ่ม ใช้บวก', explain: '7 + 2 = 9' },
  { id: 'part-15', topic: 'part', level: 'medium', kind: 'fill', text: '54 − 20 = ◯', small: 'พิมพ์ผลลบ', visual: '54 − 20', answer: '34', hint: 'ลบออก 2 สิบ', explain: '54 − 20 = 34' },
  { id: 'part-16', topic: 'part', level: 'easy', kind: 'choice', text: 'ส่วนรวม 8 ส่วนย่อยคือ 5 กับเท่าไร', small: 'หาส่วนย่อยที่เหลือ', visual: '8 = 5 + ◯', answer: '3', choices: ['2', '3', '4', '5'], hint: '8 − 5', explain: '8 − 5 = 3' },

  // ── การบอกอันดับ (rank) ─────────────────────────────────────
  { id: 'rank-1', topic: 'rank', level: 'easy', kind: 'choice', text: '🐰 อยู่ลำดับที่เท่าไร', small: 'นับจากซ้ายไปขวา', visual: '⭐ ⭐ 🐰 ⭐ ⭐', answer: '3', choices: ['2', '3', '4', '5'], hint: 'นับจากซ้ายทีละตัว', explain: '🐰 อยู่ตัวที่ 3' },
  { id: 'rank-2', topic: 'rank', level: 'easy', kind: 'choice', text: '🚗 อยู่ลำดับที่เท่าไร', small: 'นับจากซ้ายไปขวา', visual: '🚗 ⭐ ⭐ ⭐ ⭐', answer: '1', choices: ['1', '2', '4', '5'], hint: 'ตัวแรกคือลำดับที่ 1', explain: '🚗 อยู่ลำดับที่ 1' },
  { id: 'rank-3', topic: 'rank', level: 'easy', kind: 'fill', text: '🐥 อยู่ลำดับที่เท่าไร นับจากซ้าย', small: 'พิมพ์คำตอบ', visual: '⭐ ⭐ ⭐ 🐥 ⭐', answer: '4', hint: 'นับจากซ้ายไปขวา', explain: '🐥 อยู่ลำดับที่ 4' },
  { id: 'rank-4', topic: 'rank', level: 'medium', kind: 'choice', text: '🐸 อยู่ลำดับที่เท่าไร', small: 'นับจากซ้ายไปขวา', visual: '⭐ ⭐ ⭐ 🐸 ⭐ ⭐ ⭐', answer: '4', choices: ['3', '4', '5', '7'], hint: 'นับจากซ้ายไปขวา', explain: '🐸 อยู่ลำดับที่ 4' },
  { id: 'rank-5', topic: 'rank', level: 'medium', kind: 'choice', text: '🦊 อยู่ลำดับที่เท่าไร', small: 'นับจากขวาไปซ้าย', visual: '⭐ 🦊 ⭐ ⭐ ⭐ ⭐', answer: '5', choices: ['2', '4', '5', '6'], hint: 'เริ่มนับจากด้านขวา', explain: 'นับจากขวา 🦊 อยู่ลำดับที่ 5' },
  { id: 'rank-6', topic: 'rank', level: 'medium', kind: 'choice', text: '🐶 อยู่ลำดับที่เท่าไร', small: 'นับจากซ้ายไปขวา', visual: '⭐ ⭐ ⭐ ⭐ ⭐ 🐶 ⭐ ⭐', answer: '6', choices: ['5', '6', '7', '8'], hint: 'นับจากซ้ายไปขวา', explain: '🐶 อยู่ลำดับที่ 6' },
  { id: 'rank-7', topic: 'rank', level: 'easy', kind: 'choice', text: 'ผลไม้ลำดับที่ 2 จากซ้ายคือผลใด', small: 'นับจากซ้ายไปขวา', visual: '🍎 🍌 🍇 🍓', answer: '🍌', choices: ['🍎', '🍌', '🍇', '🍓'], hint: 'ตัวที่ 2 จากซ้าย', explain: 'ลำดับที่ 2 คือ 🍌' },
  { id: 'rank-8', topic: 'rank', level: 'medium', kind: 'fill', text: '🐼 อยู่ลำดับที่เท่าไร นับจากซ้าย', small: 'พิมพ์คำตอบ', visual: '⭐ ⭐ ⭐ ⭐ ⭐ ⭐ 🐼 ⭐', answer: '7', hint: 'นับจากซ้ายไปขวา', explain: '🐼 อยู่ลำดับที่ 7' },
  { id: 'rank-9', topic: 'rank', level: 'easy', kind: 'choice', text: 'สัตว์ลำดับสุดท้ายคือตัวใด', small: 'ดูตัวขวาสุด', visual: '🐱 🐶 🐰 🐯', answer: '🐯', choices: ['🐱', '🐶', '🐰', '🐯'], hint: 'ตัวขวาสุดคือลำดับสุดท้าย', explain: 'ลำดับสุดท้ายคือ 🐯' },
  { id: 'rank-10', topic: 'rank', level: 'medium', kind: 'fill', text: '🦄 อยู่ลำดับที่เท่าไร นับจากขวา', small: 'พิมพ์คำตอบ', visual: '⭐ ⭐ 🦄 ⭐ ⭐', answer: '3', hint: 'เริ่มนับจากด้านขวา', explain: 'นับจากขวา 🦄 อยู่ลำดับที่ 3' },

  // ── แบบรูปของจำนวน (pattern) ────────────────────────────────
  { id: 'pattern-1', topic: 'pattern', level: 'easy', kind: 'fill', text: 'เติมจำนวนที่หายไป 2, 4, 6, ◯', small: 'เพิ่มทีละ 2', visual: '2 → 4 → 6 → ◯', answer: '8', hint: 'นับเพิ่มทีละ 2', explain: '2, 4, 6, 8' },
  { id: 'pattern-2', topic: 'pattern', level: 'easy', kind: 'choice', text: 'เติมจำนวนที่หายไป 5, 10, 15, ◯', small: 'เพิ่มทีละ 5', visual: '5 → 10 → 15 → ◯', answer: '20', choices: ['16', '18', '20', '25'], hint: 'นับเพิ่มทีละ 5', explain: '5, 10, 15, 20' },
  { id: 'pattern-3', topic: 'pattern', level: 'medium', kind: 'choice', text: 'เติมจำนวนที่หายไป 12, 22, 32, ◯', small: 'เพิ่มทีละ 10', visual: '12 → 22 → 32 → ◯', answer: '42', choices: ['34', '40', '42', '52'], hint: 'เพิ่มทีละ 10', explain: '12, 22, 32, 42' },
  { id: 'pattern-4', topic: 'pattern', level: 'medium', kind: 'fill', text: 'เติมจำนวนที่หายไป 90, 80, 70, ◯', small: 'ลดทีละ 10', visual: '90 → 80 → 70 → ◯', answer: '60', hint: 'ลดทีละ 10', explain: '90, 80, 70, 60' },
  { id: 'pattern-5', topic: 'pattern', level: 'easy', kind: 'fill', text: 'เติมจำนวนที่หายไป 1, 2, 3, ◯', small: 'เพิ่มทีละ 1', visual: '1 → 2 → 3 → ◯', answer: '4', hint: 'นับเพิ่มทีละ 1', explain: '1, 2, 3, 4' },
  { id: 'pattern-6', topic: 'pattern', level: 'medium', kind: 'choice', text: 'เติมจำนวนที่หายไป 25, 30, 35, ◯', small: 'เพิ่มทีละ 5', visual: '25 → 30 → 35 → ◯', answer: '40', choices: ['36', '39', '40', '45'], hint: 'เพิ่มทีละ 5', explain: '25, 30, 35, 40' },
  { id: 'pattern-7', topic: 'pattern', level: 'easy', kind: 'fill', text: 'เติมจำนวนที่หายไป 10, 20, 30, ◯', small: 'เพิ่มทีละ 10', visual: '10 → 20 → 30 → ◯', answer: '40', hint: 'เพิ่มทีละ 10', explain: '10, 20, 30, 40' },
  { id: 'pattern-8', topic: 'pattern', level: 'medium', kind: 'fill', text: 'เติมจำนวนที่หายไป 20, 18, 16, ◯', small: 'ลดทีละ 2', visual: '20 → 18 → 16 → ◯', answer: '14', hint: 'ลดทีละ 2', explain: '20, 18, 16, 14' },
]
