import { useState, useEffect, memo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { HeartRateCard } from '../components/HeartRateCard';
import { StepsCard } from '../components/StepsCard';
import { SleepQualityCard } from '../components/SleepQualityCard';
import { HydrationCard } from '../components/HydrationCard';
import { ChatPanel } from '../components/ChatPanel';
import { useNavigate } from 'react-router';
import '../styles/dashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const MemoSidebar = memo(Sidebar);

/* ── Assets ─────────────────────────────────────────────────────── */
const heartImg  = '/assets/Heart.png';
const stepsImg  = '/assets/steps.png';
const waterImg  = '/assets/water.png';
const moonImg   = '/assets/moon.png';
const streakImg = '/assets/streak.png';
const medalImg  = '/assets/medal.png';
const foodImg   = '/assets/food.png';
const clockImg  = '/assets/clock.png';
const healthImg = '/assets/health.png';

const QUICK_STATS = [
  { img: heartImg, label: 'Heart Rate', value: '76',    unit: 'bpm',   color: '#ef4444', glow: 'rgba(239,68,68,0.4)',   path: '/heart',     anim: 'heartPulse' },
  { img: stepsImg, label: 'Steps',      value: '7,400', unit: 'steps', color: '#22c55e', glow: 'rgba(34,197,94,0.4)',   path: '/steps',     anim: 'stepBounce' },
  { img: waterImg, label: 'Hydration',  value: '1.8',   unit: 'L',     color: '#38bdf8', glow: 'rgba(56,189,248,0.4)',  path: '/hydration', anim: 'waterTilt'  },
  { img: moonImg,  label: 'Sleep',      value: '7.2',   unit: 'hrs',   color: '#a78bfa', glow: 'rgba(167,139,250,0.4)', path: '/sleep',     anim: 'moonFloat'  },
  { img: foodImg,  label: 'Calories',   value: '1,850', unit: 'kcal',  color: '#f97316', glow: 'rgba(249,115,22,0.4)',  path: '/calories',  anim: 'foodBob'    },
  { img: clockImg, label: 'Active',     value: '74',    unit: 'min',   color: '#fbbf24', glow: 'rgba(251,191,36,0.4)',  path: '/steps',     anim: 'clockTick'  },
];

/* ── Window width hook ───────────────────────────────────────────── */
function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

export function Dashboard() {
  const navigate  = useNavigate();
  const width     = useWindowWidth();
  const isMobile  = width < 768;
  const isTablet  = width < 992;

  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [mounted, setMounted]     = useState(false);
  const [hour]                    = useState(new Date().getHours());

  useEffect(() => { setMounted(true); }, []);

  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  /* ── Responsive column values ───────────────────────────────── */
  const outerGrid  = isMobile || isTablet ? '1fr' : '1fr 320px';
  const chipCols   = isMobile ? 'repeat(3,1fr)' : 'repeat(6,1fr)';
  const metricCols = isMobile ? '1fr' : '1fr 1fr';
  const bottomCols = isMobile ? '1fr' : '1fr 1fr';

  const chatResponses = {
    sleep:     'Your average sleep is 6.8hrs. Try for 8hrs tonight.',
    steps:     "You've hit 7,400 steps today — almost at your 10k goal!",
    water:     "You're at 1.8L today. Time to hydrate!",
    hydration: "You're at 1.8L today. Time to hydrate!",
    heart:     'Your current BPM is 76, which is in the healthy resting range.',
    bpm:       'Your current BPM is 76, which is in the healthy resting range.',
  };

  const autoMessages = [
    { text: 'Reminder: Time to drink water! You are at 1.8L of your 2.5L goal.', delay: 10000 },
    { text: 'You are 2,600 steps from your daily goal. A 20-minute walk will close it!', delay: 20000 },
  ];

  /* ── Chart data ──────────────────────────────────────────────── */
  const weeklyData = {
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    datasets: [
      { label:'Steps',    data:[8200,6500,9100,7400,10200,5800,8900], borderColor:'rgba(34,197,94,1)',   backgroundColor:'rgba(34,197,94,0.08)',   fill:true, tension:0.4, pointBackgroundColor:'rgba(74,222,128,1)',   pointRadius:4 },
      { label:'Calories', data:[420,380,510,390,550,320,480],          borderColor:'rgba(249,115,22,1)', backgroundColor:'rgba(249,115,22,0.08)', fill:true, tension:0.4, pointBackgroundColor:'rgba(251,146,60,1)',   pointRadius:4 },
    ],
  };
  const dailyData = {
    labels: ['12am','4am','8am','12pm','4pm','8pm'],
    datasets: [
      { label:'Activity', data:[20,15,45,80,95,60], borderColor:'rgba(56,189,248,1)', backgroundColor:'rgba(56,189,248,0.08)', fill:true, tension:0.4, pointBackgroundColor:'rgba(125,211,252,1)', pointRadius:4 },
    ],
  };
  const monthlyData = {
    labels: ['Week 1','Week 2','Week 3','Week 4'],
    datasets: [
      { label:'Avg Steps',    data:[7500,8200,7800,8900], borderColor:'rgba(34,197,94,1)',   backgroundColor:'rgba(34,197,94,0.08)',   fill:true, tension:0.4, pointBackgroundColor:'rgba(74,222,128,1)',   pointRadius:4 },
      { label:'Avg Calories', data:[420,450,430,480],     borderColor:'rgba(249,115,22,1)', backgroundColor:'rgba(249,115,22,0.08)', fill:true, tension:0.4, pointBackgroundColor:'rgba(251,146,60,1)',   pointRadius:4 },
    ],
  };
  const getChartData = () => timeRange === 'daily' ? dailyData : timeRange === 'monthly' ? monthlyData : weeklyData;

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend:  { position:'top' as const, labels:{ color:'rgba(180,210,255,0.7)', font:{ size:12 }, padding:16 } },
      tooltip: { backgroundColor:'rgba(8,20,50,0.95)', titleColor:'#fff', bodyColor:'rgba(180,210,255,0.85)', borderColor:'rgba(100,180,255,0.2)', borderWidth:1 },
    },
    scales: {
      y: { grid:{ color:'rgba(255,255,255,0.05)' }, ticks:{ color:'rgba(180,210,255,0.5)' } },
      x: { grid:{ color:'rgba(255,255,255,0.05)' }, ticks:{ color:'rgba(180,210,255,0.5)' } },
    },
  };

  const card: React.CSSProperties = {
    background:    'rgba(8,20,50,0.75)',
    backdropFilter:'blur(20px)',
    border:        '1px solid rgba(100,180,255,0.12)',
    borderRadius:  '20px',
    transition:    'all 0.3s ease',
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp    { from{opacity:0;transform:translateY(22px);}  to{opacity:1;transform:translateY(0);} }
        @keyframes fadeIn    { from{opacity:0;}  to{opacity:1;} }
        @keyframes ringPulse { 0%{transform:scale(1);opacity:.6;} 100%{transform:scale(1.7);opacity:0;} }
        @keyframes heartPulse{ 0%,100%{transform:scale(1);}        50%{transform:scale(1.1);} }
        @keyframes stepBounce{ 0%,100%{transform:rotate(-5deg) translateY(0);} 50%{transform:rotate(5deg) translateY(-6px);} }
        @keyframes waterTilt { 0%,100%{transform:rotate(-4deg) translateY(0);} 50%{transform:rotate(4deg) translateY(-5px);} }
        @keyframes moonFloat { 0%,100%{transform:translateY(0) rotate(-5deg);}  50%{transform:translateY(-8px) rotate(3deg);} }
        @keyframes foodBob   { 0%,100%{transform:translateY(0) rotate(0deg);}   40%{transform:translateY(-6px) rotate(-1deg);} }
        @keyframes clockTick { 0%,100%{transform:rotate(-2deg);}  50%{transform:rotate(2deg);} }
        @keyframes medalSway { 0%,100%{transform:rotate(-4deg) translateY(0);}  50%{transform:rotate(4deg) translateY(-6px);} }
        @keyframes streakPop { 0%{transform:scale(0) rotate(-20deg);opacity:0;} 70%{transform:scale(1.1) rotate(4deg);opacity:1;} 100%{transform:scale(1) rotate(0deg);opacity:1;} }
        @keyframes healthSpin{ 0%,100%{transform:rotate(-5deg) scale(1);}       50%{transform:rotate(5deg) scale(1.05);} }
        @keyframes shimmer   { 0%{transform:translateX(-100%);}  100%{transform:translateX(200%);} }
        @keyframes barFill   { from{width:0%;} }
        .stat-chip { transition:all 0.3s cubic-bezier(.4,0,.2,1); cursor:pointer; }
        .stat-chip:hover { transform:translateY(-4px) scale(1.03) !important; }
        .range-btn:hover { background:rgba(100,180,255,0.15) !important; color:#e0f0ff !important; }
      `}</style>

      <div className="dashboard-page">
        <MemoSidebar />

        <div className="main-content" style={{ padding: 0, minWidth: 0 }}>
          <Header userName="User" />

          <div style={{
            padding: isMobile ? '16px' : '24px 28px',
            display: 'grid',
            gridTemplateColumns: outerGrid,
            gap: '22px',
            minHeight: 'calc(100vh - 73px)',
          }}>

            {/* ── MAIN COLUMN ─────────────────────────────────── */}
            <div style={{ display:'flex', flexDirection:'column', gap:'20px', minWidth:0 }}>

              {/* Welcome Banner */}
              <div style={{
                ...card,
                border:'1px solid rgba(100,180,255,0.18)',
                padding: isMobile ? '18px' : '24px 28px',
                display:'flex', alignItems:'center', justifyContent:'space-between',
                position:'relative', overflow:'hidden',
                animation: mounted ? 'fadeIn 0.5s ease' : 'none',
                boxShadow:'0 8px 40px rgba(0,60,180,0.15)',
              }}>
                <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', borderRadius:'20px' }}>
                  <div style={{ position:'absolute', top:0, left:0, width:'50%', height:'100%', background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.03),transparent)', animation:'shimmer 5s ease infinite' }} />
                </div>
                <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'200px', height:'200px', borderRadius:'50%', background:'rgba(56,189,248,0.05)', filter:'blur(50px)', pointerEvents:'none' }} />

                <div style={{ position:'relative', zIndex:1 }}>
                  <p style={{ color:'rgba(180,210,255,0.5)', fontSize:'12px', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', margin:'0 0 4px' }}>{greeting}</p>
                  <h1 style={{ color:'#e0f0ff', fontWeight:900, fontSize: isMobile ? '20px' : '26px', margin:'0 0 6px', letterSpacing:'-0.5px' }}>
                    Welcome back, <span style={{ background:'linear-gradient(135deg,#7dd3fc,#38bdf8,#818cf8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>User</span>
                  </h1>
                  <p style={{ color:'rgba(180,210,255,0.5)', fontSize:'13px', margin:0 }}>
                    You're doing great — 74% of daily goals completed.
                  </p>
                </div>

                {/* Icons — hidden on mobile to save space */}
                {!isMobile && (
                  <div style={{ display:'flex', gap:'16px', position:'relative', zIndex:1, flexShrink:0 }}>
                    <img src={healthImg} alt="Health" style={{ width:56, height:56, objectFit:'contain', animation:'healthSpin 4s ease-in-out infinite', filter:'drop-shadow(0 0 14px rgba(239,68,68,0.5))' }} />
                    <div style={{ position:'relative' }}>
                      <img src={streakImg} alt="Streak" style={{ width:56, height:56, objectFit:'contain', animation: mounted ? 'streakPop 0.6s cubic-bezier(.4,0,.2,1) 0.5s both' : 'none', filter:'drop-shadow(0 0 12px rgba(251,191,36,0.55))' }} />
                      <div style={{ position:'absolute', bottom:-2, right:-2, width:20, height:20, borderRadius:'50%', background:'linear-gradient(135deg,#fbbf24,#f59e0b)', border:'2px solid rgba(8,20,50,0.9)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 8px rgba(251,191,36,0.7)' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <p style={{ color:'#fbbf24', fontSize:'10px', fontWeight:700, textAlign:'center', margin:'4px 0 0' }}>5-day streak</p>
                    </div>
                    <img src={medalImg} alt="Medal" style={{ width:56, height:56, objectFit:'contain', animation:'medalSway 3.5s ease-in-out infinite', filter:'drop-shadow(0 0 12px rgba(251,191,36,0.5))' }} />
                  </div>
                )}
              </div>

              {/* Quick Stats chips */}
              <div style={{ display:'grid', gridTemplateColumns: chipCols, gap:'10px', animation: mounted ? 'fadeUp 0.5s ease 0.1s both' : 'none' }}>
                {QUICK_STATS.map((s, i) => (
                  <div key={s.label} className="stat-chip"
                    onClick={() => navigate(s.path)}
                    style={{
                      ...card,
                      border:`1px solid ${s.color}22`,
                      padding: isMobile ? '12px 6px' : '16px 10px',
                      display:'flex', flexDirection:'column', alignItems:'center', gap:'6px',
                      position:'relative', overflow:'hidden',
                    }}>
                    <div style={{ position:'absolute', bottom:'-12px', left:'50%', transform:'translateX(-50%)', width:'80px', height:'40px', background:s.color, opacity:0.05, filter:'blur(20px)', borderRadius:'50%', pointerEvents:'none' }} />
                    <img src={s.img} alt={s.label}
                      style={{ width: isMobile ? 36 : 44, height: isMobile ? 36 : 44, objectFit:'contain', animation:`${s.anim} ${s.label==='Heart Rate'?'1.8s':s.label==='Steps'?'2s':'3.5s'} ease-in-out infinite`, filter:`drop-shadow(0 0 8px ${s.glow})` }} />
                    <div style={{ textAlign:'center' }}>
                      <p style={{ color:'#fff', fontWeight:800, fontSize: isMobile ? '13px' : '16px', margin:0, lineHeight:1 }}>{s.value}</p>
                      <p style={{ color:s.color, fontWeight:600, fontSize:'9px', margin:'2px 0 0' }}>{s.unit}</p>
                      <p style={{ color:'rgba(180,210,255,0.4)', fontSize:'8px', fontWeight:500, margin:'1px 0 0', letterSpacing:'0.03em' }}>{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Metric Cards */}
              <div style={{ display:'grid', gridTemplateColumns: metricCols, gap:'16px', animation: mounted ? 'fadeUp 0.5s ease 0.2s both' : 'none' }}>
                <HeartRateCard />
                <StepsCard />
                <SleepQualityCard />
                <HydrationCard />
              </div>

              {/* Activity Trends Chart */}
              <div style={{ ...card, padding: isMobile ? '16px' : '24px', animation: mounted ? 'fadeUp 0.5s ease 0.3s both' : 'none' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', flexWrap:'wrap', gap:'10px' }}>
                  <div>
                    <p style={{ color:'rgba(180,210,255,0.45)', fontSize:'11px', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', margin:'0 0 2px' }}>Overview</p>
                    <h3 style={{ color:'#e0f0ff', fontWeight:700, fontSize:'16px', margin:0 }}>Activity Trends</h3>
                  </div>
                  <div style={{ display:'flex', gap:'6px' }}>
                    {(['daily','weekly','monthly'] as const).map(r => (
                      <button key={r} className="range-btn" onClick={() => setTimeRange(r)}
                        style={{ padding:'7px 12px', borderRadius:'10px', fontSize:'11px', fontWeight:600, cursor:'pointer', transition:'all .2s', background: timeRange===r ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.05)', border:`1px solid ${timeRange===r ? 'rgba(56,189,248,0.5)' : 'rgba(255,255,255,0.08)'}`, color: timeRange===r ? '#38bdf8' : 'rgba(180,210,255,0.45)' }}>
                        {r.charAt(0).toUpperCase()+r.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ height: isMobile ? '220px' : '300px' }}>
                  <Line options={chartOptions} data={getChartData()} />
                </div>
              </div>

              {/* Daily Goals + Today Summary */}
              <div style={{ display:'grid', gridTemplateColumns: bottomCols, gap:'16px', animation: mounted ? 'fadeUp 0.5s ease 0.38s both' : 'none' }}>

                {/* Daily Goals */}
                <div style={{ ...card, padding:'22px' }}>
                  <p style={{ color:'rgba(180,210,255,0.45)', fontSize:'11px', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', margin:'0 0 16px' }}>Daily Goals</p>
                  {[
                    { label:'Steps',     value:7400, max:10000, color:'#22c55e', img:stepsImg },
                    { label:'Hydration', value:1.8,  max:2.5,   color:'#38bdf8', img:waterImg },
                    { label:'Calories',  value:1850, max:2200,  color:'#f97316', img:foodImg  },
                    { label:'Sleep',     value:7.2,  max:8,     color:'#a78bfa', img:moonImg  },
                  ].map(g => {
                    const pct = Math.min((g.value/g.max)*100, 100);
                    return (
                      <div key={g.label} style={{ marginBottom:'14px' }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'6px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                            <img src={g.img} alt={g.label} style={{ width:20, height:20, objectFit:'contain', filter:`drop-shadow(0 0 4px ${g.color}60)` }} />
                            <span style={{ color:'rgba(180,210,255,0.7)', fontSize:'13px', fontWeight:500 }}>{g.label}</span>
                          </div>
                          <span style={{ color:g.color, fontSize:'12px', fontWeight:700 }}>{pct.toFixed(0)}%</span>
                        </div>
                        <div style={{ height:'6px', borderRadius:'3px', background:'rgba(255,255,255,0.06)' }}>
                          <div style={{ height:'100%', borderRadius:'3px', background:g.color, width:`${pct}%`, boxShadow:`0 0 8px ${g.color}60`, transition:'width 1s ease', animation:'barFill 1.2s ease' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Today's Summary */}
                <div style={{ ...card, padding:'22px' }}>
                  <p style={{ color:'rgba(180,210,255,0.45)', fontSize:'11px', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', margin:'0 0 16px' }}>Today's Summary</p>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                    {[
                      { label:'Resting HR',  value:'76',  unit:'bpm', color:'#ef4444', img:heartImg },
                      { label:'Distance',    value:'5.2', unit:'km',  color:'#22c55e', img:stepsImg },
                      { label:'Water Left',  value:'0.7', unit:'L',   color:'#38bdf8', img:waterImg },
                      { label:'Active Time', value:'74',  unit:'min', color:'#fbbf24', img:clockImg },
                    ].map(s => (
                      <div key={s.label} style={{ padding:'12px', background:'rgba(255,255,255,0.04)', borderRadius:'14px', border:`1px solid ${s.color}18` }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'6px' }}>
                          <img src={s.img} alt={s.label} style={{ width:18, height:18, objectFit:'contain', filter:`drop-shadow(0 0 5px ${s.color}60)` }} />
                          <span style={{ color:'rgba(180,210,255,0.45)', fontSize:'9px', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' }}>{s.label}</span>
                        </div>
                        <div style={{ display:'flex', alignItems:'baseline', gap:'3px' }}>
                          <span style={{ color:'#e0f0ff', fontWeight:800, fontSize:'18px', lineHeight:1 }}>{s.value}</span>
                          <span style={{ color:s.color, fontSize:'11px', fontWeight:600 }}>{s.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chat panel — shown inline on tablet/mobile, in grid on desktop */}
              {(isMobile || isTablet) && (
                <div style={{ animation: mounted ? 'fadeUp 0.5s ease 0.45s both' : 'none' }}>
                  <ChatPanel
                    title="Chat with Health AI"
                    moduleKey="dashboard"
                    responses={chatResponses}
                    autoMessages={autoMessages}
                  />
                </div>
              )}
            </div>

            {/* ── CHAT PANEL (desktop only) ───────────────────── */}
            {!isMobile && !isTablet && (
              <div style={{ animation: mounted ? 'fadeUp 0.5s ease 0.4s both' : 'none' }}>
                <ChatPanel
                  title="Chat with Health AI"
                  moduleKey="dashboard"
                  responses={chatResponses}
                  autoMessages={autoMessages}
                />
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
