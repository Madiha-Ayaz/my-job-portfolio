'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import AnimatedSection from '@/components/ui/AnimatedSection';

import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Import default styles

const PhoneLoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(''); // Phone number can be undefined
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOtpInput, setShowOtpInput] = useState(false);

  const router = useRouter();
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    // Initialize reCAPTCHA Verifier when component mounts
    if (recaptchaContainerRef.current && !recaptchaVerifier.current) {
      recaptchaVerifier.current = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
        'size': 'invisible', // Invisible reCAPTCHA is generally better for UX
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // This callback is usually not directly triggered with 'invisible' size
        },
        'expired-callback': () => {
          setError('reCAPTCHA expired. Please try again.');
        }
      });
    }

    // Clean up reCAPTCHA when component unmounts
    return () => {
      // reCAPTCHA cleanup is handled automatically by Firebase when the verifier is no longer active
    };
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Client-side validation using the library's utility
    if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
      setError('Invalid phone number. Please enter a valid number including country code.');
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

      const result = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier.current);
      setConfirmationResult(result);
      setShowOtpInput(true);
      setError(null); // Clear any previous errors
    } catch (err: any) {
      console.error("Error sending OTP:", err);
      setError(err.message || 'Failed to send OTP. Please check your phone number and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!confirmationResult) {
      setError('No verification code was sent. Please try sending OTP again.');
      setLoading(false);
      return;
    }

    try {
      await confirmationResult.confirm(otp);
      router.push('/'); // Redirect to home on successful sign-in
    } catch (err: any) {
      console.error("Error verifying OTP:", err);
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If user is already logged in, redirect
  if (auth.currentUser) {
    if (typeof window !== 'undefined') {
        router.push('/');
    }
    return null;
  }

  return (
    <AnimatedSection>
      <div className="max-w-md mx-auto bg-gray-800/20 p-8 rounded-lg border border-border-color">
        <h1 className="text-3xl font-bold text-center mb-6">Sign in with Phone</h1>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {!showOtpInput ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-text-secondary mb-2">
                Phone Number
              </label>
              <PhoneInput
                defaultCountry="US" // Default to a common country, can be dynamic
                value={phoneNumber}
                onChange={setPhoneNumber}
                international
                withCountryCallingCode
                className="w-full" // Add full width wrapper for styling
                // Tailwind classes for input need to target the internal input element via custom CSS or className prop if supported
                // For now, we rely on the library's default styling and hope it's reasonable
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-accent text-white font-bold py-3 rounded-md hover:bg-accent-dark transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-text-secondary mb-2">
                Verification Code (OTP)
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
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
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}

        {/* reCAPTCHA container - required by Firebase, kept invisible */}
        <div ref={recaptchaContainerRef} id="recaptcha-container" className="mt-4"></div>

        <p className="text-center text-sm text-text-secondary mt-8">
          <Link href="/auth/login" className="font-medium text-accent hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </AnimatedSection>
  );
};

export default PhoneLoginPage;
