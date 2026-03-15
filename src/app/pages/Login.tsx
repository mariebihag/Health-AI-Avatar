import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { EmotionDetector } from './EmotionDetector';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmotionDetector, setShowEmotionDetector] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setShowEmotionDetector(true);
  };

  const handleEmotionComplete = (emotion: string) => {
    sessionStorage.setItem('detectedEmotion', emotion);
    navigate('/dashboard');
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <>
      {showEmotionDetector && (
        <EmotionDetector
          onComplete={handleEmotionComplete}
          onSkip={handleSkip}
        />
      )}

      <div style={{
        minHeight: '100vh',
        width: '100%',
        background: "url('/assets/FlowerBG.png') center/cover fixed no-repeat",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}>
        {/* Dark overlay */}
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 5, 20, 0.45)',
          pointerEvents: 'none',
        }} />

        {/* Glass Card */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          background: 'rgba(8, 20, 50, 0.65)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(100, 180, 255, 0.2)',
          borderRadius: '24px',
          padding: '48px 44px',
          width: '100%',
          maxWidth: '460px',
          boxShadow: '0 8px 48px rgba(0, 80, 200, 0.25), 0 2px 8px rgba(0,0,0,0.5)',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #7dd3fc 0%, #38bdf8 50%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.5px',
              marginBottom: '8px',
            }}>
              Health AI
            </h1>
            <p style={{ color: 'rgba(180, 210, 255, 0.75)', fontSize: '14px', margin: 0 }}>
              Welcome back! Please login to your account.
            </p>
          </div>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: 'rgba(180, 210, 255, 0.9)',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '6px',
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.07)',
                  border: '1px solid rgba(100, 180, 255, 0.25)',
                  borderRadius: '12px',
                  color: '#e0f0ff',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(56, 189, 248, 0.7)';
                  e.target.style.background = 'rgba(255,255,255,0.12)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(56,189,248,0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(100, 180, 255, 0.25)';
                  e.target.style.background = 'rgba(255,255,255,0.07)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{
                display: 'block',
                color: 'rgba(180, 210, 255, 0.9)',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '6px',
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.07)',
                  border: '1px solid rgba(100, 180, 255, 0.25)',
                  borderRadius: '12px',
                  color: '#e0f0ff',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(56, 189, 248, 0.7)';
                  e.target.style.background = 'rgba(255,255,255,0.12)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(56,189,248,0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(100, 180, 255, 0.25)';
                  e.target.style.background = 'rgba(255,255,255,0.07)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '13px',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '15px',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(14, 165, 233, 0.4)',
                marginBottom: '16px',
                transition: 'all 0.2s',
                letterSpacing: '0.3px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(14, 165, 233, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(14, 165, 233, 0.4)';
              }}
            >
              Login
            </button>

            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'rgba(180, 210, 255, 0.7)', fontSize: '14px', margin: 0 }}>
                Don't have an account?{' '}
                <Link to="/signup" style={{ color: '#38bdf8', fontWeight: 600, textDecoration: 'none' }}>
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}