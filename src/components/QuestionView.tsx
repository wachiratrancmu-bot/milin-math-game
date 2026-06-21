import { useEffect, useMemo, useRef, useState } from 'react'
import type { Question } from '../types'
import { TOPIC_NAMES, LEVEL_NAMES } from '../data/questions'
import { isCorrect, shuffle, pick } from '../lib/quiz'
import { playCorrect, playWrong } from '../lib/sound'
import { fireConfetti } from '../lib/confetti'
import { Visual } from './Visual'

const PRAISE = [
  'ตอบถูกต้อง เก่งมาก ⭐',
  'ถูกต้อง ทำได้ดีมาก 🌈',
  'ตอบถูกต้อง ได้รับดาวเพิ่ม ✨',
  'ถูกต้องครบถ้วน ยอดเยี่ยม 🏆',
]

/** ตอบถูกแล้วไปข้อถัดไปอัตโนมัติภายในกี่วินาที */
const AUTO_ADVANCE_SECONDS = 10

/** ตอบผิดได้กี่ครั้งก่อนเฉลย */
const MAX_TRIES = 2

interface Props {
  question: Question
  index: number
  total: number
  showHints: boolean
  sound: boolean
  /** เรียกครั้งเดียวเมื่อสรุปผลข้อนั้น พร้อมผลถูก/ผิดสุดท้าย */
  onAnswered: (correct: boolean) => void
  onNext: () => void
  isLast: boolean
}

