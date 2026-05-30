import { useState } from "react";

const COLORS = {
  bg: "#0F1117",
  card: "#181C27",
  cardBorder: "#252A3A",
  accent: "#4F8EF7",
  accentSoft: "#1E2D4F",
  green: "#2ECC71",
  greenSoft: "#1A3A2A",
  yellow: "#F7C948",
  yellowSoft: "#3A3010",
  red: "#E74C3C",
  redSoft: "#3A1A1A",
  text: "#E8EAF0",
  textMuted: "#7A8099",
  textDim: "#4A5068",
};

const NAV_ITEMS = [
  { id: "dashboard", icon: "⊞", label: "대시보드" },
  { id: "schedule", icon: "◫", label: "수업 일정" },
  { id: "grades", icon: "◈", label: "성적/과제" },
  { id: "notice", icon: "◉", label: "공지/메시지" },
  { id: "sms", icon: "✉", label: "문자 발송" },
  { id: "report", icon: "◧", label: "수업 보고서" },
];

// ── SMS 발송: 백엔드 Serverless Function 호출 (API Secret 서버에서만 사용) ──
async function sendSolapiSMS({ to, text }) {
  const res = await fetch("/api/send-sms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, text }),
  });
  return res.json();
}

const SMS_TEMPLATES = [
  { id: 1, label: "결석 안내", text: "[키맨학원] 안녕하세요, {이름} 학부모님. 오늘 {이름} 학생이 수업에 결석하였습니다. 확인 부탁드립니다." },
  { id: 2, label: "성적 통보", text: "[키맨학원] {이름} 학생의 이번 테스트 성적이 나왔습니다. 원내 방문 또는 문의 전화 주시기 바랍니다." },
  { id: 3, label: "수업 일정 변경", text: "[키맨학원] 안녕하세요. 수업 일정이 변경되었습니다. 자세한 내용은 원으로 문의 바랍니다." },
  { id: 4, label: "공지 전달", text: "[키맨학원] 학부모님께 안내드립니다. 원에서 중요한 공지사항이 있으니 확인 부탁드립니다." },
  { id: 5, label: "직접 입력", text: "" },
];

const CLASSES = [
  { id: 1, name: "수학 심화반", teacher: "김민준", time: "월·수 16:00", students: 18, room: "A101" },
  { id: 2, name: "영어 회화반", teacher: "이소연", time: "화·목 17:30", students: 14, room: "B203" },
  { id: 3, name: "과학 탐구반", teacher: "박도현", time: "수·금 15:00", students: 22, room: "A102" },
  { id: 4, name: "국어 논술반", teacher: "최지원", time: "월·목 18:00", students: 16, room: "C301" },
  { id: 5, name: "코딩 기초반", teacher: "정하은", time: "토 10:00", students: 12, room: "D401" },
];

const WEEKLY = [
  { day: "월", slots: [
    { time: "16:00", class: "수학 심화반", room: "A101", color: COLORS.accent },
    { time: "18:00", class: "국어 논술반", room: "C301", color: COLORS.yellow },
  ]},
  { day: "화", slots: [
    { time: "17:30", class: "영어 회화반", room: "B203", color: COLORS.green },
  ]},
  { day: "수", slots: [
    { time: "15:00", class: "과학 탐구반", room: "A102", color: COLORS.red },
    { time: "16:00", class: "수학 심화반", room: "A101", color: COLORS.accent },
  ]},
  { day: "목", slots: [
    { time: "17:30", class: "영어 회화반", room: "B203", color: COLORS.green },
    { time: "18:00", class: "국어 논술반", room: "C301", color: COLORS.yellow },
  ]},
  { day: "금", slots: [
    { time: "15:00", class: "과학 탐구반", room: "A102", color: COLORS.red },
  ]},
  { day: "토", slots: [
    { time: "10:00", class: "코딩 기초반", room: "D401", color: "#A78BFA" },
  ]},
  { day: "일", slots: [] },
];

const STUDENTS = [
  { id: 1, name: "강서준", class: "수학 심화반", avgScore: 92, homework: "완료", trend: "up", parentPhone: "010-1234-5678" },
  { id: 2, name: "윤아린", class: "영어 회화반", avgScore: 88, homework: "완료", trend: "up", parentPhone: "010-2345-6789" },
  { id: 3, name: "임재현", class: "과학 탐구반", avgScore: 74, homework: "미제출", trend: "down", parentPhone: "010-3456-7890" },
  { id: 4, name: "한도연", class: "수학 심화반", avgScore: 95, homework: "완료", trend: "up", parentPhone: "010-4567-8901" },
  { id: 5, name: "오수민", class: "국어 논술반", avgScore: 81, homework: "완료", trend: "same", parentPhone: "010-5678-9012" },
  { id: 6, name: "배지호", class: "코딩 기초반", avgScore: 67, homework: "미제출", trend: "down", parentPhone: "010-6789-0123" },
  { id: 7, name: "신예은", class: "영어 회화반", avgScore: 90, homework: "완료", trend: "up", parentPhone: "010-7890-1234" },
];

const NOTICES = [
  { id: 1, type: "공지", title: "6월 모의고사 일정 안내", date: "2026.05.30", author: "키맨학원", read: true, important: true },
  { id: 2, type: "메시지", title: "[수학 심화반] 추가 과제 공지", date: "2026.05.29", author: "김민준", read: true, important: false },
  { id: 3, type: "공지", title: "여름 특강 수강신청 안내", date: "2026.05.28", author: "키맨학원", read: false, important: true },
  { id: 4, type: "메시지", title: "[영어 회화반] 5월 성적표 배부", date: "2026.05.27", author: "이소연", read: false, important: false },
  { id: 5, type: "공지", title: "원내 청소 당번 변경 안내", date: "2026.05.26", author: "키맨학원", read: true, important: false },
];

