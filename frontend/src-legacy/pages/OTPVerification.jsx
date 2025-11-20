import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import authService from '../api/authService';
import toast from 'react-hot-toast';
import { FiMail, FiArrowLeft, FiClock, FiCheck } from 'react-icons/fi';

export default function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Get email from location state or localStorage
  const email = location.state?.email || localStorage.getItem('otpEmail') || '';
  const userType = location.state?.userType || localStorage.getItem('otpUserType') || 'customer';

  useEffect(() => {
    // Store email in localStorage if provided
    if (location.state?.email) {
      localStorage.setItem('otpEmail', location.state.email);
    }
    if (location.state?.userType) {
      localStorage.setItem('otpUserType', location.state.userType);
    }

    // Focus first input
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    // Timer countdown
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [location.state]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only numbers

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      pastedData.split('').forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    if (!email) {
      toast.error('Email not found. Please register again.');
      navigate('/register');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.verifyOTP({
        email,
        otp: otpString
      });

      if (response.data?.token) {
        toast.success('Email verified successfully!');
        localStorage.removeItem('otpEmail');
        localStorage.removeItem('otpUserType');

        // Navigate based on user type
        if (userType === 'student') {
          navigate('/home/student');
        } else if (userType === 'customer') {
          navigate('/home/customer');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      const errorMessage = error.response?.data?.message || 'Invalid OTP. Please try again.';
      toast.error(errorMessage);
      
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error('Email not found. Please register again.');
      navigate('/register');
      return;
    }

    try {
      await authService.resendOTP(email);
      toast.success('OTP resent successfully!');
      setTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error('Failed to resend OTP. Please try again.');
    }
  };

  const bgClass = isDark 
    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
    : 'bg-gradient-to-br from-slate-50 via-indigo-50/30 to-primary-50/20';

  return (
    <div className={`min-h-screen ${bgClass} flex items-center justify-center p-4 sm:p-6 transition-colors duration-300`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-md ${isDark ? 'bg-gray-800/95' : 'bg-white'} rounded-2xl shadow-xl border ${
          isDark ? 'border-gray-700' : 'border-gray-100'
        } p-6 sm:p-8 md:p-10`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              isDark ? 'bg-primary/20' : 'bg-primary/10'
            }`}
          >
            <FiMail className={`w-8 h-8 ${isDark ? 'text-primary' : 'text-primary'}`} />
          </motion.div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Verify Your Email
          </h1>
          <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            We've sent a 6-digit code to
          </p>
          <p className={`text-sm font-semibold mt-1 ${isDark ? 'text-primary' : 'text-primary'}`}>
            {email || 'your email'}
          </p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Inputs */}
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <motion.input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold rounded-xl border-2 transition-all ${
                  isDark
                    ? 'bg-gray-700/50 border-gray-600 text-white focus:border-primary focus:ring-2 focus:ring-primary/50'
                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/50'
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              />
            ))}
          </div>

          {/* Timer and Resend */}
          <div className="text-center space-y-2">
            {!canResend ? (
              <p className={`text-sm flex items-center justify-center gap-2 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <FiClock className="w-4 h-4" />
                Resend code in {timer}s
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-sm font-semibold text-primary hover:text-blue-600 transition-colors"
              >
                Resend Code
              </button>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading || otp.join('').length !== 6}
            whileHover={{ scale: loading || otp.join('').length !== 6 ? 1 : 1.02 }}
            whileTap={{ scale: loading || otp.join('').length !== 6 ? 1 : 0.98 }}
            className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-base sm:text-lg"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                Verify Email
                <FiCheck className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            to="/register"
            className={`text-sm flex items-center justify-center gap-2 ${
              isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
            } transition-colors`}
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to registration
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

