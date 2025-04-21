'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function VerifyPageContent() {
  const params = useParams();
  const token = params.token;
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('invalid');
        return;
      }

      console.log('🛫 FRONTEND sending token:', token);

      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/auth/verify/${encodeURIComponent(token)}`);
        
        if (res.status === 200) {
          setStatus('success');
        } else {
          setStatus('invalid');
        }
      } catch (error) {
        console.error('🛑 FRONTEND verification error:', error.response?.data || error.message);
        setStatus('invalid');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      {status === 'loading' && <p>🔄 Verifying your email...</p>}
      {status === 'success' && <p>✅ Success! Your email has been verified.</p>}
      {status === 'invalid' && <p>❌ Invalid or expired verification link.</p>}
    </div>
  );
}
