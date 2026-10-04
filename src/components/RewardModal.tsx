import { useEffect } from 'react'
import { useSettings } from '../state/SettingsContext'
import { playReward } from '../lib/sound'
import { fireConfetti } from '../lib/confetti'
import { Modal } from './ui'

// รางวัลเป็นข้อมูลความก้าวหน้า ผู้ปกครองเป็นผู้มอบ (Deci, Koestner, & Ryan, 1999)
export function RewardModal({ count, onClose }: { count: number; onClose: () => void }) {
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
    // ตั้งใจให้ฉลองครั้งเดียวตอนเปิด
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Modal label="ได้รับรางวัล" onClose={onClose}>
      <div className="rewardPop" aria-hidden="true">
        {settings.rewardEmoji}
      </div>
      <h2 className="modalTitle">
        ยินดีด้วย <span className="nobr">{settings.playerName}</span> สะสมดาวครบแล้ว
      </h2>
      <p className="modalText">
        ฝึกอย่างตั้งใจจนได้รับ <b>{settings.rewardName}</b> {count > 1 ? `${count} ชิ้น` : '1 ชิ้น'}
        <br />
        แจ้งคุณพ่อคุณแม่เพื่อรับรางวัลได้เลย
      </p>
      <div className="actions">
        <button className="btn btnPrimary btnLarge" onClick={onClose}>
          รับทราบ
        </button>
      </div>
    </Modal>
  )
}
