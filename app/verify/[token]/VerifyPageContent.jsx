'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function VerifyPageContent() {
  const params = useParams();
  const token = params.token;
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('invalid');
        return;
      }

      console.log("🛫 Sending token:", token);

      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/auth/verify/${token}`);
        console.log('✅ Backend verification response:', res.data);

        if (res.status === 200) {
          setStatus('success');
        } else {
          setStatus('invalid');
        }
      } catch (error) {
        console.error('🛑 Verification error:', error.response?.data || error.message);
        setStatus('invalid');
      }
    };

    verify();
  }, [token]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      {status === 'loading' && <p>🔄 Verifying your email...</p>}
      {status === 'success' && <p>✅ Success! Your email has been verified.</p>}
      {status === 'invalid' && <p>❌ Invalid or expired verification link.</p>}
    </div>
  );
}
