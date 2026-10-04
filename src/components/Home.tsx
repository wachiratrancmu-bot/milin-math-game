import type { Chapter, Topic } from '../types'
import {
  CHAPTER_GUIDE,
  CHAPTER_NAMES,
  SKILL_GROUPS,
  TOPIC_ICONS,
  TOPIC_NAMES,
  TOPIC_SHORT,
} from '../data/curriculum'
import { LESSONS } from '../data/lessons'
import { useSettings } from '../state/SettingsContext'
import { useProgress } from '../state/ProgressContext'
import { daysUntil, mastery, MASTERY_LABEL, topicsToPractice } from '../lib/learning'
import { ProgressBar } from './ui'

// ──────────────────────────────────────────────────────────────
// หน้าแรก: แผนเตรียมสอบประจำวันตามลำดับการเรียนรู้
// เรียน (Rosenshine, 2012) → ฝึกทักษะที่ควรฝึก (Bloom, 1968) → ทบทวนข้อที่ผิด (Cepeda et al., 2006)
// → ข้อสอบจำลอง (Roediger & Karpicke, 2006)
// ──────────────────────────────────────────────────────────────

export interface HomeActions {
  openLessons: () => void
  openExam: () => void
  openParent: () => void
  startChapter: (ch: Chapter) => void
  startMixed: () => void
  startTopic: (t: Topic) => void
  startReview: () => void
}

function examLabel(days: number | null) {
  if (days === null || days < 0) return null
  if (days === 0) return 'วันนี้เป็นวันสอบ ขอให้ทำข้อสอบอย่างตั้งใจ'
  if (days === 1) return 'พรุ่งนี้สอบแล้ว'
  return `อีก ${days} วันถึงวันสอบ`
}

