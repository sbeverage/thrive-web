'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function VerifyPage() {
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (token && email) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('Missing verification token or email');
    }
  }, [token, email]);

  const verifyEmail = async () => {
    try {
      const response = await fetch(`https://your-backend-url.com/api/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Email verified successfully! You can now return to the app.');
      } else {
        setStatus('error');
        setMessage(data.message || 'Verification failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred during verification');
    }
  };

  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center', 
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1>Email Verification</h1>
      
      {status === 'verifying' && (
        <div>
          <p>Verifying your email...</p>
          <div style={{ margin: '20px 0' }}>⏳</div>
        </div>
      )}
      
      {status === 'success' && (
        <div>
          <p style={{ color: 'green' }}>✅ {message}</p>
          <p>You can now return to the Thrive app and continue using all features.</p>
        </div>
      )}
      
      {status === 'error' && (
        <div>
          <p style={{ color: 'red' }}>❌ {message}</p>
          <p>Please try again or contact support if the problem persists.</p>
        </div>
      )}
    </div>
  );
}
