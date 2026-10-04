import { useEffect, useState } from 'react'
import type { Question, RoundResult, Topic } from '../types'
import { TOPIC_INDICATORS, TOPIC_NAMES } from '../data/curriculum'
import { EXAM_TIPS } from '../data/lessons'
import { buildRound, shuffle } from '../lib/quiz'
import { gradeExam, type ExamGrade } from '../lib/learning'
import { useSettings } from '../state/SettingsContext'
import { useProgress } from '../state/ProgressContext'
import { Modal, TopBar } from './ui'
import { Visual } from './Visual'
import { ThaiText } from './ThaiText'
import { ModelView } from './ModelView'
import { NumberLine } from './NumberLine'
import { Keypad } from './Keypad'
import { CHOICE_KEYS, formatEntry } from '../lib/format'
import { RewardModal } from './RewardModal'

// ──────────────────────────────────────────────────────────────
// ข้อสอบจำลอง: ปรนัย 20 ข้อ ตัวเลือก ก ข ค ง เหมือนข้อสอบจริง
// - ไม่บอกผลระหว่างทำ ทำข้ามข้อและทำเครื่องหมายไว้กลับมาดูได้ ตรวจก่อนส่ง
// - แสดงเพียงเวลาที่ใช้ไป ไม่มีนับถอยหลัง และซ่อนได้ (Ramirez et al., 2013)
// - หลังส่ง เฉลยพร้อมวิธีคิดและสรุปผลตามตัวชี้วัด (Black & Wiliam, 1998)
// ──────────────────────────────────────────────────────────────

const EXAM_SIZE = 20
const REAL_EXAM_MINUTES = 60

type Phase = 'intro' | 'test' | 'result'

/**
 * รูปแบบข้อสอบจำลอง
 * - mc20: ปรนัย 20 ข้อ ตามแนวข้อสอบที่โรงเรียนแจ้ง
 * - mixed: ปรนัย 15 ข้อ + เติมคำตอบ 5 ข้อ เหมือนแบบทดสอบย่อยที่ผ่านมาของโรงเรียน
 */
type ExamFormat = 'mc20' | 'mixed'
const FORMAT_LABEL: Record<ExamFormat, string> = {
  mc20: 'ปรนัย 20 ข้อ (ตามแนวข้อสอบ)',
  mixed: 'ปรนัย 15 ข้อ + เติมคำตอบ 5 ข้อ',
}

const isAnswered = (v: string | undefined) => v !== undefined && v !== ''

