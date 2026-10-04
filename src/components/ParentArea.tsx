import { useId, useState } from 'react'
import type { Mix, Question, Topic } from '../types'
import { CURRICULUM_SOURCE, INDICATORS, TOPIC_INDICATORS, TOPIC_NAMES } from '../data/curriculum'
import { PRINCIPLES, REFERENCES, type ReferenceKey } from '../data/references'
import { LESSONS } from '../data/lessons'
import { useSettings } from '../state/SettingsContext'
import { useProgress } from '../state/ProgressContext'
import { mastery, MASTERY_LABEL, topicsToPractice } from '../lib/learning'
import { Modal, TopBar } from './ui'

const ALL_TOPICS = Object.keys(TOPIC_NAMES) as Topic[]

// ชุดรางวัล — เลือกครั้งเดียวได้ทั้งสัญลักษณ์และชื่อ
const REWARD_PRESETS: { emoji: string; name: string }[] = [
  { emoji: '🍦', name: 'ไอศกรีม' },
  { emoji: '🍬', name: 'ลูกอม' },
  { emoji: '🍭', name: 'อมยิ้ม' },
  { emoji: '🍫', name: 'ช็อกโกแลต' },
  { emoji: '🍪', name: 'คุกกี้' },
  { emoji: '🧁', name: 'คัพเค้ก' },
  { emoji: '🍩', name: 'โดนัท' },
  { emoji: '🧸', name: 'ตุ๊กตา' },
  { emoji: '🎈', name: 'ลูกโป่ง' },
  { emoji: '🎁', name: 'ของขวัญ' },
  { emoji: '⭐', name: 'ดาวพิเศษ' },
  { emoji: '🍓', name: 'สตรอว์เบอร์รี' },
]

type Tab = 'overview' | 'reward' | 'settings' | 'custom' | 'principles'
const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'ภาพรวมการเรียน' },
  { id: 'reward', label: 'รางวัล' },
  { id: 'settings', label: 'การตั้งค่า' },
  { id: 'custom', label: 'เพิ่มข้อสอบ' },
  { id: 'principles', label: 'หลักการออกแบบ' },
]

