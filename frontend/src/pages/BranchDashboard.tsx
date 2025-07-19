import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  Users, 
  Wallet, 
  TrendingUp, 
  AlertCircle, 
  DollarSign,
  Building2,
  CreditCard,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  LogOut
} from 'lucide-react';

const branchStats = {
  'JKT-01': {
    name: 'Cabang Jakarta Pusat',
    totalMembers: 456,
    totalSavings: 'Rp 1.2M',
    activeLoans: 'Rp 850K',
    overdue: 'Rp 45K',
    monthlyTarget: 'Rp 2M',
    achieved: 'Rp 1.8M',
    achievementRate: 90,
    period: 'Januari 2024'
  },
  'SBY-01': {
    name: 'Cabang Surabaya',
    totalMembers: 324,
    totalSavings: 'Rp 980K',
    activeLoans: 'Rp 720K',
    overdue: 'Rp 32K',
    monthlyTarget: 'Rp 1.5M',
    achieved: 'Rp 1.3M',
    achievementRate: 87,
    period: 'Januari 2024'
  },
  'BDG-01': {
    name: 'Cabang Bandung',
    totalMembers: 278,
    totalSavings: 'Rp 650K',
    activeLoans: 'Rp 480K',
    overdue: 'Rp 28K',
    monthlyTarget: 'Rp 1M',
    achieved: 'Rp 920K',
    achievementRate: 92,
    period: 'Januari 2024'
  }
};

const recentTransactions = [
  { id: 1, type: 'Pinjaman', member: 'Andi Wijaya', amount: 'Rp 2,000,000', status: 'Approved', time: '2 jam lalu' },
  { id: 2, type: 'Simpanan', member: 'Siti Nurhaliza', amount: 'Rp 500,000', status: 'Success', time: '3 jam lalu' },
  { id: 3, type: 'Pelunasan', member: 'Budi Santoso', amount: 'Rp 1,500,000', status: 'Success', time: '5 jam lalu' },
  { id: 4, type: 'Pinjaman', member: 'Dewi Lestari', amount: 'Rp 3,000,000', status: 'Pending', time: '1 hari lalu' },
];

const loanApplications = [
  { id: 1, member: 'Ahmad Fauzi', amount: 'Rp 5,000,000', purpose: 'Modal Usaha', status: 'Review', submittedAt: '2 hari lalu' },
  { id: 2, member: 'Rita Sari', amount: 'Rp 2,500,000', purpose: 'Renovasi Rumah', status: 'Pending', submittedAt: '1 hari lalu' },
  { id: 3, member: 'Joko Susilo', amount: 'Rp 1,000,000', purpose: 'Pendidikan', status: 'Approved', submittedAt: '3 hari lalu' },
];

export function BranchDashboard() {
  const { user, logout, requireAuth, loading: authLoading } = useAuth();
  const [currentStats, setCurrentStats] = useState<any>(null);

  useEffect(() => {
    // Check if user is authenticated and has branch role
    if (!authLoading && !requireAuth('branch')) {
      return;
    }

    // Set branch stats based on user's branch
    if (user?.branchCode && branchStats[user.branchCode as keyof typeof branchStats]) {
      setCurrentStats(branchStats[user.branchCode as keyof typeof branchStats]);
    } else {
      // Default to Jakarta if no branch code
      setCurrentStats(branchStats['JKT-01']);
    }
  }, [user, authLoading, requireAuth]);

  if (authLoading || !user || !currentStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Anggota",
      value: currentStats.totalMembers.toString(),
      change: "+8",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Total Simpanan",
      value: currentStats.totalSavings,
      change: "+12%",
      icon: Wallet,
      color: "text-green-600"
    },
    {
      title: "Pinjaman Aktif",
      value: currentStats.activeLoans,
      change: "+5%",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Tunggakan",
      value: currentStats.overdue,
      change: "-2%",
      icon: AlertCircle,
      color: "text-red-600"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Dashboard Cabang</h1>
            <p className="text-muted-foreground">Monitoring dan analisis kinerja cabang</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>

        {/* Branch Info */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Building2 className="w-5 h-5" />
              {currentStats.name}
            </CardTitle>
            <CardDescription>Periode: {currentStats.period}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Target Bulanan: <span className="font-medium">{currentStats.monthlyTarget}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Pencapaian: <span className="font-medium">{currentStats.achieved}</span></span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{currentStats.achievementRate}%</div>
                <div className="text-sm text-muted-foreground">Achievement Rate</div>
                <div className="w-24 h-2 bg-muted rounded-full mt-2">
                  <div 
                    className="h-2 bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${currentStats.achievementRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="relative overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full bg-background ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  {stat.change.startsWith('+') ? (
                    <ArrowUpRight className="w-3 h-3 text-green-600" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-red-600" />
                  )}
                  <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                    {stat.change}
                  </span>
                  {' '}dari bulan lalu
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Transaksi Terbaru
              </CardTitle>
              <CardDescription>Aktivitas transaksi hari ini</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        {transaction.type === 'Pinjaman' && <CreditCard className="h-4 w-4 text-primary" />}
                        {transaction.type === 'Simpanan' && <Wallet className="h-4 w-4 text-green-600" />}
                        {transaction.type === 'Pelunasan' && <DollarSign className="h-4 w-4 text-purple-600" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.member}</p>
                        <p className="text-xs text-muted-foreground">{transaction.type} • {transaction.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{transaction.amount}</p>
                      <Badge variant={
                        transaction.status === 'Success' ? 'default' :
                        transaction.status === 'Approved' ? 'default' :
                        transaction.status === 'Pending' ? 'secondary' : 'outline'
                      } className="text-xs">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Loan Applications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Pengajuan Pinjaman
              </CardTitle>
              <CardDescription>Pengajuan yang memerlukan persetujuan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loanApplications.map((application) => (
                  <div key={application.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-sm">{application.member}</p>
                        <p className="text-xs text-muted-foreground">{application.purpose}</p>
                      </div>
                      <Badge variant={
                        application.status === 'Approved' ? 'default' :
                        application.status === 'Review' ? 'secondary' : 'outline'
                      } className="text-xs">
                        {application.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-primary">{application.amount}</span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {application.submittedAt}
                      </div>
                    </div>
                    {application.status === 'Pending' && (
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 text-xs">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 text-xs">
                          Review
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Aksi Cepat
            </CardTitle>
            <CardDescription>Tindakan yang sering dilakukan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button className="h-20 flex-col gap-2 bg-blue-600 hover:bg-blue-700">
                <Users className="w-5 h-5" />
                <span className="text-xs">Daftar Anggota Baru</span>
              </Button>
              <Button className="h-20 flex-col gap-2" variant="outline">
                <CreditCard className="w-5 h-5" />
                <span className="text-xs">Proses Pinjaman</span>
              </Button>
              <Button className="h-20 flex-col gap-2" variant="outline">
                <Wallet className="w-5 h-5" />
                <span className="text-xs">Input Simpanan</span>
              </Button>
              <Button className="h-20 flex-col gap-2" variant="outline">
                <TrendingUp className="w-5 h-5" />
                <span className="text-xs">Laporan Harian</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}