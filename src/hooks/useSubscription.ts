import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionState {
  subscribed: boolean;
  productId: string | null;
  subscriptionEnd: string | null;
  isLoading: boolean;
}

export function useSubscription() {
  const [state, setState] = useState<SubscriptionState>({
    subscribed: false,
    productId: null,
    subscriptionEnd: null,
    isLoading: true,
  });

  const checkSubscription = useCallback(async () => {
    try {
      // First check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.log('No active session, skipping subscription check');
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Error checking subscription:', error);
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      setState({
        subscribed: data.subscribed || false,
        productId: data.product_id || null,
        subscriptionEnd: data.subscription_end || null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    checkSubscription();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        checkSubscription();
      } else if (event === 'SIGNED_OUT') {
        setState({
          subscribed: false,
          productId: null,
          subscriptionEnd: null,
          isLoading: false,
        });
      }
    });
    
    // Check every 60 seconds only if user is authenticated
    const interval = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        checkSubscription();
      }
    }, 60000);
    
    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [checkSubscription]);

  const startCheckout = async () => {
    try {
      // Try to refresh the session first
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError || !refreshData.session) {
        // Session is invalid, sign out and throw
        await supabase.auth.signOut();
        throw new Error('Your session has expired. Please sign in again.');
      }

      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) {
        // Check if it's an auth error
        if (error.message?.includes('Authentication') || error.message?.includes('auth')) {
          await supabase.auth.signOut();
          throw new Error('Your session has expired. Please sign in again.');
        }
        throw error;
      }
      
      if (data?.url) {
        window.open(data.url, '_blank');
      } else if (data?.error) {
        throw new Error(data.error);
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Error starting checkout:', error);
      throw error;
    }
  };

  const openCustomerPortal = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      throw error;
    }
  };

  return {
    ...state,
    checkSubscription,
    startCheckout,
    openCustomerPortal,
  };
}
