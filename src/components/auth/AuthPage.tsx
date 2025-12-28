import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Wind, Mail, Eye, EyeOff, Loader2, Chrome } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onAuthSuccess();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        if (error) throw error;
        toast({
          title: "Account created!",
          description: "You're now signed in.",
        });
        onAuthSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Google sign in failed",
        description: "Please configure Google OAuth in your dashboard",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleAppleAuth = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Apple sign in failed",
        description: "Please configure Apple OAuth in your dashboard",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex flex-col items-center justify-center p-6 relative z-10">
      {/* Logo */}
      <div className="text-center mb-10 animate-fade-in">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6 animate-float">
          <Wind className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-2">BreatheFree</h1>
        <p className="text-muted-foreground text-lg">Start your smoke-free journey</p>
      </div>

      {/* Auth Card */}
      <div className="glass-panel-strong w-full max-w-md p-8 animate-fade-in-scale animate-delay-200">
        <h2 className="text-2xl font-bold text-center mb-2">
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="text-muted-foreground text-center mb-8">
          {isLogin ? 'Sign in to continue your journey' : 'Join thousands quitting smoking'}
        </p>

        {/* Social Buttons */}
        <div className="space-y-3 mb-6">
          <Button
            variant="social"
            className="w-full justify-center gap-3"
            onClick={handleGoogleAuth}
            disabled={isLoading}
          >
            <Chrome className="w-5 h-5" />
            Continue with Google
          </Button>
          <Button
            variant="social"
            className="w-full justify-center gap-3"
            onClick={handleAppleAuth}
            disabled={isLoading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Continue with Apple
          </Button>
        </div>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-card text-muted-foreground">or continue with email</span>
          </div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input pl-12"
              disabled={isLoading}
            />
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input pr-12"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isLogin ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        {/* Toggle */}
        <p className="text-center mt-6 text-muted-foreground">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-semibold hover:underline tap-scale"
            disabled={isLoading}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>

      {/* Footer */}
      <p className="text-muted-foreground text-sm mt-8 text-center max-w-xs animate-fade-in animate-delay-400">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
};

export default AuthPage;
