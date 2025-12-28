import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Wind, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(false); // Default to signup
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
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: "Account not found",
              description: "No account exists with this email. Please sign up first.",
              variant: "destructive",
            });
            setIsLogin(false); // Switch to signup mode
          } else {
            throw error;
          }
          return;
        }
        toast({
          title: "Welcome back!",
          description: "You're now signed in.",
        });
        onAuthSuccess();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        if (error) {
          if (error.message.includes('User already registered')) {
            toast({
              title: "Account exists",
              description: "This email is already registered. Please sign in instead.",
              variant: "destructive",
            });
            setIsLogin(true); // Switch to login mode
          } else {
            throw error;
          }
          return;
        }
        
        // Check if user was created and signed in
        if (data.user) {
          toast({
            title: "Account created!",
            description: "Welcome to BreatheFree!",
          });
          onAuthSuccess();
        }
      }
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
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
        {/* Tab Switcher */}
        <div className="flex bg-secondary rounded-2xl p-1.5 mb-8">
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 tap-scale ${
              !isLogin
                ? 'bg-card text-foreground shadow-lg'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            disabled={isLoading}
          >
            Sign Up
          </button>
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 tap-scale ${
              isLogin
                ? 'bg-card text-foreground shadow-lg'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            disabled={isLoading}
          >
            Sign In
          </button>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="text-muted-foreground text-center mb-8">
          {isLogin ? 'Sign in to continue your journey' : 'Join thousands quitting smoking'}
        </p>

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
              placeholder="Password (min 6 characters)"
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

        {/* Info text */}
        <p className="text-center mt-6 text-sm text-muted-foreground">
          {isLogin ? (
            <>
              New here?{' '}
              <button
                onClick={() => setIsLogin(false)}
                className="text-primary font-semibold hover:underline tap-scale"
                disabled={isLoading}
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setIsLogin(true)}
                className="text-primary font-semibold hover:underline tap-scale"
                disabled={isLoading}
              >
                Sign in
              </button>
            </>
          )}
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
