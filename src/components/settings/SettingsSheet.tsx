import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserData, CURRENCIES, getCurrencySymbol } from '@/types/smoking';
import { 
  User, CreditCard, Shield, Loader2, Crown, Check, ExternalLink, 
  RotateCcw, AlertTriangle, Cigarette, Settings2, Mail, Lock, 
  Coins, Package, Calendar, MessageCircle, FileText
} from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';

interface SettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
  userData?: UserData | null;
  onResetProgram?: () => Promise<void>;
  onUpdateUserData?: (data: UserData) => Promise<void>;
}

const SettingsSheet: React.FC<SettingsSheetProps> = ({ 
  open, 
  onOpenChange, 
  userEmail, 
  userData,
  onResetProgram,
  onUpdateUserData
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { subscribed, subscriptionEnd, isLoading: subLoading, startCheckout, openCustomerPortal } = useSubscription();
  
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isSavingHabits, setIsSavingHabits] = useState(false);

  // Smoking habit editing state
  const [editCigarettesPerDay, setEditCigarettesPerDay] = useState(userData?.cigarettesPerDay || 10);
  const [editPricePerPack, setEditPricePerPack] = useState(userData?.pricePerPack || 8);
  const [editCigarettesPerPack, setEditCigarettesPerPack] = useState(userData?.cigarettesPerPack || 20);
  const [editCurrency, setEditCurrency] = useState(userData?.currency || 'EUR');

  // Sync state when userData changes
  React.useEffect(() => {
    if (userData) {
      setEditCigarettesPerDay(userData.cigarettesPerDay);
      setEditPricePerPack(userData.pricePerPack);
      setEditCigarettesPerPack(userData.cigarettesPerPack);
      setEditCurrency(userData.currency || 'EUR');
    }
  }, [userData]);

  const hasHabitChanges = userData && (
    editCigarettesPerDay !== userData.cigarettesPerDay ||
    editPricePerPack !== userData.pricePerPack ||
    editCigarettesPerPack !== userData.cigarettesPerPack ||
    editCurrency !== (userData.currency || 'EUR')
  );

  const handleSaveHabits = async () => {
    if (!userData || !onUpdateUserData) return;
    
    setIsSavingHabits(true);
    try {
      await onUpdateUserData({
        ...userData,
        cigarettesPerDay: editCigarettesPerDay,
        pricePerPack: editPricePerPack,
        cigarettesPerPack: editCigarettesPerPack,
        currency: editCurrency,
      });
      toast({
        title: "Settings Saved",
        description: "Your smoking habits have been updated.",
      });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSavingHabits(false);
    }
  };

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
      <SheetContent className="sm:max-w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-primary" />
            Settings
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="habits" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="habits" className="text-xs sm:text-sm">
              <Cigarette className="w-4 h-4 mr-1.5 hidden sm:inline" />
              Habits
            </TabsTrigger>
            <TabsTrigger value="account" className="text-xs sm:text-sm">
              <Shield className="w-4 h-4 mr-1.5 hidden sm:inline" />
              Account
            </TabsTrigger>
            <TabsTrigger value="subscription" className="text-xs sm:text-sm">
              <Crown className="w-4 h-4 mr-1.5 hidden sm:inline" />
              Pro
            </TabsTrigger>
          </TabsList>

          {/* Habits Tab */}
          <TabsContent value="habits" className="space-y-6 mt-6">
            {/* Currency Selection */}
            <div className="glass-panel p-4 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Coins className="w-4 h-4 text-primary" />
                <Label className="font-semibold">Currency</Label>
              </div>
              <Select value={editCurrency} onValueChange={setEditCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.symbol} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Smoking Habits */}
            <div className="glass-panel p-4 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Cigarette className="w-4 h-4 text-primary" />
                <Label className="font-semibold">Smoking Habits</Label>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">Cigarettes per day</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      value={editCigarettesPerDay}
                      onChange={(e) => setEditCigarettesPerDay(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-muted-foreground text-sm">cigarettes</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">Cigarettes per pack</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      min={1}
                      max={50}
                      value={editCigarettesPerPack}
                      onChange={(e) => setEditCigarettesPerPack(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-muted-foreground text-sm">cigarettes</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">Price per pack</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      min={1}
                      max={50}
                      step={0.01}
                      value={editPricePerPack}
                      onChange={(e) => setEditPricePerPack(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-muted-foreground text-sm">{getCurrencySymbol(editCurrency)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            {hasHabitChanges && (
              <Button 
                onClick={handleSaveHabits}
                disabled={isSavingHabits}
                className="w-full"
              >
                {isSavingHabits ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                ) : (
                  'Save Changes'
                )}
              </Button>
            )}

            <Separator />

            {/* Reset Program */}
            {onResetProgram && (
              <div className="glass-panel p-4 border-destructive/20">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <Label className="font-semibold text-destructive">Reset Program</Label>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Started smoking again? No judgment – relapse is part of many quit journeys. 
                  Reset to start fresh with new settings.
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
                          Start Over
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
                          This will reset your progress and take you back to the setup screen 
                          to re-enter your smoking habits. Your journal entries will be kept.
                        </p>
                        <p className="font-medium text-foreground">
                          Every quit attempt teaches you something. You've got this! 💪
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

            {/* Quit Date Info */}
            {userData && (
              <div className="glass-panel p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <Label className="text-muted-foreground text-sm">Your quit date</Label>
                </div>
                <p className="font-medium">
                  {format(new Date(userData.quitDate), 'MMMM d, yyyy')}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6 mt-6">
            {/* Current Email */}
            <div className="glass-panel p-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <Label className="text-muted-foreground text-sm">Current Email</Label>
              </div>
              <p className="font-medium">{userEmail}</p>
            </div>

            {/* Change Email */}
            <div className="glass-panel p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <Label className="font-semibold">Change Email</Label>
              </div>
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
                variant="secondary"
              >
                {isUpdatingEmail ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</>
                ) : (
                  'Update Email'
                )}
              </Button>
            </div>

            {/* Change Password */}
            <div className="glass-panel p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                <Label className="font-semibold">Change Password</Label>
              </div>
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
                variant="secondary"
              >
                {isUpdatingPassword ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</>
                ) : (
                  'Update Password'
                )}
              </Button>
            </div>

            <Separator />

            {/* Contact Us */}
            <div className="glass-panel p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-4 h-4 text-primary" />
                <Label className="font-semibold">Need Help?</Label>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Have questions or feedback? We'd love to hear from you.
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  onOpenChange(false);
                  navigate('/contact');
                }}
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Us
              </Button>
            </div>

            {/* Privacy Policy */}
            <div className="glass-panel p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-primary" />
                <Label className="font-semibold">Legal</Label>
              </div>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-muted-foreground hover:text-foreground"
                onClick={() => {
                  onOpenChange(false);
                  navigate('/privacy');
                }}
              >
                <FileText className="w-4 h-4 mr-2" />
                Privacy Policy
              </Button>
            </div>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-6 mt-6">
            {subLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : subscribed ? (
              <>
                {/* Pro Status */}
                <div className="glass-panel-strong p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Crown className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-xl gradient-text">Pro Member</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your subscription renews on{' '}
                    {subscriptionEnd ? format(new Date(subscriptionEnd), 'MMM d, yyyy') : 'N/A'}
                  </p>
                </div>

                {/* Pro Features */}
                <div className="glass-panel p-4 space-y-3">
                  <p className="text-sm font-semibold">Your Pro benefits:</p>
                  <ul className="space-y-2">
                    {['24/7 AI Coaching Support', 'Personalized Craving Help', 'Priority Support', 'Custom Milestones'].map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                          <Check className="w-3 h-3 text-success" />
                        </div>
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
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400" />
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Crown className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-xl">Upgrade to Pro</h3>
                  <p className="text-3xl font-bold gradient-text mt-2">$3<span className="text-base font-normal text-muted-foreground">/month</span></p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Get personalized support on your quit journey
                  </p>
                </div>

                {/* Pro Features */}
                <div className="glass-panel p-4 space-y-3">
                  <p className="text-sm font-semibold">What you'll get:</p>
                  <ul className="space-y-2">
                    {[
                      '24/7 AI Coaching Support',
                      'Personalized Craving Help',
                      'Priority Support',
                      'Custom Milestone Creation',
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
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