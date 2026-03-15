import { useState } from 'react';
import { useNavigate, Link } from 'react-router';

export function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    navigate('/dashboard');
  };

  const inputStyle: React.CSSProperties = {
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
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: 'rgba(180, 210, 255, 0.9)',
    fontSize: '13px',
    fontWeight: 600,
    marginBottom: '6px',
  };

  return (
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
        padding: '44px 44px',
        width: '100%',
        maxWidth: '460px',
        boxShadow: '0 8px 48px rgba(0, 80, 200, 0.25), 0 2px 8px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
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
            Create your account to get started.
          </p>
        </div>

        <form onSubmit={handleSignUp}>
          {[
            { label: 'Name', id: 'name', type: 'text', placeholder: 'Enter your full name' },
            { label: 'Email', id: 'email', type: 'email', placeholder: 'Enter your email' },
            { label: 'Password', id: 'password', type: 'password', placeholder: 'Create a password' },
            { label: 'Confirm Password', id: 'confirmPassword', type: 'password', placeholder: 'Confirm your password' },
          ].map((field, i, arr) => (
            <div key={field.id} style={{ marginBottom: i === arr.length - 1 ? '28px' : '16px' }}>
              <label style={labelStyle}>{field.label}</label>
              <input
                type={field.type}
                name={field.id}
                value={formData[field.id as keyof typeof formData]}
                onChange={handleChange}
                required
                placeholder={field.placeholder}
                style={inputStyle}
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
          ))}

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
            Create Account
          </button>

          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'rgba(180, 210, 255, 0.7)', fontSize: '14px', margin: 0 }}>
              Already have an account?{' '}
              <Link to="/" style={{ color: '#38bdf8', fontWeight: 600, textDecoration: 'none' }}>
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}