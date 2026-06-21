// โปรยดาว/อิโมจิเฉลิมฉลองบนหน้าจอ
export function fireConfetti(count = 14, marks = ['⭐', '🌟', '✨', '🎈', '💛', '🌈']) {
  if (typeof document === 'undefined') return
  for (let i = 0; i < count; i++) {
    const span = document.createElement('span')
    span.className = 'confetti'
    span.textContent = marks[Math.floor(Math.random() * marks.length)]
    span.style.left = Math.floor(Math.random() * 90 + 5) + 'vw'
    span.style.animationDelay = Math.random() * 0.4 + 's'
    span.style.fontSize = 22 + Math.floor(Math.random() * 18) + 'px'
    document.body.appendChild(span)
    setTimeout(() => span.remove(), 2000)
  }
}
