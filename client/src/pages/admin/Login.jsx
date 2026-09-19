import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building, KeyRound, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = Credentials, 2 = OTP
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password
      });

      if (response.data.requiresOtp) {
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/users/verify-login-otp', {
        email,
        otp
      });

      // Save token to localStorage
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data));
      
      // Redirect to dashboard
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        
        <div className="bg-primary text-center py-8">
          <Building size={48} className="mx-auto text-accent mb-2" />
          <h1 className="text-2xl font-serif text-white tracking-wider">PK PROPERTIES</h1>
          <p className="text-gray-400 text-sm mt-1">Admin Portal - {step === 1 ? 'Secure Login' : '2-Step Verification'}</p>
        </div>

        <div className="p-8">
          {step === 1 ? (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign In</h2>
              
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
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
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <Link to="/admin/forgot-password" className="text-sm text-accent hover:text-yellow-600 transition">
                      Forgot Password?
                    </Link>
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                    placeholder="••••••••"
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-md font-medium hover:bg-gray-800 transition disabled:opacity-70 flex justify-center items-center"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>
              </form>
            </>
          ) : (
            <>
              <button 
                onClick={() => setStep(1)} 
                className="text-sm text-gray-500 hover:text-primary flex items-center mb-6 transition"
              >
                <ArrowLeft size={16} className="mr-1" /> Back to login
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <KeyRound size={28} className="text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Enter OTP</h2>
                <p className="text-gray-500 text-sm mt-2">
                  We've sent a 6-digit verification code to <br/>
                  <span className="font-medium text-gray-800">{email}</span>
                </p>
              </div>
              
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Verification Code</label>
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    className="w-full px-4 py-4 text-center text-2xl tracking-[0.5em] font-bold rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                    placeholder="------"
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-primary text-white py-3 rounded-md font-medium hover:bg-gray-800 transition disabled:opacity-70 flex justify-center items-center"
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      
      <p className="text-sm text-gray-500 mt-8">
        &copy; {new Date().getFullYear()} PK PROPERTIES. All rights reserved.
      </p>
    </div>
  );
};

export default Login;
