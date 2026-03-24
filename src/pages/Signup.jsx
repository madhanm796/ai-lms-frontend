import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import decorativeDotsReflected from '../assets/images/dots-reflected.png';
import decorativeDotsReflectedInverted from '../assets/images/dots-reflected-inverted.png';
import signUpVideo from '../assets/videos/sign_up.mp4';
import BirdLogo from '../components/BirdLogo';
import GoogleOAuth from '../components/GoogleOAuth';
import ButtonWithText from '../components/ButtonWithText'
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';

const Signup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('first_name');
    const lastName = formData.get('last_name');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm_password');

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      await authService.signup({
        email: email,
        password: password,
        full_name: (firstName + ' ' + lastName)
      });

      toast.success("Account created! Please log in.");
      navigate('/login');

    } catch (error) {
      console.error("Signup error:", error);
      const message = error.response?.data?.detail || "Signup failed. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row-reverse bg-white relative overflow-hidden font-sans">

                 
            {isLoading && <LoadingSpinner />}

            {/* Bird Logo - Top Left */}
            <div className="absolute top-10 left-10">
                <BirdLogo></BirdLogo>
            </div>

            {/* Decorative Dots - Top Center-ish */}
            <div className="absolute top-10 right-[32%] hidden lg:grid grid-cols-2 gap-2">
                <img src={decorativeDotsReflected} className='max-w-10'></img>
            </div>

            {/* Decorative Dots - Bottom Left */}
            <div className="absolute bottom-10 left-10 hidden lg:grid grid-cols-3 gap-2">
                <img src={decorativeDotsReflectedInverted} className='max-w-10'></img>
            </div>

            {/* Right Section - Purple Block (Mirrored from Login) */}
            <div className="hidden md:flex md:w-1/3 w-2/4 bg-white p-4 h-screen items-center">
                <div className="w-full h-[98%] bg-[#a855f7] rounded-[2.5rem]">
                    <div className="w-full h-full bg-[#a855f7] rounded-[2.5rem] overflow-clip">
                        <video className="w-full h-full object-fill overflow-hidden" src={signUpVideo} autoPlay muted playsInline loop controls={false}/>
                    </div>
                </div>
            </div>

            {/* Left Section - Sign Up Form */}
            <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 md:px-24">
                <div className="w-full max-w-md space-y-6">

                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-gray-800">Sign Up</h1>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        </p>
                    </div>

                    <form className="mt-8 space-y-5" onSubmit={(e) => {handleSignup(e)}}>

                        {/* Name Fields Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative border-b border-purple-200 focus-within:border-purple-500 transition-colors py-2">
                                <div className="flex items-center gap-2">
                                    <User className="text-purple-500 w-4 h-4" />
                                    <input
                                        required
                                        name='first_name'
                                        type="text"
                                        placeholder="First Name"
                                        className="block w-full bg-transparent border-none focus:ring-0 text-sm text-gray-700 placeholder-purple-300"
                                    />
                                </div>
                            </div>
                            <div className="relative border-b border-purple-200 focus-within:border-purple-500 transition-colors py-2">
                                <div className="flex items-center gap-2">
                                    <User className="text-purple-500 w-4 h-4" />
                                    <input
                                        required
                                        name='last_name'
                                        type="text"
                                        placeholder="Last Name"
                                        className="block w-full bg-transparent border-none focus:ring-0 text-sm text-gray-700 placeholder-purple-300"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="relative border-b border-purple-200 focus-within:border-purple-500 transition-colors py-2">
                            <div className="flex items-center gap-3">
                                <Mail className="text-purple-500 w-5 h-5" />
                                <input
                                    required
                                    name='email'
                                    type="email"
                                    placeholder="Email"
                                    className="block w-full bg-transparent border-none focus:ring-0 text-gray-700 placeholder-purple-300"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="relative border-b border-purple-200 focus-within:border-purple-500 transition-colors py-2">
                            <div className="flex items-center gap-3">
                                <Lock className="text-purple-500 w-5 h-5" />
                                <input
                                    required
                                    name='password'
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter password"
                                    className="block w-full bg-transparent border-none focus:ring-0 text-gray-700 placeholder-purple-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-purple-300 hover:text-purple-500 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="relative border-b border-purple-200 focus-within:border-purple-500 transition-colors py-2">
                            <div className="flex items-center gap-3">
                                <Lock className="text-purple-500 w-5 h-5" />
                                <input
                                    required
                                    name='confirm_password'
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    className="block w-full bg-transparent border-none focus:ring-0 text-gray-700 placeholder-purple-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="text-purple-300 hover:text-purple-500 focus:outline-none"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Sign Up Button */}
                        <ButtonWithText isLoading={isLoading} text={isLoading ? 'Creating an account...' : 'Create one'}>
                        </ButtonWithText>

                        {/* Divider */}
                        {/* <div className="relative flex items-center py-2">
                            <div className="grow border-t border-gray-100"></div>
                            <span className="shrink mx-4 text-xs font-bold text-purple-400 uppercase tracking-widest">OR</span>
                            <div className="grow border-t border-gray-100"></div>
                        </div> */}

                        {/* Google Signup Button */}
                        {/* <GoogleOAuth title={'Sign Up with Google'} onClick={() => {}}></GoogleOAuth> */}
                    </form>

                    {/* Footer */}
                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <a href="/login" className="text-purple-500 font-semibold hover:underline">
                            Log in.
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;