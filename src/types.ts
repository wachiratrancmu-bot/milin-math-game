// ──────────────────────────────────────────────────────────────
// ชนิดข้อมูลกลางของทั้งเกม
// ──────────────────────────────────────────────────────────────

/** หัวข้อตามใบสอบเก็บคะแนนท้ายบทที่ 1 วิชาคณิตศาสตร์ ป.1 */
export type Topic =
  | 'place'    // จำนวนและค่าประจำหลัก
  | 'compare'  // เปรียบเทียบจำนวน >,<,=
  | 'expand'   // การกระจายจำนวน
  | 'order'    // การเรียงลำดับจำนวน
  | 'part'     // ความสัมพันธ์ส่วนรวม–ส่วนย่อย
  | 'rank'     // การบอกอันดับ
  | 'pattern'  // แบบรูปของจำนวน (เสริม)

export type Level = 'easy' | 'medium' | 'hard'

/** กากบาท (เลือกตอบ) หรือ เติมคำตอบ */
export type QuestionKind = 'choice' | 'fill'

export interface Question {
  id: string
  topic: Topic
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
