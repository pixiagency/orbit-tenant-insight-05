import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';
import { OTPVerificationForm } from '../components/auth/OTPVerificationForm';
import { LanguageSwitcher } from '../components/auth/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // If user is already authenticated, redirect to appropriate dashboard
    if (!isLoading && user) {
      if (user.role === 'super-admin') {
        navigate('/super-admin', { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      }
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleAuthSuccess = (email: string) => {
    setUserEmail(email);
    setShowOTP(true);
  };

  const handleOTPVerified = () => {
    // Redirect to appropriate dashboard after OTP verification
    if (user?.role === 'super-admin') {
      navigate('/super-admin', { replace: true });
    } else if (user?.role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, don't show auth form (will be redirected by useEffect)
  if (user) {
    return null;
  }

  return (
    <div 
      ref={backgroundRef}
      className="min-h-screen flex items-center justify-center px-2 py-4 md:px-8 md:py-6 xl:px-16 xl:py-10 relative overflow-hidden"
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
          rgba(99, 102, 241, 0.3) 0%, 
          rgba(59, 130, 246, 0.2) 25%, 
          rgba(147, 51, 234, 0.1) 50%, 
          rgba(236, 72, 153, 0.05) 75%, 
          transparent 100%)`,
      }}
    >
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x / 2}%`,
            top: `${mousePosition.y / 2}%`,
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.3s ease-out',
          }}
        />
        <div 
          className="absolute w-72 h-72 bg-gradient-to-r from-pink-400/15 to-indigo-600/15 rounded-full blur-2xl animate-pulse"
          style={{
            right: `${(100 - mousePosition.x) / 3}%`,
            bottom: `${(100 - mousePosition.y) / 3}%`,
            transform: 'translate(50%, 50%)',
            transition: 'all 0.5s ease-out',
            animationDelay: '1s',
          }}
        />
        <div 
          className="absolute w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-xl animate-pulse"
          style={{
            left: `${mousePosition.x / 4}%`,
            bottom: `${mousePosition.y / 4}%`,
            transform: 'translate(-25%, 25%)',
            transition: 'all 0.7s ease-out',
            animationDelay: '2s',
          }}
        />
      </div>

      {/* Backdrop blur effect */}
      <div className="absolute inset-0 backdrop-blur-[1px] bg-white/5" />

      <Card className="w-full max-w-md shadow-2xl backdrop-blur-md bg-white/90 border border-white/20 relative z-10">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CRM Platform
          </CardTitle>
          <CardDescription className="text-lg">
            {showOTP 
              ? 'Enter verification code'
              : isLogin 
                ? 'Welcome back' 
                : 'Create your account'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {showOTP ? (
            <OTPVerificationForm 
              email={userEmail}
              onVerified={handleOTPVerified}
              onBack={() => setShowOTP(false)}
            />
          ) : isLogin ? (
            <LoginForm onSuccess={handleAuthSuccess} />
          ) : (
            <SignupForm onSuccess={handleAuthSuccess} />
          )}
          
          {!showOTP && (
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </Button>
            </div>
          )}
          
          {isLogin && !showOTP && (
            <div className="mt-6 text-sm text-gray-600 bg-gray-50/80 p-4 rounded-lg">
              <p className="font-medium mb-2">Demo Accounts:</p>
              <p>Super Admin: superadmin@demo.com</p>
              <p>Tenant Admin: admin@demo.com</p>
              <p className="mt-1 text-xs">Use any password</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
