// ──────────────────────────────────────────────────────────────
// ชนิดข้อมูลกลางของทั้งระบบ
// ──────────────────────────────────────────────────────────────

/** ทักษะตามแนวข้อสอบคณิตศาสตร์ ป.1 บทที่ 4–6 (ผูกกับตัวชี้วัดใน data/curriculum.ts) */
export type Topic =
  | 'number' // อ่าน เขียน นับ จำนวน 11–20
  | 'place' // หลักสิบ หลักหน่วย
  | 'compare' // เปรียบเทียบจำนวน = ≠ > <
  | 'order' // เรียงลำดับ และแบบรูปของจำนวน
  | 'add' // การบวกไม่เกิน 20
  | 'sub' // การลบไม่เกิน 20
  | 'sentence' // ประโยคสัญลักษณ์จากภาพหรือเรื่องราว
  | 'word' // โจทย์ปัญหา
  | 'relation' // ความสัมพันธ์ของการบวกและการลบ

/** บทเรียนตามแนวข้อสอบของโรงเรียน */
export type Chapter = 4 | 5 | 6

export type Level = 'easy' | 'medium' | 'hard'

/** เลือกตอบ (ปรนัย) หรือ เติมคำตอบ */
export type QuestionKind = 'choice' | 'fill'

/**
 * ภาพช่วยคิด (ขั้นภาพแทนของ CRA) วาดด้วยกรอบสิบช่อง
 * ใช้ในวิธีคิดหลังตอบ ไม่แสดงตั้งแต่แรก เพื่อให้เด็กลองคิดเองก่อน
 */
export type Model =
  | { type: 'count'; n: number }
  | { type: 'add'; a: number; b: number }
  | { type: 'sub'; a: number; b: number }
  | { type: 'place'; n: number }

export interface NumberLineSpec {
  min: number
  max: number
  start: number
  end: number
}

export interface Question {
  id: string
  topic: Topic
  /** บทเรียน (ข้อที่ผู้ปกครองเพิ่มเองไม่มีบท) */
  chapter?: Chapter
  level: Level
  kind: QuestionKind
  /** โจทย์หลัก */
  text: string
  /** คำสั่งบรรทัดเล็กใต้โจทย์ */
  small?: string
  /** ภาพประกอบโจทย์ — สตริงอิโมจิหรือข้อความ (เป็นส่วนหนึ่งของโจทย์) */
  visual?: string
  /** คำตอบที่ถูกต้อง (เทียบแบบ normalize) */
  answer: string
  /** คำตอบอื่นที่ถูกต้องเช่นกัน เช่น 4 + 2 = 6 สำหรับ 2 + 4 = 6 */
  accept?: string[]
  /** รูปแบบคำตอบของข้อเติมคำตอบ: ตัวเลข หรือ ประโยคสัญลักษณ์ (มีแป้น + − =) */
  format?: 'number' | 'sentence'
  /** ตัวเลือกสำหรับ kind === 'choice' */
  choices?: string[]
  /** เส้นจำนวนประกอบโจทย์ (start ถูกทำเครื่องหมายไว้ end ใช้แสดงในวิธีคิด) */
  line?: NumberLineSpec
  /** แนวคิดสั้น ๆ (ใช้ในวิธีคิดเมื่อไม่มีขั้นตอนละเอียด) */
  hint?: string
  /** วิธีคิดสรุป */
  explain?: string
  /** วิธีคิดทีละขั้น (แสดงเมื่อเฉลย) */
  steps?: string[]
  /** ภาพช่วยคิด */
  model?: Model
  /** true = ข้อที่ผู้ปกครองเพิ่มเอง */
  custom?: boolean
}

/** ความท้าทาย — สัดส่วนระดับง่าย/กลาง/ยาก */
export type Mix = 'warmup' | 'balanced' | 'challenge'

export type Mode = 'practice' | 'exam'

export interface Settings {
  /** PIN สำหรับเข้าส่วนของผู้ปกครอง */
  pin: string
  /** จำนวนข้อต่อรอบ */
  questionsPerRound: number
  mode: Mode
  mix: Mix
  /** หัวข้อที่เปิดใช้ */
  enabledTopics: Topic[]
  sound: boolean
  /** แสดงปุ่มฟังโจทย์ */
  readAloud: boolean
  /** วันสอบ (YYYY-MM-DD) ว่าง = ไม่แสดงการนับวัน */
  examDate: string
  /** ตอบถูกแล้วไปข้อถัดไปอัตโนมัติภายในกี่วินาที (0 = กดเอง) */
  autoAdvanceSeconds: number
  /** ตอบผิดได้กี่ครั้งก่อนเฉลย */
  maxTries: number
  /** สะสมดาวครบกี่ดวงจึงได้ 1 รางวัล */
  rewardThreshold: number
  /** โบนัสดาวเมื่อทำเต็มในรอบเดียว */
  fullMarksBonus: number
  /** ชื่อรางวัล + อิโมจิ */
  rewardName: string
  rewardEmoji: string
  /** ชื่อผู้เรียน */
  playerName: string
  /** ข้อสอบที่ผู้ปกครองเพิ่มเอง */
  customQuestions: Question[]
}

export interface SessionRecord {
  date: string
  score: number
  total: number
  mode: Mode
}

/** สถิติรายทักษะ: recent เก็บผลการตอบครั้งแรก 10 ครั้งล่าสุด (1 = ถูก) */
export interface TopicStat {
  attempts: number
  correct: number
  recent: number[]
}

/**
 * ข้อที่เคยตอบผิด จัดแบบกล่อง Leitner
 * box 1 = ทบทวนได้ทันที, box 2 = ทบทวนอีกครั้งเมื่อผ่านไปอย่างน้อย 1 รอบ
 */
export interface MistakeEntry {
  box: 1 | 2
  lastRound: number
  wrongCount: number
}

export interface ExamRecord {
  date: string
  score: number
  total: number
  perTopic: Record<string, { right: number; total: number }>
}

export interface Progress {
  /** ตอบถูกสะสมตลอดกาล */
  totalCorrect: number
  /** ดาวสะสมเดินหน้าสู่รางวัลถัดไป */
  starBalance: number
  /** รางวัลที่ปลดล็อกแล้ว */
  ticketsEarned: number
  /** รางวัลที่ผู้ปกครองมอบให้แล้ว */
  ticketsRedeemed: number
  /** สถิติตอบถูกติดกันสูงสุด */
  bestStreak: number
  /** จำนวนรอบที่ทำเต็ม */
  perfectRounds: number
  history: SessionRecord[]
  /** จำนวนรอบที่เล่นจบแล้ว (ใช้เว้นระยะการทบทวน) */
  rounds: number
  topicStats: Partial<Record<Topic, TopicStat>>
  mistakes: Record<string, MistakeEntry>
  examHistory: ExamRecord[]
  lessonsDone: string[]
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
