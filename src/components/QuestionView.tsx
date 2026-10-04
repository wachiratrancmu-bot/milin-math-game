import { useEffect, useMemo, useRef, useState } from 'react'
import type { Question } from '../types'
import { LEVEL_NAMES, TOPIC_ICONS, TOPIC_SHORT } from '../data/curriculum'
import { matchesAnswer, shuffle, pick } from '../lib/quiz'
import { playCorrect, playWrong } from '../lib/sound'
import { fireConfetti } from '../lib/confetti'
import { canSpeak, speak, stopSpeaking } from '../lib/speech'
import { Visual } from './Visual'
import { ThaiText } from './ThaiText'
import { ModelView } from './ModelView'
import { NumberLine } from './NumberLine'
import { Keypad } from './Keypad'
import { CHOICE_KEYS, formatEntry } from '../lib/format'

// ──────────────────────────────────────────────────────────────
// หน้าทำโจทย์ (โหมดฝึก)
// ลำดับ: คิดเอง → ผิดลองใหม่ได้ → เฉลยพร้อมวิธีคิดทีละขั้นและภาพช่วยคิด
// (ผลป้อนกลับ: Shute, 2008 · ตัวอย่างการทำ: Sweller & Cooper, 1985)
// คำชมเน้นความพยายามและวิธีคิด ไม่ชมว่าฉลาด (Mueller & Dweck, 1998)
// ──────────────────────────────────────────────────────────────

const PRAISE = [
  'ถูกต้อง ตั้งใจคิดดีมาก',
  'ถูกต้อง คิดอย่างเป็นขั้นตอนดีมาก',
  'ถูกต้อง อ่านโจทย์ได้ละเอียดดีมาก',
  'ถูกต้อง ใช้วิธีคิดได้เหมาะสม',
]
const RETRY_PRAISE = 'ถูกต้องแล้ว ลองคิดใหม่จนได้คำตอบ ดีมาก'

type Tone = 'success' | 'warn' | 'info'

interface Props {
  question: Question
  sound: boolean
  readAloud: boolean
  /** ตอบถูกแล้วไปข้อถัดไปอัตโนมัติในกี่วินาที (0 = กดเอง) */
  autoAdvanceSeconds: number
  /** ตอบผิดได้กี่ครั้งก่อนเฉลย */
  maxTries: number
  /** เรียกครั้งเดียวเมื่อสรุปผลข้อนั้น */
  onAnswered: (correct: boolean, firstTry: boolean) => void
  onNext: () => void
  isLast: boolean
}

