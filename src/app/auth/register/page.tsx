'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import AnimatedSection from '@/components/ui/AnimatedSection';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const router = useRouter();

  const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }
    setPasswordsMatch(true);
    const success = await createUserWithEmailAndPassword(email, password);
    if (success) {
      router.push('/'); // Redirect to home on successful registration
    }
  };
  
  if (user) {
    // Already logged in, redirecting
    if (typeof window !== 'undefined') {
        router.push('/');
    }
    return null; // Render nothing while redirecting
  }

  return (
    <AnimatedSection>
      <div className="max-w-md mx-auto bg-gray-800/20 p-8 rounded-lg border border-border-color">
        <h1 className="text-3xl font-bold text-center mb-6">Create Account</h1>

        {!passwordsMatch && <p className="text-red-500 text-center mb-4">Passwords do not match.</p>}
        {error && <p className="text-red-500 text-center mb-4">{error.message}</p>}

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-background border border-border-color text-text px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-background border border-border-color text-text px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-2">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-background border border-border-color text-text px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-accent text-white font-bold py-3 rounded-md hover:bg-accent-dark transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-8">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-accent hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </AnimatedSection>
  );
};

export default RegisterPage;
