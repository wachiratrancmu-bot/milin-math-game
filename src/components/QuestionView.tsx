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
const AUTO_ADVANCE_SECONDS = 5

interface Props {
  question: Question
  index: number
  total: number
  showHints: boolean
  sound: boolean
  /** เรียกครั้งเดียวเมื่อตอบ พร้อมผลถูก/ผิด */
  onAnswered: (correct: boolean) => void
  onNext: () => void
  isLast: boolean
}

export function QuestionView({ question, index, total, showHints, sound, onAnswered, onNext, isLast }: Props) {
  const [answered, setAnswered] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [chosen, setChosen] = useState<string | null>(null)
  const [inputVal, setInputVal] = useState('')
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

  useEffect(() => {
    setAnswered(false)
    setCorrect(false)
    setChosen(null)
    setInputVal('')
    setCountdown(null)
    if (question.kind === 'fill') {
      const t = setTimeout(() => inputRef.current?.focus(), 120)
      return () => clearTimeout(t)
    }
  }, [question.id])

  // ตอบถูก → นับถอยหลังแล้วไปข้อถัดไปอัตโนมัติ (ตอบผิดให้กดเองเพื่ออ่านวิธีคิด)
  // หมายเหตุ: ตัว updater ต้องบริสุทธิ์ (ไม่มี side effect) เพราะ StrictMode เรียกซ้ำ
  useEffect(() => {
    if (!answered || !correct) return
    setCountdown(AUTO_ADVANCE_SECONDS)
    const id = setInterval(() => {
      setCountdown((c) => (c !== null && c > 0 ? c - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [answered, correct])

  // เมื่อนับถอยหลังถึง 0 จึงไปข้อถัดไป (แยกออกจาก updater เพื่อความถูกต้อง)
  useEffect(() => {
    if (countdown === 0) onNextRef.current()
  }, [countdown])

  function submit(value: string) {
    if (answered) return
    const ok = isCorrect(value, question.answer)
    setAnswered(true)
    setCorrect(ok)
    setChosen(value)
    if (ok) {
      playCorrect(sound)
      fireConfetti()
    } else {
      playWrong(sound)
    }
    onAnswered(ok)
  }

  const feedback = answered
    ? correct
      ? pick(PRAISE)
      : 'ยังไม่ถูกต้อง ไม่เป็นไร ลองอ่านวิธีคิดด้านล่าง'
    : ''

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
            if (answered) {
              if (isCorrect(value, question.answer)) cls += ' correct'
              else if (value === chosen) cls += ' wrong'
            }
            return (
              <button key={value} className={cls} disabled={answered} onClick={() => submit(value)}>
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
            disabled={answered}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputVal.trim() !== '') submit(inputVal)
            }}
          />
          {!answered && (
            <button className="primary" disabled={inputVal.trim() === ''} onClick={() => submit(inputVal)}>
              ส่งคำตอบ
            </button>
          )}
        </div>
      )}

      {showHints && !answered && question.hint && <div className="hintBox">💡 {question.hint}</div>}

      {answered && (
        <>
          <div className="feedback" style={{ color: correct ? 'var(--green2)' : 'var(--red)' }}>
            {feedback}
          </div>
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
