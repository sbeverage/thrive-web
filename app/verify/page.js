'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function VerifyContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      setStatus('error');
      setMessage('Invalid verification link. Please try again.');
      return;
    }

    // Show success message
    setStatus('success');
    setMessage('Email verified successfully!');
    
    // Try multiple redirect methods
    setTimeout(() => {
      // Method 1: Try to redirect to your app
      window.location.href = `thriveapp://verify?token=${token}&email=${encodeURIComponent(email)}`;
      
      // Method 2: Fallback - show instructions
      setTimeout(() => {
        setMessage('Email verified successfully');
      }, 2000);
    }, 2000);

  }, [searchParams]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%'
      }}>
        {/* Logo/Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
          margin: '0 auto 30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          color: 'white'
        }}>
          {status === 'success' ? '✅' : status === 'error' ? '❌' : '⏳'}
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '20px',
          margin: '0 0 20px 0'
        }}>
          {status === 'success' ? 'Email Verified!' : 
           status === 'error' ? 'Verification Failed' : 
           'Verifying Email...'}
        </h1>

        {/* Message */}
        <p style={{
          fontSize: '16px',
          color: '#666',
          lineHeight: '1.5',
          marginBottom: '30px',
          margin: '0 0 30px 0'
        }}>
          {message}
        </p>

        {/* Status indicator */}
        {status === 'verifying' && (
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #0ea5e9',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
        )}

        {/* Success message */}
        {status === 'success' && (
          <div style={{
            backgroundColor: '#f0f9ff',
            border: '1px solid #0ea5e9',
            borderRadius: '12px',
            padding: '20px',
            marginTop: '20px'
          }}>
            <p style={{
              color: '#0369a1',
              fontSize: '14px',
              margin: '0',
              fontWeight: '500'
            }}>
              {message.includes('return to the Thrive app') ? 
                'Please return to the THRIVE Initiative app to continue.' : 
                'Redirecting you back to the Thrive app...'}
            </p>
          </div>
        )}

        {/* Error message */}
        {status === 'error' && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #f87171',
            borderRadius: '12px',
            padding: '20px',
            marginTop: '20px'
          }}>
            <p style={{
              color: '#dc2626',
              fontSize: '14px',
              margin: '0',
              fontWeight: '500'
            }}>
              Please try the verification link again or contact support.
            </p>
          </div>
        )}
      </div>

      {/* CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)'
      }}>
        <div style={{
          color: 'white',
          fontSize: '18px',
          fontWeight: '500'
        }}>
          Loading...
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
