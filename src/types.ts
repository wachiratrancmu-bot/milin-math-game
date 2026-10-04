// ──────────────────────────────────────────────────────────────
// ชนิดข้อมูลกลางของทั้งเกม
// ──────────────────────────────────────────────────────────────

/** หัวข้อตามแนวข้อสอบคณิตศาสตร์ ป.1 บทที่ 4–6 */
export type Topic =
  | 'number' // บทที่ 4: อ่าน เขียน นับ จำนวน 11–20
  | 'place' // บทที่ 4: หลักสิบ หลักหน่วย
  | 'compare' // บทที่ 4: เปรียบเทียบจำนวน > < =
  | 'order' // บทที่ 4: เรียงลำดับ ก่อนหน้า–ถัดไป เติมจำนวนที่หายไป
  | 'add' // บทที่ 5: การบวกไม่เกิน 20
  | 'sub' // บทที่ 6: การลบไม่เกิน 20
  | 'sentence' // บทที่ 5–6: ประโยคสัญลักษณ์จากภาพ/สถานการณ์
  | 'word' // บทที่ 5–6: โจทย์ปัญหา
  | 'relation' // บทที่ 6: ความสัมพันธ์ของการบวกกับการลบ

/** บทเรียนในหนังสือ */
export type Chapter = 4 | 5 | 6

export type Level = 'easy' | 'medium' | 'hard'

/** กากบาท (เลือกตอบ) หรือ เติมคำตอบ */
export type QuestionKind = 'choice' | 'fill'

export interface Question {
  id: string
  topic: Topic
  /** บทเรียน (ข้อที่พ่อแม่เพิ่มเองไม่มีบท) */
  chapter?: Chapter
  level: Level
  kind: QuestionKind
  /** โจทย์หลัก */
  text: string
  /** คำสั่ง/คำใบ้บรรทัดเล็กใต้โจทย์ */
  small?: string
  /** ภาพประกอบ — สตริง emoji หรือข้อความ */
  visual?: string
  /** คำตอบที่ถูกต้อง (เทียบแบบ normalize) */
  answer: string
  /** ตัวเลือกสำหรับ kind === 'choice' */
  choices?: string[]
  /** คำใบ้ (แสดงในโหมดฝึก) */
  hint?: string
  /** วิธีคิด แสดงหลังตอบ */
  explain?: string
  /** true = ข้อที่พ่อแม่เพิ่มเอง */
  custom?: boolean
}

/** ความท้าทาย — สัดส่วนระดับง่าย/กลาง/ยาก */
export type Mix = 'warmup' | 'balanced' | 'challenge'

export type Mode = 'practice' | 'exam'

export interface Settings {
  /** PIN สำหรับเข้าหน้าตั้งค่าพ่อแม่ */
  pin: string
  /** จำนวนข้อต่อรอบ */
  questionsPerRound: number
  mode: Mode
  mix: Mix
  /** หัวข้อที่เปิดใช้ */
  enabledTopics: Topic[]
  showHints: boolean
  sound: boolean
  /** ตอบถูกแล้วไปข้อถัดไปอัตโนมัติภายในกี่วินาที */
  autoAdvanceSeconds: number
  /** ตอบผิดได้กี่ครั้งก่อนเฉลย */
  maxTries: number
  /** สะสมตอบถูกครบกี่ข้อจึงได้ 1 รางวัล */
  rewardThreshold: number
  /** โบนัสดาวเมื่อทำเต็มในรอบเดียว */
  fullMarksBonus: number
  /** ชื่อรางวัล + อิโมจิ */
  rewardName: string
  rewardEmoji: string
  /** ชื่อผู้เล่น (ปรับได้) */
  playerName: string
  /** ข้อสอบที่พ่อแม่เพิ่มเอง */
  customQuestions: Question[]
}

export interface SessionRecord {
  date: string
  score: number
  total: number
  mode: Mode
}

export interface Progress {
  /** ตอบถูกสะสมตลอดกาล */
  totalCorrect: number
  /** ดาวสะสมเดินหน้าสู่รางวัลถัดไป */
  starBalance: number
  /** รางวัลที่ปลดล็อกแล้ว */
  ticketsEarned: number
  /** รางวัลที่พ่อแม่มอบให้แล้ว */
  ticketsRedeemed: number
  /** สถิติเล่นต่อเนื่องตอบถูกสูงสุด */
  bestStreak: number
  /** จำนวนรอบที่ทำเต็ม */
  perfectRounds: number
  history: SessionRecord[]
}

/** ผลของการตอบหนึ่งข้อ */
export interface AnswerResult {
  correct: boolean
  value: string
}

/** สรุปผลหนึ่งรอบ */
export interface RoundResult {
  score: number
  total: number
  mode: Mode
  perTopic: Record<string, { right: number; total: number }>
  /** ดาวที่ได้รอบนี้ (รวมโบนัสเต็ม) */
  starsGained: number
  /** ปลดล็อกรางวัลใหม่กี่ใบในรอบนี้ */
  newTickets: number
}
