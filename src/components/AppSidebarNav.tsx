import { useLocation, useNavigate, NavLink as RouterNavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, ShoppingCart, Package, History, LogOut, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { useState } from 'react';

const allNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['cashier', 'manager', 'owner'] },
  { path: '/pos', label: 'POS Terminal', icon: ShoppingCart, roles: ['cashier', 'manager', 'owner'] },
  { path: '/inventory', label: 'Inventory', icon: Package, roles: ['manager', 'owner'] },
  { path: '/sales', label: 'Sales History', icon: History, roles: ['cashier', 'manager', 'owner'] },
  { path: '/staff', label: 'Staff', icon: Users, roles: ['owner'] },
];

export function AppSidebarNav() {
  const { role, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = allNavItems.filter((item) => item.roles.includes(role || ''));

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className={`flex flex-col h-full bg-sidebar text-sidebar-foreground transition-all duration-200 ${collapsed ? 'w-16' : 'w-56'}`}>
      <div className="h-12 flex items-center px-3 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-sidebar-primary flex items-center justify-center">
              <Package className="h-4 w-4 text-sidebar-primary-foreground" />
            </div>
            <span className="font-bold text-sm">BulkDrink</span>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="ml-auto h-7 w-7 rounded flex items-center justify-center hover:bg-sidebar-accent transition-colors">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 py-2 space-y-0.5 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <RouterNavLink key={item.path} to={item.path}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              }`}>
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </RouterNavLink>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        {!collapsed && (
          <div className="mb-2">
            <p className="text-xs font-medium truncate">{profile?.full_name}</p>
            <p className="text-xs text-sidebar-foreground/50 capitalize">{role}</p>
          </div>
        )}
        <button onClick={handleSignOut}
          className="flex items-center gap-2 w-full px-2.5 py-2 rounded-md text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors">
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
}
