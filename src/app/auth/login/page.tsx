'use client'; // This page itself is a client component

import AnimatedSection from '@/components/ui/AnimatedSection';
import { auth as firebaseAuth } from '@/lib/firebase'; // The potentially null auth object
import LoginForm from '@/components/auth/LoginForm'; // New component

const LoginPage = () => {
  // If firebaseAuth is null (e.g., during SSR), show a loading state.
  // The actual form with hooks will only render when firebaseAuth is available.
  if (!firebaseAuth) {
    return (
      <AnimatedSection>
        <div className="max-w-md mx-auto bg-gray-800/20 p-8 rounded-lg border border-border-color">
          <p className="text-center text-text-secondary">Loading authentication components...</p>
        </div>
      </AnimatedSection>
    );
  }

  // firebaseAuth is guaranteed to be non-null here, so we can pass it safely.
  return (
    <AnimatedSection>
      <LoginForm auth={firebaseAuth} />
    </AnimatedSection>
  );
};

export default LoginPage;