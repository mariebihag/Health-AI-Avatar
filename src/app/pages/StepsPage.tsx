import { useState, useEffect, memo } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Filler);
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { ChatPanel } from '../components/ChatPanel';
import { Footprints, MapPin, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { useResponsive } from '../hooks/useResponsive';
import '../styles/dashboard.css';

const stepsImg  = '/assets/steps.png';
const medalImg  = '/assets/medal.png';
const streakImg = '/assets/streak.png';

const MemoSidebar = memo(Sidebar);

export function StepsPage() {
  const [showLogModal, setShowLogModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isMobile, isTablet } = useResponsive();
  const [currentSteps, setCurrentSteps] = useState(7400);
  const [logData, setLogData] = useState({
    steps: '', activity: 'walking', duration: '', notes: '',
  });

  const goal       = 10000;
  const percentage = Math.min((currentSteps / goal) * 100, 100);
  const distance   = (currentSteps * 0.0007).toFixed(1);
  const remaining  = Math.max(goal - currentSteps, 0);
  const streak     = 5;
  const goalMet    = currentSteps >= goal;

  useEffect(() => { setMounted(true); }, []);

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentSteps(prev => prev + parseInt(logData.steps || '0'));
    toast.success('Steps logged!');
    setShowLogModal(false);
    setLogData({ steps:'', activity:'walking', duration:'', notes:'' });
  };

  const chatResponses = {
    steps:    `You've taken ${currentSteps.toLocaleString()} steps today — ${remaining.toLocaleString()} to go.`,
    walk:     `Walking is great! You're at ${currentSteps.toLocaleString()} steps — ${percentage.toFixed(0)}% of your goal.`,
    distance: `You've covered ${distance}km today.`,
    goal:     `Your daily step goal is ${goal.toLocaleString()}. You're ${percentage.toFixed(0)}% there.`,
  };

  const weeklyData = {
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    datasets: [{
      label: 'Steps',
      data: [8200,6500,9100,7400,10200,5800,currentSteps],
      backgroundColor: (ctx: any) => ctx.dataIndex === 6 ? 'rgba(34,197,94,0.9)' : 'rgba(34,197,94,0.35)',
      borderRadius: 8,
    }],
  };

  const hourlyData = {
    labels: ['6am','8am','10am','12pm','2pm','4pm','6pm','8pm'],
    datasets: [{
      label: 'Steps',
      data: [500,1200,900,1500,1100,800,1000,400],
      borderColor: 'rgba(34,197,94,1)',
      backgroundColor: 'rgba(34,197,94,0.1)',
      fill: true, tension: 0.4,
      pointBackgroundColor: 'rgba(74,222,128,1)',
      pointRadius: 4,
    }],
  };

  const chartOpts: any = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { labels:{ color:'rgba(180,210,255,0.7)', font:{ size:11 } } },
      tooltip: { backgroundColor:'rgba(8,20,50,0.95)', titleColor:'#fff', bodyColor:'rgba(180,210,255,0.85)' },
    },
    scales: {
      y: { grid:{ color:'rgba(255,255,255,0.06)' }, ticks:{ color:'rgba(180,210,255,0.5)' } },
      x: { grid:{ color:'rgba(255,255,255,0.06)' }, ticks:{ color:'rgba(180,210,255,0.5)' } },
    },
  };

  const card: React.CSSProperties = {
    background: 'rgba(8,20,50,0.75)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(100,180,255,0.12)',
    borderRadius: '18px',
    padding: '20px 22px',
    transition: 'all 0.3s ease',
  };

  const metrics = [
    { label:'Today\'s Steps', value: currentSteps.toLocaleString(), unit:'',    color:'#22c55e', icon:Footprints, desc:`${percentage.toFixed(0)}% of goal` },
    { label:'Distance',       value: distance,                       unit:'km',  color:'#3b82f6', icon:MapPin,    desc:'Total covered' },
    { label:'Active Minutes', value: '78',                           unit:'min', color:'#f59e0b', icon:Clock,     desc:'Movement time' },
    { label:'Remaining',      value: remaining.toLocaleString(),     unit:'',    color:'#a78bfa', icon:TrendingUp,desc:'Steps to goal' },
  ];

  const summaryStats = [
    { label:'Avg Daily',    value:'7,850',  color:'#e0f0ff' },
    { label:'Weekly Total', value:'54,900', color:'#e0f0ff' },
    { label:'Best Day',     value:'10,200', color:'#22c55e' },
    { label:'Streak',       value:`${streak} days`, color:'#fbbf24' },
  ];

  return (
    <>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(22px);} to{opacity:1;transform:translateY(0);} }
        @keyframes fadeIn   { from{opacity:0;} to{opacity:1;} }
        @keyframes ringPulse{ 0%{transform:scale(1);opacity:.6;} 100%{transform:scale(1.7);opacity:0;} }

        /* Shoe bounces like taking a step */
        @keyframes shoeStep {
          0%,100%{ transform:rotate(-5deg) translateY(0) translateX(0); filter:drop-shadow(0 10px 24px rgba(34,197,94,0.4)); }
          25%    { transform:rotate(0deg) translateY(-12px) translateX(6px); filter:drop-shadow(0 20px 30px rgba(34,197,94,0.55)); }
          50%    { transform:rotate(4deg) translateY(-6px) translateX(12px); filter:drop-shadow(0 14px 26px rgba(34,197,94,0.45)); }
          75%    { transform:rotate(0deg) translateY(-2px) translateX(6px); }
        }
        /* Medal sways */
        @keyframes medalSway {
          0%,100%{ transform:rotate(-4deg) translateY(0); filter:drop-shadow(0 0 28px rgba(251,191,36,0.5)); }
          50%    { transform:rotate(4deg) translateY(-6px); filter:drop-shadow(0 0 42px rgba(251,191,36,0.75)); }
        }
        /* Streak pop */
        @keyframes streakPop {
          0%  { transform:scale(0) rotate(-20deg); opacity:0; }
          70% { transform:scale(1.1) rotate(4deg); opacity:1; }
          100%{ transform:scale(1) rotate(0deg); opacity:1; }
        }
        /* Step bar fill */
        @keyframes barFill { from{ width:0%; } }
        /* Pulse step dot */
        @keyframes stepDot {
          0%,100%{ transform:scale(1); opacity:.5; }
          50%    { transform:scale(1.4); opacity:1; }
        }

        .step-card:hover  { transform:translateY(-3px) !important; box-shadow:0 12px 40px rgba(34,197,94,0.2) !important; }
        .organ-card:hover { transform:translateY(-4px) scale(1.015) !important; }
        .log-btn:hover    { transform:translateY(-2px) !important; box-shadow:0 8px 24px rgba(34,197,94,0.45) !important; }

        .step-input { width:100%; padding:11px 14px; background:rgba(255,255,255,0.07); border:1px solid rgba(100,180,255,0.25); border-radius:10px; color:#e0f0ff; font-size:14px; outline:none; box-sizing:border-box; transition:all .2s; }
        .step-input:focus { border-color:rgba(34,197,94,0.7); background:rgba(255,255,255,0.11); box-shadow:0 0 0 3px rgba(34,197,94,0.15); }
        .step-input::placeholder { color:rgba(180,210,255,0.35); }

        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(34,197,94,0.25); border-radius:10px; }
      `}</style>

      <div className="dashboard-page">
        <MemoSidebar />
        <div className="main-content" style={{ padding:0 }}>
          <Header userName="User" />

          <div style={{ padding: isMobile ? '16px' : '24px 28px', display:'grid', gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 320px', gap:'22px', minHeight:'calc(100vh - 73px)' }}>

            {/* ── MAIN COLUMN ─────────────────────────────────── */}
            <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>

              {/* Page Header */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', animation: mounted ? 'fadeIn 0.4s ease' : 'none' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
                  <div style={{ position:'relative', width:52, height:52 }}>
                    <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'rgba(34,197,94,0.15)', animation:'ringPulse 2.2s ease-out infinite' }} />
                    <div style={{ position:'absolute', inset:'8px', borderRadius:'50%', background:'rgba(34,197,94,0.2)', animation:'ringPulse 2.2s ease-out infinite 0.5s' }} />
                    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Footprints size={22} color="#4ade80" />
                    </div>
                  </div>
                  <div>
                    <h1 style={{ color:'#e0f0ff', fontWeight:800, fontSize:'22px', margin:0, letterSpacing:'-0.3px' }}>Steps Tracker</h1>
                    <p style={{ color:'rgba(180,210,255,0.5)', fontSize:'13px', margin:'2px 0 0' }}>Keep moving towards your daily goal</p>
                  </div>
                </div>
                <button className="log-btn" onClick={() => setShowLogModal(true)}
                  style={{ background:'linear-gradient(135deg,#22c55e,#16a34a)', border:'none', borderRadius:'12px', padding:'12px 22px', color:'#fff', fontWeight:700, fontSize:'13px', cursor:'pointer', boxShadow:'0 4px 18px rgba(34,197,94,0.35)', transition:'all .2s ease', letterSpacing:'0.02em' }}>
                  Log Steps
                </button>
              </div>

              {/* Hero: Shoe + Medal/Streak */}
              <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:'16px', animation: mounted ? 'fadeUp 0.5s ease 0.1s both' : 'none' }}>

                {/* Shoe Card */}
                <div style={{ ...card, border:'1px solid rgba(34,197,94,0.25)', display:'flex', flexDirection:'column', alignItems:'center', gap:'14px', padding:'28px 20px', position:'relative', overflow:'hidden' }} className="organ-card">
                  {/* step trail dots */}
                  {[{left:'10%',d:0},{left:'30%',d:0.3},{left:'50%',d:0.6},{left:'70%',d:0.9}].map((p,i) => (
                    <div key={i} style={{ position:'absolute', bottom:'18px', left:p.left, width:7, height:7, borderRadius:'50%', background:'rgba(74,222,128,0.5)', animation:'stepDot 1.5s ease-in-out infinite', animationDelay:`${p.d}s`, pointerEvents:'none' }} />
                  ))}
                  <div style={{ position:'absolute', bottom:'-20px', left:'50%', transform:'translateX(-50%)', width:'180px', height:'90px', background:'rgba(34,197,94,0.08)', filter:'blur(35px)', borderRadius:'50%', pointerEvents:'none' }} />
                  <img src={stepsImg} alt="Steps" style={{ width:160, height:160, objectFit:'contain', animation:'shoeStep 2s ease-in-out infinite', filter:'drop-shadow(0 10px 28px rgba(34,197,94,0.5))' }} />
                  <div style={{ textAlign:'center' }}>
                    <p style={{ color:'#e0f0ff', fontWeight:700, fontSize:'15px', margin:'0 0 5px' }}>Today's Steps</p>
                    <div style={{ display:'flex', alignItems:'center', gap:'5px', justifyContent:'center' }}>
                      <div style={{ width:7, height:7, borderRadius:'50%', background: goalMet ? '#22c55e' : '#4ade80', boxShadow:`0 0 5px ${goalMet ? '#22c55e' : '#4ade80'}` }} />
                      <span style={{ color: goalMet ? '#22c55e' : '#4ade80', fontSize:'12px', fontWeight:600 }}>{currentSteps.toLocaleString()} steps</span>
                    </div>
                    <p style={{ color:'rgba(180,210,255,0.4)', fontSize:'11px', margin:'4px 0 0' }}>{percentage.toFixed(0)}% of {goal.toLocaleString()}</p>
                  </div>
                </div>

                {/* Medal / Streak Card */}
                <div style={{ ...card, border:'1px solid rgba(251,191,36,0.25)', display:'flex', flexDirection:'column', alignItems:'center', gap:'14px', padding:'28px 20px', position:'relative', overflow:'hidden' }} className="organ-card">
                  <div style={{ position:'absolute', bottom:'-20px', left:'50%', transform:'translateX(-50%)', width:'180px', height:'90px', background:'rgba(251,191,36,0.08)', filter:'blur(35px)', borderRadius:'50%', pointerEvents:'none' }} />
                  <div style={{ position:'relative' }}>
                    <img src={goalMet ? medalImg : streakImg} alt={goalMet ? 'Medal' : 'Streak'} style={{ width:140, height:140, objectFit:'contain', animation: goalMet ? 'medalSway 3.5s ease-in-out infinite' : (mounted ? 'streakPop 0.6s cubic-bezier(.4,0,.2,1) 0.3s both' : 'none'), filter:`drop-shadow(0 0 28px rgba(251,191,36,${goalMet ? 0.6 : 0.4}))` }} />
                    {/* verified badge */}
                    <div style={{ position:'absolute', bottom:8, right:0, width:38, height:38, borderRadius:'50%', background:'linear-gradient(135deg,#fbbf24,#f59e0b)', border:'3px solid rgba(8,20,50,0.9)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 14px rgba(251,191,36,0.7)', animation: mounted ? 'streakPop 0.6s ease 0.6s both' : 'none' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                  <div style={{ textAlign:'center' }}>
                    <p style={{ color:'#e0f0ff', fontWeight:700, fontSize:'15px', margin:'0 0 5px' }}>{goalMet ? 'Goal Achieved!' : 'Activity Streak'}</p>
                    <div style={{ display:'flex', alignItems:'center', gap:'5px', justifyContent:'center' }}>
                      <div style={{ width:7, height:7, borderRadius:'50%', background:'#fbbf24', boxShadow:'0 0 5px #fbbf24' }} />
                      <span style={{ color:'#fbbf24', fontSize:'12px', fontWeight:600 }}>{streak} days in a row</span>
                    </div>
                    <p style={{ color:'rgba(180,210,255,0.4)', fontSize:'11px', margin:'4px 0 0' }}>{goalMet ? 'Daily goal complete' : `${remaining.toLocaleString()} steps remaining`}</p>
                  </div>
                </div>
              </div>

              {/* Metric Cards */}
              <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap:'14px', animation: mounted ? 'fadeUp 0.5s ease 0.18s both' : 'none' }}>
                {metrics.map((m) => {
                  const Icon = m.icon;
                  return (
                    <div key={m.label} style={{ ...card, border:`1px solid ${m.color}22`, cursor:'default' }} className="step-card">
                      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px' }}>
                        <div style={{ width:32, height:32, borderRadius:'9px', background:`${m.color}18`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 10px ${m.color}30` }}>
                          <Icon size={16} color={m.color} />
                        </div>
                        <span style={{ color:'rgba(180,210,255,0.5)', fontSize:'11px', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' as const }}>{m.label}</span>
                      </div>
                      <div style={{ display:'flex', alignItems:'baseline', gap:'4px', marginBottom:'4px' }}>
                        <span style={{ fontSize:'26px', fontWeight:900, color:'#fff', lineHeight:1 }}>{m.value}</span>
                        {m.unit && <span style={{ fontSize:'13px', color:m.color, fontWeight:600 }}>{m.unit}</span>}
                      </div>
                      <p style={{ color:'rgba(180,210,255,0.35)', fontSize:'11px', margin:0 }}>{m.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Progress Banner */}
              <div style={{
                background:'linear-gradient(135deg,rgba(34,197,94,0.2),rgba(16,163,74,0.15))',
                backdropFilter:'blur(20px)', border:'1px solid rgba(34,197,94,0.3)',
                borderRadius:'18px', padding:'22px 24px',
                animation: mounted ? 'fadeUp 0.5s ease 0.25s both' : 'none',
                position:'relative', overflow:'hidden',
              }}>
                <div style={{ position:'absolute', top:'-30px', right:'-20px', width:'140px', height:'140px', borderRadius:'50%', background:'rgba(34,197,94,0.1)', filter:'blur(35px)', pointerEvents:'none' }} />
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
                  <div>
                    <p style={{ color:'rgba(180,210,255,0.5)', fontSize:'11px', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase' as const, margin:'0 0 2px' }}>Daily Progress</p>
                    <p style={{ color:'#e0f0ff', fontWeight:700, fontSize:'15px', margin:0 }}>
                      {currentSteps.toLocaleString()} <span style={{ color:'rgba(180,210,255,0.4)', fontWeight:400 }}>/ {goal.toLocaleString()} steps</span>
                    </p>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <span style={{ color:'#4ade80', fontWeight:800, fontSize:'22px' }}>{percentage.toFixed(0)}%</span>
                    <p style={{ color:'rgba(180,210,255,0.4)', fontSize:'11px', margin:0 }}>{remaining.toLocaleString()} remaining</p>
                  </div>
                </div>
                <div style={{ height:'10px', borderRadius:'5px', background:'rgba(255,255,255,0.07)', overflow:'hidden', position:'relative' }}>
                  <div style={{ height:'100%', borderRadius:'5px', background:'linear-gradient(90deg,#22c55e,#4ade80,#86efac)', width:`${percentage}%`, boxShadow:'0 0 12px rgba(34,197,94,0.6)', transition:'width 1.5s cubic-bezier(.4,0,.2,1)', animation:'barFill 1.5s ease', position:'relative', overflow:'hidden' }}>
                    <div style={{ position:'absolute', top:0, left:0, right:0, bottom:0, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)', animation:'ripple 2s ease-in-out infinite' }} />
                  </div>
                </div>
              </div>

              {/* Activity Summary */}
              <div style={{ ...card, animation: mounted ? 'fadeUp 0.5s ease 0.3s both' : 'none' }}>
                <p style={{ color:'rgba(180,210,255,0.45)', fontSize:'11px', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase' as const, margin:'0 0 2px' }}>Summary</p>
                <p style={{ color:'#e0f0ff', fontWeight:700, fontSize:'15px', margin:'0 0 16px' }}>Activity Overview</p>
                <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap:'12px' }}>
                  {summaryStats.map(s => (
                    <div key={s.label} style={{ textAlign:'center', padding:'16px 12px', background:'rgba(255,255,255,0.04)', borderRadius:'12px', border:'1px solid rgba(100,180,255,0.08)', transition:'all .2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background='rgba(34,197,94,0.07)'; (e.currentTarget as HTMLDivElement).style.borderColor='rgba(34,197,94,0.2)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background='rgba(255,255,255,0.04)'; (e.currentTarget as HTMLDivElement).style.borderColor='rgba(100,180,255,0.08)'; }}>
                      <p style={{ color:'rgba(180,210,255,0.45)', fontSize:'10px', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase' as const, margin:'0 0 6px' }}>{s.label}</p>
                      <p style={{ color:s.color, fontWeight:800, fontSize:'18px', margin:0 }}>{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Charts */}
              <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:'16px', animation: mounted ? 'fadeUp 0.5s ease 0.35s both' : 'none' }}>
                <div style={card}>
                  <p style={{ color:'rgba(180,210,255,0.45)', fontSize:'11px', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase' as const, margin:'0 0 2px' }}>Weekly</p>
                  <p style={{ color:'#e0f0ff', fontWeight:700, fontSize:'15px', margin:'0 0 16px' }}>7-Day Steps</p>
                  <div style={{ height:'200px' }}>
                    <Bar options={chartOpts} data={weeklyData} />
                  </div>
                </div>
                <div style={card}>
                  <p style={{ color:'rgba(180,210,255,0.45)', fontSize:'11px', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase' as const, margin:'0 0 2px' }}>Distribution</p>
                  <p style={{ color:'#e0f0ff', fontWeight:700, fontSize:'15px', margin:'0 0 16px' }}>Hourly Steps</p>
                  <div style={{ height:'200px' }}>
                    <Line options={chartOpts} data={hourlyData} />
                  </div>
                </div>
              </div>
            </div>

            {/* ── CHAT ────────────────────────────────────────── */}
            <div style={{ animation: mounted ? 'fadeUp 0.5s ease 0.4s both' : 'none' }}>
              <ChatPanel
                title="Steps AI"
                avatar="/assets/Medical_Avatar_Logo.png"
                responses={chatResponses}
                defaultResponse="Keep moving! Every step counts towards your health goals."
                autoMessages={[{ text: `You've taken ${currentSteps.toLocaleString()} steps today — ${percentage.toFixed(0)}% of your ${goal.toLocaleString()} step goal.`, delay: 1500 }]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Log Steps Modal ──────────────────────────────────────── */}
      {showLogModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,5,20,0.75)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999, animation:'fadeIn .25s ease' }} onClick={() => setShowLogModal(false)}>
          <div style={{ background:'#0d1a38', border:'1px solid rgba(34,197,94,0.3)', borderRadius:'22px', padding:'36px', width:'100%', maxWidth:'460px', boxShadow:'0 20px 60px rgba(0,0,0,0.6)', animation:'fadeUp .3s ease', maxHeight:'90vh', overflowY:'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'28px' }}>
              <div style={{ width:40, height:40, borderRadius:'12px', background:'rgba(34,197,94,0.18)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Footprints size={20} color="#4ade80" />
              </div>
              <div>
                <h4 style={{ color:'#e0f0ff', fontWeight:800, fontSize:'18px', margin:0 }}>Log Steps</h4>
                <p style={{ color:'rgba(180,210,255,0.4)', fontSize:'12px', margin:0 }}>Record your activity</p>
              </div>
            </div>
            <form onSubmit={handleLogSubmit}>
              <div style={{ marginBottom:'16px' }}>
                <label style={{ display:'block', color:'rgba(180,210,255,0.8)', fontSize:'12px', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' as const, marginBottom:'6px' }}>Step Count</label>
                <input type="number" className="step-input" placeholder="e.g. 2000" value={logData.steps} onChange={e => setLogData({...logData, steps: e.target.value})} required />
              </div>
              {/* Quick add */}
              <div style={{ display:'flex', gap:'8px', marginBottom:'16px', flexWrap:'wrap' }}>
                {[500,1000,2000,3000,5000].map(n => (
                  <button key={n} type="button" onClick={() => setLogData({...logData, steps: String(n)})}
                    style={{ padding:'7px 12px', background: logData.steps === String(n) ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.05)', border: logData.steps === String(n) ? '1px solid rgba(34,197,94,0.5)' : '1px solid rgba(100,180,255,0.15)', borderRadius:'8px', color: logData.steps === String(n) ? '#4ade80' : 'rgba(180,210,255,0.5)', fontSize:'12px', fontWeight:600, cursor:'pointer', transition:'all .15s' }}>
                    +{n.toLocaleString()}
                  </button>
                ))}
              </div>
              <div style={{ marginBottom:'16px' }}>
                <label style={{ display:'block', color:'rgba(180,210,255,0.8)', fontSize:'12px', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' as const, marginBottom:'6px' }}>Activity Type</label>
                <select className="step-input" value={logData.activity} onChange={e => setLogData({...logData, activity: e.target.value})} style={{ width:'100%', padding:'11px 14px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(100,180,255,0.25)', borderRadius:'10px', color:'#e0f0ff', fontSize:'14px', outline:'none' }}>
                  {['Walking','Running','Jogging','Hiking','Other'].map(a => <option key={a} value={a.toLowerCase()} style={{ background:'#0d1a38' }}>{a}</option>)}
                </select>
              </div>
              <div style={{ marginBottom:'16px' }}>
                <label style={{ display:'block', color:'rgba(180,210,255,0.8)', fontSize:'12px', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' as const, marginBottom:'6px' }}>Duration (minutes)</label>
                <input type="number" className="step-input" placeholder="e.g. 30" value={logData.duration} onChange={e => setLogData({...logData, duration: e.target.value})} required />
              </div>
              <div style={{ marginBottom:'24px' }}>
                <label style={{ display:'block', color:'rgba(180,210,255,0.8)', fontSize:'12px', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' as const, marginBottom:'6px' }}>Notes (optional)</label>
                <input type="text" className="step-input" placeholder="e.g. Morning walk in the park" value={logData.notes} onChange={e => setLogData({...logData, notes: e.target.value})} />
              </div>
              <div style={{ display:'flex', gap:'10px' }}>
                <button type="submit" style={{ flex:1, padding:'13px', background:'linear-gradient(135deg,#22c55e,#16a34a)', border:'none', borderRadius:'12px', color:'#fff', fontWeight:700, fontSize:'14px', cursor:'pointer', boxShadow:'0 4px 18px rgba(34,197,94,0.35)', transition:'all .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity='0.9'; e.currentTarget.style.transform='translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity='1'; e.currentTarget.style.transform='translateY(0)'; }}>
                  Save Steps
                </button>
                <button type="button" onClick={() => setShowLogModal(false)} style={{ flex:1, padding:'13px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(100,180,255,0.2)', borderRadius:'12px', color:'rgba(180,210,255,0.8)', fontWeight:700, fontSize:'14px', cursor:'pointer', transition:'all .2s' }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.12)'}
                  onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.07)'}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}