const style = {
  "@font": `@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&family=Space+Grotesk:wght@400;500;700&display=swap');`,
};

export default function AcademyApp() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeText, setComposeText] = useState("");
  const [composeTitle, setComposeTitle] = useState("");
  const [notices, setNotices] = useState(NOTICES);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const unreadCount = notices.filter(n => !n.read).length;

  const sendNotice = () => {
    if (!composeTitle.trim()) return;
    setNotices([{
      id: notices.length + 1,
      type: "공지",
      title: composeTitle,
      date: "2026.05.31",
      author: "키맨학원",
      read: true,
      important: false,
    }, ...notices]);
    setComposeOpen(false);
    setComposeTitle("");
    setComposeText("");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.bg,
      color: COLORS.text,
      fontFamily: "'Noto Sans KR', sans-serif",
      display: "flex",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&family=Space+Grotesk:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #252A3A; border-radius: 2px; }
        button { cursor: pointer; border: none; background: none; font-family: inherit; }
        input, textarea { font-family: inherit; }
        .nav-item { transition: all 0.2s; }
        .nav-item:hover { background: rgba(79,142,247,0.08) !important; }
        .nav-item.active { background: rgba(79,142,247,0.15) !important; }
        .card-hover { transition: transform 0.2s, box-shadow 0.2s; }
        .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        .row-hover:hover { background: rgba(255,255,255,0.03) !important; }
        .btn-primary { transition: all 0.15s; }
        .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
        .badge-pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        .fade-in { animation: fadeIn 0.35s ease; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
      `}</style>

      {/* Sidebar */}
      <aside style={{
        width: 72,
        background: COLORS.card,
        borderRight: `1px solid ${COLORS.cardBorder}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px 0",
        position: "sticky",
        top: 0,
        height: "100vh",
        zIndex: 10,
      }}>
        <div style={{
          width: 38,
          height: 38,
          background: COLORS.accent,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 900,
          fontFamily: "'Space Grotesk', sans-serif",
          marginBottom: 4,
          boxShadow: `0 0 20px rgba(79,142,247,0.4)`,
        }}>K</div>
        <div style={{ fontSize: 8, color: COLORS.accent, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 24, textAlign: "center" }}>키맨</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`nav-item${activeNav === item.id ? " active" : ""}`}
              onClick={() => setActiveNav(item.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                padding: "10px 4px",
                borderRadius: 8,
                margin: "0 8px",
                position: "relative",
              }}
              title={item.label}
            >
              <span style={{ fontSize: 18, color: activeNav === item.id ? COLORS.accent : COLORS.textMuted }}>{item.icon}</span>
              <span style={{ fontSize: 9, color: activeNav === item.id ? COLORS.accent : COLORS.textDim, letterSpacing: "0.02em" }}>{item.label}</span>
              {item.id === "notice" && unreadCount > 0 && (
                <span className="badge-pulse" style={{
                  position: "absolute",
                  top: 6,
                  right: 10,
                  width: 14,
                  height: 14,
                  background: COLORS.red,
                  borderRadius: "50%",
                  fontSize: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  color: "#fff",
                }}>{unreadCount}</span>
              )}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
          }}>키</div>
          <span style={{ fontSize: 9, color: COLORS.textDim }}>키맨학원</span>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: "auto", padding: "28px 32px" }}>
        {activeNav === "dashboard" && <Dashboard setActiveNav={setActiveNav} notices={notices} />}
        {activeNav === "schedule" && <Schedule />}
        {activeNav === "grades" && <Grades selectedStudent={selectedStudent} setSelectedStudent={setSelectedStudent} />}
        {activeNav === "notice" && (
          <NoticePanel
            notices={notices}
            setNotices={setNotices}
            composeOpen={composeOpen}
            setComposeOpen={setComposeOpen}
            composeTitle={composeTitle}
            setComposeTitle={setComposeTitle}
            composeText={composeText}
            setComposeText={setComposeText}
            sendNotice={sendNotice}
          />
        )}
        {activeNav === "sms" && <SMSPanel />}
        {activeNav === "report" && <ReportPanel />}
      </main>
    </div>
  );
}

