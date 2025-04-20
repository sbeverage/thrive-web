'use client';

import { useParams } from 'next/navigation'; // 👈 this instead of useSearchParams
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function VerifyPageContent() {
  const params = useParams(); // 👈 useParams, not useSearchParams
  const token = params.token; // 👈 get token from params
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/auth/verify/${encodeURIComponent(token)}`);
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