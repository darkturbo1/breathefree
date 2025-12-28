import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, CreditCard, Shield, Loader2, Crown, Check, ExternalLink, RotateCcw, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface SettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
  onResetProgram?: () => Promise<void>;
}

const SettingsSheet: React.FC<SettingsSheetProps> = ({ open, onOpenChange, userEmail, onResetProgram }) => {
  const { toast } = useToast();
  const { subscribed, subscriptionEnd, isLoading: subLoading, startCheckout, openCustomerPortal } = useSubscription();
  
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleResetProgram = async () => {
    if (!onResetProgram) return;
    
    setIsResetting(true);
    try {
      await onResetProgram();
      toast({
        title: "Program Reset",
        description: "Your quit journey has been restarted. You've got this!",
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsResetting(false);
    }
  };
  

  const handleUpdateEmail = async () => {
    if (!newEmail.trim()) {
      toast({ title: "Error", description: "Please enter a new email address", variant: "destructive" });
      return;
    }

    setIsUpdatingEmail(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      
      toast({
        title: "Confirmation sent",
        description: "Please check your new email address for a confirmation link",
      });
      setNewEmail('');
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }

    if (newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      
      toast({ title: "Success", description: "Your password has been updated" });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleUpgrade = async () => {
    setIsCheckingOut(true);
    try {
      await startCheckout();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      await openCustomerPortal();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[440px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Account Settings
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="account" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Account
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Pro
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6 mt-6">
            {/* Current Email */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Current Email</Label>
              <p className="font-medium">{userEmail}</p>
            </div>

            {/* Change Email */}
            <div className="space-y-3 pt-4 border-t">
              <Label>Change Email</Label>
              <Input
                type="email"
                placeholder="New email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <Button 
                onClick={handleUpdateEmail} 
                disabled={isUpdatingEmail}
                className="w-full"
              >
                {isUpdatingEmail ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</>
                ) : (
                  'Update Email'
                )}
              </Button>
            </div>

            {/* Change Password */}
            <div className="space-y-3 pt-4 border-t">
              <Label>Change Password</Label>
              <Input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button 
                onClick={handleUpdatePassword} 
                disabled={isUpdatingPassword}
                className="w-full"
              >
                {isUpdatingPassword ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</>
                ) : (
                  'Update Password'
                )}
              </Button>
            </div>

            {/* Reset Program */}
            {onResetProgram && (
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <Label className="text-destructive">Reset Program</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Started smoking again? No judgment – relapse is part of many quit journeys. 
                  Reset your program to start fresh with a new quit date.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      disabled={isResetting}
                    >
                      {isResetting ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Resetting...</>
                      ) : (
                        <>
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Reset My Journey
                        </>
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <RotateCcw className="w-5 h-5" />
                        Start Over?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="space-y-2">
                        <p>
                          This will reset your quit date to today and clear your progress. 
                          Your journal entries will be kept.
                        </p>
                        <p className="font-medium text-foreground">
                          Remember: Every quit attempt teaches you something. You've got this! 💪
                        </p>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleResetProgram}>
                        Yes, Start Fresh
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </TabsContent>

          <TabsContent value="subscription" className="space-y-6 mt-6">
            {subLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : subscribed ? (
              <>
                {/* Pro Status */}
                <div className="glass-panel-strong p-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                    <Crown className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg gradient-text">Pro Member</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your subscription renews on{' '}
                    {subscriptionEnd ? format(new Date(subscriptionEnd), 'MMM d, yyyy') : 'N/A'}
                  </p>
                </div>

                {/* Pro Features */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Your Pro benefits:</p>
                  <ul className="space-y-2">
                    {['Personalized AI coaching', 'Advanced progress analytics', 'Priority support', 'Custom milestones'].map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-success" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  variant="outline" 
                  onClick={handleManageSubscription}
                  className="w-full"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Manage Subscription
                </Button>
              </>
            ) : (
              <>
                {/* Upgrade CTA */}
                <div className="glass-panel-strong p-6 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
                  <Crown className="w-10 h-10 text-primary mx-auto mb-3" />
                  <h3 className="font-bold text-xl">Upgrade to Pro</h3>
                  <p className="text-3xl font-bold gradient-text mt-2">$3<span className="text-base font-normal text-muted-foreground">/month</span></p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Get personalized support on your quit journey
                  </p>
                </div>

                {/* Pro Features */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">What you'll get:</p>
                  <ul className="space-y-2">
                    {[
                      'Personalized AI coaching sessions',
                      'Advanced progress analytics & insights',
                      'Priority support when you need it',
                      'Custom milestone creation',
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-success" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  onClick={handleUpgrade}
                  disabled={isCheckingOut}
                  className="w-full"
                  size="lg"
                >
                  {isCheckingOut ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                  ) : (
                    <>
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Pro
                    </>
                  )}
                </Button>
              </>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsSheet;
