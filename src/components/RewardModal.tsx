import { useEffect } from 'react'
import { useSettings } from '../state/SettingsContext'
import { playReward } from '../lib/sound'
import { fireConfetti } from '../lib/confetti'

interface Props {
  count: number
  onClose: () => void
}

export function RewardModal({ count, onClose }: Props) {
  const { settings } = useSettings()

  useEffect(() => {
    playReward(settings.sound)
    fireConfetti(40)
    const t = setInterval(() => fireConfetti(20), 700)
    const stop = setTimeout(() => clearInterval(t), 2400)
    return () => {
      clearInterval(t)
      clearTimeout(stop)
    }
  }, [])

  return (
    <div className="overlay">
      <div className="modal rewardModal">
        <div className="gift">{settings.rewardEmoji}</div>
        <div className="rewardTitle">ยินดีด้วย! {settings.playerName}ทำได้ดีมาก 🎉</div>
        <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--soft)', lineHeight: 1.6 }}>
          สะสมดาวครบแล้ว ได้รับ <b>{settings.rewardName}</b> {count > 1 ? `จำนวน ${count} ชิ้น` : '1 ชิ้น'}
          <br />
          แจ้งคุณพ่อคุณแม่เพื่อรับรางวัลได้เลย
        </p>
        <div className="note" style={{ textAlign: 'center' }}>
          คุณพ่อคุณแม่กดยืนยันการมอบรางวัลได้ที่หน้า “ตั้งค่าผู้ปกครอง”
        </div>
        <div className="btnRow" style={{ justifyContent: 'center' }}>
          <button className="green" onClick={onClose}>รับทราบ 🎈</button>
        </div>
      </div>
    </div>
  )
}