export function QuestionView({
  question,
  sound,
  readAloud,
  autoAdvanceSeconds,
  maxTries,
  onAnswered,
  onNext,
  isLast,
}: Props) {
  const [locked, setLocked] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [wrongTries, setWrongTries] = useState(0)
  const [chosen, setChosen] = useState<string | null>(null)
  const [wrongChoices, setWrongChoices] = useState<string[]>([])
  const [entry, setEntry] = useState('')
  const [feedback, setFeedback] = useState<{ tone: Tone; text: string } | null>(null)
  const [solutionOpen, setSolutionOpen] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  const onNextRef = useRef(onNext)
  onNextRef.current = onNext

  // สลับตัวเลือกใหม่ทุกครั้งที่เปลี่ยนข้อ (question คงที่ต่อหนึ่งข้อ)
  const choices = useMemo(() => (question.choices ? shuffle(question.choices) : []), [question])
  const steps = question.steps ?? [question.hint, question.explain].filter((s): s is string => !!s)
  const isSentence = question.format === 'sentence'

  // หยุดเสียงอ่านเมื่อเปลี่ยนข้อ
  useEffect(() => () => stopSpeaking(), [question])

  // ตอบถูก → นับถอยหลังแล้วไปข้อถัดไป (หยุดนับเมื่อเปิดดูวิธีคิด)
  useEffect(() => {
    if (!locked || !correct || autoAdvanceSeconds <= 0) return
    if (solutionOpen) {
      setCountdown(null)
      return
    }
    setCountdown(autoAdvanceSeconds)
    const id = setInterval(() => setCountdown((c) => (c !== null && c > 0 ? c - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [locked, correct, autoAdvanceSeconds, solutionOpen])

  useEffect(() => {
    if (countdown === 0) onNextRef.current()
  }, [countdown])

  // ย้ายโฟกัสไปที่ปุ่มข้อถัดไปเมื่อสรุปผล เพื่อกด Enter ต่อได้
  useEffect(() => {
    if (locked) nextRef.current?.focus()
  }, [locked])

  // คีย์ลัด: 1–4 เลือกตัวเลือก ก–ง
  useEffect(() => {
    if (question.kind !== 'choice') return
    const onKey = (e: KeyboardEvent) => {
      if (locked || e.altKey || e.ctrlKey || e.metaKey) return
      const i = ['1', '2', '3', '4'].indexOf(e.key)
      if (i >= 0 && i < choices.length && !wrongChoices.includes(choices[i])) submit(choices[i])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  function submit(value: string) {
    if (locked || !value) return
    if (matchesAnswer(question, value)) {
      setLocked(true)
      setCorrect(true)
      setChosen(value)
      setFeedback({ tone: 'success', text: wrongTries > 0 ? RETRY_PRAISE : pick(PRAISE) })
      playCorrect(sound)
      fireConfetti()
      onAnswered(true, wrongTries === 0)
      return
    }

    playWrong(sound)
    const tries = wrongTries + 1
    setWrongTries(tries)
    setChosen(value)
    if (question.kind === 'choice') setWrongChoices((w) => [...w, value])

    if (tries < maxTries) {
      setFeedback({ tone: 'warn', text: 'ยังไม่ถูก ลองอ่านโจทย์อีกครั้ง แล้วคิดใหม่นะ' })
      if (question.kind === 'fill') setEntry('')
    } else {
      setLocked(true)
      setCorrect(false)
      setFeedback({ tone: 'info', text: 'ไม่เป็นไร มาดูวิธีคิดด้วยกันนะ' })
      setSolutionOpen(true)
      onAnswered(false, false)
    }
  }

  function readQuestion() {
    const parts = [question.text]
    if (question.kind === 'choice') {
      parts.push(choices.map((c, i) => `ข้อ ${CHOICE_KEYS[i]} ${c}`).join(' '))
    }
    speak(parts.join(' '))
  }

  return (
    <article className="qCard" aria-labelledby={`q-${question.id}`}>
      <div className="qMeta">
        <span className="chip">
          <span aria-hidden="true">{TOPIC_ICONS[question.topic]}</span>{' '}
          {TOPIC_SHORT[question.topic]}
        </span>
        <span className="chip chipMuted">{LEVEL_NAMES[question.level]}</span>
        {readAloud && canSpeak() && (
          <button className="btn btnGhost btnSmall qListen" onClick={readQuestion}>
            <span aria-hidden="true">🔊</span> ฟังโจทย์
          </button>
        )}
      </div>

      <h2
        id={`q-${question.id}`}
        className={`qText ${question.text.length > 34 ? 'qTextLong' : ''}`}
      >
        <ThaiText text={question.text} />
      </h2>
      {question.small && (
        <p className="qSmall">
          <ThaiText text={question.small} />
        </p>
      )}
      <Visual visual={question.visual} />
      {question.line && (
        <NumberLine spec={question.line} markEnd={question.answer !== String(question.line.end)} />
      )}

      {question.kind === 'choice' ? (
        <div
          className={`choices ${choices.some((c) => c.length > 8) ? 'choicesWide' : ''}`}
          role="group"
          aria-label="ตัวเลือก"
        >
          {choices.map((value, i) => {
            const isAnswer = matchesAnswer(question, value)
            const isWrong =
              wrongChoices.includes(value) || (locked && value === chosen && !isAnswer)
            const state = locked && isAnswer ? 'choiceCorrect' : isWrong ? 'choiceWrong' : ''
            return (
              <button
                key={value}
                className={`choice ${state}`}
                disabled={locked || wrongChoices.includes(value)}
                onClick={() => submit(value)}
                aria-label={`ตัวเลือก ${CHOICE_KEYS[i]} ${value}${state === 'choiceCorrect' ? ' คำตอบที่ถูก' : state === 'choiceWrong' ? ' ไม่ถูก' : ''}`}
              >
                <span className="choiceKey" aria-hidden="true">
                  {CHOICE_KEYS[i]}
                </span>
                <span className="choiceText">{value}</span>
                {state && (
                  <span className="choiceMark" aria-hidden="true">
                    {state === 'choiceCorrect' ? '✓' : '✕'}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      ) : (
        <Keypad
          id={`fill-${question.id}`}
          label={isSentence ? 'ประโยคสัญลักษณ์' : 'คำตอบ'}
          value={locked ? (chosen ?? '') : entry}
          onChange={setEntry}
          onSubmit={() => submit(entry)}
          sentence={isSentence}
          disabled={locked}
        />
      )}

      <div className="qFeedbackArea" aria-live="polite">
        {feedback && (
          <div className={`feedback fb-${feedback.tone}`}>
            <span aria-hidden="true">
              {feedback.tone === 'success' ? '🌟' : feedback.tone === 'warn' ? '🤔' : '💪'}
            </span>{' '}
            {feedback.text}
            {!locked && wrongTries > 0 && (
              <span className="fbSub"> (เหลือโอกาสอีก {maxTries - wrongTries} ครั้ง)</span>
            )}
          </div>
        )}
      </div>

      {locked && (
        <div className="afterAnswer">
          {correct && steps.length > 0 && !solutionOpen && (
            <button className="btn btnGhost btnSmall" onClick={() => setSolutionOpen(true)}>
              ดูวิธีคิด
            </button>
          )}
          {solutionOpen && (
            <section className="solution" aria-label="วิธีคิดทีละขั้น">
              <h3>วิธีคิดทีละขั้น</h3>
              <ol>
                {steps.map((s) => (
                  <li key={s}>
                    <ThaiText text={s} />
                  </li>
                ))}
              </ol>
              {question.line && <NumberLine spec={question.line} showJumps />}
              {question.model && <ModelView model={question.model} />}
              {!correct && (
                <p className="solutionAnswer">
                  คำตอบที่ถูกคือ{' '}
                  <b>{isSentence ? formatEntry(question.answer) : question.answer}</b>
                </p>
              )}
            </section>
          )}
          <button ref={nextRef} className="btn btnPrimary btnLarge" onClick={onNext}>
            {isLast ? 'ดูสรุปผล' : 'ข้อถัดไป'}
            {countdown !== null && countdown > 0 ? ` (${countdown})` : ''}{' '}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </article>
  )
}
