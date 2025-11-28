'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import AnimatedSection from '@/components/ui/AnimatedSection';
import {
  MultiFactorResolver,
  PhoneMultiFactorGenerator,
  PhoneMultiFactorInfo,
  RecaptchaVerifier,
  AuthError,
} from 'firebase/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaOtp, setMfaOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [mfaResolver, setMfaResolver] = useState<MultiFactorResolver | null>(null);
  const [selectedMfaFactor, setSelectedMfaFactor] = useState<PhoneMultiFactorInfo | null>(null);
  const [showMfaInput, setShowMfaInput] = useState(false);

  const router = useRouter();
  
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);

  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle] = useSignInWithGoogle(auth);

  useEffect(() => {
    // Initialize reCAPTCHA Verifier
    if (showMfaInput && recaptchaContainerRef.current && !recaptchaVerifier.current) {
      recaptchaVerifier.current = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
        'size': 'invisible', // Invisible reCAPTCHA
        'callback': (response: any) => { /* reCAPTCHA solved */ },
        'expired-callback': () => {
          setError('reCAPTCHA expired. Please try again.');
          if (recaptchaVerifier.current) {
            recaptchaVerifier.current.clear();
          }
        }
      });
    }

    return () => {
      if (recaptchaVerifier.current) {
        recaptchaVerifier.current.clear();
      }
    };
  }, [showMfaInput]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setMfaResolver(null); // Reset MFA state

    try {
      const userCredential = await signInWithEmailAndPassword(email, password);
      if (userCredential) {
        router.push('/'); // Redirect to home on successful login
      }
    } catch (err: any) {
      if (err.code === 'auth/multi-factor-required') {
        const resolver = err as MultiFactorResolver;
        setMfaResolver(resolver);
        setShowMfaInput(true);
        setError('Two-factor authentication required. Please enter your verification code.');
        
        // Assuming phone MFA, select the first available phone factor
        const phoneFactors = resolver.hints.filter(
          (hint) => hint.factorId === PhoneMultiFactorGenerator.FACTOR_ID
        ) as PhoneMultiFactorInfo[];

        if (phoneFactors.length > 0) {
          setSelectedMfaFactor(phoneFactors[0]);
        } else {
          setError('No supported MFA factors found for this account.');
          setMfaResolver(null); // Clear resolver if no supported factors
        }
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    setMfaResolver(null); // Reset MFA state

    try {
      const userCredential = await signInWithGoogle();
      if (userCredential) {
        router.push('/');
      }
    } catch (err: any) {
      if (err.code === 'auth/multi-factor-required') {
        const resolver = err as MultiFactorResolver;
        setMfaResolver(resolver);
        setShowMfaInput(true);
        setError('Two-factor authentication required. Please enter your verification code.');

        const phoneFactors = resolver.hints.filter(
            (hint) => hint.factorId === PhoneMultiFactorGenerator.FACTOR_ID
        ) as PhoneMultiFactorInfo[];

        if (phoneFactors.length > 0) {
            setSelectedMfaFactor(phoneFactors[0]);
        } else {
            setError('No supported MFA factors found for this account.');
            setMfaResolver(null);
        }
      } else {
        setError(err.message || 'Google Sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!mfaResolver || !selectedMfaFactor) {
      setError('MFA challenge data missing. Please restart login.');
      setLoading(false);
      return;
    }
    if (!recaptchaVerifier.current) {
        setError('reCAPTCHA not initialized. Please refresh the page.');
        setLoading(false);
        return;
    }

    try {
        await recaptchaVerifier.current.verify(); // Execute reCAPTCHA for phone MFA challenge

        const multiFactorAssertion = PhoneMultiFactorGenerator.getAssertionCredential(
            mfaOtp,
            selectedMfaFactor.startSession(mfaResolver.challenge)
        );

        const userCredential = await mfaResolver.resolveSignIn(multiFactorAssertion);
        if (userCredential) {
            router.push('/');
        }
    } catch (err: any) {
        console.error('MFA Verification Error:', err);
        setError(err.message || 'MFA verification failed. Please check the code and try again.');
        if (recaptchaVerifier.current) {
            recaptchaVerifier.current.clear(); // Clear reCAPTCHA on error
        }
    } finally {
        setLoading(false);
    }
  };

  if (auth.currentUser) {
    // Already logged in, redirecting
    if (typeof window !== 'undefined') {
        router.push('/');
    }
    return null;
  }

  return (
    <AnimatedSection>
      <div className="max-w-md mx-auto bg-gray-800/20 p-8 rounded-lg border border-border-color">
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {showMfaInput ? (
          <form onSubmit={handleMfaSignIn} className="space-y-6">
            <div>
              <label htmlFor="mfaOtp" className="block text-sm font-medium text-text-secondary mb-2">
                Enter Verification Code (OTP)
              </label>
              <input
                type="text"
                id="mfaOtp"
                value={mfaOtp}
                onChange={(e) => setMfaOtp(e.target.value)}
                required
                className="w-full bg-background border border-border-color text-text px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="123456"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-accent text-white font-bold py-3 rounded-md hover:bg-accent-dark transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Verifying MFA...' : 'Verify MFA'}
            </button>
            {/* reCAPTCHA container for phone MFA challenges */}
            <div ref={recaptchaContainerRef} id="recaptcha-container" className="mt-4"></div>
          </form>
        ) : (
          <>
            <form onSubmit={handleLogin} className="space-y-6">
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
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <div className="text-sm text-right mt-4">
                <Link href="/auth/forgot-password" className="font-medium text-accent hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </form>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border-color"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-gray-800/20 px-2 text-text-secondary">Or continue with</span>
                </div>
            </div>

            <button 
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center border border-border-color py-3 rounded-md hover:bg-gray-700/50 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {/* A simple inline SVG for Google icon */}
              <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
                <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.222 0-9.612-3.87-11.188-9.014l-6.571 4.819C9.656 39.663 16.318 44 24 44z"></path>
                <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.015 35.137 44 30.022 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
              </svg>
              {loading ? 'Signing in...' : 'Sign in with Google'}
            </button>

            <div className="text-center text-sm text-text-secondary mt-4">
                <Link href="/auth/phone-login" className="font-medium text-accent hover:underline mr-4">
                  Sign in with Phone Number
                </Link>
                <Link href="/auth/manage-mfa" className="font-medium text-accent hover:underline">
                  Manage MFA
                </Link>
            </div>
          </>
        )}

        <p className="text-center text-sm text-text-secondary mt-8">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="font-medium text-accent hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </AnimatedSection>
  );
};

export default LoginPage;
