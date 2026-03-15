import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
const medicalLogo = '/assets/Medical_Avatar_Logo.png';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatPanelProps {
  title: string;
  avatar: string;
  responses: Record<string, string>;
  defaultResponse?: string;
  autoMessages?: { text: string; delay: number }[];
}

// ─── COMPREHENSIVE HEALTH RESPONSES ───────────────────────────
const healthResponses: Record<string, string> = {
  'heart rate': "Your current heart rate is 76 BPM — that's a healthy resting range! ❤️ Aim to keep it between 60–100 BPM at rest.",
  'heart': "Your heart is doing great! Resting BPM is 76, HRV is 65ms, and recovery score is 78%. Keep staying active! ❤️",
  'bpm': "Your BPM is currently 76 — perfectly healthy! During workouts, aim for 120–150 BPM for cardio benefits. 💓",
  'pulse': "Your pulse is 76 BPM — normal resting range of 60–100 BPM. Great job! ❤️",
  'hrv': "Your Heart Rate Variability (HRV) is 65ms — a good sign of recovery and low stress! 💚",
  'palpitation': "Occasional palpitations can happen with caffeine or stress. If they're frequent, consult your doctor. Your current BPM looks normal at 76. ❤️",
  'cardio': "Great for cardio zone training: aim for 50–70% of your max heart rate (220 minus your age). Your current resting HR is 76 BPM. 💓",
  'sleep': "Your average sleep is 7.2hrs with a quality score of 78/100. Try to aim for 8hrs tonight for optimal recovery! 🌙",
  'tired': "Feeling tired? Your sleep last night was 7hrs. Try going to bed 30 minutes earlier tonight. 😴",
  'rest': "Your resting metrics look healthy! Sleep quality is 78/100 and recovery is strong. 💤",
  'insomnia': "If you're having trouble sleeping, try limiting screen time 1hr before bed and keep a consistent bedtime. 🌙",
  'bedtime': "Your most consistent bedtime is 11pm. Keeping a regular schedule improves deep sleep quality! 🌙",
  'deep sleep': "You spent about 22% of your sleep in deep sleep last night — within the healthy 20–25% range! 💤",
  'rem': "Your REM sleep was 19% last night, supporting memory and mood. Keep your sleep schedule consistent! 🧠",
  'nap': "Short naps (10–20 min) can boost alertness without disrupting night sleep. Avoid napping after 3pm! 😴",
  'snore': "Snoring can disrupt sleep quality. Consider a sleep tracking device to monitor it. Your sleep score is 78/100. 😴",
  'water': "You've had 1.8L today — only 0.7L more to hit your 2.5L goal! Drink a glass now 💧",
  'hydration': "You're 72% to your hydration goal today (1.8L / 2.5L). Try drinking a glass every 1.5 hours! 💧",
  'drink': "Time to hydrate! You've had 1.8L so far — your goal is 2.5L. You've got this! 💧",
  'thirsty': "Your body is signaling it needs water! You're at 1.8L today. Drink up! 💧",
  'dehydrated': "Signs of dehydration include fatigue and headaches. You're at 72% of your water goal — drink a glass now! 💦",
  'electrolyte': "Electrolytes are key for hydration. If you've been sweating a lot, consider a sports drink or banana! 💧",
  'calories': "You've consumed 1,850 kcal today against a 2,200 goal. You're in a healthy deficit! 🔥",
  'calorie': "Your calorie intake is on track at 1,850 / 2,200 kcal. Protein is slightly low — try adding a snack! 💪",
  'food': "You've logged 3 meals today totaling 1,850 kcal. Dinner is your biggest meal at 740 kcal. 🍽️",
  'eat': "Based on your activity level, aim for 2,200 kcal today. You've consumed 1,850 so far — on track! 🥗",
  'diet': "Your macro breakdown: 98g protein, 210g carbs, 65g fat. Try to increase protein by 22g! 💪",
  'nutrition': "Your nutrition today: 1,850 kcal consumed, 98g protein, 210g carbs, 65g fat. Protein is a bit low! 🥗",
  'meal': "You've logged breakfast (380 kcal), lunch (520 kcal), snack (210 kcal), and dinner (740 kcal) today. 🍽️",
  'protein': "Your protein intake is 98g today. For your activity level, aim for 120g. Try adding eggs or chicken! 🥩",
  'macro': "Macros today — Protein: 98g, Carbs: 210g, Fat: 65g. Carbs and fat are on target; boost protein slightly! 💪",
  'sugar': "Watch your sugar intake! Aim to keep added sugars under 50g/day. Focus on whole foods. 🍎",
  'fat': "Healthy fats (avocado, nuts, olive oil) are essential! Your fat intake of 65g is on track. 🥑",
  'carb': "Your carb intake of 210g is within healthy range. Focus on complex carbs like oats and sweet potato. 🌾",
  'steps': "You've taken 7,400 steps today — only 2,600 more to hit your 10k goal! A 20-min walk will do it! 👟",
  'walk': "Walking is great for you! You're at 7,400 steps. Try a short evening walk to reach 10,000! 🚶",
  'walking': "You've walked approximately 5.2km today (7,400 steps). Keep going — you're 74% to your goal! 🚶",
  'exercise': "You've had 74 active minutes today and burned ~296 calories from movement. Great work! 💪",
  'active': "Your activity score is solid — 7,400 steps, 74 active minutes, 5.2km covered today! 🏃",
  'activity': "Today's activity: 7,400 steps, 5.2km distance, 74 active minutes, 12 floors climbed. Keep it up! 💪",
  'run': "Running is great cardio! Your heart rate during exercise peaks at ~145 BPM — that's the cardio zone! 🏃",
  'running': "You burned approximately 400 kcal during your last run session. Love that energy! 🏃‍♀️",
  'gym': "Gym sessions push your heart rate into cardio and peak zones. Your recovery score is 78% — great! 💪",
  'workout': "Your last workout pushed your BPM to 95 — solid cardio zone effort! Recovery score is 78%. 💪",
  'fitness': "Your fitness metrics: 7,400 steps, 76 BPM resting HR, 78% recovery, 78/100 sleep quality. Looking strong! 💪",
  'stretch': "Stretching after workouts improves flexibility and reduces soreness. Try 10 minutes of light stretching! 🧘",
  'yoga': "Yoga is excellent for both physical and mental health! It can lower your resting heart rate over time. 🧘",
  'stress': "Your stress level is 4.2/10 based on HRV data. Try 5 minutes of deep breathing to bring it down! 🧘",
  'anxious': "Try box breathing: inhale 4 sec, hold 4, exhale 4, hold 4. Repeat 4 times. Works great! 🧘",
  'anxiety': "Your HRV suggests moderate stress today. A short meditation or walk can help reset your nervous system! 🌿",
  'overwhelmed': "Take a breath! Your body metrics suggest moderate stress. Try stepping away for a 5-minute walk. 🌿",
  'mood': "Based on your sleep and activity data, your energy should be moderate today. Stay hydrated for better mood! 😊",
  'feeling': "Your health data suggests you're in good shape today! Sleep 78/100, HR healthy, steps on track. 🌟",
  'energy': "Your energy correlates with your 7.2hrs sleep and 1,850 kcal intake. You should be feeling good! ⚡",
  'sad': "I'm here for you! Your health stats are looking solid. Sometimes low mood links to dehydration — drink up! 💧",
  'happy': "That's wonderful! 🌟 Your health metrics confirm it — healthy HR, decent sleep, and calories on track!",
  'mental': "Mental health is just as important as physical! Your HRV of 65ms suggests good stress resilience today. 🧠",
  'meditate': "Let's meditate! Close your eyes, breathe in for 4 counts, hold 4, out for 6. Repeat 5 times. 🧘",
  'meditation': "Starting a quick meditation. Focus on your breath — inhale slowly through your nose, exhale through your mouth. 🧘",
  'calm': "To calm down: try 4-7-8 breathing. Inhale 4 sec, hold 7 sec, exhale 8 sec. Very effective! 🌿",
  'relax': "Your HRV improves with slow breathing. Try 5 minutes of deep breathing before bed tonight! 😌",
  'breathe': "Breathing exercise: Inhale 4 → Hold 4 → Exhale 4 → Hold 4. Repeat 4 cycles! 🌬️",
  'breathing': "Deep breathing activates the parasympathetic nervous system, lowering heart rate. Try it for 5 minutes! 🌬️",
  'weight': "I don't have weight data yet, but your calorie balance (1,850 consumed vs ~2,200 burned) suggests a healthy deficit! ⚖️",
  'bmi': "Based on your activity data, your health metrics suggest you're in a healthy range. Log your weight for BMI tracking! 📊",
  'body': "Your body is performing well today! Resting HR 76, sleep 7.2hrs, 7,400 steps. Keep it up! 💪",
  'muscle': "Muscle building requires protein! Your intake of 98g is slightly low — aim for 120g. Keep strength training! 💪",
  'recovery': "Your recovery score is 78% — excellent! Your body handled yesterday's activity well. 💪",
  'sore': "Muscle soreness is normal after activity! Recovery score is 78% — you're bouncing back well. 🧘",
  'sick': "If you're feeling unwell, rest is the best medicine! Monitor your HR — it can be elevated when sick. 🌡️",
  'summary': "📊 Today's Summary:\n❤️ HR: 76 BPM (Healthy)\n👟 Steps: 7,400 / 10,000\n💧 Water: 1.8L / 2.5L\n🔥 Calories: 1,850 / 2,200\n🌙 Sleep: 7.2hrs (78/100)\n\nFocus on steps and hydration to close your goals! 💪",
  'overview': "📊 Health Overview:\n✅ Heart: Healthy (76 BPM)\n⚠️ Steps: 74% to goal\n⚠️ Water: 72% to goal\n✅ Sleep: Good quality\n✅ Calories: On track\n\nTop priority: Drink more water and take a short walk! 💧🚶",
  'how am i': "You're doing well overall! ✅ Heart rate is healthy, sleep quality is 78/100, and calories are on track. Focus on steps and hydration today! 💪",
  'health': "Your health today looks solid! Resting HR 76 BPM, sleep 7.2hrs, 7,400 steps, 1.8L water, 1,850 kcal. Keep pushing! 🌟",
  'recommend': "My recommendations for today:\n1. 💧 Drink 2 more glasses of water\n2. 🚶 Take a 20-min walk for your steps goal\n3. 🥩 Add a protein-rich snack\n4. 🌙 Aim to sleep by 10:30pm tonight!",
  'advice': "Health advice for today:\n💧 You need 0.7L more water\n🚶 2,600 more steps to hit 10k\n🥩 Boost protein by 22g\n😴 Sleep 30 min earlier for better recovery!",
  'what should i do': "Here's your action plan:\n1. 💧 Drink a glass of water RIGHT NOW\n2. 🚶 Go for a 20-min walk after your next meal\n3. 🥗 Have a high-protein snack\n4. 📵 No screens 1hr before bed for better sleep!",
  'goal': "Your goals today:\n👟 Steps: 7,400/10,000 (74%)\n💧 Water: 1.8L/2.5L (72%)\n🔥 Calories: 1,850/2,200 (84%)\n🌙 Sleep: 7.2/8hrs\n\nSo close — you've got this! 💪",
  'progress': "Great progress! You're 74% to your step goal, 72% to hydration, 84% to calorie goal, and slept 90% of your target. Keep going! 🌟",
  'hello': "Hello! 👋 I'm your Health AI. Today you have 7,400 steps, 1.8L water, and a healthy heart rate of 76 BPM. What would you like to know?",
  'hi': "Hi there! 😊 Your health stats are looking good today. Ask me about steps, sleep, calories, heart rate, or hydration!",
  'hey': "Hey! 👋 Ready to check your health? You're doing well today. Ask me about any of your metrics!",
  'good morning': "Good morning! ☀️ Start your day right — drink a glass of water and aim for 8,000 steps today!",
  'good night': "Good night! 🌙 Aim for 7-8 hours of sleep. Try to avoid screens for the last hour. Sweet dreams!",
  'thanks': "You're welcome! 😊 Small consistent steps lead to big health improvements. You've got this! 🌟",
  'thank you': "Happy to help! 🌟 Keep tracking your health — consistency is key to long-term wellness!",
  'how many calories': "You've consumed 1,850 kcal out of your 2,200 kcal daily goal. That's 84% — nicely on track! 🔥",
  'how much water': "You've had 1.8L today out of your 2.5L goal. Only 0.7L to go! 💧",
  'how many steps': "You've taken 7,400 steps today — 74% of your 10,000 step goal. A 20-min walk will close it! 👟",
  'how much sleep': "Your last tracked sleep was 7.2hrs, scoring 78/100. Aim for 8hrs tonight! 🌙",
  'what is my': "Based on your health data: HR 76 BPM ❤️, Steps 7,400 👟, Water 1.8L 💧, Calories 1,850 kcal 🔥, Sleep 7.2hrs 🌙",
  'vitamin': "Vitamins D and B12 are commonly deficient. Sunlight exposure and a balanced diet can help. Consider testing if you're often tired! 🌞",
  'supplement': "Common beneficial supplements: Vitamin D, Omega-3, Magnesium, and Protein. Always consult your doctor first! 💊",
};

