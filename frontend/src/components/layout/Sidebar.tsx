import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Settings,
  Users,
  Building2,
  CreditCard,
  TrendingUp,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileText,
  ArrowUpCircle,
  CheckCircle2,
  HeartPulse,
  Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const adminMenu = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Package, label: 'Add Products', path: '/products/add' },
  { icon: Settings, label: 'Settings Products', path: '/products/settings' },
  { icon: CreditCard, label: 'Settings PKA', path: '/settings/pka' },
  { icon: TrendingUp, label: 'Settings Top Up', path: '/settings/topup' },
  { icon: Shield, label: 'User Access Rights', path: '/users/access' },
  { icon: Building2, label: 'Management Branches', path: '/management/branches' },
  { icon: CreditCard, label: 'Management Kantor Bayar', path: '/management/payment-offices' },
  { icon: Users, label: 'Management Users', path: '/management/users' },
];

const branchMenu = [
  { icon: LayoutDashboard, label: 'Dashboard Cabang', path: '/branch-dashboard' },
  { icon: Users, label: 'Anggota', path: '/branch/members' },
  { icon: FileText, label: 'Data Pinjaman', path: '/branch/loans' },
  { icon: ArrowUpCircle, label: 'Top Up Pinjaman', path: '/branch/topup' },
  { icon: CheckCircle2, label: 'Pelunasan PKA', path: '/branch/pka-repayment' },
  { icon: HeartPulse, label: 'Nasabah Meninggal', path: '/branch/deceased' },
  { icon: Wallet, label: 'Data Simpanan', path: '/branch/savings' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, user } = useAuth();

  const menuItems = user?.role === 'branch' ? branchMenu : adminMenu;

  return (
    <div className={cn(
      "bg-card border-r border-border h-screen flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-primary">Koperasi</h1>
              <p className="text-sm text-muted-foreground">Simpan Pinjam</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
              "hover:bg-primary/10 hover:text-primary",
              isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            "w-full justify-start gap-3 text-destructive hover:bg-destructive/10",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}