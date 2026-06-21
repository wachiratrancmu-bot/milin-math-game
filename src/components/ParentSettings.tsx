import { useState } from 'react'
import type { Topic, Question, Mix, Mode } from '../types'
import { useSettings } from '../state/SettingsContext'
import { useProgress } from '../state/ProgressContext'
import { TOPIC_NAMES } from '../data/questions'

const ALL_TOPICS = Object.keys(TOPIC_NAMES) as Topic[]
const EMOJIS = ['🍦', '🍬', '🍭', '🍫', '🍪', '🧁', '🍩', '🎁', '⭐', '🧸', '🎈', '🍓']

export function ParentSettings({ onClose }: { onClose: () => void }) {
  const { settings, update, reset } = useSettings()
  const { progress, pendingTickets, redeemTicket, resetProgress } = useProgress()
  const [unlocked, setUnlocked] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState(false)

  if (!unlocked) {
    return (
      <div className="overlay">
        <div className="modal" style={{ maxWidth: 420 }}>
          <div style={{ fontSize: 54 }}>🔒</div>
          <h2 style={{ margin: '4px 0' }}>สำหรับผู้ปกครอง</h2>
          <p className="mini">ใส่ PIN เพื่อเข้าหน้าตั้งค่า</p>
          <input
            className="answer"
            type="password"
            inputMode="numeric"
            placeholder="• • • •"
            value={pinInput}
            autoFocus
            onChange={(e) => { setPinInput(e.target.value); setPinError(false) }}
            onKeyDown={(e) => { if (e.key === 'Enter') tryUnlock() }}
            style={{ width: 200 }}
          />
          {pinError && <div className="feedback danger" style={{ fontSize: 18 }}>PIN ไม่ถูกต้อง</div>}
          <div className="btnRow" style={{ justifyContent: 'center' }}>
            <button className="primary" onClick={tryUnlock}>เข้าสู่ระบบ</button>
            <button className="ghost" onClick={onClose}>ปิด</button>
          </div>
          <div className="mini">PIN เริ่มต้นคือ 1234 (เปลี่ยนได้เมื่อเข้าระบบ)</div>
        </div>
      </div>
    )

    function tryUnlock() {
      if (pinInput === settings.pin) setUnlocked(true)
      else setPinError(true)
    }
  }

  return (
    <div className="overlay">
      <div className="modal left" style={{ maxWidth: 640 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>⚙️ ตั้งค่าผู้ปกครอง</h2>
          <button className="ghost smallBtn" onClick={onClose}>เสร็จสิ้น</button>
        </div>

        {/* รางวัลที่รอมอบ */}
        <div className="sectionLabel">รางวัลของลูก</div>
        <div className="note" style={{ marginTop: 0 }}>
          มีรางวัลรอมอบ <b>{pendingTickets}</b> ชิ้น ({settings.rewardEmoji} {settings.rewardName})
          {pendingTickets > 0 && (
            <div className="btnRow" style={{ marginTop: 10 }}>
              <button className="green smallBtn" onClick={redeemTicket}>✓ มอบรางวัลแล้ว 1 ชิ้น</button>
            </div>
          )}
          <div className="mini">ได้รางวัลรวม {progress.ticketsEarned} · มอบแล้ว {progress.ticketsRedeemed}</div>
        </div>

        {/* ตั้งค่ารางวัล */}
        <div className="sectionLabel">ปรับระบบรางวัล</div>
        <div className="formGrid">
          <div className="field">
            <label>ชื่อรางวัล</label>
            <input value={settings.rewardName} onChange={(e) => update({ rewardName: e.target.value })} />
          </div>
          <div className="field">
            <label>เลือกสัญลักษณ์รางวัล</label>
            <div className="chips">
              {EMOJIS.map((e) => (
                <button key={e} className={`chip ${settings.rewardEmoji === e ? 'on' : ''}`} style={{ fontSize: 22 }} onClick={() => update({ rewardEmoji: e })}>{e}</button>
              ))}
            </div>
          </div>
          <div className="field">
            <label>สะสมดาวครบกี่ดวงจึงได้ 1 รางวัล: <b>{settings.rewardThreshold}</b></label>
            <input type="range" min={10} max={100} step={5} value={settings.rewardThreshold} onChange={(e) => update({ rewardThreshold: Number(e.target.value) })} />
          </div>
          <div className="field">
            <label>โบนัสดาวเมื่อทำเต็มในรอบเดียว: <b>{settings.fullMarksBonus}</b></label>
            <input type="range" min={0} max={20} step={1} value={settings.fullMarksBonus} onChange={(e) => update({ fullMarksBonus: Number(e.target.value) })} />
          </div>
        </div>

        {/* ตั้งค่าการเล่น */}
        <div className="sectionLabel">ปรับการเล่น</div>
        <div className="formGrid">
          <div className="field">
            <label>ชื่อผู้เล่น</label>
            <input value={settings.playerName} onChange={(e) => update({ playerName: e.target.value })} />
          </div>
          <div className="field">
            <label>จำนวนข้อต่อรอบ: <b>{settings.questionsPerRound}</b></label>
            <input type="range" min={5} max={40} step={5} value={settings.questionsPerRound} onChange={(e) => update({ questionsPerRound: Number(e.target.value) })} />
          </div>
          <div className="field">
            <label>โหมดเริ่มต้น</label>
            <select value={settings.mode} onChange={(e) => update({ mode: e.target.value as Mode })}>
              <option value="practice">โหมดฝึก (มีคำใบ้)</option>
              <option value="exam">โหมดสอบ (ไม่มีคำใบ้)</option>
            </select>
          </div>
          <div className="field">
            <label>ความท้าทาย</label>
            <select value={settings.mix} onChange={(e) => update({ mix: e.target.value as Mix })}>
              <option value="warmup">อุ่นเครื่อง (ง่ายเยอะ)</option>
              <option value="balanced">สมดุล</option>
              <option value="challenge">ท้าทาย (ยากเยอะ)</option>
            </select>
          </div>
          <div className="field">
            <label>หัวข้อที่เปิดใช้</label>
            <div className="chips">
              {ALL_TOPICS.map((t) => {
                const on = settings.enabledTopics.includes(t)
                return (
                  <button key={t} className={`chip ${on ? 'on' : ''}`} onClick={() => toggleTopic(t)}>
                    {on ? '✓ ' : ''}{TOPIC_NAMES[t]}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="field">
            <label className="toggle">
              <input type="checkbox" checked={settings.showHints} onChange={(e) => update({ showHints: e.target.checked })} />
              แสดงคำใบ้ในโหมดฝึก
            </label>
            <label className="toggle">
              <input type="checkbox" checked={settings.sound} onChange={(e) => update({ sound: e.target.checked })} />
              เปิดเสียงประกอบ
            </label>
          </div>
        </div>

        {/* เพิ่มข้อสอบเอง */}
        <CustomQuestions />

        {/* ความปลอดภัย */}
        <div className="sectionLabel">PIN และการรีเซ็ต</div>
        <div className="formGrid">
          <div className="field">
            <label>เปลี่ยน PIN (4 หลัก)</label>
            <input
              inputMode="numeric"
              maxLength={8}
              value={settings.pin}
              onChange={(e) => update({ pin: e.target.value.replace(/\D/g, '') })}
            />
          </div>
          <div className="btnRow">
            <button className="ghost smallBtn danger" onClick={() => {
              if (confirm('ล้างดาวสะสมและสถิติทั้งหมด? (รางวัลที่ได้จะถูกล้างด้วย)')) resetProgress()
            }}>🗑 ล้างความคืบหน้า</button>
            <button className="ghost smallBtn danger" onClick={() => {
              if (confirm('คืนค่าตั้งค่าทั้งหมดเป็นค่าเริ่มต้น? (ข้อสอบที่เพิ่มเองจะถูกลบ)')) reset()
            }}>↺ คืนค่าเริ่มต้น</button>
          </div>
        </div>

        {/* ประวัติการเล่น */}
        {progress.history.length > 0 && (
          <>
            <div className="sectionLabel">ประวัติการเล่นล่าสุด</div>
            <div className="report">
              {progress.history.slice(0, 6).map((h, i) => (
                <div key={i}>
                  <b>{h.score}/{h.total}</b> ({h.mode === 'practice' ? 'ฝึก' : 'สอบ'})
                  <br /><span className="mini">{h.date}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="btnRow" style={{ justifyContent: 'center' }}>
          <button className="primary" onClick={onClose}>บันทึกและกลับ</button>
        </div>
      </div>
    </div>
  )

  function toggleTopic(t: Topic) {
    const on = settings.enabledTopics.includes(t)
    const next = on ? settings.enabledTopics.filter((x) => x !== t) : [...settings.enabledTopics, t]
    if (next.length === 0) return // ต้องเหลืออย่างน้อย 1 หัวข้อ
    update({ enabledTopics: next })
  }
}

// ── ฟอร์มเพิ่มข้อสอบเอง ─────────────────────────────────
function CustomQuestions() {
  const { settings, update } = useSettings()
  const [topic, setTopic] = useState<Topic>('part')
  const [kind, setKind] = useState<'choice' | 'fill'>('choice')
  const [text, setText] = useState('')
  const [visual, setVisual] = useState('')
  const [answer, setAnswer] = useState('')
  const [c1, setC1] = useState('')
  const [c2, setC2] = useState('')
  const [c3, setC3] = useState('')
  const [explain, setExplain] = useState('')

  function add() {
    if (!text.trim() || !answer.trim()) {
      alert('กรุณากรอกโจทย์และคำตอบ')
      return
    }
    const choices = kind === 'choice'
      ? Array.from(new Set([answer, c1, c2, c3].map((s) => s.trim()).filter(Boolean)))
      : undefined
    if (kind === 'choice' && (choices?.length ?? 0) < 2) {
      alert('โหมดกากบาทต้องมีตัวเลือกอย่างน้อย 2 ตัว (รวมคำตอบ)')
      return
    }
    const q: Question = {
      id: `custom-${Date.now()}`,
      topic, level: 'easy', kind,
      text: text.trim(),
      visual: visual.trim() || undefined,
      answer: answer.trim(),
      choices,
      explain: explain.trim() || undefined,
      custom: true,
    }
    update({ customQuestions: [...settings.customQuestions, q] })
    setText(''); setVisual(''); setAnswer(''); setC1(''); setC2(''); setC3(''); setExplain('')
  }

  function remove(id: string) {
    update({ customQuestions: settings.customQuestions.filter((q) => q.id !== id) })
  }

  return (
    <>
      <div className="sectionLabel">เพิ่มข้อสอบเอง ({settings.customQuestions.length} ข้อ)</div>
      <div className="formGrid">
        <div className="field">
          <div className="row">
            <select value={topic} onChange={(e) => setTopic(e.target.value as Topic)} style={{ flex: 1 }}>
              {ALL_TOPICS.map((t) => <option key={t} value={t}>{TOPIC_NAMES[t]}</option>)}
            </select>
            <select value={kind} onChange={(e) => setKind(e.target.value as 'choice' | 'fill')} style={{ flex: 1 }}>
              <option value="choice">กากบาท</option>
              <option value="fill">เติมคำตอบ</option>
            </select>
          </div>
        </div>
        <div className="field"><label>โจทย์</label><input value={text} onChange={(e) => setText(e.target.value)} placeholder="เช่น 5 + 4 = ?" /></div>
        <div className="field"><label>ภาพประกอบ (ไม่บังคับ — อิโมจิหรือข้อความ)</label><input value={visual} onChange={(e) => setVisual(e.target.value)} placeholder="เช่น 🍎🍎🍎 หรือ 5 + 4" /></div>
        <div className="field"><label>คำตอบที่ถูก</label><input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="เช่น 9" /></div>
        {kind === 'choice' && (
          <div className="field">
            <label>ตัวเลือกที่ผิด (อีก 3 ตัว)</label>
            <div className="row">
              <input value={c1} onChange={(e) => setC1(e.target.value)} placeholder="ตัวเลือก" style={{ flex: 1 }} />
              <input value={c2} onChange={(e) => setC2(e.target.value)} placeholder="ตัวเลือก" style={{ flex: 1 }} />
              <input value={c3} onChange={(e) => setC3(e.target.value)} placeholder="ตัวเลือก" style={{ flex: 1 }} />
            </div>
          </div>
        )}
        <div className="field"><label>วิธีคิด (ไม่บังคับ)</label><input value={explain} onChange={(e) => setExplain(e.target.value)} placeholder="เช่น 5 + 4 = 9" /></div>
        <div className="btnRow" style={{ marginTop: 0 }}>
          <button className="secondary smallBtn" onClick={add}>+ เพิ่มข้อนี้</button>
        </div>
      </div>

      {settings.customQuestions.length > 0 && (
        <div className="report" style={{ marginTop: 12 }}>
          {settings.customQuestions.map((q) => (
            <div key={q.id}>
              <b>{q.text}</b><br />
              <span className="mini">ตอบ: {q.answer} · {TOPIC_NAMES[q.topic]}</span>
              <br />
              <button className="ghost smallBtn danger" style={{ marginTop: 6 }} onClick={() => remove(q.id)}>ลบ</button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
