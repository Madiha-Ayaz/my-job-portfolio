'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { Auth } from 'firebase/auth'; // Import Auth type
import { useAuth } from '@/context/AuthContext';

interface RegisterFormProps {
  auth: Auth; // Expect a non-null Auth object
}

const RegisterForm: React.FC<RegisterFormProps> = ({ auth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(email, password);
      if (userCredential) {
        router.push('/'); // Redirect to home on successful registration
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || user) {
    return null; // Or a loading spinner
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-6">Register</h1>
      
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

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
            className="w-full bg-background border border-border-color text-text px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-accent text-white font-bold py-3 rounded-md hover:bg-accent-dark transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p className="text-center text-sm text-text-secondary mt-8">
        Already have an account?{' '}
        <Link href="/auth/login" className="font-medium text-accent hover:underline">
          Login
        </Link>
      </p>
    </>
  );
};

export default RegisterForm;
