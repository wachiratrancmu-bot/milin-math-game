import type { Settings } from '../types'
import type { RoundOptions } from '../lib/quiz'
import { useSettings } from '../state/SettingsContext'
import { useProgress } from '../state/ProgressContext'
import { CHAPTER_GUIDE, CHAPTER_NAMES } from '../data/questions'

/** ค่าที่ใช้เริ่มรอบ: patch ใช้เฉพาะรอบนี้ ไม่บันทึกทับค่าตั้งของพ่อแม่ */
export interface StartConfig {
  patch?: Partial<Settings>
  options?: RoundOptions
}

interface Props {
  onStart: (config?: StartConfig) => void
  onOpenParent: () => void
}

const PRESETS: {
  key: string
  icon: string
  title: string
  desc: string
  cls: string
  config: StartConfig
}[] = [
  {
    key: 'ch4',
    icon: '🔢',
    title: 'ฝึกบทที่ 4',
    desc: 'จำนวน 11–20 · หลักสิบ หลักหน่วย · เปรียบเทียบ (15 ข้อ)',
    cls: 'secondary',
    config: {
      patch: { mode: 'practice', questionsPerRound: 15, mix: 'balanced' },
      options: { chapters: [4] },
    },
  },
  {
    key: 'ch5',
    icon: '➕',
    title: 'ฝึกบทที่ 5',
    desc: 'การบวกไม่เกิน 20 · หาตัวไม่ทราบค่า · โจทย์ปัญหา (15 ข้อ)',
    cls: 'secondary',
    config: {
      patch: { mode: 'practice', questionsPerRound: 15, mix: 'balanced' },
      options: { chapters: [5] },
    },
  },
  {
    key: 'ch6',
    icon: '➖',
    title: 'ฝึกบทที่ 6',
    desc: 'การลบไม่เกิน 20 · มากกว่ากันกี่ · ตรวจคำตอบ (15 ข้อ)',
    cls: 'secondary',
    config: {
      patch: { mode: 'practice', questionsPerRound: 15, mix: 'balanced' },
      options: { chapters: [6] },
    },
  },
  {
    key: 'all',
    icon: '🌟',
    title: 'แบบฝึกรวม 40 ข้อ',
    desc: 'ทบทวนครบทั้งบทที่ 4–6 มีคำใบ้และวิธีคิด',
    cls: 'primary',
    config: { patch: { mode: 'practice', questionsPerRound: 40, mix: 'balanced' } },
  },
  {
    key: 'mock',
    icon: '📝',
    title: 'ข้อสอบจำลอง 20 ข้อ',
    desc: 'ปรนัยล้วนเหมือนข้อสอบจริง ไม่มีคำใบ้ ตอบได้ครั้งเดียว',
    cls: 'green',
    config: {
      patch: {
        mode: 'exam',
        questionsPerRound: 20,
        mix: 'balanced',
        maxTries: 1,
        showHints: false,
      },
      options: { choiceOnly: true },
    },
  },
]

export function Home({ onStart, onOpenParent }: Props) {
  const { settings } = useSettings()
  const { progress, pendingTickets } = useProgress()

  const pct = Math.min(100, Math.round((progress.starBalance / settings.rewardThreshold) * 100))
  const toNext = Math.max(0, settings.rewardThreshold - progress.starBalance)

  return (
    <main>
      <header className="top">
        <div className="brand">
          <div className="mark">⭐</div>
          <div>
            <h1>
              ผจญภัยดาวคณิตของ<span className="nobr">{settings.playerName}</span>
            </h1>
            <div className="caption">คณิตศาสตร์ ป.1 บทที่ 4–6 · เก็บดาวแลกรางวัล</div>
          </div>
        </div>
        <div className="btnRow" style={{ marginTop: 0 }}>
          {pendingTickets > 0 && (
            <div className="pill" style={{ background: '#eafff3', color: 'var(--green2)' }}>
              {settings.rewardEmoji} รางวัลรอรับ {pendingTickets}
            </div>
          )}
          <button className="ghost smallBtn" onClick={onOpenParent}>
            👨‍👩‍👧 ตั้งค่าผู้ปกครอง
          </button>
        </div>
      </header>

      <section className="grid2">
        <div className="card hero">
          <div className="mascotRow">
            <div className="mascot">🐰</div>
            <div className="speech">
              ข้อสอบจริงเป็นแบบเลือกตอบ 20 ข้อ ฝึกทีละบทก่อน แล้วลองทำข้อสอบจำลองนะ
            </div>
          </div>

          <div className="heroTitle">
            วันนี้<span className="nobr">{settings.playerName}</span>จะเก็บดาวได้กี่ดวง
          </div>
          <p className="heroText">
            เลือกฝึกทีละบท ทำแบบฝึกรวม หรือลองทำข้อสอบจำลองให้คุ้นกับข้อสอบจริง
          </p>

          <div className="missionGrid">
            {PRESETS.map((p) => (
              <div className="missionCard" key={p.key}>
                <div>
                  <div className="missionIcon">{p.icon}</div>
                  <b>{p.title}</b>
                  <span>{p.desc}</span>
                </div>
                <button className={`${p.cls} smallBtn`} onClick={() => onStart(p.config)}>
                  เริ่ม
                </button>
              </div>
            ))}
          </div>

          <div className="btnRow">
            <button className="ghost" onClick={() => onStart()}>
              ▶ เล่นด้วยค่าที่ผู้ปกครองตั้งไว้
            </button>
          </div>
        </div>

        <aside className="card rewardCard">
          <h2 style={{ margin: '0 0 4px' }}>กล่องเก็บดาว</h2>
          <div className="rewardBig">{settings.rewardEmoji}</div>
          <b style={{ fontSize: 18 }}>
            อีก {toNext} ดวง จะได้รับ{settings.rewardName}
          </b>
          <div className="rewardProgress">
            <div className="rewardProgressInner" style={{ width: `${pct}%` }} />
          </div>
          <div className="mini">
            {progress.starBalance} / {settings.rewardThreshold} ดวง
          </div>

          <div className="statRow">
            <div className="statBox">
              <div className="num">{progress.totalCorrect}</div>
              <span>ตอบถูกสะสม</span>
            </div>
            <div className="statBox">
              <div className="num">{progress.ticketsEarned}</div>
              <span>รางวัลที่ได้</span>
            </div>
            <div className="statBox">
              <div className="num">{progress.bestStreak}</div>
              <span>ตอบถูกติดกันสูงสุด</span>
            </div>
            <div className="statBox">
              <div className="num">{progress.perfectRounds}</div>
              <span>รอบที่ทำเต็ม</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="card guide">
        <h2 style={{ margin: '0 0 4px' }}>สิ่งที่ต้องทำได้ก่อนสอบ</h2>
        <p className="mini" style={{ marginTop: 0 }}>
          แนวข้อสอบ: ปรนัย 20 ข้อ ข้อละ 1 คะแนน เนื้อหาบทที่ 4–6
        </p>
        <div className="guideGrid">
          {CHAPTER_GUIDE.map((g) => (
            <div className="guideCard" key={g.chapter}>
              <b>
                {g.icon} {CHAPTER_NAMES[g.chapter]}
              </b>
              <ul>
                {g.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <div className="guideExample">ตัวอย่าง: {g.example}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
