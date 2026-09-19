import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building, ArrowLeft, KeyRound } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP & Password
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, { email });
      setStep(2);
      setStatus(null);
    } catch (err) {
      setStatus('error');
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match');
      return;
    }

    setStatus('loading');
    setMessage('');
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password-with-otp`, { 
        email, 
        otp, 
        newPassword 
      });
      setStatus('success');
      setMessage(response.data.message);
      
      // Auto redirect to login after 3 seconds
      setTimeout(() => navigate('/admin/login'), 3000);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Invalid OTP or an error occurred.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        
        <div className="bg-primary text-center py-8">
          <Building size={48} className="mx-auto text-accent mb-2" />
          <h1 className="text-2xl font-serif text-white tracking-wider">PK PROPERTIES</h1>
          <p className="text-gray-400 text-sm mt-1">Admin Portal - Reset Password</p>
        </div>

        <div className="p-8">
          {step === 1 ? (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Forgot Password</h2>
              <p className="text-gray-500 text-sm text-center mb-6">
                Enter your email address and we'll send you a 6-digit verification code.
              </p>
              
              {status === 'error' && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm text-center">
                  {message}
                </div>
              )}

              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                    placeholder="admin@pkproperties.com"
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full bg-primary text-white py-3 rounded-md font-medium hover:bg-gray-800 transition disabled:opacity-70 flex justify-center items-center"
                >
                  {status === 'loading' ? 'Sending Code...' : 'Send Verification Code'}
                </button>
              </form>
            </>
          ) : (
            <>
              <button 
                onClick={() => setStep(1)} 
                className="text-sm text-gray-500 hover:text-primary flex items-center mb-6 transition"
              >
                <ArrowLeft size={16} className="mr-1" /> Back to email
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <KeyRound size={28} className="text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Set New Password</h2>
                <p className="text-gray-500 text-sm mt-2">
                  Enter the 6-digit code sent to {email}
                </p>
              </div>

              {status === 'success' && (
                <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6 text-sm text-center border border-green-200">
                  {message} Redirecting to login...
                </div>
              )}
              
              {status === 'error' && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm text-center">
                  {message}
                </div>
              )}

              {status !== 'success' && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-center">Verification Code</label>
                    <input 
                      type="text" 
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                      maxLength={6}
                      className="w-full px-4 py-3 text-center text-xl tracking-[0.5em] font-bold rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                      placeholder="------"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={status === 'loading' || otp.length !== 6 || !newPassword || !confirmPassword}
                    className="w-full bg-primary text-white py-3 mt-4 rounded-md font-medium hover:bg-gray-800 transition disabled:opacity-70 flex justify-center items-center"
                  >
                    {status === 'loading' ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              )}
            </>
          )}
          
          <div className="mt-8 text-center">
            <Link to="/admin/login" className="text-sm text-gray-600 hover:text-primary transition inline-flex items-center">
              <ArrowLeft size={16} className="mr-1" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
