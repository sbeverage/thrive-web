'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const BACKEND_URL = process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL || 'https://mdqgndyhzlnwojtubouh.supabase.co/functions/v1';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcWduZHloemxud29qdHVib3VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NjE3MTksImV4cCI6MjA3NzUzNzcxOX0.EtIyUJ3kFILYV6bAIETAk6RE-ra7sEDd14bDG7PDVfg';

const cardStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #DB8633 0%, #324E58 100%)',
  padding: '2rem',
  fontFamily: 'system-ui, -apple-system, sans-serif',
};

const innerStyle = {
  background: 'white',
  borderRadius: '20px',
  padding: '3rem',
  maxWidth: '500px',
  width: '100%',
  textAlign: 'center',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
};

function DonorInvitationContent() {
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token.');
      return;
    }
    verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/verify-email?token=${token}&format=json`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && (data.success || data.message?.includes('verified') || data.message?.includes('success'))) {
        setStatus('success');
      } else {
        setStatus('error');
        setMessage(data.error || data.message || 'Verification failed. The link may be invalid or expired.');
      }
    } catch {
      setStatus('error');
      setMessage('An error occurred. Please try again.');
    }
  };

  const openApp = () => {
    // Try Universal Link first, then custom scheme fallback
    window.location.href = `https://thrive-web-jet.vercel.app/donorInvitationVerify?token=${token || ''}`;
    setTimeout(() => {
      window.location.href = `thriveapp://donorInvitationVerify?token=${token || ''}`;
    }, 1500);
  };

  return (
    <div style={cardStyle}>
      <div style={innerStyle}>
        <h1 style={{ color: '#DB8633', marginBottom: '1.5rem', fontSize: '2rem', fontWeight: 'bold' }}>
          Thrive Initiative
        </h1>

        {status === 'verifying' && (
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>Verifying your invitation...</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <p style={{ color: '#4CAF50', fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>
              Invitation Verified!
            </p>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              Open the Thrive app to complete your account setup and set your password.
            </p>
            <button
              onClick={openApp}
              style={{
                backgroundColor: '#DB8633',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '14px 28px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%',
                maxWidth: '280px',
              }}
            >
              Open in Thrive App
            </button>
            <p style={{ color: '#999', fontSize: '0.85rem', marginTop: '1.5rem' }}>
              Don't have the app yet?{' '}
              <a
                href="https://apps.apple.com/app/thrive-initiative/id6744030078"
                style={{ color: '#DB8633' }}
              >
                Download on the App Store
              </a>
            </p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
            <p style={{ color: '#f44336', fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
              Verification Failed
            </p>
            <p style={{ color: '#666' }}>
              {message || 'This invitation link is invalid or has expired. Please contact support.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DonorInvitationVerifyPage() {
  return (
    <Suspense fallback={
      <div style={cardStyle}>
        <div style={innerStyle}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>Loading...</p>
        </div>
      </div>
    }>
      <DonorInvitationContent />
    </Suspense>
  );
}
