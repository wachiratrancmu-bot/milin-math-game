import { CURRICULUM_SOURCE } from './curriculum'

// ──────────────────────────────────────────────────────────────
// หลักการออกแบบระบบและเอกสารอ้างอิง (รูปแบบ APA 7)
// แสดงในส่วนผู้ปกครอง หัวข้อ "หลักการออกแบบ" และใน docs/DESIGN.md
// ──────────────────────────────────────────────────────────────

export const REFERENCES = {
  curriculum: CURRICULUM_SOURCE,
  school:
    'แนวข้อสอบคณิตศาสตร์ ป.1 ที่โรงเรียนแจ้งผู้ปกครอง: ปรนัย 20 ข้อ ข้อละ 1 คะแนน เนื้อหาบทที่ 4–6',
  schoolQuiz:
    'ผลแบบทดสอบย่อยของผู้เรียนจากระบบประกาศผลคะแนนของโรงเรียน (รูปแบบข้อสอบ: ตัวเลือก ก ข ค, เส้นจำนวน, การเขียนประโยคสัญลักษณ์แบบเติมคำตอบ, ตัวไม่ทราบค่า □ และ Δ)',
  blackWiliam:
    'Black, P., & Wiliam, D. (1998). Assessment and classroom learning. Assessment in Education: Principles, Policy & Practice, 5(1), 7–74.',
  bloom: 'Bloom, B. S. (1968). Learning for mastery. Evaluation Comment, 1(2), 1–12.',
  bruner: 'Bruner, J. S. (1966). Toward a theory of instruction. Harvard University Press.',
  buzick:
    'Buzick, H., & Stone, E. (2014). A meta-analysis of research on the read aloud accommodation. Educational Measurement: Issues and Practice, 33(3), 17–30.',
  cepeda:
    'Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. Psychological Bulletin, 132(3), 354–380.',
  deci: 'Deci, E. L., Koestner, R., & Ryan, R. M. (1999). A meta-analytic review of experiments examining the effects of extrinsic rewards on intrinsic motivation. Psychological Bulletin, 125(6), 627–668.',
  dunlosky:
    'Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students’ learning with effective learning techniques. Psychological Science in the Public Interest, 14(1), 4–58.',
  hattie:
    'Hattie, J., & Timperley, H. (2007). The power of feedback. Review of Educational Research, 77(1), 81–112.',
  hourcade:
    'Hourcade, J. P. (2008). Interaction design and children. Foundations and Trends in Human–Computer Interaction, 1(4), 277–392.',
  karp: 'Karp, K. S., Bush, S. B., & Dougherty, B. J. (2014). 13 rules that expire. Teaching Children Mathematics, 21(1), 18–25.',
  leitner: 'Leitner, S. (1972). So lernt man lernen. Herder.',
  mueller:
    'Mueller, C. M., & Dweck, C. S. (1998). Praise for intelligence can undermine children’s motivation and performance. Journal of Personality and Social Psychology, 75(1), 33–52.',
  nrc: 'National Research Council. (2009). Mathematics learning in early childhood: Paths toward excellence and equity. The National Academies Press.',
  polya:
    'Pólya, G. (1945). How to solve it: A new aspect of mathematical method. Princeton University Press.',
  ramirez:
    'Ramirez, G., Gunderson, E. A., Levine, S. C., & Beilock, S. L. (2013). Math anxiety, working memory, and math achievement in early elementary school. Journal of Cognition and Development, 14(2), 187–202.',
  riley:
    'Riley, M. S., Greeno, J. G., & Heller, J. I. (1983). Development of children’s problem-solving ability in arithmetic. In H. P. Ginsburg (Ed.), The development of mathematical thinking (pp. 153–196). Academic Press.',
  roediger:
    'Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. Psychological Science, 17(3), 249–255.',
  rohrer:
    'Rohrer, D., & Taylor, K. (2007). The shuffling of mathematics problems improves learning. Instructional Science, 35(6), 481–498.',
  rosenshine:
    'Rosenshine, B. (2012). Principles of instruction: Research-based strategies that all teachers should know. American Educator, 36(1), 12–19, 39.',
  shute:
    'Shute, V. J. (2008). Focus on formative feedback. Review of Educational Research, 78(1), 153–189.',
  sweller:
    'Sweller, J., & Cooper, G. A. (1985). The use of worked examples as a substitute for problem solving in learning algebra. Cognition and Instruction, 2(1), 59–89.',
  vanDeWalle:
    'Van de Walle, J. A., Karp, K. S., & Bay-Williams, J. M. (2019). Elementary and middle school mathematics: Teaching developmentally (10th ed.). Pearson.',
  wcag: 'World Wide Web Consortium. (2023). Web Content Accessibility Guidelines (WCAG) 2.2. https://www.w3.org/TR/WCAG22/',
  witzel:
    'Witzel, B. S., Mercer, C. D., & Miller, M. D. (2003). Teaching algebra to students with learning difficulties: An investigation of an explicit instruction model. Learning Disabilities Research & Practice, 18(2), 121–131.',
} as const

