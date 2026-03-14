import { Outlet } from 'react-router-dom';
import { AppSidebarNav } from '@/components/AppSidebarNav';

export default function AppLayout() {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <AppSidebarNav />
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
