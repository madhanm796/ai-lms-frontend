import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // <--- Import Toast

// Components & Assets
import ButtonWithText from '../components/ButtonWithText';
import decorativeDots from '../assets/images/dots.png';
import invertedDots from '../assets/images/dots-invert.png';
import signInVideo from '../assets/videos/sign_in.mp4';
import GoogleOAuth from '../components/GoogleOAuth';
import BirdLogo from '../components/BirdLogo';

// Logic
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        const responseData = await authService.login(email, password);
        
        const { access_token } = responseData;
        login({email: email}, access_token); 
        
        // JWT - JSON Web Token
        
        toast.success("Welcome back!");
        const userData = await authService.getCurrentUser();
        login(userData, access_token);
        navigate('/dashboard');

    } catch (error) {
        e.preventDefault();
        console.error("Login error:", error);
        toast.error(error.response?.data?.detail || "Login failed. Please check credentials.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white relative overflow-hidden font-sans">
      
      {isLoading && <LoadingSpinner />}

      {/* Decorative Dots - Top Left-ish */}
      <div className={`grid grid-cols-3 gap-2 absolute top-10 left-[38%] lg:grid`}>
        <img src={decorativeDots} className='max-w-10' alt="dots" />
      </div>

      {/* Decorative Dots - Bottom Right */}
      <div className="absolute bottom-10 right-5 hidden lg:grid grid-cols-2 gap-2">
         <img src={invertedDots} className='max-w-10' alt="dots" />
      </div>

      {/* Bird Logo - Top Right */}
      <div className="absolute top-4 right-10">
        <BirdLogo />
      </div>

      {/* Left Section - Purple Block */}
      <div className="hidden md:flex md:w-1/3 p-4 h-screen items-center">
        <div className="w-full h-full bg-[#a855f7] rounded-[2.5rem] overflow-clip relative">
            <video className="w-full h-full object-cover" src={signInVideo} autoPlay muted playsInline loop />
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 md:px-24">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Continue your learning journey with LearnFlow AI.
            </p>
          </div>

          {/* FIX: Use onSubmit, remove action */}
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            
            {/* Email Field */}
            <div className="relative group border-b border-purple-300 focus-within:border-purple-600 transition-colors py-2">
              <div className="flex items-center gap-3">
                <Mail className="text-purple-500 w-5 h-5" />
                <input
                  name='email'
                  type="email"
                  required // <--- Added validation
                  placeholder="Email address"
                  className="block w-full bg-transparent border-none outline-0 focus:ring-0 text-gray-700 placeholder-purple-300"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative group border-b border-purple-300 focus-within:border-purple-600 transition-colors py-2">
              <div className="flex items-center gap-3">
                <Lock className="text-purple-500 w-5 h-5" />
                <input
                  name='password'
                  type={showPassword ? "text" : "password"}
                  required // <--- Added validation
                  placeholder="Enter password"
                  className="block w-full bg-transparent border-none outline-0 focus:ring-0 text-black placeholder-purple-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-purple-600 hover:text-purple-500 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            {/* Make sure ButtonWithText accepts `type="submit"` or handles click */}
            <ButtonWithText text={isLoading ? 'Signing In...' : 'Sign In'} isLoading={isLoading}></ButtonWithText>

            {/* Divider */}
            {/* <div className="relative flex items-center py-4">
              <div className="grow border-t border-gray-100"></div>
              <span className="shrink mx-4 text-xs font-semibold text-purple-400 uppercase tracking-widest">OR</span>
              <div className="grow border-t border-gray-100"></div>
            </div> */}

            {/* Google Login Button */}
            {/* <GoogleOAuth 
                title={'Sign In with Google'} 
                onClick={handleGoogleOAuth} 
            /> */}
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="text-purple-500 font-semibold hover:underline">
              Create new one.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;