export function ChatPanel({
  title,
  avatar,
  responses,
  defaultResponse = "Keep it up! You're doing great today. 🌟",
  autoMessages = [],
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi! I'm your Health AI assistant. Ask me anything about your health! 😊", sender: 'ai', timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isAvatarTalking, setIsAvatarTalking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setIsAvatarTalking(true);
    setTimeout(() => setIsAvatarTalking(false), 2500);
  }, []);

  useEffect(() => {
    autoMessages.forEach(({ text, delay }) => {
      setTimeout(() => triggerAIMessage(text), delay);
    });
  }, []);

  const triggerAIMessage = (text: string) => {
    setIsAvatarTalking(true);
    setTimeout(() => setIsAvatarTalking(false), 2500);
    setMessages(prev => [...prev, { id: Date.now(), text, sender: 'ai', timestamp: new Date() }]);
  };

  const getResponse = (userInput: string): string => {
    const lower = userInput.toLowerCase();
    for (const [key, value] of Object.entries(healthResponses)) {
      if (lower.includes(key.toLowerCase())) return value;
    }
    for (const [key, value] of Object.entries(responses)) {
      if (lower.includes(key.toLowerCase())) return value;
    }
    return defaultResponse;
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage: Message = { id: Date.now(), text: input, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setTimeout(() => triggerAIMessage(getResponse(input)), 500);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      <style>{`
        @keyframes pingRing { 0%{transform:scale(1);opacity:.8} 100%{transform:scale(1.5);opacity:0} }
        @keyframes msgSlide { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .msg-bubble { animation: msgSlide 0.25s ease forwards; }
        .chat-input-blue::placeholder { color: rgba(180,210,255,0.45); }
        .chat-input-blue:focus { 
          border-color: rgba(56,189,248,0.6) !important; 
          background: rgba(255,255,255,0.1) !important;
          box-shadow: 0 0 0 3px rgba(56,189,248,0.12);
          outline: none;
        }
        .suggest-btn:hover { 
          background: rgba(56,189,248,0.15) !important; 
          color: #7dd3fc !important;
          border-color: rgba(56,189,248,0.4) !important;
        }
      `}</style>

      {/* Chat Panel */}
      <div style={{
        background: 'rgba(8, 20, 50, 0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(100, 180, 255, 0.2)',
        borderRadius: '20px',
        boxShadow: '0 8px 48px rgba(0, 60, 180, 0.3), 0 2px 8px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column' as const,
        height: 'calc(100vh - 140px)',
        maxHeight: '800px',
        position: 'sticky' as const,
        top: '100px',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '20px',
          borderBottom: '1px solid rgba(100, 180, 255, 0.15)',
        }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={medicalLogo}
              alt="AI Avatar"
              style={{
                width: 48, height: 48, borderRadius: '50%',
                border: '2px solid rgba(100, 180, 255, 0.5)',
                objectFit: 'cover',
                transition: 'all 0.3s ease',
                transform: isAvatarTalking ? 'scale(1.08)' : 'scale(1)',
                filter: isAvatarTalking
                  ? 'drop-shadow(0 0 10px rgba(56,189,248,0.9)) brightness(1.15)'
                  : 'drop-shadow(0 0 3px rgba(56,189,248,0.3))',
              }}
            />
            {isAvatarTalking && (
              <>
                <span style={{ position: 'absolute', inset: '-4px', borderRadius: '50%', border: '2px solid rgba(56,189,248,0.7)', animation: 'pingRing 1s ease-out infinite', pointerEvents: 'none' }} />
                <span style={{ position: 'absolute', inset: '-10px', borderRadius: '50%', border: '2px solid rgba(56,189,248,0.4)', animation: 'pingRing 1s ease-out infinite 0.3s', pointerEvents: 'none' }} />
              </>
            )}
            <span style={{
              position: 'absolute', bottom: 2, right: 2,
              width: 11, height: 11, borderRadius: '50%',
              background: isAvatarTalking ? '#38bdf8' : '#22c55e',
              border: '2px solid #050f28',
              transition: 'background 0.3s',
              boxShadow: isAvatarTalking ? '0 0 8px #38bdf8' : 'none',
            }} />
          </div>
          <div>
            <h5 style={{ color: '#e0f0ff', margin: 0, fontWeight: 700 }}>{title}</h5>
            <span style={{ fontSize: '11px', color: isAvatarTalking ? '#38bdf8' : 'rgba(180,210,255,0.45)', transition: 'color 0.3s' }}>
              {isAvatarTalking ? '● Speaking...' : '● Online'}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto' as const,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column' as const,
          gap: '12px',
          scrollbarWidth: 'thin' as const,
        }}>
          {messages.map(msg => (
            <div
              key={msg.id}
              className="msg-bubble"
              style={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-end',
                gap: '8px',
              }}
            >
              {msg.sender === 'ai' && (
                <img
                  src={medicalLogo}
                  alt="AI"
                  style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid rgba(56,189,248,0.4)', flexShrink: 0, objectFit: 'cover' }}
                />
              )}
              <div style={{
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                fontSize: '14px',
                lineHeight: 1.5,
                whiteSpace: 'pre-line',
                background: msg.sender === 'user'
                  ? 'linear-gradient(135deg, #0ea5e9, #6366f1)'
                  : 'rgba(255, 255, 255, 0.08)',
                color: msg.sender === 'user' ? '#ffffff' : 'rgba(220, 235, 255, 0.95)',
                border: msg.sender === 'ai' ? '1px solid rgba(100,180,255,0.15)' : 'none',
                boxShadow: msg.sender === 'user' ? '0 4px 15px rgba(14,165,233,0.3)' : 'none',
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick suggestions */}
        <div style={{
          display: 'flex', gap: '6px', padding: '8px 14px',
          flexWrap: 'wrap' as const,
          borderTop: '1px solid rgba(100,180,255,0.1)',
        }}>
          {['summary', 'heart rate', 'steps', 'hydration', 'sleep', 'recommend'].map(s => (
            <button
              key={s}
              className="suggest-btn"
              onClick={() => setInput(s)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(100,180,255,0.2)',
                borderRadius: '20px',
                padding: '4px 10px',
                color: 'rgba(180,210,255,0.6)',
                fontSize: '11px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{
          display: 'flex', gap: '8px', padding: '16px 20px',
          borderTop: '1px solid rgba(100,180,255,0.1)',
        }}>
          <input
            type="text"
            className="chat-input-blue"
            placeholder="Ask me anything about your health..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(100,180,255,0.25)',
              color: '#e0f0ff',
              padding: '12px 16px',
              borderRadius: '25px',
              fontSize: '14px',
              transition: 'all 0.2s',
            }}
          />
          <button
            onClick={handleSend}
            style={{
              background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
              border: 'none',
              color: 'white',
              width: 44, height: 44,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 4px 15px rgba(14,165,233,0.35)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </>
  );
}