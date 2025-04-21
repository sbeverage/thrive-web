'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function VerifyPageContent() {
  const params = useParams();
  const token = params.token;
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/auth/verify/${token}`);
        if (res.status === 200) {
          setStatus('success');
        } else {
          setStatus('invalid');
        }
      } catch (error) {
        console.error('Verification error:', error.response?.data || error.message);
        setStatus('invalid');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div style={{ backgroundColor: '#1e1e24', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        {status === 'loading' && (
          <>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Verifying...</h1>
            <p>Please wait while we verify your email.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div style={{ fontSize: '3rem', color: '#4BB543', marginBottom: '1rem' }}>✅</div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Email Verified!</h1>
            <p style={{ marginBottom: '2rem' }}>Your email was successfully verified. You can now continue to the app.</p>
            <button
              onClick={() => window.location.href = '/'}
              style={{ 
                backgroundColor: '#e2822b', 
                color: 'white', 
                border: 'none', 
                padding: '0.75rem 2rem', 
                fontSize: '1rem', 
                borderRadius: '8px', 
                cursor: 'pointer' 
              }}
            >
              Continue
            </button>
          </>
        )}
        {status === 'invalid' && (
          <>
            <div style={{ fontSize: '3rem', color: '#e63946', marginBottom: '1rem' }}>❌</div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Invalid Link</h1>
            <p>This verification link is invalid or expired. Please request a new verification email.</p>
          </>
        )}
      </div>
    </div>
  );
}
