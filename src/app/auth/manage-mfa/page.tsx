'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Auth,
  RecaptchaVerifier,
  MultiFactorResolver,
  PhoneMultiFactorGenerator,
  PhoneMultiFactorInfo,
  ConfirmationResult,
} from 'firebase/auth'; // Import MultiFactorResolver
import { auth } from '@/lib/firebase';
import AnimatedSection from '@/components/ui/AnimatedSection';

const ManageMFAPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [showVerificationInput, setShowVerificationInput] = useState(false);

  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);
  const router = useRouter();

  const currentUser = auth.currentUser;

  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser && typeof window !== 'undefined') {
      router.push('/auth/login');
      return;
    }

    // Initialize reCAPTCHA Verifier
    if (recaptchaContainerRef.current && !recaptchaVerifier.current) {
      recaptchaVerifier.current = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, this callback is usually not directly triggered with 'invisible' size
        },
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
  }, [currentUser, router]);

  const handleEnrollMFA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (!currentUser) {
      setError('You must be logged in to manage MFA.');
      setLoading(false);
      return;
    }

    if (!recaptchaVerifier.current) {
      setError('reCAPTCHA not initialized. Please refresh the page.');
      setLoading(false);
      return;
    }

    try {
      // Execute reCAPTCHA first
      await recaptchaVerifier.current.verify();

      const multiFactorSession = await PhoneMultiFactorGenerator.session(currentUser, {
        recaptchaVerifier: recaptchaVerifier.current,
      });

      const phoneOptions = {
        phoneNumber: phoneNumber,
        session: multiFactorSession,
      };

      const verificationId = await PhoneMultiFactorGenerator.sendVerificationCode(currentUser, phoneOptions);

      // Save confirmationResult for later use
      setConfirmationResult(verificationId);
      setShowVerificationInput(true);
      setMessage('Verification code sent to your phone.');

    } catch (err: any) {
      console.error('Error enrolling MFA:', err);
      setError(err.message || 'Failed to enroll MFA. Please try again.');
      if (recaptchaVerifier.current) {
        recaptchaVerifier.current.clear();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMFA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (!currentUser || !confirmationResult) {
      setError('Something went wrong. Please restart the enrollment process.');
      setLoading(false);
      return;
    }

    try {
      const cred = PhoneMultiFactorGenerator.getAssertionCredential(verificationCode, confirmationResult);
      await currentUser.enroll('phone', cred); // Enroll the phone number as an MFA factor
      
      setMessage('Phone number successfully enrolled as a second factor!');
      setPhoneNumber('');
      setVerificationCode('');
      setShowVerificationInput(false);
      setConfirmationResult(null);

    } catch (err: any) {
      console.error('Error verifying MFA:', err);
      setError(err.message || 'Failed to verify code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedSection>
      <div className="max-w-md mx-auto bg-gray-800/20 p-8 rounded-lg border border-border-color">
        <h1 className="text-3xl font-bold text-center mb-6">Manage Two-Factor Authentication</h1>
        
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {showVerificationInput ? (
          <form onSubmit={handleVerifyMFA} className="space-y-6">
            <div>
              <label htmlFor="verificationCode" className="block text-sm font-medium text-text-secondary mb-2">
                Enter Verification Code
              </label>
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
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
              {loading ? 'Verifying...' : 'Verify & Enroll'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleEnrollMFA} className="space-y-6">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-text-secondary mb-2">
                Phone Number (e.g., +11234567890)
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="w-full bg-background border border-border-color text-text px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="+11234567890"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-accent text-white font-bold py-3 rounded-md hover:bg-accent-dark transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Sending Code...' : 'Send Verification Code'}
            </button>
          </form>
        )}

        {/* reCAPTCHA container - required by Firebase for phone auth, kept invisible */}
        <div ref={recaptchaContainerRef} id="recaptcha-container" className="mt-4"></div>

        <p className="text-center text-sm text-text-secondary mt-8">
          <Link href="/" className="font-medium text-accent hover:underline">
            Back to Home
          </Link>
        </p>
      </div>
    </AnimatedSection>
  );
};

export default ManageMFAPage;
