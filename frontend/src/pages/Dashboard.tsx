import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Users, 
  Wallet, 
  TrendingUp, 
  AlertCircle, 
  DollarSign,
  Building2,
  CreditCard,
  PieChart
} from 'lucide-react';

const stats = [
  {
    title: "Total Anggota",
    value: "1,234",
    change: "+12%",
    icon: Users,
    color: "text-blue-600"
  },
  {
    title: "Total Simpanan",
    value: "Rp 2.5M",
    change: "+8%",
    icon: Wallet,
    color: "text-success"
  },
  {
    title: "Pinjaman Aktif",
    value: "Rp 1.8M",
    change: "+15%",
    icon: TrendingUp,
    color: "text-accent"
  },
  {
    title: "Tunggakan",
    value: "Rp 120K",
    change: "-5%",
    icon: AlertCircle,
    color: "text-destructive"
  }
];

const recentActivity = [
  { id: 1, type: "Pinjaman", member: "John Doe", amount: "Rp 500,000", status: "Pending" },
  { id: 2, type: "Simpanan", member: "Jane Smith", amount: "Rp 100,000", status: "Success" },
  { id: 3, type: "Pelunasan", member: "Bob Johnson", amount: "Rp 250,000", status: "Success" },
  { id: 4, type: "Pinjaman", member: "Alice Brown", amount: "Rp 750,000", status: "Review" },
];

export function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <p className="text-muted-foreground">Selamat datang di sistem manajemen Koperasi Simpan Pinjam</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={stat.title} className="relative overflow-hidden animate-scale-in hover:shadow-lg transition-shadow duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}>
                    {stat.change}
                  </span>
                  {' '}dari bulan lalu
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
              <CardDescription>Transaksi terbaru dalam sistem</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        {activity.type === 'Pinjaman' && <CreditCard className="h-4 w-4 text-primary" />}
                        {activity.type === 'Simpanan' && <Wallet className="h-4 w-4 text-success" />}
                        {activity.type === 'Pelunasan' && <DollarSign className="h-4 w-4 text-accent" />}
                      </div>
                      <div>
                        <p className="font-medium">{activity.member}</p>
                        <p className="text-sm text-muted-foreground">{activity.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{activity.amount}</p>
                      <Badge variant={
                        activity.status === 'Success' ? 'default' :
                        activity.status === 'Pending' ? 'secondary' : 'outline'
                      }>
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
              <CardDescription>Menu yang sering digunakan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2">
                <div className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-primary/5">
                  <Building2 className="h-5 w-5 text-primary" />
                  <span>Tambah Anggota</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-primary/5">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span>Proses Pinjaman</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-primary/5">
                  <Wallet className="h-5 w-5 text-primary" />
                  <span>Input Simpanan</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-primary/5">
                  <PieChart className="h-5 w-5 text-primary" />
                  <span>Laporan</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}