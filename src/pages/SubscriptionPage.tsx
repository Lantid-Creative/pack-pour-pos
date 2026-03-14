import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Check, Crown, Zap, Building2, Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: '₦5,000',
    yearlyPrice: '₦48,000',
    yearlySavings: 'Save ₦12,000',
    icon: Zap,
    features: ['1 Store', 'Up to 100 Products', '2 Staff Accounts', 'Basic Reports', 'Email Support'],
    popular: false,
  },
  {
    id: 'business',
    name: 'Business',
    monthlyPrice: '₦15,000',
    yearlyPrice: '₦144,000',
    yearlySavings: 'Save ₦36,000',
    icon: Crown,
    features: ['1 Store', 'Unlimited Products', '10 Staff Accounts', 'Advanced Reports', 'Priority Support', 'Inventory Alerts'],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: '₦50,000',
    yearlyPrice: '₦480,000',
    yearlySavings: 'Save ₦120,000',
    icon: Building2,
    features: ['Multiple Stores', 'Unlimited Products', 'Unlimited Staff', 'Custom Reports', 'Dedicated Support', 'API Access', 'White Label'],
    popular: false,
  },
];

export default function SubscriptionPage() {
  const { storeId, user, refetchSubscription } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const { data: subscription, refetch } = useQuery({
    queryKey: ['subscription', storeId],
    queryFn: async () => {
      if (!storeId) return null;
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!storeId,
  });

  // Check for payment callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get('reference');
    if (reference) {
      verifyPayment(reference);
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const verifyPayment = async (reference: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase.functions.invoke('paystack-verify', {
        body: { reference },
      });

      if (error) throw error;

      if (data.success) {
        toast.success('Payment successful! Your subscription is now active.');
        refetch();
        await refetchSubscription();
      } else {
        toast.error('Payment was not successful. Please try again.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      toast.error('Could not verify payment. Please contact support.');
    }
  };

  const handleSubscribe = async (plan: string) => {
    if (!storeId || !user) return;
    setLoadingPlan(plan);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const callbackUrl = `${window.location.origin}/subscription`;

      const { data, error } = await supabase.functions.invoke('paystack-initialize', {
        body: { plan, store_id: storeId, callback_url: callbackUrl, billing_cycle: billingCycle },
      });

      if (error) throw error;

      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error('No authorization URL returned');
      }
    } catch (err) {
      console.error('Payment init error:', err);
      toast.error('Could not initialize payment. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  const isActive = subscription?.status === 'active';
  const currentPlan = subscription?.plan;
  const expiresAt = subscription?.expires_at ? new Date(subscription.expires_at) : null;

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Subscription</h1>
            <p className="text-muted-foreground mt-1">Manage your store's subscription plan</p>
          </div>
          {/* Billing Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Current Status */}
        {subscription && (
          <div className={`rounded-xl border p-5 mb-8 ${isActive ? 'border-primary/30 bg-primary/5' : 'border-destructive/30 bg-destructive/5'}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-destructive'}`} />
                  <span className="font-semibold text-foreground capitalize">
                    {currentPlan} Plan — {isActive ? 'Active' : subscription.status}
                  </span>
                </div>
                {expiresAt && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {isActive ? `Expires ${expiresAt.toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}` : 'Subscription expired'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => {
            const isCurrent = isActive && currentPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative rounded-xl border p-6 flex flex-col transition-all ${
                  plan.popular
                    ? 'border-primary shadow-lg shadow-primary/10 scale-[1.02]'
                    : 'border-border hover:border-primary/40'
                } ${isCurrent ? 'ring-2 ring-primary' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <plan.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{plan.name}</h3>
                  </div>
                </div>

                <div className="mb-5">
                  <span className="text-3xl font-extrabold text-foreground">
                    {billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {billingCycle === 'monthly' ? '/month' : '/year'}
                  </span>
                  {billingCycle === 'yearly' && (
                    <div className="mt-1">
                      <span className="text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                        {plan.yearlySavings}
                      </span>
                    </div>
                  )}
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isCurrent || !!loadingPlan}
                  className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    isCurrent
                      ? 'bg-primary/10 text-primary cursor-default'
                      : plan.popular
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]'
                        : 'border border-primary text-primary hover:bg-primary/10 active:scale-[0.98]'
                  } disabled:opacity-50`}
                >
                  {loadingPlan === plan.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isCurrent ? (
                    'Current Plan'
                  ) : (
                    <>
                      Subscribe <ExternalLink className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