export function ParentArea({ onBack }: { onBack: () => void }) {
  const { settings } = useSettings()
  const [unlocked, setUnlocked] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [tab, setTab] = useState<Tab>('overview')

  if (!unlocked) {
    return (
      <main className="screen">
        <TopBar title="สำหรับผู้ปกครอง" onBack={onBack} backLabel="หน้าแรก" />
        <section className="card pinCard">
          <div className="pinIcon" aria-hidden="true">
            🔒
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (pin === settings.pin) setUnlocked(true)
              else setError(true)
            }}
          >
            <label className="fieldLabel" htmlFor="pin">
              ใส่รหัส PIN เพื่อเข้าสู่ส่วนของผู้ปกครอง
            </label>
            <input
              id="pin"
              className="input pinInput"
              type="password"
              inputMode="numeric"
              autoComplete="off"
              value={pin}
              autoFocus
              aria-invalid={error}
              aria-describedby="pin-help"
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, ''))
                setError(false)
              }}
            />
            <p
              id="pin-help"
              className={error ? 'fieldError' : 'fieldHelp'}
              role={error ? 'alert' : undefined}
            >
              {error ? 'รหัส PIN ไม่ถูกต้อง' : 'รหัสเริ่มต้นคือ 1234 เปลี่ยนได้ในหน้าการตั้งค่า'}
            </p>
            <button className="btn btnPrimary btnLarge" type="submit">
              เข้าสู่ระบบ
            </button>
          </form>
        </section>
      </main>
    )
  }

  return (
    <main className="screen">
      <TopBar title="สำหรับผู้ปกครอง" onBack={onBack} backLabel="หน้าแรก" />
      <div className="tabs" role="tablist" aria-label="หมวดของผู้ปกครอง">
        {TABS.map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            role="tab"
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            className={`tab ${tab === t.id ? 'tabActive' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {tab === 'overview' && <Overview />}
        {tab === 'reward' && <RewardTab />}
        {tab === 'settings' && <SettingsTab />}
        {tab === 'custom' && <CustomQuestions />}
        {tab === 'principles' && <Principles />}
      </div>
    </main>
  )
}

// ── ภาพรวมการเรียน (การประเมินระหว่างเรียน: Black & Wiliam, 1998) ──
function Overview() {
  const { settings } = useSettings()
  const { progress } = useProgress()
  const focus = topicsToPractice(progress, settings.enabledTopics).slice(0, 3)
  return (
    <>
      <section className="statGrid">
        <div className="stat">
          <span className="statNum">{progress.totalCorrect}</span>
          <span className="statLabel">ตอบถูกสะสม (ข้อ)</span>
        </div>
        <div className="stat">
          <span className="statNum">
            {progress.examHistory[0]
              ? `${progress.examHistory[0].score}/${progress.examHistory[0].total}`
              : '–'}
          </span>
          <span className="statLabel">ข้อสอบจำลองครั้งล่าสุด</span>
        </div>
        <div className="stat">
          <span className="statNum">{Object.keys(progress.mistakes).length}</span>
          <span className="statLabel">ข้อในกล่องทบทวน</span>
        </div>
        <div className="stat">
          <span className="statNum">
            {progress.lessonsDone.length}/{LESSONS.length}
          </span>
          <span className="statLabel">บทเรียนที่เรียนแล้ว</span>
        </div>
      </section>

      {focus.length > 0 && (
        <section className="card">
          <h2 className="sectionTitle">ควรฝึกเพิ่ม</h2>
          <ul className="bulletList">
            {focus.map((t) => {
              const m = mastery(progress.topicStats[t])
              return (
                <li key={t}>
                  {TOPIC_NAMES[t]} — {MASTERY_LABEL[m.level]}
                  {m.count > 0 &&
                    ` (ถูก ${Math.round(m.accuracy * 100)}% จาก ${m.count} ข้อล่าสุด)`}
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <section className="card">
        <h2 className="sectionTitle">ความเชี่ยวชาญตามตัวชี้วัด</h2>
        <p className="sectionHint">
          คิดจากการตอบครั้งแรก 10 ข้อล่าสุดของแต่ละทักษะ · เชี่ยวชาญ = ถูกอย่างน้อย 90% จากอย่างน้อย
          8 ข้อ
        </p>
        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">ทักษะ</th>
                <th scope="col">ตัวชี้วัด</th>
                <th scope="col">ระดับ</th>
                <th scope="col">ความแม่นยำ</th>
                <th scope="col">ทำแล้ว</th>
              </tr>
            </thead>
            <tbody>
              {ALL_TOPICS.map((t) => {
                const stat = progress.topicStats[t]
                const m = mastery(stat)
                return (
                  <tr key={t}>
                    <td>{TOPIC_NAMES[t]}</td>
                    <td className="nowrap">{TOPIC_INDICATORS[t].join(', ')}</td>
                    <td>
                      <span className={`mastery mastery-${m.level}`}>{MASTERY_LABEL[m.level]}</span>
                    </td>
                    <td>{m.count ? `${Math.round(m.accuracy * 100)}%` : '–'}</td>
                    <td>{stat?.attempts ?? 0} ข้อ</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h2 className="sectionTitle">ประวัติข้อสอบจำลอง</h2>
        {progress.examHistory.length === 0 ? (
          <p className="sectionHint">ยังไม่มีประวัติ</p>
        ) : (
          <ul className="historyList">
            {progress.examHistory.map((h, i) => (
              <li key={i}>
                <b>
                  {h.score}/{h.total}
                </b>{' '}
                <span className="muted">{h.date}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2 className="sectionTitle">ตัวชี้วัดที่ใช้</h2>
        <dl className="indicatorList">
          {Object.entries(INDICATORS).map(([code, text]) => (
            <div key={code}>
              <dt>{code}</dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
        <p className="sectionHint">ที่มา: {CURRICULUM_SOURCE}</p>
      </section>
    </>
  )
}

// ── รางวัล ──
function RewardTab() {
  const { settings, update } = useSettings()
  const { progress, pendingTickets, redeemTicket } = useProgress()
  const nameId = useId()
  const thresholdId = useId()
  const bonusId = useId()
  return (
    <>
      <section className="card">
        <h2 className="sectionTitle">รางวัลรอมอบ</h2>
        <p className="modalText">
          มีรางวัลรอมอบ <b>{pendingTickets}</b> ชิ้น ({settings.rewardEmoji} {settings.rewardName})
        </p>
        <p className="sectionHint">
          ได้รับทั้งหมด {progress.ticketsEarned} ชิ้น · มอบแล้ว {progress.ticketsRedeemed} ชิ้น
        </p>
        {pendingTickets > 0 && (
          <button className="btn btnSuccess" onClick={redeemTicket}>
            มอบรางวัลแล้ว 1 ชิ้น
          </button>
        )}
      </section>

      <section className="card form">
        <h2 className="sectionTitle">ตั้งค่ารางวัล</h2>
        <fieldset className="field">
          <legend className="fieldLabel">เลือกรางวัล (สัญลักษณ์และชื่อเปลี่ยนพร้อมกัน)</legend>
          <div className="chips">
            {REWARD_PRESETS.map((r) => {
              const on = settings.rewardEmoji === r.emoji && settings.rewardName === r.name
              return (
                <button
                  key={r.emoji}
                  className={`chipBtn ${on ? 'chipOn' : ''}`}
                  aria-pressed={on}
                  onClick={() => update({ rewardEmoji: r.emoji, rewardName: r.name })}
                >
                  <span aria-hidden="true">{r.emoji}</span> {r.name}
                </button>
              )
            })}
          </div>
        </fieldset>
        <div className="field">
          <label className="fieldLabel" htmlFor={nameId}>
            หรือกำหนดชื่อรางวัลเอง
          </label>
          <input
            id={nameId}
            className="input"
            value={settings.rewardName}
            onChange={(e) => update({ rewardName: e.target.value })}
          />
        </div>
        <div className="field">
          <label className="fieldLabel" htmlFor={thresholdId}>
            สะสมดาวครบกี่ดวงจึงได้ 1 รางวัล: <b>{settings.rewardThreshold}</b>
          </label>
          <input
            id={thresholdId}
            type="range"
            min={10}
            max={100}
            step={5}
            value={settings.rewardThreshold}
            onChange={(e) => update({ rewardThreshold: Number(e.target.value) })}
          />
        </div>
        <div className="field">
          <label className="fieldLabel" htmlFor={bonusId}>
            ดาวโบนัสเมื่อทำได้ถูกทุกข้อในรอบเดียว: <b>{settings.fullMarksBonus}</b>
          </label>
          <input
            id={bonusId}
            type="range"
            min={0}
            max={20}
            value={settings.fullMarksBonus}
            onChange={(e) => update({ fullMarksBonus: Number(e.target.value) })}
          />
        </div>
      </section>
    </>
  )
}

// ── การตั้งค่า ──
function SettingsTab() {
  const { settings, update, reset } = useSettings()
  const { resetProgress } = useProgress()
  const [confirm, setConfirm] = useState<null | 'progress' | 'settings'>(null)
  const ids = {
    name: useId(),
    date: useId(),
    count: useId(),
    mix: useId(),
    advance: useId(),
    tries: useId(),
    pin: useId(),
  }

  function toggleTopic(t: Topic) {
    const on = settings.enabledTopics.includes(t)
    const next = on ? settings.enabledTopics.filter((x) => x !== t) : [...settings.enabledTopics, t]
    if (next.length > 0) update({ enabledTopics: next })
  }

  return (
    <>
      <section className="card form">
        <h2 className="sectionTitle">ผู้เรียนและวันสอบ</h2>
        <div className="field">
          <label className="fieldLabel" htmlFor={ids.name}>
            ชื่อผู้เรียน
          </label>
          <input
            id={ids.name}
            className="input"
            value={settings.playerName}
            onChange={(e) => update({ playerName: e.target.value })}
          />
        </div>
        <div className="field">
          <label className="fieldLabel" htmlFor={ids.date}>
            วันสอบ (แสดงการนับวันที่หน้าแรก)
          </label>
          <input
            id={ids.date}
            className="input"
            type="date"
            value={settings.examDate}
            onChange={(e) => update({ examDate: e.target.value })}
          />
        </div>
      </section>

      <section className="card form">
        <h2 className="sectionTitle">การฝึก</h2>
        <div className="field">
          <label className="fieldLabel" htmlFor={ids.count}>
            จำนวนข้อเมื่อเล่นด้วยค่าที่ตั้งไว้: <b>{settings.questionsPerRound}</b>
          </label>
          <input
            id={ids.count}
            type="range"
            min={5}
            max={40}
            step={5}
            value={settings.questionsPerRound}
            onChange={(e) => update({ questionsPerRound: Number(e.target.value) })}
          />
        </div>
        <div className="field">
          <label className="fieldLabel" htmlFor={ids.mix}>
            ระดับความยากของแบบฝึก
          </label>
          <select
            id={ids.mix}
            className="input"
            value={settings.mix}
            onChange={(e) => update({ mix: e.target.value as Mix })}
          >
            <option value="warmup">เริ่มต้น (ข้อพื้นฐานมาก)</option>
            <option value="balanced">สมดุล</option>
            <option value="challenge">ท้าทาย (ข้อยากมาก)</option>
          </select>
        </div>
        <fieldset className="field">
          <legend className="fieldLabel">ทักษะที่เปิดใช้ (ต้องเหลืออย่างน้อย 1 ทักษะ)</legend>
          <div className="chips">
            {ALL_TOPICS.map((t) => {
              const on = settings.enabledTopics.includes(t)
              return (
                <button
                  key={t}
                  className={`chipBtn ${on ? 'chipOn' : ''}`}
                  aria-pressed={on}
                  onClick={() => toggleTopic(t)}
                >
                  {on && <span aria-hidden="true">✓ </span>}
                  {TOPIC_NAMES[t]}
                </button>
              )
            })}
          </div>
        </fieldset>
        <div className="field">
          <label className="fieldLabel" htmlFor={ids.advance}>
            ตอบถูกแล้วไปข้อถัดไปอัตโนมัติ:{' '}
            <b>
              {settings.autoAdvanceSeconds === 0
                ? 'ปิด (กดเอง)'
                : `${settings.autoAdvanceSeconds} วินาที`}
            </b>
          </label>
          <input
            id={ids.advance}
            type="range"
            min={0}
            max={30}
            value={settings.autoAdvanceSeconds}
            onChange={(e) => update({ autoAdvanceSeconds: Number(e.target.value) })}
          />
        </div>
        <div className="field">
          <label className="fieldLabel" htmlFor={ids.tries}>
            ตอบผิดได้กี่ครั้งก่อนเฉลย: <b>{settings.maxTries} ครั้ง</b>
          </label>
          <input
            id={ids.tries}
            type="range"
            min={1}
            max={4}
            value={settings.maxTries}
            onChange={(e) => update({ maxTries: Number(e.target.value) })}
          />
        </div>
        <div className="toggleList">
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.readAloud}
              onChange={(e) => update({ readAloud: e.target.checked })}
            />
            แสดงปุ่มฟังโจทย์
          </label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.sound}
              onChange={(e) => update({ sound: e.target.checked })}
            />
            เปิดเสียงประกอบ
          </label>
        </div>
      </section>

      <section className="card form">
        <h2 className="sectionTitle">ความปลอดภัยและการล้างข้อมูล</h2>
        <div className="field">
          <label className="fieldLabel" htmlFor={ids.pin}>
            รหัส PIN (ตัวเลข 4–8 หลัก)
          </label>
          <input
            id={ids.pin}
            className="input"
            inputMode="numeric"
            maxLength={8}
            value={settings.pin}
            aria-invalid={settings.pin.length < 4}
            onChange={(e) => update({ pin: e.target.value.replace(/\D/g, '') })}
          />
          {settings.pin.length < 4 && (
            <p className="fieldError" role="alert">
              รหัส PIN ควรมีอย่างน้อย 4 หลัก
            </p>
          )}
        </div>
        <div className="actions actionsStart">
          <button className="btn btnDanger" onClick={() => setConfirm('progress')}>
            ล้างความคืบหน้าและดาวสะสม
          </button>
          <button className="btn btnGhost" onClick={() => setConfirm('settings')}>
            คืนค่าการตั้งค่าเริ่มต้น
          </button>
        </div>
      </section>

      {confirm && (
        <Modal label="ยืนยันการล้างข้อมูล" onClose={() => setConfirm(null)}>
          <h2 className="modalTitle">
            {confirm === 'progress'
              ? 'ล้างความคืบหน้าทั้งหมดหรือไม่'
              : 'คืนค่าการตั้งค่าเริ่มต้นหรือไม่'}
          </h2>
          <p className="modalText">
            {confirm === 'progress'
              ? 'ดาวสะสม รางวัล สถิติรายทักษะ กล่องทบทวน และประวัติข้อสอบจะถูกลบ และกู้คืนไม่ได้'
              : 'การตั้งค่าทั้งหมดรวมถึงข้อสอบที่เพิ่มเองจะกลับเป็นค่าเริ่มต้น'}
          </p>
          <div className="actions">
            <button className="btn btnGhost btnLarge" onClick={() => setConfirm(null)}>
              ยกเลิก
            </button>
            <button
              className="btn btnDanger btnLarge"
              onClick={() => {
                if (confirm === 'progress') resetProgress()
                else reset()
                setConfirm(null)
              }}
            >
              ยืนยัน
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}

// ── เพิ่มข้อสอบเอง ──
function CustomQuestions() {
  const { settings, update } = useSettings()
  const [topic, setTopic] = useState<Topic>('add')
  const [kind, setKind] = useState<'choice' | 'fill'>('choice')
  const [text, setText] = useState('')
  const [visual, setVisual] = useState('')
  const [answer, setAnswer] = useState('')
  const [wrong, setWrong] = useState(['', ''])
  const [explain, setExplain] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const id = useId()

  function add() {
    setSaved(false)
    if (!text.trim() || !answer.trim()) return setError('กรุณากรอกโจทย์และคำตอบที่ถูก')
    if (kind === 'fill' && !/^\d+$/.test(answer.trim())) {
      return setError('ข้อแบบเติมคำตอบ ต้องมีคำตอบเป็นตัวเลข')
    }
    const choices =
      kind === 'choice'
        ? [...new Set([answer, ...wrong].map((s) => s.trim()).filter(Boolean))]
        : undefined
    if (kind === 'choice' && (choices?.length ?? 0) < 2) {
      return setError('ข้อแบบเลือกตอบ ต้องมีตัวเลือกที่ผิดอย่างน้อย 1 ตัว')
    }
    const q: Question = {
      id: `custom-${Date.now()}`,
      topic,
      level: 'easy',
      kind,
      text: text.trim(),
      visual: visual.trim() || undefined,
      answer: answer.trim(),
      choices,
      explain: explain.trim() || undefined,
      custom: true,
    }
    update({ customQuestions: [...settings.customQuestions, q] })
    setText('')
    setVisual('')
    setAnswer('')
    setWrong(['', ''])
    setExplain('')
    setError('')
    setSaved(true)
  }

  return (
    <>
      <section className="card form">
        <h2 className="sectionTitle">เพิ่มข้อสอบเอง</h2>
        <p className="sectionHint">
          ข้อที่เพิ่มจะอยู่ในแบบฝึกรวม ฝึกรายทักษะ และข้อสอบจำลอง ข้อแบบเลือกตอบมี 3 ตัวเลือก (ก ข
          ค) เหมือนข้อสอบของโรงเรียน
        </p>
        <div className="fieldRow">
          <div className="field">
            <label className="fieldLabel" htmlFor={`${id}-topic`}>
              ทักษะ
            </label>
            <select
              id={`${id}-topic`}
              className="input"
              value={topic}
              onChange={(e) => setTopic(e.target.value as Topic)}
            >
              {ALL_TOPICS.map((t) => (
                <option key={t} value={t}>
                  {TOPIC_NAMES[t]}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="fieldLabel" htmlFor={`${id}-kind`}>
              รูปแบบ
            </label>
            <select
              id={`${id}-kind`}
              className="input"
              value={kind}
              onChange={(e) => setKind(e.target.value as 'choice' | 'fill')}
            >
              <option value="choice">เลือกตอบ</option>
              <option value="fill">เติมคำตอบ</option>
            </select>
          </div>
        </div>
        <div className="field">
          <label className="fieldLabel" htmlFor={`${id}-text`}>
            โจทย์
          </label>
          <input
            id={`${id}-text`}
            className="input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="เช่น 5 + 4 = □"
          />
        </div>
        <div className="field">
          <label className="fieldLabel" htmlFor={`${id}-visual`}>
            ภาพประกอบ (ไม่บังคับ)
          </label>
          <input
            id={`${id}-visual`}
            className="input"
            value={visual}
            onChange={(e) => setVisual(e.target.value)}
            placeholder="เช่น 🍎🍎🍎"
          />
        </div>
        <div className="field">
          <label className="fieldLabel" htmlFor={`${id}-answer`}>
            คำตอบที่ถูก
          </label>
          <input
            id={`${id}-answer`}
            className="input"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="เช่น 9"
          />
        </div>
        {kind === 'choice' && (
          <fieldset className="field">
            <legend className="fieldLabel">ตัวเลือกที่ผิด (1–2 ตัว รวมเป็นตัวเลือก ก ข ค)</legend>
            <div className="fieldRow">
              {wrong.map((w, i) => (
                <input
                  key={i}
                  className="input"
                  aria-label={`ตัวเลือกที่ผิด ตัวที่ ${i + 1}`}
                  value={w}
                  onChange={(e) =>
                    setWrong((ws) => ws.map((x, j) => (j === i ? e.target.value : x)))
                  }
                />
              ))}
            </div>
          </fieldset>
        )}
        <div className="field">
          <label className="fieldLabel" htmlFor={`${id}-explain`}>
            วิธีคิด (ไม่บังคับ)
          </label>
          <input
            id={`${id}-explain`}
            className="input"
            value={explain}
            onChange={(e) => setExplain(e.target.value)}
            placeholder="เช่น 5 + 4 = 9"
          />
        </div>
        <div aria-live="polite">
          {error && <p className="fieldError">{error}</p>}
          {saved && <p className="fieldSuccess">เพิ่มข้อสอบแล้ว</p>}
        </div>
        <button className="btn btnPrimary" onClick={add}>
          เพิ่มข้อนี้
        </button>
      </section>

      <section className="card">
        <h2 className="sectionTitle">ข้อที่เพิ่มไว้ ({settings.customQuestions.length} ข้อ)</h2>
        {settings.customQuestions.length === 0 ? (
          <p className="sectionHint">ยังไม่มีข้อที่เพิ่มเอง</p>
        ) : (
          <ul className="customList">
            {settings.customQuestions.map((q) => (
              <li key={q.id}>
                <span>
                  <b>{q.text}</b>
                  <span className="muted">
                    {' '}
                    · ตอบ {q.answer} · {TOPIC_NAMES[q.topic]}
                  </span>
                </span>
                <button
                  className="btn btnGhost btnSmall"
                  onClick={() =>
                    update({
                      customQuestions: settings.customQuestions.filter((x) => x.id !== q.id),
                    })
                  }
                  aria-label={`ลบข้อ ${q.text}`}
                >
                  ลบ
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

// ── หลักการออกแบบและเอกสารอ้างอิง ──
function Principles() {
  const keys = Object.keys(REFERENCES) as ReferenceKey[]
  const numberOf = (k: ReferenceKey) => keys.indexOf(k) + 1
  return (
    <>
      <section className="card">
        <h2 className="sectionTitle">หลักการออกแบบระบบ</h2>
        <p className="sectionHint">
          ทุกส่วนของระบบออกแบบโดยอิงหลักสูตรและงานวิจัยด้านการเรียนรู้ ดังนี้
        </p>
        <ol className="principleList">
          {PRINCIPLES.map((p) => (
            <li key={p.title} className="principle">
              <h3 className="principleTitle">{p.title}</h3>
              <p>
                <b>ระบบทำอะไร:</b> {p.what}
              </p>
              <p>
                <b>เหตุผล:</b> {p.why}
              </p>
              <p className="muted">อ้างอิง: {p.refs.map((r) => `[${numberOf(r)}]`).join(' ')}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="card">
        <h2 className="sectionTitle">เอกสารอ้างอิง</h2>
        <ol className="refList">
          {keys.map((k) => (
            <li key={k}>{REFERENCES[k]}</li>
          ))}
        </ol>
      </section>
    </>
  )
}