const fmtTime = (sec: number) => {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
const fmtThaiTime = (sec: number) => `${Math.floor(sec / 60)} นาที ${sec % 60} วินาที`

interface Props {
  onHome: () => void
  onPractice: (title: string, questions: Question[]) => void
}

export function ExamSession({ onHome, onPractice }: Props) {
  const { settings } = useSettings()
  const { progress, finishExam } = useProgress()
  const [phase, setPhase] = useState<Phase>('intro')
  const [format, setFormat] = useState<ExamFormat>('mc20')
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [flagged, setFlagged] = useState<string[]>([])
  const [index, setIndex] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [showTime, setShowTime] = useState(true)
  const [confirmSubmit, setConfirmSubmit] = useState(false)
  const [confirmLeave, setConfirmLeave] = useState(false)
  const [grade, setGrade] = useState<ExamGrade | null>(null)
  const [result, setResult] = useState<RoundResult | null>(null)
  const [rewardOpen, setRewardOpen] = useState(false)

  useEffect(() => {
    if (phase !== 'test') return
    const id = setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [phase])

  const current = questions[index]

  // คีย์ลัด 1–4 เลือกคำตอบ
  useEffect(() => {
    if (phase !== 'test' || !current || confirmSubmit || confirmLeave) return
    if (current.kind !== 'choice') return
    const onKey = (e: KeyboardEvent) => {
      const i = ['1', '2', '3', '4'].indexOf(e.key)
      const choices = current.choices ?? []
      if (i >= 0 && i < choices.length) setAnswers((a) => ({ ...a, [current.id]: choices[i] }))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, current, confirmSubmit, confirmLeave])

  function start() {
    const base = { ...settings, mix: 'balanced' as const }
    const picked =
      format === 'mc20'
        ? buildRound({ ...base, questionsPerRound: EXAM_SIZE }, { choiceOnly: true })
        : [
            // ตอนที่ 1 ปรนัย แล้วตามด้วยตอนที่ 2 เติมคำตอบ เหมือนกระดาษข้อสอบ
            ...buildRound({ ...base, questionsPerRound: 15 }, { choiceOnly: true }),
            ...buildRound({ ...base, questionsPerRound: 5 }, { fillOnly: true }),
          ]
    // สลับลำดับตัวเลือกครั้งเดียวตอนเริ่ม เพื่อให้ ก ข ค คงที่ตลอดการสอบ
    setQuestions(picked.map((q) => (q.choices ? { ...q, choices: shuffle(q.choices) } : q)))
    setAnswers({})
    setFlagged([])
    setIndex(0)
    setElapsed(0)
    setGrade(null)
    setResult(null)
    setPhase('test')
    window.scrollTo({ top: 0 })
  }

  function go(i: number) {
    setIndex(Math.max(0, Math.min(questions.length - 1, i)))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function submit() {
    const g = gradeExam(questions, answers)
    const r = finishExam(g)
    setGrade(g)
    setResult(r)
    setConfirmSubmit(false)
    setPhase('result')
    if (r.newTickets > 0) setRewardOpen(true)
    window.scrollTo({ top: 0 })
  }

  // ── หน้าแนะนำก่อนสอบ ──
  if (phase === 'intro') {
    const last = progress.examHistory[0]
    return (
      <main className="screen">
        <TopBar title="ข้อสอบจำลอง" onBack={onHome} backLabel="หน้าแรก" />
        <section className="card examIntro">
          <div className="examIntroIcon" aria-hidden="true">
            📝
          </div>
          <h2 className="sectionTitle">เหมือนการสอบจริง</h2>
          <dl className="factList">
            <div>
              <dt>จำนวนข้อ</dt>
              <dd>{FORMAT_LABEL[format]} ข้อละ 1 คะแนน</dd>
            </div>
            <div>
              <dt>เนื้อหา</dt>
              <dd>บทที่ 4–6 จำนวน 11–20 การบวก และการลบ</dd>
            </div>
            <div>
              <dt>เวลา</dt>
              <dd>สอบจริง {REAL_EXAM_MINUTES} นาที ข้อละประมาณ 3 นาที ไม่ต้องรีบ</dd>
            </div>
          </dl>
          {last && (
            <p className="note">
              ครั้งล่าสุดได้ {last.score} จาก {last.total} คะแนน
            </p>
          )}
        </section>
        <section className="card">
          <fieldset className="field">
            <legend className="sectionTitle">รูปแบบข้อสอบ</legend>
            <div className="formatOptions">
              {(Object.keys(FORMAT_LABEL) as ExamFormat[]).map((f) => (
                <label key={f} className={`formatOption ${format === f ? 'formatOn' : ''}`}>
                  <input
                    type="radio"
                    name="exam-format"
                    checked={format === f}
                    onChange={() => setFormat(f)}
                  />
                  <span>
                    <b>{FORMAT_LABEL[f]}</b>
                    <span className="formatDesc">
                      {f === 'mc20'
                        ? 'ตรงกับแนวข้อสอบที่โรงเรียนแจ้ง'
                        : 'เหมือนแบบทดสอบย่อยที่ผ่านมา มีเขียนประโยคสัญลักษณ์และเส้นจำนวน'}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </section>
        <section className="card">
          <h2 className="sectionTitle">เคล็ดลับการทำข้อสอบ</h2>
          <ol className="tipList">
            {EXAM_TIPS.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ol>
        </section>
        <div className="actions">
          <button className="btn btnPrimary btnLarge" onClick={start}>
            เริ่มทำข้อสอบ
          </button>
        </div>
      </main>
    )
  }

  // ── หน้าผลสอบ ──
  if (phase === 'result' && grade && result) {
    const wrong = grade.items.filter((i) => !i.correct).map((i) => i.question)
    const topics = Object.entries(grade.perTopic) as [Topic, { right: number; total: number }][]
    const ratio = grade.score / grade.total
    return (
      <main className="screen">
        <TopBar title="ผลข้อสอบจำลอง" onBack={onHome} backLabel="หน้าแรก" />
        <section className="card resultHero">
          <p className="resultScore">
            ได้ <b>{grade.score}</b> จาก {grade.total} คะแนน
          </p>
          <p className="resultSub">ใช้เวลา {fmtThaiTime(elapsed)}</p>
          <p className="resultMessage">
            {ratio === 1
              ? 'ตอบถูกทุกข้อ เตรียมตัวมาอย่างดี'
              : ratio >= 0.8
                ? 'ทำได้ดีมาก ทบทวนข้อที่ผิดอีกนิดจะมั่นใจยิ่งขึ้น'
                : ratio >= 0.6
                  ? 'ทำได้ดี ดูวิธีคิดของข้อที่ผิด แล้วฝึกทักษะนั้นเพิ่มนะ'
                  : 'ไม่เป็นไร ลองเรียนบทเรียนสั้นของเรื่องที่ผิด แล้วกลับมาทำใหม่นะ'}
          </p>
          <p className="resultStars">
            <span aria-hidden="true">⭐</span> ได้รับดาว +{result.starsGained} ดวง
          </p>
        </section>

        <section className="card">
          <h2 className="sectionTitle">ผลตามตัวชี้วัด</h2>
          <div className="tableWrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">ทักษะ</th>
                  <th scope="col">ตัวชี้วัด</th>
                  <th scope="col">ถูก</th>
                </tr>
              </thead>
              <tbody>
                {topics.map(([t, v]) => (
                  <tr key={t}>
                    <td>{TOPIC_NAMES[t]}</td>
                    <td className="nowrap">{TOPIC_INDICATORS[t].join(', ')}</td>
                    <td>
                      <span className={`badge badge-${v.right === v.total ? 'good' : 'todo'}`}>
                        {v.right}/{v.total}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card">
          <h2 className="sectionTitle">เฉลยและวิธีคิด</h2>
          <ol className="reviewList">
            {grade.items.map(({ question: q, chosen, correct }, i) => (
              <li key={q.id}>
                <details className={`reviewItem ${correct ? 'reviewRight' : 'reviewWrong'}`}>
                  <summary>
                    <span className="reviewMark" aria-hidden="true">
                      {correct ? '✓' : '✕'}
                    </span>
                    <span className="reviewNo">ข้อ {i + 1}</span>
                    <span className="reviewText">
                      <ThaiText text={q.text} />
                    </span>
                    <span className="srOnly">{correct ? 'ตอบถูก' : 'ตอบผิด'}</span>
                  </summary>
                  <div className="reviewBody">
                    <Visual visual={q.visual} />
                    {q.line && <NumberLine spec={q.line} showJumps={!correct} />}
                    <p>
                      คำตอบที่ตอบ: <b>{isAnswered(chosen) ? formatEntry(chosen!) : 'ไม่ได้ตอบ'}</b>
                    </p>
                    <p>
                      คำตอบที่ถูก: <b>{formatEntry(q.answer)}</b>
                    </p>
                    {(q.steps ?? [q.explain]).filter(Boolean).length > 0 && (
                      <ol className="stepList">
                        {(q.steps ?? [q.explain!]).map((s) => (
                          <li key={s}>
                            <ThaiText text={s} />
                          </li>
                        ))}
                      </ol>
                    )}
                    {!correct && q.model && <ModelView model={q.model} />}
                  </div>
                </details>
              </li>
            ))}
          </ol>
        </section>

        <div className="actions">
          {wrong.length > 0 && (
            <button
              className="btn btnPrimary btnLarge"
              onClick={() => onPractice('ฝึกข้อที่ผิดจากข้อสอบจำลอง', wrong)}
            >
              ฝึกข้อที่ผิด ({wrong.length} ข้อ)
            </button>
          )}
          <button className="btn btnSecondary btnLarge" onClick={() => setPhase('intro')}>
            ทำข้อสอบชุดใหม่
          </button>
          <button className="btn btnGhost btnLarge" onClick={onHome}>
            กลับหน้าแรก
          </button>
        </div>
        {rewardOpen && (
          <RewardModal count={result.newTickets} onClose={() => setRewardOpen(false)} />
        )}
      </main>
    )
  }

  // ── หน้าทำข้อสอบ ──
  if (!current) return null
  const answeredCount = questions.filter((q) => isAnswered(answers[q.id])).length
  const unanswered = questions
    .map((q, i) => (isAnswered(answers[q.id]) ? 0 : i + 1))
    .filter(Boolean)
  const flaggedNos = questions.map((q, i) => (flagged.includes(q.id) ? i + 1 : 0)).filter(Boolean)
  const isFlagged = flagged.includes(current.id)
  const overTime = elapsed > REAL_EXAM_MINUTES * 60

  return (
    <main className="screen">
      <TopBar
        title="ข้อสอบจำลอง"
        onBack={() => setConfirmLeave(true)}
        backLabel="ออก"
        right={
          <button
            className="btn btnGhost btnSmall timer"
            onClick={() => setShowTime((v) => !v)}
            aria-label={showTime ? `เวลาที่ใช้ ${fmtTime(elapsed)} กดเพื่อซ่อน` : 'แสดงเวลาที่ใช้'}
          >
            <span aria-hidden="true">⏱</span> {showTime ? fmtTime(elapsed) : 'แสดงเวลา'}
          </button>
        }
      />
      {overTime && showTime && (
        <p className="note noteCenter">เกินเวลาสอบจริงแล้ว ค่อย ๆ ทำต่อให้เสร็จได้</p>
      )}

      <nav className="qNav" aria-label="เลือกข้อสอบ">
        {questions.map((q, i) => {
          const state = [
            isAnswered(answers[q.id]) ? 'qNavDone' : '',
            flagged.includes(q.id) ? 'qNavFlag' : '',
            i === index ? 'qNavCurrent' : '',
          ].join(' ')
          return (
            <button
              key={q.id}
              className={`qNavItem ${state}`}
              onClick={() => go(i)}
              aria-current={i === index ? 'step' : undefined}
              aria-label={`ข้อ ${i + 1}${isAnswered(answers[q.id]) ? ' ตอบแล้ว' : ' ยังไม่ตอบ'}${flagged.includes(q.id) ? ' ทำเครื่องหมายไว้' : ''}`}
            >
              {i + 1}
            </button>
          )
        })}
      </nav>
      <p className="examStatus">
        ตอบแล้ว {answeredCount} จาก {questions.length} ข้อ
      </p>

      <article className="qCard" aria-labelledby={`exam-q-${current.id}`}>
        <div className="qMeta">
          <span className="chip chipStrong">ข้อ {index + 1}</span>
          <button
            className={`btn btnSmall ${isFlagged ? 'btnWarn' : 'btnGhost'}`}
            aria-pressed={isFlagged}
            onClick={() =>
              setFlagged((f) =>
                isFlagged ? f.filter((id) => id !== current.id) : [...f, current.id],
              )
            }
          >
            <span aria-hidden="true">🚩</span> {isFlagged ? 'ทำเครื่องหมายไว้แล้ว' : 'ไว้กลับมาดู'}
          </button>
        </div>
        <h2
          id={`exam-q-${current.id}`}
          className={`qText ${current.text.length > 34 ? 'qTextLong' : ''}`}
        >
          <ThaiText text={current.text} />
        </h2>
        {current.small && (
          <p className="qSmall">
            <ThaiText text={current.small} />
          </p>
        )}
        <Visual visual={current.visual} />
        {current.line && (
          <NumberLine spec={current.line} markEnd={current.answer !== String(current.line.end)} />
        )}
        {current.kind === 'fill' ? (
          <Keypad
            key={current.id}
            id={`exam-fill-${current.id}`}
            label={`คำตอบของข้อ ${index + 1}`}
            value={answers[current.id] ?? ''}
            onChange={(v) => setAnswers((a) => ({ ...a, [current.id]: v }))}
            sentence={current.format === 'sentence'}
          />
        ) : (
          <div
            className={`choices ${(current.choices ?? []).some((c) => c.length > 8) ? 'choicesWide' : ''}`}
            role="radiogroup"
            aria-label={`ตัวเลือกของข้อ ${index + 1}`}
          >
            {(current.choices ?? []).map((value, i) => {
              const selected = answers[current.id] === value
              return (
                <button
                  key={value}
                  role="radio"
                  aria-checked={selected}
                  className={`choice ${selected ? 'choiceSelected' : ''}`}
                  onClick={() => setAnswers((a) => ({ ...a, [current.id]: value }))}
                >
                  <span className="choiceKey" aria-hidden="true">
                    {CHOICE_KEYS[i]}
                  </span>
                  <span className="choiceText">{value}</span>
                </button>
              )
            })}
          </div>
        )}
      </article>

      <div className="examNav">
        <button className="btn btnGhost" onClick={() => go(index - 1)} disabled={index === 0}>
          <span aria-hidden="true">←</span> ข้อก่อนหน้า
        </button>
        {index + 1 < questions.length ? (
          <button className="btn btnPrimary" onClick={() => go(index + 1)}>
            ข้อถัดไป <span aria-hidden="true">→</span>
          </button>
        ) : (
          <button className="btn btnPrimary" onClick={() => setConfirmSubmit(true)}>
            ตรวจและส่งคำตอบ
          </button>
        )}
      </div>
      {index + 1 < questions.length && (
        <div className="actions">
          <button className="btn btnSecondary" onClick={() => setConfirmSubmit(true)}>
            ตรวจและส่งคำตอบ
          </button>
        </div>
      )}

      {confirmSubmit && (
        <Modal label="ตรวจก่อนส่งคำตอบ" onClose={() => setConfirmSubmit(false)}>
          <h2 className="modalTitle">ตรวจก่อนส่งคำตอบ</h2>
          <p className="modalText">
            ตอบแล้ว <b>{answeredCount}</b> จาก {questions.length} ข้อ
          </p>
          {unanswered.length > 0 && (
            <p className="note noteWarn">ยังไม่ได้ตอบข้อ {unanswered.join(', ')}</p>
          )}
          {flaggedNos.length > 0 && (
            <p className="note">ทำเครื่องหมายไว้ที่ข้อ {flaggedNos.join(', ')}</p>
          )}
          <div className="actions">
            <button className="btn btnGhost btnLarge" onClick={() => setConfirmSubmit(false)}>
              กลับไปทำต่อ
            </button>
            <button className="btn btnPrimary btnLarge" onClick={submit}>
              ส่งคำตอบ
            </button>
          </div>
        </Modal>
      )}

      {confirmLeave && (
        <Modal label="ออกจากข้อสอบ" onClose={() => setConfirmLeave(false)}>
          <h2 className="modalTitle">ออกจากข้อสอบหรือไม่</h2>
          <p className="modalText">คำตอบที่ทำไว้จะไม่ถูกบันทึก</p>
          <div className="actions">
            <button className="btn btnPrimary btnLarge" onClick={() => setConfirmLeave(false)}>
              ทำข้อสอบต่อ
            </button>
            <button className="btn btnGhost btnLarge" onClick={onHome}>
              ออกจากข้อสอบ
            </button>
          </div>
        </Modal>
      )}
    </main>
  )
}
