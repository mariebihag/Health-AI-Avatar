import { useState, useEffect, memo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { ChatPanel } from '../components/ChatPanel';
import { Flame } from 'lucide-react';
import { toast } from 'sonner';
import { useResponsive } from '../hooks/useResponsive';
import '../styles/dashboard.css';

const foodImg   = '/assets/food.png';
const scaleImg  = '/assets/foodscale.png';
const streakImg = '/assets/streak.png';

const MemoSidebar = memo(Sidebar);

interface Meal { category: string; foodName: string; calories: number; time: string; }

const initialMeals: Meal[] = [
  { category: 'Breakfast', foodName: 'Oatmeal with banana & honey',        calories: 320, time: '7:15 AM' },
  { category: 'Breakfast', foodName: 'Black coffee',                       calories:   5, time: '7:20 AM' },
  { category: 'Lunch',     foodName: 'Grilled chicken breast with rice',   calories: 520, time: '12:30 PM' },
  { category: 'Lunch',     foodName: 'Caesar salad',                       calories: 180, time: '12:35 PM' },
  { category: 'Snack',     foodName: 'Greek yogurt with blueberries',      calories: 150, time: '3:00 PM' },
  { category: 'Snack',     foodName: 'Protein shake',                      calories: 180, time: '3:05 PM' },
  { category: 'Dinner',    foodName: 'Salmon fillet with steamed broccoli',calories: 480, time: '7:00 PM' },
  { category: 'Dinner',    foodName: 'Brown rice',                         calories: 215, time: '7:05 PM' },
];

export function CaloriesPage() {
  const [meals, setMeals]           = useState<Meal[]>(initialMeals);
  const [showModal, setShowModal]   = useState(false);
  const [mounted, setMounted]       = useState(false);
  const { isMobile, isTablet } = useResponsive();
  const [newMeal, setNewMeal] = useState({ category: 'Breakfast', foodName: '', calories: 0 });

  useEffect(() => { setMounted(true); }, []);

  const totalCals = meals.reduce((s, m) => s + m.calories, 0);
  const goal         = 2200;
  const pct          = Math.min((totalCals / goal) * 100, 100);

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const h = now.getHours();
    const time = `${h}:${String(now.getMinutes()).padStart(2,'0')} ${h>=12?'PM':'AM'}`;
    setMeals(prev => [...prev, { category: newMeal.category, foodName: newMeal.foodName, calories: newMeal.calories, time }]);
    toast.success(`${newMeal.foodName} logged!`);
    setShowModal(false);
    setNewMeal({ category: 'Breakfast', foodName: '', calories: 0 });
  };

  const chatResponses = {
    calories: `You've consumed ${totalCals} kcal of your ${goal} kcal goal today.`,
    meal:     `You've logged ${meals.length} meals today totaling ${totalCals} kcal.`,
  };

  /* ── Chart Data ─────────────────────────────────────────────── */
  const weeklyData = {
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    datasets: [{
      label: 'Calories',
      data: [1980, 2150, 2320, 1890, 2100, 2450, totalCals],
      backgroundColor: meals.map((_, i) => i === 6 ? 'rgba(249,115,22,0.9)' : 'rgba(249,115,22,0.4)'),
      borderRadius: 8,
    }],
  };

  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor:'rgba(8,20,50,0.95)', titleColor:'#fff', bodyColor:'rgba(180,210,255,0.85)' },
    },
    scales: {
      y: { grid: { color:'rgba(255,255,255,0.06)' }, ticks: { color:'rgba(180,210,255,0.5)' } },
      x: { grid: { color:'rgba(255,255,255,0.06)' }, ticks: { color:'rgba(180,210,255,0.5)' } },
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
    { label:'Total Calories', value: totalCals, unit:'kcal', color:'#f97316', icon:Flame, desc:`${goal} kcal goal` },
  ];

  return (
    <>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(22px);}  to{opacity:1;transform:translateY(0);} }
        @keyframes fadeIn   { from{opacity:0;} to{opacity:1;} }
        @keyframes ringPulse{ 0%{transform:scale(1);opacity:.6;} 100%{transform:scale(1.7);opacity:0;} }

        /* Food crate bobs gently */
        @keyframes foodBob {
          0%,100%{ transform:translateY(0) rotate(0deg); filter:drop-shadow(0 10px 24px rgba(0,0,0,0.45)); }
          40%    { transform:translateY(-8px) rotate(-1deg); filter:drop-shadow(0 18px 32px rgba(0,0,0,0.5)); }
          70%    { transform:translateY(-4px) rotate(0.8deg); }
        }
        /* Food scale sways */
        @keyframes scaleWobble {
          0%,100%{ transform:rotate(0deg) translateY(0); filter:drop-shadow(0 8px 20px rgba(0,0,0,0.4)); }
          30%    { transform:rotate(-1deg) translateY(-3px); filter:drop-shadow(0 12px 26px rgba(249,115,22,0.3)); }
          60%    { transform:rotate(0.8deg) translateY(-1px); }
        }
        /* Calorie fill bar */
        @keyframes barFill {
          from { width: 0%; }
        }

        .cal-card:hover  { transform:translateY(-3px) !important; box-shadow:0 12px 40px rgba(249,115,22,0.2) !important; }
        .organ-card:hover{ transform:translateY(-4px) scale(1.015) !important; }
        .add-meal-btn:hover { transform:translateY(-2px) !important; box-shadow:0 8px 24px rgba(249,115,22,0.45) !important; }
        @keyframes streakPop {
          0%  { transform:scale(0) rotate(-20deg); opacity:0; }
          70% { transform:scale(1.1) rotate(4deg); opacity:1; }
          100%{ transform:scale(1) rotate(0deg); opacity:1; }
        }

        .cal-input { width:100%; padding:11px 14px; background:rgba(255,255,255,0.07); border:1px solid rgba(100,180,255,0.25); border-radius:10px; color:#e0f0ff; font-size:14px; outline:none; box-sizing:border-box; transition:all .2s; }
        .cal-input:focus { border-color:rgba(249,115,22,0.6); background:rgba(255,255,255,0.11); box-shadow:0 0 0 3px rgba(249,115,22,0.12); }
        .cal-input::placeholder { color:rgba(180,210,255,0.35); }

        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(249,115,22,0.25); border-radius:10px; }
      `}</style>

      <div className="dashboard-page">
        <MemoSidebar />

        <div className="main-content" style={{ padding: 0 }}>
          <Header userName="User" />

          <div style={{ padding: isMobile ? '16px' : '24px 28px', display:'grid', gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 320px', gap:'22px', minHeight:'calc(100vh - 73px)' }}>

            {/* ── MAIN COLUMN ─────────────────────────────────── */}
            <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>

              {/* Page Header */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', animation: mounted ? 'fadeIn 0.4s ease' : 'none' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
                  <div style={{ position:'relative', width:52, height:52 }}>
                    <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'rgba(249,115,22,0.15)', animation:'ringPulse 2.2s ease-out infinite' }} />
                    <div style={{ position:'absolute', inset:'8px', borderRadius:'50%', background:'rgba(249,115,22,0.2)', animation:'ringPulse 2.2s ease-out infinite 0.5s' }} />
                    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Flame size={22} color="#f97316" />
                    </div>
                  </div>
                  <div>
                    <h1 style={{ color:'#e0f0ff', fontWeight:800, fontSize:'22px', margin:0, letterSpacing:'-0.3px' }}>Calorie Tracker</h1>
                    <p style={{ color:'rgba(180,210,255,0.5)', fontSize:'13px', margin:'2px 0 0' }}>Track your nutrition and daily intake</p>
                  </div>
                </div>
                <button
                  className="add-meal-btn"
                  onClick={() => setShowModal(true)}
                  style={{ background:'linear-gradient(135deg,#f97316,#ea580c)', border:'none', borderRadius:'12px', padding:'12px 22px', color:'#fff', fontWeight:700, fontSize:'13px', cursor:'pointer', boxShadow:'0 4px 18px rgba(249,115,22,0.35)', transition:'all .2s ease', letterSpacing:'0.02em' }}
                >
                  + Add Meal
                </button>
              </div>

              {/* Food Image Cards + Streak */}
              <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap:'16px', animation: mounted ? 'fadeUp 0.5s ease 0.1s both' : 'none' }}>

                {/* Food Crate Card */}
                <div style={{ ...card, border:'1px solid rgba(249,115,22,0.2)', display:'flex', flexDirection:'column', alignItems:'center', gap:'12px', padding:'28px 20px', position:'relative', overflow:'hidden' }} className="organ-card">
                  <div style={{ position:'absolute', bottom:'-24px', left:'50%', transform:'translateX(-50%)', width:'160px', height:'80px', background:'rgba(249,115,22,0.08)', filter:'blur(32px)', borderRadius:'50%', pointerEvents:'none' }} />
                  <img src={foodImg} alt="Food" style={{ width:150, height:150, objectFit:'contain', animation:'foodBob 4.5s ease-in-out infinite', filter:'drop-shadow(0 10px 24px rgba(0,0,0,0.45))' }} />
                  <div style={{ textAlign:'center' }}>
                    <p style={{ color:'#e0f0ff', fontWeight:700, fontSize:'15px', margin:'0 0 5px' }}>Today's Nutrition</p>
                    <div style={{ display:'flex', alignItems:'center', gap:'5px', justifyContent:'center' }}>
                      <div style={{ width:7, height:7, borderRadius:'50%', background:'#22c55e', boxShadow:'0 0 5px #22c55e' }} />
                      <span style={{ color:'#22c55e', fontSize:'12px', fontWeight:600 }}>{totalCals} kcal logged</span>
                    </div>
                    <p style={{ color:'rgba(180,210,255,0.4)', fontSize:'11px', margin:'4px 0 0' }}>{meals.length} items recorded</p>
                  </div>
                </div>

                {/* Scale Card */}
                <div style={{ ...card, border:'1px solid rgba(249,115,22,0.15)', display:'flex', flexDirection:'column', alignItems:'center', gap:'12px', padding:'28px 20px', position:'relative', overflow:'hidden' }} className="organ-card">
                  <div style={{ position:'absolute', bottom:'-24px', left:'50%', transform:'translateX(-50%)', width:'160px', height:'80px', background:'rgba(249,115,22,0.06)', filter:'blur(32px)', borderRadius:'50%', pointerEvents:'none' }} />
                  <img src={scaleImg} alt="Scale" style={{ width:150, height:150, objectFit:'contain', animation:'scaleWobble 5s ease-in-out infinite', filter:'drop-shadow(0 8px 20px rgba(0,0,0,0.4))' }} />
                  <div style={{ textAlign:'center' }}>
                    <p style={{ color:'#e0f0ff', fontWeight:700, fontSize:'15px', margin:'0 0 5px' }}>Calorie Balance</p>
                    <div style={{ display:'flex', alignItems:'center', gap:'5px', justifyContent:'center' }}>
                      <div style={{ width:7, height:7, borderRadius:'50%', background: totalCals <= goal ? '#22c55e' : '#ef4444', boxShadow:`0 0 5px ${totalCals <= goal ? '#22c55e' : '#ef4444'}` }} />
                      <span style={{ color: totalCals <= goal ? '#22c55e' : '#ef4444', fontSize:'12px', fontWeight:600 }}>
                        {goal - totalCals > 0 ? `${goal - totalCals} kcal remaining` : 'Goal reached'}
                      </span>
                    </div>
                    <p style={{ color:'rgba(180,210,255,0.4)', fontSize:'11px', margin:'4px 0 0' }}>Goal: {goal} kcal</p>
                  </div>
                </div>

                {/* Streak Card */}
                <div style={{ ...card, border:'1px solid rgba(251,191,36,0.25)', display:'flex', flexDirection:'column', alignItems:'center', gap:'14px', padding:'28px 20px', position:'relative', overflow:'hidden' }} className="organ-card">
                  <div style={{ position:'absolute', bottom:'-20px', left:'50%', transform:'translateX(-50%)', width:'160px', height:'80px', background:'rgba(251,191,36,0.08)', filter:'blur(32px)', borderRadius:'50%', pointerEvents:'none' }} />
                  <div style={{ position:'relative' }}>
                    <img src={streakImg} alt="Streak" style={{ width:130, height:130, objectFit:'contain', animation: mounted ? 'streakPop 0.6s cubic-bezier(.4,0,.2,1) 0.3s both' : 'none', filter:'drop-shadow(0 0 28px rgba(251,191,36,0.55))' }} />
                    <div style={{ position:'absolute', bottom:6, right:-2, width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#fbbf24,#f59e0b)', border:'3px solid rgba(8,20,50,0.9)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 14px rgba(251,191,36,0.7)', animation: mounted ? 'streakPop 0.6s ease 0.6s both' : 'none' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                  <div style={{ textAlign:'center' }}>
                    <p style={{ color:'#e0f0ff', fontWeight:700, fontSize:'15px', margin:'0 0 5px' }}>Logging Streak</p>
                    <div style={{ display:'flex', alignItems:'center', gap:'5px', justifyContent:'center' }}>
                      <div style={{ width:7, height:7, borderRadius:'50%', background:'#fbbf24', boxShadow:'0 0 5px #fbbf24' }} />
                      <span style={{ color:'#fbbf24', fontSize:'12px', fontWeight:600 }}>6 days in a row</span>
                    </div>
                    <p style={{ color:'rgba(180,210,255,0.4)', fontSize:'11px', margin:'4px 0 0' }}>Meals logged daily</p>
                  </div>
                </div>
              </div>

              {/* Metric Cards */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:'14px', animation: mounted ? 'fadeUp 0.5s ease 0.18s both' : 'none' }}>
                {metrics.map((m, i) => {
                  const Icon = m.icon;
                  const maxMap: Record<string,number> = { 'Total Calories': goal, Protein:120, Carbohydrates:250, Fat:65 };
                  const barW = Math.min((m.value / (maxMap[m.label] || 100)) * 100, 100);
                  return (
                    <div key={m.label} style={{ ...card, border:`1px solid ${m.color}22`, cursor:'default' }} className="cal-card">
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
                        <div style={{ height:'100%', borderRadius:'2px', background:m.color, width:`${barW}%`, boxShadow:`0 0 6px ${m.color}`, transition:'width 1s ease', animation:'barFill 1.2s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Daily Progress Banner */}
              <div style={{
                background:'linear-gradient(135deg,rgba(249,115,22,0.25),rgba(234,88,12,0.2))',
                backdropFilter:'blur(20px)', border:'1px solid rgba(249,115,22,0.3)',
                borderRadius:'18px', padding:'20px 24px',
                animation: mounted ? 'fadeUp 0.5s ease 0.25s both' : 'none',
                position:'relative', overflow:'hidden',
              }}>
                <div style={{ position:'absolute', top:'-30px', right:'-30px', width:'140px', height:'140px', borderRadius:'50%', background:'rgba(249,115,22,0.1)', filter:'blur(35px)', pointerEvents:'none' }} />
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
                  <div>
                    <p style={{ color:'rgba(180,210,255,0.5)', fontSize:'11px', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase' as const, margin:'0 0 2px' }}>Daily Progress</p>
                    <p style={{ color:'#e0f0ff', fontWeight:700, fontSize:'15px', margin:0 }}>
                      {totalCals} <span style={{ color:'rgba(180,210,255,0.4)', fontWeight:400 }}>/ {goal} kcal</span>
                    </p>
                  </div>
                  <span style={{ color:'#f97316', fontWeight:800, fontSize:'22px' }}>{Math.round(pct)}%</span>
                </div>
                {/* Progress bar */}
                <div style={{ height:'8px', borderRadius:'4px', background:'rgba(255,255,255,0.08)' }}>
                  <div style={{ height:'100%', borderRadius:'4px', background:'linear-gradient(90deg,#f97316,#fbbf24)', width:`${pct}%`, boxShadow:'0 0 10px rgba(249,115,22,0.5)', transition:'width 1.2s cubic-bezier(.4,0,.2,1)', animation:'barFill 1.2s ease' }} />
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:'8px' }}>
                  <span style={{ color:'rgba(180,210,255,0.4)', fontSize:'11px' }}>0 kcal</span>
                  <span style={{ color:'rgba(180,210,255,0.4)', fontSize:'11px' }}>{goal} kcal goal</span>
                </div>
              </div>

              {/* Meal Log */}
              <div style={{ ...card, animation: mounted ? 'fadeUp 0.5s ease 0.3s both' : 'none' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
                  <div>
                    <p style={{ color:'rgba(180,210,255,0.45)', fontSize:'11px', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase' as const, margin:'0 0 2px' }}>Today's Log</p>
                    <p style={{ color:'#e0f0ff', fontWeight:700, fontSize:'15px', margin:0 }}>Meal History</p>
                  </div>
                  <button onClick={() => setShowModal(true)} style={{ background:'rgba(249,115,22,0.15)', border:'1px solid rgba(249,115,22,0.3)', borderRadius:'10px', padding:'8px 14px', color:'#f97316', fontWeight:600, fontSize:'12px', cursor:'pointer', transition:'all .2s' }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(249,115,22,0.25)'}
                    onMouseLeave={e => e.currentTarget.style.background='rgba(249,115,22,0.15)'}>
                    + Add Meal
                  </button>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                  {meals.map((meal, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(100,180,255,0.08)', borderRadius:'12px', transition:'all .2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background='rgba(249,115,22,0.07)'; (e.currentTarget as HTMLDivElement).style.borderColor='rgba(249,115,22,0.2)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background='rgba(255,255,255,0.04)'; (e.currentTarget as HTMLDivElement).style.borderColor='rgba(100,180,255,0.08)'; }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                        <div style={{ width:36, height:36, borderRadius:'10px', background:'rgba(249,115,22,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          <Flame size={16} color="#f97316" />
                        </div>
                        <div>
                          <div style={{ display:'flex', alignItems:'center', gap:'7px', marginBottom:'2px' }}>
                            <span style={{ color:'#e0f0ff', fontWeight:600, fontSize:'14px' }}>{meal.foodName}</span>
                            <span style={{ background:'rgba(249,115,22,0.15)', border:'1px solid rgba(249,115,22,0.3)', borderRadius:'6px', padding:'1px 7px', color:'#f97316', fontSize:'10px', fontWeight:700 }}>{meal.category}</span>
                          </div>
                          <p style={{ color:'rgba(180,210,255,0.4)', fontSize:'11px', margin:0 }}>{meal.time}</p>
                        </div>
                      </div>
                      <span style={{ color:'#f97316', fontWeight:700, fontSize:'16px', flexShrink:0 }}>{meal.calories}<span style={{ color:'rgba(180,210,255,0.4)', fontSize:'11px', fontWeight:400 }}> kcal</span></span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div style={{ ...card, padding:'22px', animation: mounted ? 'fadeUp 0.5s ease 0.35s both' : 'none' }}>
                <p style={{ color:'rgba(180,210,255,0.45)', fontSize:'11px', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase' as const, margin:'0 0 2px' }}>Weekly</p>
                <p style={{ color:'#e0f0ff', fontWeight:700, fontSize:'15px', margin:'0 0 16px' }}>7-Day Calorie Intake</p>
                <div style={{ height:'200px' }}>
                  <Bar options={chartOpts} data={weeklyData} />
                </div>
              </div>
            </div>

            {/* ── CHAT COLUMN ─────────────────────────────────── */}
            <div style={{ animation: mounted ? 'fadeUp 0.5s ease 0.4s both' : 'none' }}>
              <ChatPanel
                title="Nutrition AI"
                avatar="/assets/Medical_Avatar_Logo.png"
                responses={chatResponses}
                defaultResponse="Your nutrition today looks on track. Keep logging your meals for accurate insights."
                autoMessages={[{ text: `You've consumed ${totalCals} kcal so far. Keep logging your meals for accurate insights.`, delay: 1500 }]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Add Meal Modal ────────────────────────────────────────── */}
      {showModal && (
        <div
          style={{ position:'fixed', inset:0, background:'rgba(0,5,20,0.75)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999, animation:'fadeIn .25s ease' }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{ background:'#0d1a38', border:'1px solid rgba(249,115,22,0.3)', borderRadius:'22px', padding:'36px', width:'100%', maxWidth:'480px', boxShadow:'0 20px 60px rgba(0,0,0,0.6)', animation:'fadeUp .3s ease', maxHeight:'90vh', overflowY:'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'28px' }}>
              <div style={{ width:40, height:40, borderRadius:'12px', background:'rgba(249,115,22,0.18)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Flame size={20} color="#f97316" />
              </div>
              <div>
                <h4 style={{ color:'#e0f0ff', fontWeight:800, fontSize:'18px', margin:0 }}>Add Meal</h4>
                <p style={{ color:'rgba(180,210,255,0.4)', fontSize:'12px', margin:0 }}>Log your food intake</p>
              </div>
            </div>

            <form onSubmit={handleAddMeal}>
              <div style={{ marginBottom:'14px' }}>
                <label style={{ display:'block', color:'rgba(180,210,255,0.8)', fontSize:'12px', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' as const, marginBottom:'6px' }}>Meal Type</label>
                <select
                  className="cal-input"
                  value={newMeal.category}
                  onChange={e => setNewMeal({ ...newMeal, category: e.target.value })}
                  style={{ cursor:'pointer' }}
                >
                  {['Breakfast','Lunch','Dinner','Snack','Pre-Workout','Post-Workout'].map(m => (
                    <option key={m} value={m} style={{ background:'#0d1a38' }}>{m}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom:'14px' }}>
                <label style={{ display:'block', color:'rgba(180,210,255,0.8)', fontSize:'12px', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' as const, marginBottom:'6px' }}>Food / Drink Name</label>
                <input
                  type="text"
                  className="cal-input"
                  placeholder="e.g. Grilled chicken, Protein shake, Coffee..."
                  value={newMeal.foodName}
                  onChange={e => setNewMeal({ ...newMeal, foodName: e.target.value })}
                  required
                />
              </div>

              <div style={{ marginBottom:'24px' }}>
                <label style={{ display:'block', color:'rgba(180,210,255,0.8)', fontSize:'12px', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' as const, marginBottom:'6px' }}>Calories</label>
                <input
                  type="number"
                  className="cal-input"
                  placeholder="e.g. 450"
                  value={newMeal.calories || ''}
                  onChange={e => setNewMeal({ ...newMeal, calories: Number(e.target.value) })}
                  required
                  min={1}
                />
              </div>

              <div style={{ display:'flex', gap:'10px' }}>
                <button type="submit" style={{ flex:1, padding:'13px', background:'linear-gradient(135deg,#f97316,#ea580c)', border:'none', borderRadius:'12px', color:'#fff', fontWeight:700, fontSize:'14px', cursor:'pointer', boxShadow:'0 4px 18px rgba(249,115,22,0.35)', transition:'all .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity='0.9'; e.currentTarget.style.transform='translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity='1'; e.currentTarget.style.transform='translateY(0)'; }}>
                  Save Meal
                </button>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex:1, padding:'13px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(100,180,255,0.2)', borderRadius:'12px', color:'rgba(180,210,255,0.8)', fontWeight:700, fontSize:'14px', cursor:'pointer', transition:'all .2s' }}
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