function examDateText(date: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  if (!m) return ''
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])).toLocaleDateString('th-TH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function Home({ actions, dueCount }: { actions: HomeActions; dueCount: number }) {
  const { settings } = useSettings()
  const { progress, pendingTickets } = useProgress()

  const days = daysUntil(settings.examDate)
  const countdown = examLabel(days)
  const lessonsDone = LESSONS.filter((l) => progress.lessonsDone.includes(l.id)).length
  const focus = topicsToPractice(progress, settings.enabledTopics)[0]
  const lastExam = progress.examHistory[0]

  const plan = [
    {
      key: 'learn',
      title: 'เรียนบทเรียนสั้น',
      status: `เรียนแล้ว ${lessonsDone} จาก ${LESSONS.length} บท`,
      done: lessonsDone === LESSONS.length,
      action: 'เรียน',
      onClick: actions.openLessons,
    },
    {
      key: 'skill',
      title: 'ฝึกทักษะที่ควรฝึก',
      status: focus ? TOPIC_NAMES[focus] : 'เชี่ยวชาญครบทุกทักษะแล้ว',
      done: !focus,
      action: 'ฝึก 10 ข้อ',
      onClick: () => focus && actions.startTopic(focus),
      disabled: !focus,
    },
    {
      key: 'review',
      title: 'ทบทวนข้อที่เคยผิด',
      status: dueCount > 0 ? `มี ${dueCount} ข้อรอทบทวน` : 'ไม่มีข้อที่ต้องทบทวนตอนนี้',
      done: dueCount === 0,
      action: 'ทบทวน',
      onClick: actions.startReview,
      disabled: dueCount === 0,
    },
    {
      key: 'exam',
      title: 'ทำข้อสอบจำลอง 20 ข้อ',
      status: lastExam
        ? `ครั้งล่าสุดได้ ${lastExam.score} จาก ${lastExam.total} คะแนน`
        : 'ยังไม่เคยทำ',
      done: !!lastExam && lastExam.score / lastExam.total >= 0.8,
      action: 'ทำข้อสอบ',
      onClick: actions.openExam,
    },
  ]

  return (
    <main className="screen">
      <header className="appBar">
        <div className="brand">
          <span className="brandMark" aria-hidden="true">
            ⭐
          </span>
          <span className="brandName">ผจญภัยดาวคณิต</span>
        </div>
        <div className="appBarRight">
          <span className="pill" aria-label={`ดาวสะสม ${progress.starBalance} ดวง`}>
            <span aria-hidden="true">⭐</span> {progress.starBalance}
          </span>
          <button className="btn btnGhost btnSmall" onClick={actions.openParent}>
            ผู้ปกครอง
          </button>
        </div>
      </header>

      <section className="hero card">
        <div className="heroText">
          <p className="eyebrow">คณิตศาสตร์ ป.1 · บทที่ 4–6</p>
          <h1 className="heroTitle">
            สวัสดี <span className="nobr">{settings.playerName}</span>
          </h1>
          {countdown ? (
            <p className="heroCountdown">
              <b>{countdown}</b>
              <span className="heroDate">{examDateText(settings.examDate)}</span>
            </p>
          ) : (
            <p className="heroCountdown">ฝึกวันละนิด ทำต่อเนื่องจะเก่งขึ้นทุกวัน</p>
          )}
          <p className="heroInfo">ข้อสอบเป็นปรนัย 20 ข้อ ข้อละ 1 คะแนน</p>
        </div>
        <div className="heroMascot" aria-hidden="true">
          🐰
        </div>
      </section>

      <section className="section" aria-labelledby="plan-title">
        <h2 id="plan-title" className="sectionTitle">
          แผนเตรียมสอบวันนี้
        </h2>
        <ol className="plan">
          {plan.map((p, i) => (
            <li key={p.key} className={`planItem ${p.done ? 'planDone' : ''}`}>
              <span className="planNo" aria-hidden="true">
                {p.done ? '✓' : i + 1}
              </span>
              <span className="planBody">
                <span className="planTitle">{p.title}</span>
                <span className="planStatus">{p.status}</span>
              </span>
              <button
                className={`btn ${p.done ? 'btnGhost' : 'btnPrimary'} btnSmall`}
                onClick={p.onClick}
                disabled={p.disabled}
                aria-label={`${p.action}: ${p.title}`}
              >
                {p.action}
              </button>
            </li>
          ))}
        </ol>
      </section>

      <section className="section" aria-labelledby="chapter-title">
        <h2 id="chapter-title" className="sectionTitle">
          ฝึกตามบท
        </h2>
        <div className="cardGrid">
          {CHAPTER_GUIDE.map((g) => (
            <button
              key={g.chapter}
              className="card chapterCard"
              onClick={() => actions.startChapter(g.chapter)}
            >
              <span className="chapterIcon" aria-hidden="true">
                {g.icon}
              </span>
              <span className="chapterName">{CHAPTER_NAMES[g.chapter]}</span>
              <span className="chapterMeta">ฝึก 15 ข้อ พร้อมวิธีคิดทีละขั้น</span>
            </button>
          ))}
          <button className="card chapterCard chapterMixed" onClick={actions.startMixed}>
            <span className="chapterIcon" aria-hidden="true">
              🌟
            </span>
            <span className="chapterName">แบบฝึกรวม 40 ข้อ</span>
            <span className="chapterMeta">คละทุกบท ฝึกเลือกวิธีคิดให้เหมาะกับโจทย์</span>
          </button>
        </div>
      </section>

      <section className="section" aria-labelledby="skill-title">
        <h2 id="skill-title" className="sectionTitle">
          แผนที่ทักษะ
        </h2>
        <p className="sectionHint">
          แตะทักษะเพื่อฝึก 10 ข้อ ความเชี่ยวชาญคิดจากการตอบครั้งแรก 10 ข้อล่าสุด
        </p>
        {SKILL_GROUPS.map((g) => (
          <div key={g.title} className="skillGroup">
            <h3 className="skillGroupTitle">{g.title}</h3>
            <div className="skillGrid">
              {g.topics
                .filter((t) => settings.enabledTopics.includes(t))
                .map((t) => {
                  const m = mastery(progress.topicStats[t])
                  const pct = Math.round(m.accuracy * 100)
                  return (
                    <button
                      key={t}
                      className={`skillTile skill-${m.level}`}
                      onClick={() => actions.startTopic(t)}
                      aria-label={`${TOPIC_NAMES[t]} ${MASTERY_LABEL[m.level]}${m.count ? ` ถูก ${pct} เปอร์เซ็นต์` : ''} แตะเพื่อฝึก`}
                    >
                      <span className="skillIcon" aria-hidden="true">
                        {TOPIC_ICONS[t]}
                      </span>
                      <span className="skillName">{TOPIC_SHORT[t]}</span>
                      <ProgressBar
                        value={m.count ? pct : 0}
                        max={100}
                        label={`ความแม่นยำ ${TOPIC_SHORT[t]}`}
                        tone={m.level === 'mastered' ? 'success' : 'brand'}
                      />
                      <span className={`mastery mastery-${m.level}`}>
                        {MASTERY_LABEL[m.level]}
                        {m.count > 0 && ` · ${pct}%`}
                      </span>
                    </button>
                  )
                })}
            </div>
          </div>
        ))}
      </section>

      <section className="card rewardBox" aria-labelledby="reward-title">
        <span className="rewardEmoji" aria-hidden="true">
          {settings.rewardEmoji}
        </span>
        <div className="rewardBody">
          <h2 id="reward-title" className="rewardTitle">
            สะสมดาวครบ {settings.rewardThreshold} ดวง ได้รับ{settings.rewardName}
          </h2>
          <ProgressBar
            value={progress.starBalance}
            max={settings.rewardThreshold}
            label="ดาวสะสม"
            tone="warm"
          />
          <p className="rewardStatus">
            มีแล้ว {progress.starBalance} ดวง อีก{' '}
            {Math.max(0, settings.rewardThreshold - progress.starBalance)} ดวง
            {pendingTickets > 0 && ` · มีรางวัลรอรับ ${pendingTickets} ชิ้น`}
          </p>
        </div>
      </section>
    </main>
  )
}
