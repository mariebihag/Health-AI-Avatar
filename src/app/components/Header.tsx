import { useState, useEffect } from 'react';
const medicalLogo = '/assets/Medical_Avatar_Logo.png';

interface Notification {
  id: number;
  type: string;
  icon: string;
  title: string;
  msg: string;
  time: string;
  read: boolean;
}

interface HeaderProps {
  userName: string;
}

const NOTIFICATIONS: Notification[] = [
  { id: 1, type: 'water', icon: '💧', title: 'Hydration Reminder', msg: "Time to drink water! You're at 1.8L of your 2.5L goal.", time: '2 min ago', read: false },
  { id: 2, type: 'steps', icon: '👟', title: 'Step Goal Alert', msg: 'Only 2,600 steps left! Take a short walk to hit 10,000.', time: '15 min ago', read: false },
  { id: 3, type: 'heart', icon: '❤️', title: 'Heart Health Check', msg: 'Your resting heart rate is healthy at 76 BPM.', time: '1 hr ago', read: true },
  { id: 4, type: 'sleep', icon: '🌙', title: 'Sleep Reminder', msg: 'For 8hrs of sleep, aim to be in bed by 10:30 PM.', time: '3 hrs ago', read: true },
  { id: 5, type: 'calories', icon: '🔥', title: 'Calorie Milestone', msg: "Great job! You've consumed 1,850 of 2,200 kcal target.", time: '5 hrs ago', read: true },
];

export function Header({ userName }: HeaderProps) {
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [animate, setAnimate] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => { setAnimate(true); }, []);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <>
      <style>{`
        @keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bellRing { 0%,100%{transform:rotate(0)} 20%{transform:rotate(15deg)} 40%{transform:rotate(-15deg)} 60%{transform:rotate(10deg)} 80%{transform:rotate(-10deg)} }
        .header-animate { animation: slideDown 0.5s ease forwards; }
        .notif-panel { animation: slideDown 0.25s ease forwards; }
        .bell-unread { animation: bellRing 1s ease 0.5s; }
        .notif-item { transition: background 0.2s ease; cursor: pointer; }
        .notif-item:hover { background: rgba(255,255,255,0.05) !important; }
      `}</style>

      <div className={`header ${animate ? 'header-animate' : ''}`}>
        <div className="container-fluid px-4">
          <div className="d-flex justify-content-between align-items-center">

            <div className="d-flex align-items-center gap-2">
              <img
                src={medicalLogo}
                alt="Health AI Logo"
                style={{ width:'40px', height:'40px', borderRadius:'50%', border:'2px solid rgba(0,229,204,0.6)', objectFit:'cover', boxShadow:'0 0 12px rgba(0,229,204,0.3)' }}
              />
              <h3 className="logo-text-small mb-0">Health AI</h3>
            </div>

            <div className="d-flex align-items-center gap-3">
              <div style={{ position:'relative' }}>
                <button
                  onClick={() => setShowNotif(!showNotif)}
                  className={unreadCount > 0 ? 'bell-unread' : ''}
                  style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'10px', padding:'7px 10px', cursor:'pointer', fontSize:'18px', position:'relative', transition:'background 0.2s' }}
                >
                  🔔
                  {unreadCount > 0 && (
                    <span style={{ position:'absolute', top:'2px', right:'2px', background:'#ef4444', borderRadius:'50%', width:'16px', height:'16px', fontSize:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:'#fff' }}>
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotif && (
                  <div className="notif-panel" style={{ position:'absolute', top:'calc(100% + 10px)', right:0, width:'320px', background:'rgba(10,20,40,0.97)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'16px', padding:'16px', zIndex:9999, boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="text-white mb-0" style={{ fontSize:'14px', fontWeight:600 }}>🔔 Health Reminders</h6>
                      <button onClick={markAllRead} style={{ background:'none', border:'none', color:'#00e5cc', fontSize:'12px', cursor:'pointer' }}>Mark all read</button>
                    </div>
                    {notifications.map(n => (
                      <div key={n.id} className="notif-item" onClick={() => markRead(n.id)} style={{ background: n.read ? 'transparent' : 'rgba(0,229,204,0.06)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'10px', padding:'10px 12px', marginBottom:'8px' }}>
                        <div className="d-flex gap-2 align-items-start">
                          <span style={{ fontSize:'20px', flexShrink:0 }}>{n.icon}</span>
                          <div style={{ flex:1 }}>
                            <p style={{ margin:0, fontSize:'13px', fontWeight:600, color: n.read ? 'rgba(255,255,255,0.55)' : '#fff' }}>{n.title}</p>
                            <p style={{ margin:'2px 0 0', fontSize:'11px', color:'rgba(255,255,255,0.4)', lineHeight:'1.4' }}>{n.msg}</p>
                            <p style={{ margin:'4px 0 0', fontSize:'10px', color:'rgba(255,255,255,0.25)' }}>{n.time}</p>
                          </div>
                          {!n.read && <div style={{ width:8, height:8, borderRadius:'50%', background:'#00e5cc', flexShrink:0, marginTop:4 }} />}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-white mb-0" style={{ fontSize:'14px' }}>
                Welcome back, <span style={{ color:'#00e5cc', fontWeight:600 }}>{userName}</span>!
              </p>

              <img
                src="https://img.freepik.com/free-psd/3d-rendering-hair-style-avatar-design_23-2151869153.jpg?semt=ais_rp_progressive&w=740&q=80"
                alt="User Avatar"
                className="user-avatar"
                style={{ transition:'transform 0.2s', cursor:'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              />
            </div>
          </div>
        </div>
      </div>
      {showNotif && <div onClick={() => setShowNotif(false)} style={{ position:'fixed', inset:0, zIndex:9998 }} />}
    </>
  );
}