export function QuestionView({ question, index, total, showHints, sound, onAnswered, onNext, isLast }: Props) {
  const [locked, setLocked] = useState(false) // สรุปผลแล้ว (ตอบถูก หรือ ผิดครบ 2 ครั้ง)
  const [correct, setCorrect] = useState(false)
  const [wrongTries, setWrongTries] = useState(0)
  const [chosen, setChosen] = useState<string | null>(null)
  const [wrongChoices, setWrongChoices] = useState<string[]>([])
  const [inputVal, setInputVal] = useState('')
  const [feedbackMsg, setFeedbackMsg] = useState('')
  const [countdown, setCountdown] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // อ้างอิง onNext ล่าสุดเสมอ เพื่อให้ตัวจับเวลาเรียกค่าที่อัปเดตแล้ว
  const onNextRef = useRef(onNext)
  onNextRef.current = onNext

  // สลับตัวเลือกใหม่ทุกครั้งที่เปลี่ยนข้อ
  const choices = useMemo(
    () => (question.choices ? shuffle(question.choices) : []),
    [question.id],
  )

  // รีเซ็ตสถานะทั้งหมดเมื่อเปลี่ยนข้อ
  useEffect(() => {
    setLocked(false)
    setCorrect(false)
    setWrongTries(0)
    setChosen(null)
    setWrongChoices([])
    setInputVal('')
    setFeedbackMsg('')
    setCountdown(null)
    if (question.kind === 'fill') {
      const t = setTimeout(() => inputRef.current?.focus(), 120)
      return () => clearTimeout(t)
    }
  }, [question.id])

  // ตอบถูก → นับถอยหลังแล้วไปข้อถัดไปอัตโนมัติ
  // หมายเหตุ: ตัว updater ต้องบริสุทธิ์ (ไม่มี side effect) เพราะ StrictMode เรียกซ้ำ
  useEffect(() => {
    if (!locked || !correct) return
    setCountdown(AUTO_ADVANCE_SECONDS)
    const id = setInterval(() => {
      setCountdown((c) => (c !== null && c > 0 ? c - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [locked, correct])

  // เมื่อนับถอยหลังถึง 0 จึงไปข้อถัดไป (แยกออกจาก updater เพื่อความถูกต้อง)
  useEffect(() => {
    if (countdown === 0) onNextRef.current()
  }, [countdown])

  function submit(value: string) {
    if (locked) return
    const ok = isCorrect(value, question.answer)

    if (ok) {
      setLocked(true)
      setCorrect(true)
      setChosen(value)
      setFeedbackMsg(wrongTries > 0 ? 'ถูกต้องแล้ว เก่งมากที่ตั้งใจ ⭐' : pick(PRAISE))
      playCorrect(sound)
      fireConfetti()
      onAnswered(true)
      return
    }

    // ตอบผิด
    playWrong(sound)
    const tries = wrongTries + 1
    setWrongTries(tries)
    setChosen(value)
    if (question.kind === 'choice') setWrongChoices((w) => [...w, value])

    if (tries < MAX_TRIES) {
      // ผิดครั้งแรก → ยังไม่เฉลย ให้ลองอีกครั้ง
      setFeedbackMsg('ยังไม่ถูกต้อง ลองอีกครั้งนะ')
      if (question.kind === 'fill') {
        setInputVal('')
        setTimeout(() => inputRef.current?.focus(), 50)
      }
    } else {
      // ผิดครบ 2 ครั้ง → เฉลย
      setLocked(true)
      setCorrect(false)
      setFeedbackMsg('ยังไม่ถูกต้อง ไม่เป็นไร ลองอ่านวิธีคิดด้านล่าง')
      onAnswered(false)
    }
  }

  return (
    <section className="card questionCard">
      <div className="tag">
        {TOPIC_NAMES[question.topic]} · ระดับ{LEVEL_NAMES[question.level]}
      </div>
      <div className="question">{question.text}</div>
      {question.small && <p className="instruction">{question.small}</p>}
      <Visual visual={question.visual} />

      {question.kind === 'choice' ? (
        <div className="choiceGrid">
          {choices.map((value) => {
            let cls = 'choice'
            if (locked) {
              if (isCorrect(value, question.answer)) cls += ' correct'
              else if (value === chosen || wrongChoices.includes(value)) cls += ' wrong'
            } else if (wrongChoices.includes(value)) {
              cls += ' wrong'
            }
            const disabled = locked || wrongChoices.includes(value)
            return (
              <button key={value} className={cls} disabled={disabled} onClick={() => submit(value)}>
                {value}
              </button>
            )
          })}
        </div>
      ) : (
        <div className="inputRow">
          <input
            ref={inputRef}
            className="answer"
            inputMode="numeric"
            placeholder="พิมพ์คำตอบ"
            value={inputVal}
            disabled={locked}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputVal.trim() !== '') submit(inputVal)
            }}
          />
          {!locked && (
            <button className="primary" disabled={inputVal.trim() === ''} onClick={() => submit(inputVal)}>
              ส่งคำตอบ
            </button>
          )}
        </div>
      )}

      {showHints && !locked && question.hint && <div className="hintBox">💡 {question.hint}</div>}

      {feedbackMsg && (
        <div className="feedback" style={{ color: correct ? 'var(--green2)' : 'var(--red)' }}>
          {feedbackMsg}
        </div>
      )}

      {/* ผิดครั้งแรก: ยังไม่เฉลย บอกให้ลองอีกครั้ง */}
      {!locked && wrongTries > 0 && (
        <div className="mini" style={{ marginTop: 2 }}>เหลือโอกาสอีก {MAX_TRIES - wrongTries} ครั้ง</div>
      )}

      {locked && (
        <>
          {(!correct || showHints) && question.explain && (
            <div className="explain">วิธีคิด: {question.explain}</div>
          )}
          <div className="btnRow" style={{ justifyContent: 'center' }}>
            <button className="green" onClick={onNext}>
              {isLast ? 'ดูสรุปผล' : 'ไปข้อถัดไป'}
              {countdown !== null && countdown > 0 ? ` (${countdown})` : ''} →
            </button>
          </div>
          {correct && countdown !== null && countdown > 0 && (
            <div className="mini" style={{ marginTop: 4 }}>
              จะไปข้อถัดไปอัตโนมัติใน {countdown} วินาที (กดปุ่มเพื่อไปทันที)
            </div>
          )}
          <div className="mini" style={{ marginTop: 6 }}>ข้อ {index + 1} จาก {total}</div>
        </>
      )}
    </section>
  )
}
