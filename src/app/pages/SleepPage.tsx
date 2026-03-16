import { useState, useEffect, memo } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { ChatPanel } from '../components/ChatPanel';
import { useResponsive } from '../hooks/useResponsive';
import { Clock, TrendingUp, Star, Moon } from 'lucide-react';
import { toast } from 'sonner';
import '../styles/dashboard.css';

const bedImg    = '/assets/bed.png';
const moonImg   = '/assets/moon.png';
const streakImg = '/assets/streak.png';

const MemoSidebar = memo(Sidebar);

export function SleepPage() {
  const [showLogModal, setShowLogModal] = useState(false);
  const [mounted, setMounted]           = useState(false);
  const { isMobile, isTablet } = useResponsive();
  const [logData, setLogData] = useState({
    hours: '', bedtime: '', waketime: '', quality: '5',
  });

  useEffect(() => { setMounted(true); }, []);

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Sleep data logged successfully!');
    setShowLogModal(false);
    setLogData({ hours: '', bedtime: '', waketime: '', quality: '5' });
  };

  const chatResponses = {
    sleep:   'Your average is 7.2 hours with a quality score of 78/100.',
    quality: 'Sleep quality score is 78/100 — above average. Keep your bedtime consistent.',
    deep:    'You spent 1.8 hours in deep sleep last night — within the healthy 20–25% range.',
    rem:     'REM sleep was 19% last night, supporting memory and mood.',
  };

  /* ── Chart data ─────────────────────────────────────────────── */
  const sleepDurationData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Hours',
      data: [7.2, 6.5, 8.0, 7.5, 6.8, 8.5, 7.8],
      backgroundColor: 'rgba(139,92,246,0.75)',
      borderRadius: 8,
    }],
  };

  const sleepStagesData = {
    labels: ['Deep Sleep', 'Light Sleep', 'REM', 'Awake'],
    datasets: [{
      data: [25, 45, 25, 5],
      backgroundColor: [
        'rgba(99,102,241,0.85)',
        'rgba(139,92,246,0.85)',
        'rgba(168,85,247,0.85)',
        'rgba(192,132,252,0.3)',
      ],
      borderWidth: 0,
    }],
  };

  const bedtimeData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Bedtime (PM)',
      data: [10.5, 11, 10.3, 10.8, 11.5, 12, 11.2],
      borderColor: 'rgba(139,92,246,1)',
      backgroundColor: 'rgba(139,92,246,0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: 'rgba(168,85,247,1)',
      pointRadius: 4,
    }],
  };

  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: 'rgba(220,220,255,0.7)', font: { size: 11 } } },
      tooltip: { backgroundColor: 'rgba(8,20,50,0.95)', titleColor: '#fff', bodyColor: 'rgba(180,210,255,0.85)' },
    },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: 'rgba(180,210,255,0.5)' } },
      x: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: 'rgba(180,210,255,0.5)' } },
    },
  };

  const doughnutOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const, labels: { color: 'rgba(180,210,255,0.7)', font: { size: 11 }, padding: 14 } },
      tooltip: { backgroundColor: 'rgba(8,20,50,0.95)', titleColor: '#fff', bodyColor: 'rgba(180,210,255,0.85)' },
    },
    cutout: '68%',
  };

  /* ── Metric cards config ─────────────────────────────────────── */
  const metrics = [
    { label: 'Avg Duration', value: '7.2', unit: 'hrs',  color: '#8b5cf6', icon: Moon,       desc: 'Nightly average' },
    { label: 'Quality Score', value: '78',  unit: '/100', color: '#a78bfa', icon: TrendingUp, desc: 'Above average' },
    { label: 'Avg Bedtime',   value: '10:45', unit: 'PM', color: '#38bdf8', icon: Clock,      desc: 'Consistent schedule' },
    { label: 'Deep Sleep',    value: '1.8', unit: 'hrs',  color: '#f59e0b', icon: Star,       desc: '25% of total sleep' },
  ];

  const card: React.CSSProperties = {
    background: 'rgba(8,20,50,0.75)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(100,180,255,0.12)',
    borderRadius: '18px',
    padding: '20px 22px',
    transition: 'all 0.3s ease',
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp   { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
        @keyframes ringPulse { 0%{ transform:scale(1); opacity:.6; } 100%{ transform:scale(1.7); opacity:0; } }

        /* Moon floats gently */
        @keyframes moonFloat {
          0%,100% { transform: translateY(0) rotate(-5deg); filter: drop-shadow(0 0 22px rgba(250,204,21,0.5)); }
          50%      { transform: translateY(-10px) rotate(2deg); filter: drop-shadow(0 0 38px rgba(250,204,21,0.8)); }
        }
        /* Bed rocks slightly, like settling in */
        @keyframes bedSettle {
          0%,100% { transform: rotate(0deg) translateY(0); filter: drop-shadow(0 8px 20px rgba(0,0,0,0.4)); }
          30%     { transform: rotate(-1.5deg) translateY(-4px); filter: drop-shadow(0 12px 28px rgba(0,0,0,0.5)); }
          60%     { transform: rotate(1deg) translateY(-2px); }
        }
        /* Stars twinkle */
        @keyframes twinkle {
          0%,100% { opacity:.2; transform:scale(1); }
          50%      { opacity:.9; transform:scale(1.3); }
        }
        /* Quality ring fill on mount */
        @keyframes ringFill {
          from { stroke-dashoffset: 283; }
        }

        .sleep-card:hover { transform: translateY(-3px) !important; box-shadow: 0 12px 40px rgba(80,0,200,0.25) !important; }
        .organ-card:hover { transform: translateY(-4px) scale(1.015) !important; }
        .log-btn:hover    { transform: translateY(-2px) !important; box-shadow: 0 8px 24px rgba(139,92,246,0.45) !important; }
        @keyframes streakPop {
          0%  { transform:scale(0) rotate(-20deg); opacity:0; }
          70% { transform:scale(1.1) rotate(4deg); opacity:1; }
          100%{ transform:scale(1) rotate(0deg); opacity:1; }
        }

        /* Modal input overrides */
        .sleep-input {
          width:100%; padding:11px 14px;
          background:rgba(255,255,255,0.07);
          border:1px solid rgba(100,180,255,0.25);
          border-radius:10px; color:#e0f0ff; font-size:14px; outline:none;
          box-sizing:border-box; transition:all .2s;
        }
        .sleep-input:focus { border-color:rgba(139,92,246,0.7); background:rgba(255,255,255,0.11); box-shadow:0 0 0 3px rgba(139,92,246,0.15); }
        .sleep-input::placeholder { color:rgba(180,210,255,0.35); }
        /* range track */
        .sleep-range { width:100%; accent-color:#8b5cf6; }

        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(139,92,246,0.3); border-radius:10px; }
      `}</style>

      <div className="dashboard-page">
        <MemoSidebar />

        <div className="main-content" style={{ padding: 0 }}>
          <Header userName="User" />

          <div style={{ padding: isMobile ? '16px' : '24px 28px', display: 'grid', gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 320px', gap: '22px', minHeight: 'calc(100vh - 73px)' }}>

            {/* ── MAIN COLUMN ─────────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Page Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: mounted ? 'fadeIn 0.4s ease' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ position: 'relative', width: 52, height: 52 }}>
                    <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'rgba(139,92,246,0.15)', animation:'ringPulse 2.2s ease-out infinite' }} />
                    <div style={{ position:'absolute', inset:'8px', borderRadius:'50%', background:'rgba(139,92,246,0.2)', animation:'ringPulse 2.2s ease-out infinite 0.5s' }} />
                    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Moon size={22} color="#a78bfa" />
                    </div>
                  </div>
                  <div>
                    <h1 style={{ color:'#e0f0ff', fontWeight:800, fontSize:'22px', margin:0, letterSpacing:'-0.3px' }}>Sleep Tracker</h1>
                    <p style={{ color:'rgba(180,210,255,0.5)', fontSize:'13px', margin:'2px 0 0' }}>Monitor your sleep quality and patterns</p>
                  </div>
                </div>
                <button
                  className="log-btn"
                  onClick={() => setShowLogModal(true)}
                  style={{
                    background:'linear-gradient(135deg,#8b5cf6,#6366f1)',
                    border:'none', borderRadius:'12px', padding:'12px 22px',
                    color:'#fff', fontWeight:700, fontSize:'13px', cursor:'pointer',
                    boxShadow:'0 4px 18px rgba(139,92,246,0.35)', transition:'all .2s ease',
                    letterSpacing:'0.02em',
                  }}
                >
                  Log Sleep
                </button>
              </div>

              {/* Organ Cards — Moon, Bed & Streak */}
              <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap:'16px', animation: mounted ? 'fadeUp 0.5s ease 0.1s both' : 'none' }}>

                {/* Moon Card */}
                <div style={{ ...card, border:'1px solid rgba(250,204,21,0.2)', display:'flex', flexDirection:'column', alignItems:'center', gap:'12px', padding:'28px 20px', position:'relative', overflow:'hidden' }} className="organ-card">
                  {/* twinkling stars */}
                  {[{top:'12%',left:'8%',d:.7},{top:'18%',right:'12%',d:1.1},{top:'8%',right:'30%',d:1.8},{top:'30%',left:'20%',d:2.3}].map((s,i)=>(
                    <div key={i} style={{ position:'absolute', top:s.top, left:(s as any).left, right:(s as any).right, width:4, height:4, borderRadius:'50%', background:'#fde68a', animation:`twinkle ${1.4+i*0.5}s ease-in-out infinite`, animationDelay:`${s.d}s` }} />
                  ))}
                  <div style={{ position:'absolute', bottom:'-24px', left:'50%', transform:'translateX(-50%)', width:'160px', height:'80px', background:'rgba(250,204,21,0.08)', filter:'blur(32px)', borderRadius:'50%', pointerEvents:'none' }} />
                  <img src={moonImg} alt="Moon" style={{ width:150, height:150, objectFit:'contain', animation:'moonFloat 4s ease-in-out infinite', filter:'drop-shadow(0 0 28px rgba(250,204,21,0.55))' }} />
                  <div style={{ textAlign:'center' }}>
                    <p style={{ color:'#e0f0ff', fontWeight:700, fontSize:'15px', margin:'0 0 5px' }}>Sleep Quality</p>
                    <div style={{ display:'flex', alignItems:'center', gap:'5px', justifyContent:'center' }}>
                      <div style={{ width:7, height:7, borderRadius:'50%', background:'#22c55e', boxShadow:'0 0 5px #22c55e' }} />
                      <span style={{ color:'#22c55e', fontSize:'12px', fontWeight:600 }}>78 / 100</span>
                    </div>
                    <p style={{ color:'rgba(180,210,255,0.4)', fontSize:'11px', margin:'4px 0 0' }}>Above average</p>
                  </div>
                </div>

                {/* Bed Card */}
                <div style={{ ...card, border:'1px solid rgba(196,130,89,0.25)', display:'flex', flexDirection:'column', alignItems:'center', gap:'12px', padding:'28px 20px', position:'relative', overflow:'hidden' }} className="organ-card">
                  <div style={{ position:'absolute', bottom:'-24px', left:'50%', transform:'translateX(-50%)', width:'160px', height:'80px', background:'rgba(196,130,89,0.08)', filter:'blur(32px)', borderRadius:'50%', pointerEvents:'none' }} />
                  <img src={bedImg} alt="Bed" style={{ width:150, height:150, objectFit:'contain', animation:'bedSettle 5s ease-in-out infinite', filter:'drop-shadow(0 8px 20px rgba(0,0,0,0.4))' }} />
                  <div style={{ textAlign:'center' }}>
                    <p style={{ color:'#e0f0ff', fontWeight:700, fontSize:'15px', margin:'0 0 5px' }}>Rest Duration</p>
                    <div style={{ display:'flex', alignItems:'center', gap:'5px', justifyContent:'center' }}>
                      <div style={{ width:7, height:7, borderRadius:'50%', background:'#22c55e', boxShadow:'0 0 5px #22c55e' }} />
                      <span style={{ color:'#22c55e', fontSize:'12px', fontWeight:600 }}>7.2 hrs avg</span>
                    </div>
                    <p style={{ color:'rgba(180,210,255,0.4)', fontSize:'11px', margin:'4px 0 0' }}>Bedtime 10:45 PM</p>
                  </div>
                </div>

                {/* Sleep Streak Card */}
                <div style={{ ...card, border:'1px solid rgba(251,191,36,0.25)', display:'flex', flexDirection:'column', alignItems:'center', gap:'12px', padding:'24px 16px', position:'relative', overflow:'hidden' }} className="organ-card">
                  <div style={{ position:'absolute', bottom:'-20px', left:'50%', transform:'translateX(-50%)', width:'140px', height:'70px', background:'rgba(251,191,36,0.08)', filter:'blur(30px)', borderRadius:'50%', pointerEvents:'none' }} />
                  <div style={{ position:'relative' }}>
                    <img src={streakImg} alt="Streak" style={{ width:120, height:120, objectFit:'contain', animation: mounted ? 'streakPop 0.6s cubic-bezier(.4,0,.2,1) 0.4s both' : 'none', filter:'drop-shadow(0 0 24px rgba(251,191,36,0.55))' }} />
                    {/* Verified badge */}
                    <div style={{ position:'absolute', bottom:4, right:-4, width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#fbbf24,#f59e0b)', border:'3px solid rgba(8,20,50,0.9)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 12px rgba(251,191,36,0.7)', animation: mounted ? 'streakPop 0.6s ease 0.7s both' : 'none' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                  <div style={{ textAlign:'center' }}>
                    <p style={{ color:'#e0f0ff', fontWeight:700, fontSize:'14px', margin:'0 0 5px' }}>Sleep Streak</p>
                    <div style={{ display:'flex', alignItems:'center', gap:'5px', justifyContent:'center' }}>
                      <div style={{ width:7, height:7, borderRadius:'50%', background:'#fbbf24', boxShadow:'0 0 5px #fbbf24' }} />
                      <span style={{ color:'#fbbf24', fontSize:'12px', fontWeight:600 }}>6 nights</span>
                    </div>
                    <p style={{ color:'rgba(180,210,255,0.4)', fontSize:'11px', margin:'4px 0 0' }}>7+ hrs each night</p>
                  </div>
                </div>
              </div>

              {/* Metric Cards */}
              <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap:'14px', animation: mounted ? 'fadeUp 0.5s ease 0.18s both' : 'none' }}>
                {metrics.map((m, i) => {
                  const Icon = m.icon;
                  return (
                    <div key={m.label} style={{ ...card, border:`1px solid ${m.color}22`, animationDelay:`${i*0.07}s`, cursor:'default' }} className="sleep-card">
                      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px' }}>
                        <div style={{ width:32, height:32, borderRadius:'9px', background:`${m.color}18`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 10px ${m.color}30` }}>
                          <Icon size={16} color={m.color} />
                        </div>
                        <span style={{ color:'rgba(180,210,255,0.5)', fontSize:'11px', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' as const }}>{m.label}</span>
                      </div>
                      <div style={{ display:'flex', alignItems:'baseline', gap:'4px', marginBottom:'4px' }}>
                        <span style={{ fontSize:'28px', fontWeight:900, color:'#fff', lineHeight:1 }}>{m.value}</span>
                        <span style={{ fontSize:'13px', color:m.color, fontWeight:600 }}>{m.unit}</span>
                      </div>
                      <p style={{ color:'rgba(180,210,255,0.35)', fontSize:'11px', margin:0 }}>{m.desc}</p>
                      <div style={{ marginTop:'10px', height:'3px', borderRadius:'2px', background:'rgba(255,255,255,0.06)' }}>
                        <div style={{ height:'100%', borderRadius:'2px', background:m.color, width: m.label === 'Quality Score' ? '78%' : m.label === 'Avg Duration' ? '90%' : m.label === 'Deep Sleep' ? '60%' : '85%', boxShadow:`0 0 6px ${m.color}`, transition:'width 1s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sleep Reminder Banner */}
              <div style={{
                background:'linear-gradient(135deg,rgba(139,92,246,0.3),rgba(99,102,241,0.3))',
                backdropFilter:'blur(20px)', border:'1px solid rgba(139,92,246,0.35)',
                borderRadius:'18px', padding:'18px 24px',
                display:'flex', alignItems:'center', justifyContent:'space-between',
                animation: mounted ? 'fadeUp 0.5s ease 0.25s both' : 'none',
                position:'relative', overflow:'hidden',
              }}>
                <div style={{ position:'absolute', top:'-30px', left:'-30px', width:'120px', height:'120px', borderRadius:'50%', background:'rgba(139,92,246,0.12)', filter:'blur(30px)', pointerEvents:'none' }} />
                <div>
                  <p style={{ color:'rgba(180,210,255,0.5)', fontSize:'11px', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase' as const, margin:'0 0 2px' }}>Tonight's Target</p>
                  <p style={{ color:'#e0f0ff', fontWeight:700, fontSize:'15px', margin:0 }}>Aim for 8 hours — keep a consistent bedtime for better sleep quality</p>
                </div>
                <div style={{ display:'flex', gap:'16px', flexShrink:0, marginLeft:'20px' }}>
                  <div style={{ textAlign:'center' }}>
                    <p style={{ color:'#a78bfa', fontWeight:800, fontSize:'20px', margin:0 }}>22:30</p>
                    <p style={{ color:'rgba(180,210,255,0.4)', fontSize:'11px', margin:0 }}>Bedtime</p>
                  </div>
                  <div style={{ width:'1px', background:'rgba(180,210,255,0.1)' }} />
                  <div style={{ textAlign:'center' }}>
                    <p style={{ color:'#38bdf8', fontWeight:800, fontSize:'20px', margin:0 }}>06:30</p>
                    <p style={{ color:'rgba(180,210,255,0.4)', fontSize:'11px', margin:0 }}>Wake time</p>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:'16px', animation: mounted ? 'fadeUp 0.5s ease 0.3s both' : 'none' }}>
                <div style={card}>
                  <p style={{ color:'rgba(180,210,255,0.45)', fontSize:'11px', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase' as const, margin:'0 0 2px' }}>Weekly Trend</p>
                  <p style={{ color:'#e0f0ff', fontWeight:700, fontSize:'15px', margin:'0 0 16px' }}>7-Day Sleep Duration</p>
                  <div style={{ height:'200px' }}>
                    <Bar options={chartOpts} data={sleepDurationData} />
                  </div>
                </div>
                <div style={card}>
                  <p style={{ color:'rgba(180,210,255,0.45)', fontSize:'11px', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase' as const, margin:'0 0 2px' }}>Breakdown</p>
                  <p style={{ color:'#e0f0ff', fontWeight:700, fontSize:'15px', margin:'0 0 16px' }}>Sleep Stages</p>
                  <div style={{ height:'200px' }}>
                    <Doughnut options={doughnutOpts} data={sleepStagesData} />
                  </div>
                </div>
              </div>

              {/* Bedtime Consistency */}
              <div style={{ ...card, animation: mounted ? 'fadeUp 0.5s ease 0.35s both' : 'none' }}>
                <p style={{ color:'rgba(180,210,255,0.45)', fontSize:'11px', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase' as const, margin:'0 0 2px' }}>Consistency</p>
                <p style={{ color:'#e0f0ff', fontWeight:700, fontSize:'15px', margin:'0 0 16px' }}>Bedtime Tracker</p>
                <div style={{ height:'160px' }}>
                  <Line options={chartOpts} data={bedtimeData} />
                </div>
              </div>
            </div>

            {/* ── CHAT COLUMN ─────────────────────────────────── */}
            <div style={{ animation: mounted ? 'fadeUp 0.5s ease 0.4s both' : 'none' }}>
              <ChatPanel
                title="Sleep AI"
                moduleKey="sleep"
                responses={chatResponses}
                defaultResponse="Your sleep metrics look healthy. Consistency is key to better rest."
                autoMessages={[{ text: 'Average sleep is 7.2 hours with a quality score of 78/100. Try aiming for 8 hours tonight.', delay: 1500 }]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Log Sleep Modal ──────────────────────────────────────── */}
      {showLogModal && (
        <div
          style={{ position:'fixed', inset:0, background:'rgba(0,5,20,0.7)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999, animation:'fadeIn .25s ease' }}
          onClick={() => setShowLogModal(false)}
        >
          <div
            style={{ background:'#0d1a38', border:'1px solid rgba(139,92,246,0.3)', borderRadius:'22px', padding:'36px', width:'100%', maxWidth:'460px', boxShadow:'0 20px 60px rgba(0,0,0,0.6)', animation:'fadeUp .3s ease' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'28px' }}>
              <div style={{ width:40, height:40, borderRadius:'12px', background:'rgba(139,92,246,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Moon size={20} color="#a78bfa" />
              </div>
              <div>
                <h4 style={{ color:'#e0f0ff', fontWeight:800, fontSize:'18px', margin:0 }}>Log Sleep</h4>
                <p style={{ color:'rgba(180,210,255,0.4)', fontSize:'12px', margin:0 }}>Record tonight's rest</p>
              </div>
            </div>

            <form onSubmit={handleLogSubmit}>
              {[
                { label:'Hours Slept', key:'hours', type:'number', placeholder:'e.g. 7.5', step:'0.1' },
                { label:'Bedtime',     key:'bedtime',  type:'time', placeholder:'' },
                { label:'Wake Time',   key:'waketime', type:'time', placeholder:'' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom:'16px' }}>
                  <label style={{ display:'block', color:'rgba(180,210,255,0.8)', fontSize:'12px', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' as const, marginBottom:'6px' }}>{f.label}</label>
                  <input
                    type={f.type}
                    step={(f as any).step}
                    className="sleep-input"
                    value={logData[f.key as keyof typeof logData]}
                    onChange={e => setLogData({...logData, [f.key]: e.target.value})}
                    required
                    placeholder={f.placeholder}
                  />
                </div>
              ))}

              <div style={{ marginBottom:'24px' }}>
                <label style={{ display:'block', color:'rgba(180,210,255,0.8)', fontSize:'12px', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' as const, marginBottom:'6px' }}>
                  Quality Rating — <span style={{ color:'#a78bfa' }}>{logData.quality} / 10</span>
                </label>
                <input type="range" className="sleep-range" min="1" max="10" value={logData.quality} onChange={e => setLogData({...logData, quality: e.target.value})} />
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:'4px' }}>
                  <span style={{ color:'rgba(180,210,255,0.3)', fontSize:'10px' }}>Poor</span>
                  <span style={{ color:'rgba(180,210,255,0.3)', fontSize:'10px' }}>Excellent</span>
                </div>
              </div>

              <div style={{ display:'flex', gap:'10px' }}>
                <button
                  type="submit"
                  style={{ flex:1, padding:'13px', background:'linear-gradient(135deg,#8b5cf6,#6366f1)', border:'none', borderRadius:'12px', color:'#fff', fontWeight:700, fontSize:'14px', cursor:'pointer', boxShadow:'0 4px 18px rgba(139,92,246,0.35)', transition:'all .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity='0.9'; e.currentTarget.style.transform='translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity='1'; e.currentTarget.style.transform='translateY(0)'; }}
                >
                  Save Sleep Log
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  style={{ flex:1, padding:'13px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(100,180,255,0.2)', borderRadius:'12px', color:'rgba(180,210,255,0.8)', fontWeight:700, fontSize:'14px', cursor:'pointer', transition:'all .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; }}
                >
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
