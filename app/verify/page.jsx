import { Suspense } from 'react';
import VerifyPageContent from './VerifyPageContent';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading verification page...</div>}>
      <VerifyPageContent />
    </Suspense>
  );
}
