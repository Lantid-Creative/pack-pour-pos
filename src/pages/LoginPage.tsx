import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { UserRole } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Crown, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const roles: { role: UserRole; label: string; icon: React.ElementType; desc: string }[] = [
  { role: 'cashier', label: 'Cashier', icon: User, desc: 'POS terminal & personal sales' },
  { role: 'manager', label: 'Manager', icon: ShieldCheck, desc: 'Inventory, staff & sales reports' },
  { role: 'owner', label: 'Owner', icon: Crown, desc: 'Full analytics & system control' },
];

export default function LoginPage() {
  const { setRole } = useAppStore();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleLogin = () => {
    if (!selectedRole) return;
    setRole(selectedRole);
    navigate(selectedRole === 'cashier' ? '/pos' : '/dashboard');
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-primary mb-3">
            <Package className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-secondary-foreground">BulkDrink POS</h1>
          <p className="text-sm text-secondary-foreground/60">Wholesale Drinks Management System</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <p className="text-sm font-medium text-foreground">Select your role to continue</p>
          
          <div className="space-y-2">
            {roles.map(({ role, label, icon: Icon, desc }) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-lg border transition-all text-left ${
                  selectedRole === role
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/30 hover:bg-muted/50'
                }`}
              >
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  selectedRole === role ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleLogin}
            disabled={!selectedRole}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </motion.div>
    </div>
  );
}
