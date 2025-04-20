'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

export default function VerifyTokenPage() {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/api/auth/verify/${token}`);
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
    <div style={{ padding: "2rem", textAlign: "center" }}>
      {status === 'loading' && <p>🔄 Verifying your email...</p>}
      {status === 'success' && <p>✅ Success! Your email has been verified.</p>}
      {status === 'invalid' && <p>❌ Invalid or expired verification link.</p>}
    </div>
  );
}
