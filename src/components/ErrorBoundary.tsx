import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}
interface State {
  hasError: boolean
  message?: string
}

/** กันจอขาว: ถ้ามี error ระหว่าง render จะแสดงหน้าขอโทษแทน */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // บันทึกไว้ดูภายหลัง (ดูได้ใน console ของเบราว์เซอร์)
    console.error('เกิดข้อผิดพลาดในแอป:', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, message: undefined })
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="screen">
          <section className="card errorCard" role="alert">
            <div className="errorIcon" aria-hidden="true">
              🛠️
            </div>
            <h1 className="sectionTitle">ขออภัย ระบบขัดข้องเล็กน้อย</h1>
            <p className="sectionHint">
              กดปุ่ม “เริ่มใหม่” เพื่อโหลดหน้าอีกครั้ง ดาวสะสมและความคืบหน้ายังอยู่ครบ
            </p>
            <div className="actions">
              <button className="btn btnPrimary btnLarge" onClick={() => window.location.reload()}>
                เริ่มใหม่
              </button>
              <button className="btn btnGhost btnLarge" onClick={this.handleReset}>
                ลองทำต่อ
              </button>
            </div>
            {this.state.message && <p className="muted">({this.state.message})</p>}
          </section>
        </main>
      )
    }
    return this.props.children
  }
}
