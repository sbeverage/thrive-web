'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// Supabase backend configuration
const BACKEND_URL = 'https://mdqgndyhzlnwojtubouh.supabase.co/functions/v1';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcWduZHloemxud29qdHVib3VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NjE3MTksImV4cCI6MjA3NzUzNzcxOX0.EtIyUJ3kFILYV6bAIETAk6RE-ra7sEDd14bDG7PDVfg';

function VerifyContent() {
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const searchParams = useSearchParams();
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const verified = searchParams.get('verified'); // Check if already verified

  const redirectToApp = () => {
    setIsRedirecting(true);
    
    console.log('🔗 Attempting to open app...');
    
    // Build deep link with token and email
    const deepLink = `thriveapp://verify?token=${token || ''}&email=${encodeURIComponent(email || '')}&verified=true`;
    console.log('🔗 Deep link:', deepLink);
    
    // For iOS Safari, we need to use a different approach
    // Try creating an anchor element and clicking it (works better in Safari)
    try {
      const anchor = document.createElement('a');
      anchor.href = deepLink;
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      
      // Trigger click event (user-initiated action)
      anchor.click();
      
      // Remove anchor after a short delay
      setTimeout(() => {
        document.body.removeChild(anchor);
      }, 1000);
      
      console.log('✅ Deep link triggered via anchor click');
    } catch (error) {
      console.error('❌ Anchor click failed:', error);
      
      // Fallback: Try window.location directly
      try {
        window.location.href = deepLink;
        console.log('✅ Deep link triggered via window.location');
      } catch (locationError) {
        console.error('❌ Window.location failed:', locationError);
        
        // Last resort: Try window.open
        try {
          window.open(deepLink, '_blank');
          console.log('✅ Deep link triggered via window.open');
        } catch (openError) {
          console.error('❌ All redirect methods failed:', openError);
          alert('Unable to open the app. Please open the Thrive app manually.');
        }
      }
    }
  };

  useEffect(() => {
    // If already verified (from redirect), just show success - don't auto-redirect
    if (verified === 'true' && token) {
      setStatus('success');
      setMessage('Email verified successfully! Tap the button below to open the Thrive app.');
      return;
    }

    // Otherwise, verify the email
    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('Missing verification token');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, email, verified]);

  const verifyEmail = async () => {
    try {
      console.log('🔍 Starting verification for token:', token);
      console.log('🔍 Backend URL:', `${BACKEND_URL}/api/auth/verify-email?token=${token}`);
      
      // Use the correct Supabase Edge Function endpoint
      const response = await fetch(`${BACKEND_URL}/api/auth/verify-email?token=${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
        },
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      let data;
      try {
        data = await response.json();
        console.log('📡 Response data:', data);
      } catch (jsonError) {
        console.error('❌ Failed to parse JSON response:', jsonError);
        const text = await response.text();
        console.error('❌ Response text:', text);
        setStatus('error');
        setMessage('Invalid response from server. Please try again.');
        return;
      }

      if (response.ok && (data.success || data.message?.includes('verified') || data.message?.includes('success'))) {
        console.log('✅ Verification successful!');
        setStatus('success');
        setMessage('Email verified successfully! Tap the button below to open the Thrive app.');
        
        // Don't auto-redirect - Safari blocks it. Let user click the button instead.
        // The button click will trigger redirectToApp() which is a user action
      } else {
        console.error('❌ Verification failed:', data);
        setStatus('error');
        setMessage(data.error || data.message || data.code || 'Verification failed');
      }
    } catch (error) {
      console.error('❌ Verification error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      setStatus('error');
      setMessage(error.message || 'An error occurred during verification. Please try again.');
    }
  };

  const handleOpenApp = () => {
    redirectToApp();
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #DB8633 0%, #324E58 100%)',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{ 
        background: 'white',
        borderRadius: '20px',
        padding: '3rem',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
      }}>
        <h1 style={{ 
          color: '#DB8633',
          marginBottom: '1.5rem',
          fontSize: '2rem',
          fontWeight: 'bold',
        }}>
          Email Verification
        </h1>
        
        {status === 'verifying' && (
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>Verifying your email...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <p style={{ color: '#4CAF50', fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>
              Email Verified!
            </p>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              {message || 'Your email has been verified successfully. Opening the Thrive app...'}
            </p>
            
            <a
              href={`thriveapp://verify?token=${token || ''}&email=${encodeURIComponent(email || '')}&verified=true`}
              onClick={(e) => {
                e.preventDefault();
                handleOpenApp();
              }}
              style={{
                display: 'inline-block',
                backgroundColor: '#DB8633',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '14px 28px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'background-color 0.3s',
                marginTop: '1rem',
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#c97527'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#DB8633'}
            >
              {isRedirecting ? 'Opening App...' : 'Open in Thrive App'}
            </a>
            
            <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '1.5rem' }}>
              {isRedirecting 
                ? 'If the app didn\'t open automatically, tap the button above.'
                : 'Tap the button above to open the Thrive app and continue.'}
            </p>
          </div>
        )}
        
        {status === 'error' && (
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
            <p style={{ color: '#f44336', fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
              Verification Failed
            </p>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              {message || 'The verification link is invalid or has expired.'}
            </p>
            <p style={{ color: '#999', fontSize: '0.9rem' }}>
              Please try again or contact support if the problem persists.
            </p>
          </div>
        )}
      </div>
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
        background: 'linear-gradient(135deg, #DB8633 0%, #324E58 100%)',
        padding: '2rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        <div style={{ 
          background: 'white',
          borderRadius: '20px',
          padding: '3rem',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>Loading...</p>
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