export type ReferenceKey = keyof typeof REFERENCES

export interface DesignPrinciple {
  title: string
  /** สิ่งที่ระบบทำ */
  what: string
  /** เหตุผล */
  why: string
  refs: ReferenceKey[]
}

export const PRINCIPLES: DesignPrinciple[] = [
  {
    title: 'ยึดหลักสูตรและแนวข้อสอบ',
    what: 'ทุกข้อผูกกับตัวชี้วัด ค 1.1 ป.1/1–5 และ ค 1.2 ป.1/1 ใช้จำนวนไม่เกิน 20 ตามบทที่ 4–6 ข้อสอบจำลองเป็นปรนัย 20 ข้อเหมือนจริง',
    why: 'ฝึกตรงกับสิ่งที่จะถูกวัด และใช้คำศัพท์เดียวกับหนังสือเรียน',
    refs: ['curriculum', 'school'],
  },
  {
    title: 'รูปแบบเดียวกับข้อสอบของโรงเรียน',
    what: 'ตัวเลือก ก ข ค 3 ตัวเลือก ใช้ทั้ง □ และ Δ แทนตัวไม่ทราบค่า มีโจทย์เส้นจำนวน การเขียนประโยคสัญลักษณ์แบบเติมคำตอบ และตัวเลือกที่เป็นประโยค ข้อสอบจำลองเลือกได้ทั้งปรนัย 20 ข้อ และปรนัย 15 ข้อกับเติมคำตอบ 5 ข้อ',
    why: 'เมื่อคุ้นกับรูปแบบข้อสอบ ผู้เรียนจะใช้เวลาไปกับการคิดคำตอบ ไม่ต้องเสียเวลาทำความเข้าใจรูปแบบ และฝึกตรงกับข้อที่เคยผิดในแบบทดสอบย่อย',
    refs: ['schoolQuiz', 'school'],
  },
  {
    title: 'บทเรียนสั้นก่อนฝึก',
    what: 'แต่ละบทสอนทีละขั้นเล็ก ๆ มีตัวอย่างที่ทำให้ดู แล้วจึงให้ลองทำ',
    why: 'ผู้เรียนเริ่มต้นเรียนรู้ได้ดีเมื่อได้เห็นตัวอย่างการทำก่อนลงมือเอง',
    refs: ['rosenshine', 'sweller'],
  },
  {
    title: 'ภาพช่วยคิดด้วยกรอบสิบช่องและเส้นจำนวน',
    what: 'วิธีคิดหลังตอบใช้กรอบสิบช่องแสดงการนับ หลักสิบ การบวกแบบทำให้ครบ 10 และการลบแบบลบให้เหลือ 10 และใช้เส้นจำนวนแสดงการนับเพิ่มและถอยหลังทีละช่อง',
    why: 'เชื่อมจากภาพไปสู่สัญลักษณ์ ช่วยให้เข้าใจความหมายของจำนวนและการดำเนินการ',
    refs: ['bruner', 'witzel', 'vanDeWalle', 'nrc'],
  },
  {
    title: 'ผลป้อนกลับทันทีและวิธีคิดทีละขั้น',
    what: 'ระหว่างทำไม่มีคำใบ้ ให้ผู้เรียนคิดเองเหมือนในห้องสอบ บอกผลทันทีหลังตอบ ถ้าผิดให้ลองใหม่ได้ เมื่อเฉลยจะแสดงวิธีคิดทีละขั้นพร้อมภาพ',
    why: 'ผลป้อนกลับที่อธิบายวิธีคิด ช่วยแก้ความเข้าใจผิดได้ดีกว่าการบอกเพียงถูกหรือผิด',
    refs: ['shute', 'hattie'],
  },
  {
    title: 'ฝึกด้วยการทำแบบทดสอบ',
    what: 'เน้นให้ตอบคำถามบ่อย ๆ และมีข้อสอบจำลองให้ทำซ้ำได้',
    why: 'การดึงความรู้ออกมาตอบช่วยให้จำได้นานกว่าการอ่านทบทวน',
    refs: ['roediger', 'dunlosky'],
  },
  {
    title: 'ฝึกคละหัวข้อ',
    what: 'แบบฝึกรวมและข้อสอบจำลองคละโจทย์หลายแบบไว้ด้วยกัน',
    why: 'ช่วยให้ฝึกเลือกวิธีคิดให้เหมาะกับโจทย์ ซึ่งเป็นสิ่งที่ต้องทำในห้องสอบ',
    refs: ['rohrer', 'dunlosky'],
  },
  {
    title: 'ทบทวนข้อที่เคยผิดแบบเว้นระยะ',
    what: 'ข้อที่ตอบผิดเข้า “กล่องทบทวน” ต้องตอบถูก 2 ครั้งในต่างรอบจึงออกจากกล่อง',
    why: 'การทบทวนแบบเว้นระยะช่วยให้จำได้ดีกว่าการทบทวนติดกัน',
    refs: ['leitner', 'cepeda', 'dunlosky'],
  },
  {
    title: 'แผนที่ทักษะและเกณฑ์ความเชี่ยวชาญ',
    what: 'วัดความแม่นยำรายทักษะจากการตอบครั้งแรก 10 ข้อล่าสุด ถือว่าเชี่ยวชาญเมื่อถูกอย่างน้อย 90% และแนะนำทักษะที่ควรฝึกต่อ',
    why: 'การประเมินระหว่างเรียนช่วยให้รู้ว่าควรฝึกอะไรต่อ และฝึกจนเชี่ยวชาญก่อนไปเรื่องถัดไป',
    refs: ['bloom', 'blackWiliam'],
  },
  {
    title: 'ชมความพยายามและวิธีคิด',
    what: 'คำชมเน้นความตั้งใจและวิธีคิด เช่น “ตั้งใจคิดดีมาก” แทนการชมว่าฉลาด',
    why: 'การชมความสามารถอาจทำให้เด็กกลัวความผิดพลาด การชมกระบวนการช่วยให้พยายามต่อ',
    refs: ['mueller'],
  },
  {
    title: 'รางวัลเป็นข้อมูลความก้าวหน้า',
    what: 'ดาวบอกความก้าวหน้า รางวัลจริงตั้งค่าโดยผู้ปกครองและผู้ปกครองเป็นผู้มอบ',
    why: 'รางวัลที่จับต้องได้ควรใช้อย่างพอดี เพื่อไม่ลดความสนใจในการเรียนรู้ด้วยตัวเอง',
    refs: ['deci'],
  },
  {
    title: 'ลดความกังวลเรื่องเวลา',
    what: 'ไม่มีนาฬิกานับถอยหลัง ข้อสอบจำลองแสดงเพียงเวลาที่ใช้ไปและปิดได้',
    why: 'ความกังวลต่อคณิตศาสตร์ส่งผลต่อผลการเรียนของเด็กประถมต้น',
    refs: ['ramirez'],
  },
  {
    title: 'โจทย์ปัญหาเน้นเข้าใจสถานการณ์',
    what: 'สอนแก้โจทย์ 4 ขั้นตอน และให้คิดว่าเป็นการรวม การเอาออก หรือการเปรียบเทียบ แทนการจำคำสำคัญ มีโจทย์เปรียบเทียบหลายข้อ',
    why: 'การจำคำสำคัญใช้ไม่ได้เสมอ และโจทย์เปรียบเทียบเป็นแบบที่เด็กพบว่ายากที่สุด',
    refs: ['polya', 'karp', 'riley'],
  },
  {
    title: 'ปุ่มฟังโจทย์',
    what: 'อ่านโจทย์ออกเสียงภาษาไทยให้ฟังได้ในโหมดฝึก',
    why: 'ช่วยเด็กที่ยังอ่านไม่คล่องให้เข้าใจโจทย์คณิตศาสตร์ได้',
    refs: ['buzick'],
  },
  {
    title: 'ออกแบบสำหรับเด็กและทุกคนใช้ได้',
    what: 'ปุ่มสูงอย่างน้อย 48 พิกเซล ตัวอักษรใหญ่ สีตัดกันตามเกณฑ์ ใช้คีย์บอร์ดได้ อ่านด้วยโปรแกรมอ่านหน้าจอได้ และลดภาพเคลื่อนไหวเมื่อตั้งค่าไว้',
    why: 'เด็กเล็กควบคุมการแตะได้ไม่แม่นยำเท่าผู้ใหญ่ และระบบควรใช้ได้กับผู้ใช้ทุกคน',
    refs: ['wcag', 'hourcade'],
  },
]