/* ─── Dashboard ─── */
function Dashboard({ setActiveNav, notices }) {
  const unread = notices.filter(n => !n.read).length;
  return (
    <div className="fade-in">
      <Header title="대시보드" subtitle="키맨학원 · 2026년 5월 31일 일요일" />
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "전체 학생", value: "82", delta: "+3", color: COLORS.accent, icon: "◎" },
          { label: "진행 수업", value: "5", delta: "개 반", color: COLORS.green, icon: "◫" },
          { label: "오늘 출석률", value: "94%", delta: "+2%", color: COLORS.yellow, icon: "✓" },
          { label: "미확인 메시지", value: String(unread), delta: "건", color: COLORS.red, icon: "◉" },
        ].map((s, i) => (
          <div key={i} className="card-hover" style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.cardBorder}`,
            borderRadius: 14,
            padding: "20px 22px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, letterSpacing: "0.06em", marginBottom: 8, textTransform: "uppercase" }}>{s.label}</div>
                <div style={{ fontSize: 32, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 4 }}>{s.delta}</div>
              </div>
              <div style={{
                width: 36, height: 36,
                background: s.color + "18",
                borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, color: s.color,
              }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
        {/* Today's classes */}
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14, padding: 22 }}>
          <SectionHeader title="오늘 수업 없음" sub="다음 수업: 내일 월요일" action="일정 보기" onAction={() => setActiveNav("schedule")} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
            {WEEKLY[0].slots.map((slot, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12,
                background: slot.color + "12",
                border: `1px solid ${slot.color}30`,
                borderRadius: 10, padding: "12px 16px",
              }}>
                <div style={{ width: 3, height: 36, background: slot.color, borderRadius: 2 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{slot.class}</div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{slot.time} · {slot.room}</div>
                </div>
              </div>
            ))}
            <div style={{
              textAlign: "center", color: COLORS.textDim, fontSize: 12, padding: "16px 0",
              border: `1px dashed ${COLORS.cardBorder}`, borderRadius: 10,
            }}>오늘(일요일)은 예정된 수업이 없습니다</div>
          </div>
        </div>

        {/* Recent notices */}
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14, padding: 22 }}>
          <SectionHeader title="최근 공지" sub="" action="전체 보기" onAction={() => setActiveNav("notice")} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
            {notices.slice(0, 4).map(n => (
              <div key={n.id} className="row-hover" style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 8px", borderRadius: 8,
                borderLeft: n.important ? `2px solid ${COLORS.accent}` : "2px solid transparent",
              }}>
                <span style={{
                  fontSize: 9, padding: "2px 6px", borderRadius: 4,
                  background: n.type === "공지" ? COLORS.accentSoft : COLORS.greenSoft,
                  color: n.type === "공지" ? COLORS.accent : COLORS.green,
                  fontWeight: 700, letterSpacing: "0.04em",
                }}>{n.type}</span>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontSize: 12, fontWeight: n.read ? 400 : 600, color: n.read ? COLORS.textMuted : COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.title}</div>
                </div>
                {!n.read && <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.red, flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Class overview */}
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14, padding: 22, marginTop: 20 }}>
        <SectionHeader title="반 현황" sub={`총 ${CLASSES.length}개 반`} action="성적 관리" onAction={() => setActiveNav("grades")} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginTop: 8 }}>
          {CLASSES.map((c, i) => {
            const colors = [COLORS.accent, COLORS.green, COLORS.red, COLORS.yellow, "#A78BFA"];
            const col = colors[i % colors.length];
            return (
              <div key={c.id} className="card-hover" style={{
                background: col + "10",
                border: `1px solid ${col}25`,
                borderRadius: 10, padding: "14px 16px",
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: col, marginBottom: 6 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 2 }}>선생님: {c.teacher}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 2 }}>시간: {c.time}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted }}>학생: {c.students}명</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Schedule ─── */
function Schedule() {
  return (
    <div className="fade-in">
      <Header title="수업 일정" subtitle="키맨학원 · 2026년 6월 시간표" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 12 }}>
        {WEEKLY.map((day, i) => (
          <div key={i} style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.cardBorder}`,
            borderRadius: 14,
            padding: 14,
            minHeight: 260,
          }}>
            <div style={{
              fontSize: 13, fontWeight: 700,
              color: i === 6 ? COLORS.textDim : i === 5 ? "#A78BFA" : COLORS.text,
              marginBottom: 14,
              fontFamily: "'Space Grotesk', sans-serif",
            }}>{day.day}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {day.slots.length === 0 ? (
                <div style={{ fontSize: 11, color: COLORS.textDim, textAlign: "center", paddingTop: 16 }}>없음</div>
              ) : day.slots.map((slot, j) => (
                <div key={j} style={{
                  background: slot.color + "18",
                  border: `1px solid ${slot.color}35`,
                  borderRadius: 8,
                  padding: "10px 10px",
                  borderLeft: `3px solid ${slot.color}`,
                }}>
                  <div style={{ fontSize: 10, color: slot.color, fontWeight: 700, marginBottom: 4 }}>{slot.time}</div>
                  <div style={{ fontSize: 11, color: COLORS.text, fontWeight: 600, lineHeight: 1.3 }}>{slot.class}</div>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 3 }}>{slot.room}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14, padding: 22, marginTop: 20 }}>
        <SectionHeader title="전체 수업 목록" sub="" />
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${COLORS.cardBorder}` }}>
              {["반 이름", "담당 선생님", "수업 시간", "수강생 수", "강의실"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, color: COLORS.textMuted, fontWeight: 500, letterSpacing: "0.04em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CLASSES.map((c, i) => {
              const colors = [COLORS.accent, COLORS.green, COLORS.red, COLORS.yellow, "#A78BFA"];
              return (
                <tr key={c.id} className="row-hover" style={{ borderBottom: `1px solid ${COLORS.cardBorder}22` }}>
                  <td style={{ padding: "12px 12px" }}>
                    <span style={{ color: colors[i % colors.length], fontWeight: 600, fontSize: 13 }}>{c.name}</span>
                  </td>
                  <td style={{ padding: "12px 12px", fontSize: 13, color: COLORS.textMuted }}>{c.teacher}</td>
                  <td style={{ padding: "12px 12px", fontSize: 13, color: COLORS.textMuted }}>{c.time}</td>
                  <td style={{ padding: "12px 12px", fontSize: 13, color: COLORS.text, fontWeight: 600 }}>{c.students}명</td>
                  <td style={{ padding: "12px 12px", fontSize: 13, color: COLORS.textMuted }}>{c.room}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Grades ─── */
function Grades({ selectedStudent, setSelectedStudent }) {
  return (
    <div className="fade-in">
      <Header title="성적 / 과제 관리" subtitle="키맨학원 · 학생별 성취도 현황" />
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14, padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>학생 목록</div>
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>총 {STUDENTS.length}명</div>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${COLORS.cardBorder}` }}>
              {["이름", "수강반", "평균 점수", "과제 상태", "추세", ""].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 14px", fontSize: 11, color: COLORS.textMuted, fontWeight: 500, letterSpacing: "0.04em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STUDENTS.map(s => (
              <tr key={s.id} className="row-hover" style={{
                borderBottom: `1px solid ${COLORS.cardBorder}22`,
                background: selectedStudent?.id === s.id ? "rgba(79,142,247,0.06)" : "transparent",
              }}>
                <td style={{ padding: "13px 14px", fontWeight: 600, fontSize: 13 }}>{s.name}</td>
                <td style={{ padding: "13px 14px", fontSize: 12, color: COLORS.textMuted }}>{s.class}</td>
                <td style={{ padding: "13px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 60, height: 5, background: COLORS.cardBorder, borderRadius: 3, overflow: "hidden"
                    }}>
                      <div style={{
                        height: "100%",
                        width: `${s.avgScore}%`,
                        background: s.avgScore >= 90 ? COLORS.green : s.avgScore >= 75 ? COLORS.accent : COLORS.yellow,
                        borderRadius: 3,
                        transition: "width 0.5s",
                      }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: s.avgScore >= 90 ? COLORS.green : s.avgScore >= 75 ? COLORS.accent : COLORS.yellow }}>{s.avgScore}</span>
                  </div>
                </td>
                <td style={{ padding: "13px 14px" }}>
                  <span style={{
                    fontSize: 11, padding: "3px 8px", borderRadius: 5, fontWeight: 600,
                    background: s.homework === "완료" ? COLORS.greenSoft : COLORS.redSoft,
                    color: s.homework === "완료" ? COLORS.green : COLORS.red,
                  }}>{s.homework}</span>
                </td>
                <td style={{ padding: "13px 14px", fontSize: 16 }}>
                  {s.trend === "up" ? <span style={{ color: COLORS.green }}>↑</span>
                    : s.trend === "down" ? <span style={{ color: COLORS.red }}>↓</span>
                    : <span style={{ color: COLORS.textDim }}>→</span>}
                </td>
                <td style={{ padding: "13px 14px" }}>
                  <button
                    className="btn-primary"
                    onClick={() => setSelectedStudent(selectedStudent?.id === s.id ? null : s)}
                    style={{
                      fontSize: 11, padding: "4px 10px", borderRadius: 6,
                      background: selectedStudent?.id === s.id ? COLORS.accentSoft : COLORS.cardBorder,
                      color: selectedStudent?.id === s.id ? COLORS.accent : COLORS.textMuted,
                    }}
                  >{selectedStudent?.id === s.id ? "닫기" : "상세"}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedStudent && (
        <div className="fade-in" style={{ background: COLORS.card, border: `1px solid ${COLORS.accent}40`, borderRadius: 14, padding: 24, marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{selectedStudent.name} <span style={{ color: COLORS.textMuted, fontSize: 13, fontWeight: 400 }}>학생 상세</span></div>
              <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 3 }}>{selectedStudent.class} 수강 중</div>
            </div>
            <button onClick={() => setSelectedStudent(null)} style={{ color: COLORS.textMuted, fontSize: 18 }}>✕</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {[
              { label: "평균 점수", value: selectedStudent.avgScore, color: COLORS.accent },
              { label: "과제 상태", value: selectedStudent.homework, color: selectedStudent.homework === "완료" ? COLORS.green : COLORS.red },
              { label: "성적 추세", value: selectedStudent.trend === "up" ? "상승 ↑" : selectedStudent.trend === "down" ? "하락 ↓" : "유지 →", color: selectedStudent.trend === "up" ? COLORS.green : selectedStudent.trend === "down" ? COLORS.red : COLORS.textMuted },
              { label: "수강반", value: selectedStudent.class.replace("반", ""), color: COLORS.yellow },
            ].map((item, i) => (
              <div key={i} style={{ background: COLORS.bg, borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 10, color: COLORS.textDim, marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>{item.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: item.color, fontFamily: "'Space Grotesk', sans-serif" }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Notice Panel ─── */
function NoticePanel({ notices, setNotices, composeOpen, setComposeOpen, composeTitle, setComposeTitle, composeText, setComposeText, sendNotice }) {
  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <Header title="공지 / 메시지" subtitle="학생 및 강사 커뮤니케이션" noMargin />
        <button
          className="btn-primary"
          onClick={() => setComposeOpen(!composeOpen)}
          style={{
            background: COLORS.accent,
            color: "#fff",
            padding: "10px 18px",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            marginTop: 4,
          }}
        >+ 공지 작성</button>
      </div>

      {composeOpen && (
        <div className="fade-in" style={{
          background: COLORS.card,
          border: `1px solid ${COLORS.accent}50`,
          borderRadius: 14,
          padding: 22,
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: COLORS.accent }}>새 공지 작성</div>
          <input
            value={composeTitle}
            onChange={e => setComposeTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            style={{
              width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.cardBorder}`,
              borderRadius: 8, padding: "10px 14px", color: COLORS.text, fontSize: 13,
              marginBottom: 12, outline: "none",
            }}
          />
          <textarea
            value={composeText}
            onChange={e => setComposeText(e.target.value)}
            placeholder="내용을 입력하세요"
            rows={4}
            style={{
              width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.cardBorder}`,
              borderRadius: 8, padding: "10px 14px", color: COLORS.text, fontSize: 13,
              outline: "none", resize: "vertical",
            }}
          />
          <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "flex-end" }}>
            <button
              onClick={() => setComposeOpen(false)}
              style={{ padding: "8px 16px", borderRadius: 8, background: COLORS.cardBorder, color: COLORS.textMuted, fontSize: 13 }}
            >취소</button>
            <button
              className="btn-primary"
              onClick={sendNotice}
              style={{ padding: "8px 20px", borderRadius: 8, background: COLORS.accent, color: "#fff", fontSize: 13, fontWeight: 600 }}
            >발송</button>
          </div>
        </div>
      )}

      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "16px 22px", borderBottom: `1px solid ${COLORS.cardBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>전체 공지/메시지</div>
          <div style={{ fontSize: 12, color: COLORS.textMuted }}>총 {notices.length}건</div>
        </div>
        {notices.map((n, i) => (
          <div
            key={n.id}
            className="row-hover"
            onClick={() => setNotices(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
            style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "15px 22px",
              borderBottom: i < notices.length - 1 ? `1px solid ${COLORS.cardBorder}22` : "none",
              cursor: "pointer",
              background: n.read ? "transparent" : "rgba(79,142,247,0.03)",
            }}
          >
            {!n.read && <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.accent, flexShrink: 0 }} />}
            {n.read && <div style={{ width: 6, height: 6, flexShrink: 0 }} />}
            <span style={{
              fontSize: 10, padding: "2px 7px", borderRadius: 4, flexShrink: 0,
              background: n.type === "공지" ? COLORS.accentSoft : COLORS.greenSoft,
              color: n.type === "공지" ? COLORS.accent : COLORS.green,
              fontWeight: 700,
            }}>{n.type}</span>
            {n.important && <span style={{ fontSize: 10, color: COLORS.yellow }}>★</span>}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: n.read ? 400 : 600, color: n.read ? COLORS.textMuted : COLORS.text }}>{n.title}</div>
            </div>
            <div style={{ fontSize: 11, color: COLORS.textDim, flexShrink: 0 }}>{n.author}</div>
            <div style={{ fontSize: 11, color: COLORS.textDim, flexShrink: 0 }}>{n.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Shared ─── */
function Header({ title, subtitle, noMargin }) {
  return (
    <div style={{ marginBottom: noMargin ? 0 : 28 }}>
      <h1 style={{ fontSize: 22, fontWeight: 900, color: COLORS.text, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}>{title}</h1>
      {subtitle && <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>{subtitle}</div>}
    </div>
  );
}

function SectionHeader({ title, sub, action, onAction }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>{title}</div>
        {sub && <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{sub}</div>}
      </div>
      {action && (
        <button onClick={onAction} style={{ fontSize: 11, color: COLORS.accent, padding: "4px 10px", borderRadius: 6, background: COLORS.accentSoft }}>
          {action} →
        </button>
      )}
    </div>
  );
}

/* ─── SMS Panel ─── */
function SMSPanel() {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [templateId, setTemplateId] = useState(1);
  const [customText, setCustomText] = useState("");
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState([]);

  const template = SMS_TEMPLATES.find(t => t.id === templateId);
  const messageText = templateId === 5 ? customText : template.text;

  const toggleStudent = (id) =>
    setSelectedStudents(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleSend = async () => {
    if (selectedStudents.length === 0) { alert("수신자를 선택해주세요."); return; }
    if (!messageText.trim()) { alert("메시지 내용을 입력해주세요."); return; }
    setSending(true); setResults([]);
    const targets = STUDENTS.filter(s => selectedStudents.includes(s.id));
    const newResults = [];
    for (const student of targets) {
      const text = messageText.replace(/\{이름\}/g, student.name);
      const to = student.parentPhone.replace(/-/g, "");
      try {
        // API Secret은 서버(/api/send-sms)에서만 처리됨
        const res = await sendSolapiSMS({ to, text });
        if (res.error) newResults.push({ name: student.name, phone: student.parentPhone, status: "실패", reason: res.error });
        else newResults.push({ name: student.name, phone: student.parentPhone, status: "성공" });
      } catch (e) {
        newResults.push({ name: student.name, phone: student.parentPhone, status: "실패", reason: e.message });
      }
    }
    setResults(newResults); setSending(false);
  };

  return (
    <div className="fade-in">
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <Header title="문자 발송" subtitle="키맨학원 · 솔라피 SMS 발송" />

      {/* 안내 배너 */}
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.green}30`, borderRadius: 14, marginBottom: 20, padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 18, color: COLORS.green }}>🔒</span>
        <div style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.7 }}>
          API Key / Secret은 <b style={{ color: COLORS.text }}>서버 환경변수</b>에서 안전하게 관리됩니다.
          Vercel 대시보드 → Settings → Environment Variables 에서
          <b style={{ color: COLORS.accent }}> SOLAPI_API_KEY, SOLAPI_API_SECRET, SOLAPI_FROM_NUMBER</b> 를 등록하세요.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 20 }}>
        {/* 수신자 */}
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14, padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>수신자 선택</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setSelectedStudents(STUDENTS.map(s => s.id))} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, background: COLORS.accentSoft, color: COLORS.accent }}>전체</button>
              <button onClick={() => setSelectedStudents([])} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, background: COLORS.cardBorder, color: COLORS.textMuted }}>해제</button>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {STUDENTS.map(s => (
              <label key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                background: selectedStudents.includes(s.id) ? "rgba(79,142,247,0.08)" : "transparent",
                border: selectedStudents.includes(s.id) ? `1px solid ${COLORS.accent}30` : "1px solid transparent",
              }}>
                <input type="checkbox" checked={selectedStudents.includes(s.id)} onChange={() => toggleStudent(s.id)} style={{ accentColor: COLORS.accent }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted }}>{s.class} · {s.parentPhone}</div>
                </div>
                {s.homework === "미제출" && <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: COLORS.redSoft, color: COLORS.red }}>미제출</span>}
              </label>
            ))}
          </div>
          <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 8, background: COLORS.bg, fontSize: 12, color: COLORS.textMuted }}>
            선택: <span style={{ color: COLORS.accent, fontWeight: 700 }}>{selectedStudents.length}</span>명
          </div>
        </div>

        {/* 메시지 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14, padding: 22 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>메시지 템플릿</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {SMS_TEMPLATES.map(t => (
                <label key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, cursor: "pointer",
                  background: templateId === t.id ? COLORS.accentSoft : COLORS.bg,
                  border: templateId === t.id ? `1px solid ${COLORS.accent}40` : `1px solid ${COLORS.cardBorder}`,
                }}>
                  <input type="radio" checked={templateId === t.id} onChange={() => setTemplateId(t.id)} style={{ accentColor: COLORS.accent }} />
                  <span style={{ fontSize: 13, color: templateId === t.id ? COLORS.text : COLORS.textMuted }}>{t.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14, padding: 22 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>메시지 내용</div>
            {templateId === 5 ? (
              <textarea value={customText} onChange={e => setCustomText(e.target.value)} rows={4}
                placeholder={"메시지를 직접 입력하세요\n{이름} 입력 시 학생 이름으로 자동 치환됩니다."}
                style={{ width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 8, padding: "11px 13px", color: COLORS.text, fontSize: 13, outline: "none", resize: "vertical" }} />
            ) : (
              <div style={{ background: COLORS.bg, borderRadius: 8, padding: "11px 14px", fontSize: 13, color: COLORS.textMuted, lineHeight: 1.7 }}>{messageText}</div>
            )}
            <div style={{ marginTop: 8, fontSize: 11, color: COLORS.textDim }}>
              💬 <b style={{ color: COLORS.textMuted }}>{"{이름}"}</b> 입력 시 학생 이름으로 자동 치환 · SMS 90자 / LMS 2000자
            </div>
            <button className="btn-primary" onClick={handleSend} disabled={sending}
              style={{ width: "100%", marginTop: 16, padding: "13px", borderRadius: 10, background: sending ? COLORS.cardBorder : COLORS.accent,
                color: sending ? COLORS.textMuted : "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {sending
                ? <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span> 발송 중...</>
                : <>✉ {selectedStudents.length}명 학부모에게 문자 발송</>}
            </button>
          </div>
        </div>
      </div>

      {/* 결과 */}
      {results.length > 0 && (
        <div className="fade-in" style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14, padding: 22, marginTop: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>발송 결과</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 14 }}>
            {[
              { label: "전체", value: results.length, color: COLORS.accent },
              { label: "성공", value: results.filter(r => r.status === "성공").length, color: COLORS.green },
              { label: "실패", value: results.filter(r => r.status === "실패").length, color: COLORS.red },
            ].map((s, i) => (
              <div key={i} style={{ background: COLORS.bg, borderRadius: 10, padding: "12px", textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: s.color, fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {results.map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 8,
                background: r.status === "성공" ? COLORS.greenSoft : COLORS.redSoft,
                border: `1px solid ${r.status === "성공" ? COLORS.green : COLORS.red}30`,
              }}>
                <span style={{ fontSize: 14, color: r.status === "성공" ? COLORS.green : COLORS.red }}>{r.status === "성공" ? "✓" : "✗"}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</span>
                  <span style={{ fontSize: 12, color: COLORS.textMuted, marginLeft: 8 }}>{r.phone}</span>
                  {r.reason && <span style={{ fontSize: 11, color: COLORS.red, marginLeft: 8 }}>({r.reason})</span>}
                </div>
                <span style={{ fontSize: 12, color: r.status === "성공" ? COLORS.green : COLORS.red, fontWeight: 600 }}>{r.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Report Panel ─── */
function ReportPanel() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState("2026-05-31");
  const [topic, setTopic] = useState("");
  const [attendance, setAttendance] = useState({});
  const [memo, setMemo] = useState("");
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState(null);
  const [savedReports, setSavedReports] = useState([
    { id: 1, class: "수학 심화반", date: "2026-05-28", topic: "이차방정식 풀이", summary: "학생들의 전반적인 이해도가 높았으며, 심화 문제 풀이에서 탁월한 성과를 보였습니다." },
    { id: 2, class: "영어 회화반", date: "2026-05-27", topic: "비즈니스 영어 표현", summary: "대화 연습 활동에서 학생들의 자신감이 크게 향상되었습니다." },
  ]);
  const [activeTab, setActiveTab] = useState("create");
  const [copyDone, setCopyDone] = useState(false);

  const classStudents = STUDENTS.filter(s => s.class === selectedClass);

  const toggleAttendance = (id) =>
    setAttendance(prev => ({ ...prev, [id]: prev[id] === "결석" ? "출석" : "결석" }));

  const attendCount = classStudents.filter(s => attendance[s.id] !== "결석").length;
  const absentCount = classStudents.length - attendCount;

  const handleGenerate = async () => {
    if (!selectedClass) { alert("반을 선택해주세요."); return; }
    if (!topic.trim()) { alert("수업 주제를 입력해주세요."); return; }
    setGenerating(true);
    setReport(null);

    const absentNames = classStudents.filter(s => attendance[s.id] === "결석").map(s => s.name);
    const lowScoreStudents = classStudents.filter(s => s.avgScore < 75).map(s => s.name);
    const classInfo = CLASSES.find(c => c.name === selectedClass);

    const prompt = `당신은 학원 선생님을 도와 수업 보고서를 작성하는 전문 AI입니다.
다음 정보를 바탕으로 한국어로 전문적인 수업 보고서를 작성해주세요.

[수업 정보]
- 반 이름: ${selectedClass}
- 담당 교사: ${classInfo?.teacher || ""}
- 수업 날짜: ${selectedDate}
- 수업 주제: ${topic}
- 총 학생 수: ${classStudents.length}명
- 출석: ${attendCount}명, 결석: ${absentCount}명
${absentNames.length > 0 ? `- 결석 학생: ${absentNames.join(", ")}` : ""}
${lowScoreStudents.length > 0 ? `- 성적 주의 학생(75점 미만): ${lowScoreStudents.join(", ")}` : ""}
${memo ? `- 교사 메모: ${memo}` : ""}

다음 JSON 형식으로만 응답하세요 (다른 텍스트 없이):
{
  "title": "보고서 제목",
  "summary": "수업 요약 (2~3문장)",
  "achievements": ["주요 성과 1", "주요 성과 2", "주요 성과 3"],
  "concerns": ["주의사항 또는 개선점 1", "주의사항 또는 개선점 2"],
  "nextPlan": "다음 수업 계획 (1~2문장)",
  "parentMessage": "학부모께 전달할 메시지 (2문장, SMS 발송 가능한 형태)"
}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const raw = data.content?.map(i => i.text || "").join("") || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      const newReport = {
        id: Date.now(),
        class: selectedClass,
        date: selectedDate,
        topic,
        attendCount,
        absentCount,
        absentNames,
        ...parsed,
      };
      setReport(newReport);
    } catch (e) {
      alert("보고서 생성 중 오류가 발생했습니다: " + e.message);
    }
    setGenerating(false);
  };

  const saveReport = () => {
    if (!report) return;
    setSavedReports(prev => [report, ...prev]);
    alert("보고서가 저장되었습니다.");
  };

  const copyReport = () => {
    if (!report) return;
    const text = `[수업 보고서] ${report.title}
날짜: ${report.date} | 반: ${report.class} | 출석: ${report.attendCount}명
주제: ${report.topic}

📋 수업 요약
${report.summary}

✅ 주요 성과
${report.achievements.map((a, i) => `${i + 1}. ${a}`).join("\n")}

⚠️ 주의사항
${report.concerns.map((c, i) => `${i + 1}. ${c}`).join("\n")}

📅 다음 수업 계획
${report.nextPlan}

💬 학부모 전달 메시지
${report.parentMessage}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    });
  };

  return (
    <div className="fade-in">
      <Header title="수업 보고서" subtitle="키맨학원 · AI 수업 보고서 자동 작성" />

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: COLORS.card, borderRadius: 10, padding: 4, width: "fit-content", border: `1px solid ${COLORS.cardBorder}` }}>
        {[{ id: "create", label: "✦ 보고서 작성" }, { id: "history", label: "◧ 저장된 보고서" }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ padding: "8px 20px", borderRadius: 7, fontSize: 13, fontWeight: 600,
              background: activeTab === tab.id ? COLORS.accent : "transparent",
              color: activeTab === tab.id ? "#fff" : COLORS.textMuted }}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "create" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 20 }}>
          {/* 입력 폼 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14, padding: 22 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>수업 정보 입력</div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>반 선택</label>
                <select value={selectedClass} onChange={e => { setSelectedClass(e.target.value); setAttendance({}); }}
                  style={{ width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 8, padding: "9px 12px", color: selectedClass ? COLORS.text : COLORS.textDim, fontSize: 13, outline: "none" }}>
                  <option value="">반을 선택하세요</option>
                  {CLASSES.map(c => <option key={c.id} value={c.name}>{c.name} ({c.teacher} 선생님)</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>수업 날짜</label>
                <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                  style={{ width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 8, padding: "9px 12px", color: COLORS.text, fontSize: 13, outline: "none", colorScheme: "dark" }} />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>수업 주제 / 내용</label>
                <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="예: 이차방정식 풀이, 비즈니스 영어 표현"
                  style={{ width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 8, padding: "9px 12px", color: COLORS.text, fontSize: 13, outline: "none" }} />
              </div>

              <div>
                <label style={{ fontSize: 11, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>교사 메모 (선택)</label>
                <textarea value={memo} onChange={e => setMemo(e.target.value)} rows={3}
                  placeholder="특이사항, 학생 반응, 수업 분위기 등을 자유롭게 입력하세요"
                  style={{ width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 8, padding: "9px 12px", color: COLORS.text, fontSize: 13, outline: "none", resize: "vertical" }} />
              </div>
            </div>

            {/* 출석 */}
            {selectedClass && (
              <div className="fade-in" style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14, padding: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>출석 체크</div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted }}>
                    출석 <span style={{ color: COLORS.green, fontWeight: 700 }}>{attendCount}</span> / 결석 <span style={{ color: COLORS.red, fontWeight: 700 }}>{absentCount}</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {classStudents.map(s => {
                    const absent = attendance[s.id] === "결석";
                    return (
                      <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderRadius: 8,
                        background: absent ? COLORS.redSoft : COLORS.bg,
                        border: `1px solid ${absent ? COLORS.red + "30" : COLORS.cardBorder}`,
                      }}>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: absent ? COLORS.red : COLORS.text }}>{s.name}</span>
                          <span style={{ fontSize: 11, color: COLORS.textMuted, marginLeft: 8 }}>평균 {s.avgScore}점</span>
                        </div>
                        <button onClick={() => toggleAttendance(s.id)}
                          style={{ fontSize: 11, padding: "4px 12px", borderRadius: 6, fontWeight: 600,
                            background: absent ? COLORS.red : COLORS.greenSoft,
                            color: absent ? "#fff" : COLORS.green }}>
                          {absent ? "결석" : "출석"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <button className="btn-primary" onClick={handleGenerate} disabled={generating}
              style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: generating ? COLORS.cardBorder : "linear-gradient(135deg, #4F8EF7, #7C4DFF)",
                color: generating ? COLORS.textMuted : "#fff",
                boxShadow: generating ? "none" : "0 4px 20px rgba(79,142,247,0.35)" }}>
              {generating
                ? <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span> AI가 보고서 작성 중...</>
                : <>✦ AI 보고서 자동 생성</>}
            </button>
          </div>

          {/* 결과 */}
          <div>
            {!report && !generating && (
              <div style={{ background: COLORS.card, border: `1px dashed ${COLORS.cardBorder}`, borderRadius: 14, padding: 48, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, minHeight: 400 }}>
                <div style={{ fontSize: 40, opacity: 0.3 }}>◧</div>
                <div style={{ fontSize: 14, color: COLORS.textDim, textAlign: "center", lineHeight: 1.7 }}>
                  왼쪽에서 수업 정보를 입력하고<br /><b style={{ color: COLORS.textMuted }}>AI 보고서 자동 생성</b> 버튼을 누르세요
                </div>
                <div style={{ fontSize: 11, color: COLORS.textDim, textAlign: "center", lineHeight: 1.8, padding: "12px 20px", background: COLORS.bg, borderRadius: 10 }}>
                  ✦ 수업 요약 · 주요 성과 · 주의사항<br />
                  ✦ 다음 수업 계획 · 학부모 전달 메시지<br />
                  자동 생성
                </div>
              </div>
            )}

            {generating && (
              <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14, padding: 48, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, minHeight: 400 }}>
                <div style={{ position: "relative", width: 60, height: 60 }}>
                  <div style={{ position: "absolute", inset: 0, border: `3px solid ${COLORS.accent}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  <div style={{ position: "absolute", inset: 8, border: `2px solid #7C4DFF`, borderBottomColor: "transparent", borderRadius: "50%", animation: "spin 1.2s linear infinite reverse" }} />
                </div>
                <div style={{ fontSize: 14, color: COLORS.textMuted, textAlign: "center", lineHeight: 1.8 }}>
                  AI가 수업 내용을 분석하여<br />보고서를 작성하고 있습니다...
                </div>
              </div>
            )}

            {report && !generating && (
              <div className="fade-in" style={{ background: COLORS.card, border: `1px solid ${COLORS.accent}40`, borderRadius: 14, padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
                {/* 헤더 */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.text, lineHeight: 1.3 }}>{report.title}</div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>
                      {report.date} · {report.class} · 출석 {report.attendCount}명
                      {report.absentCount > 0 && <span style={{ color: COLORS.red }}> / 결석 {report.absentCount}명</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={copyReport} className="btn-primary"
                      style={{ fontSize: 11, padding: "5px 12px", borderRadius: 7, background: copyDone ? COLORS.greenSoft : COLORS.cardBorder, color: copyDone ? COLORS.green : COLORS.textMuted, fontWeight: 600 }}>
                      {copyDone ? "✓ 복사됨" : "복사"}
                    </button>
                    <button onClick={saveReport} className="btn-primary"
                      style={{ fontSize: 11, padding: "5px 12px", borderRadius: 7, background: COLORS.accentSoft, color: COLORS.accent, fontWeight: 600 }}>
                      저장
                    </button>
                  </div>
                </div>

                {/* 수업 요약 */}
                <ReportSection icon="📋" title="수업 요약" color={COLORS.accent}>
                  <p style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.8 }}>{report.summary}</p>
                </ReportSection>

                {/* 주요 성과 */}
                <ReportSection icon="✅" title="주요 성과" color={COLORS.green}>
                  {report.achievements.map((a, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 6 }}>
                      <span style={{ color: COLORS.green, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{i + 1}</span>
                      <span style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.7 }}>{a}</span>
                    </div>
                  ))}
                </ReportSection>

                {/* 주의사항 */}
                <ReportSection icon="⚠️" title="주의사항 / 개선점" color={COLORS.yellow}>
                  {report.concerns.map((c, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 6 }}>
                      <span style={{ color: COLORS.yellow, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>•</span>
                      <span style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.7 }}>{c}</span>
                    </div>
                  ))}
                </ReportSection>

                {/* 다음 수업 */}
                <ReportSection icon="📅" title="다음 수업 계획" color="#A78BFA">
                  <p style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.8 }}>{report.nextPlan}</p>
                </ReportSection>

                {/* 학부모 메시지 */}
                <ReportSection icon="💬" title="학부모 전달 메시지" color={COLORS.red}>
                  <div style={{ background: COLORS.bg, borderRadius: 8, padding: "12px 14px", fontSize: 13, color: COLORS.text, lineHeight: 1.8, border: `1px solid ${COLORS.cardBorder}` }}>
                    {report.parentMessage}
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 6 }}>💡 문자 발송 메뉴에서 학부모에게 바로 발송할 수 있습니다</div>
                </ReportSection>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="fade-in">
          {savedReports.length === 0 ? (
            <div style={{ background: COLORS.card, border: `1px dashed ${COLORS.cardBorder}`, borderRadius: 14, padding: 48, textAlign: "center", color: COLORS.textDim }}>
              저장된 보고서가 없습니다
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {savedReports.map(r => (
                <div key={r.id} className="card-hover" style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14, padding: "20px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{r.title || `${r.class} 수업 보고서`}</div>
                      <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 3 }}>
                        {r.date} · {r.class} · {r.topic}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 5, background: COLORS.accentSoft, color: COLORS.accent }}>
                        출석 {r.attendCount ?? "—"}명
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.7 }}>{r.summary}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function ReportSection({ icon, title, color, children }) {
  return (
    <div style={{ background: COLORS.bg, borderRadius: 10, padding: "14px 16px", borderLeft: `3px solid ${color}` }}>
      <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
        <span>{icon}</span> {title}
      </div>
      {children}
    </div>
  );
}
