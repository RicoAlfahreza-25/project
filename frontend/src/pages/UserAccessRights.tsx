import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Shield, Users, Save, Building2 } from 'lucide-react';

const users = [
  { id: 1, name: 'John Doe', email: 'john@koperasi.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@koperasi.com', role: 'Checker' },
  { id: 3, name: 'Bob Johnson', email: 'bob@koperasi.com', role: 'Approver' },
];

const branches = [
  { id: 1, name: 'Cabang Jakarta Pusat', code: 'JKT-01' },
  { id: 2, name: 'Cabang Surabaya', code: 'SBY-01' },
  { id: 3, name: 'Cabang Bandung', code: 'BDG-01' },
];

const accessRights = [
  { id: 'checker_loan', name: 'Checker Pinjaman', description: 'Dapat memeriksa pengajuan pinjaman' },
  { id: 'approver_loan', name: 'Approver Pinjaman', description: 'Dapat menyetujui pengajuan pinjaman' },
  { id: 'admin_branch', name: 'Admin Cabang', description: 'Akses penuh ke cabang tertentu' },
  { id: 'view_reports', name: 'Lihat Laporan', description: 'Dapat melihat laporan keuangan' },
  { id: 'manage_users', name: 'Kelola Users', description: 'Dapat mengelola pengguna sistem' },
  { id: 'manage_products', name: 'Kelola Produk', description: 'Dapat mengelola produk simpan pinjam' },
];

export function UserAccessRights() {
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedRights, setSelectedRights] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSaveRights = () => {
    if (!selectedUser) {
      toast({
        title: "Error",
        description: "Silakan pilih pengguna terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Hak Akses Berhasil Disimpan",
      description: `Hak akses untuk user telah berhasil diperbarui`,
    });
  };

  const handleRightChange = (rightId: string, checked: boolean) => {
    setSelectedRights(prev => 
      checked 
        ? [...prev, rightId]
        : prev.filter(id => id !== rightId)
    );
  };

  const selectedUserData = users.find(user => user.id.toString() === selectedUser);
  const selectedBranchData = branches.find(branch => branch.id.toString() === selectedBranch);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Settings Hak Akses Users</h1>
            <p className="text-muted-foreground">Kelola hak akses dan permissions pengguna sistem</p>
          </div>
          <Button onClick={handleSaveRights} className="bg-gradient-to-r from-primary to-primary-muted">
            <Save className="w-4 h-4 mr-2" />
            Simpan Hak Akses
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* User Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Pilih Pengguna
              </CardTitle>
              <CardDescription>Pilih pengguna yang akan diatur hak aksesnya</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Pengguna</label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih pengguna" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        <div className="flex items-center gap-2">
                          <span>{user.name}</span>
                          <Badge variant="secondary">{user.role}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedUserData && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium">{selectedUserData.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedUserData.email}</p>
                  <Badge className="mt-2">{selectedUserData.role}</Badge>
                </div>
              )}

              {selectedRights.includes('admin_branch') && (
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Cabang
                  </label>
                  <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih cabang" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map(branch => (
                        <SelectItem key={branch.id} value={branch.id.toString()}>
                          {branch.name} ({branch.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Access Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Hak Akses
              </CardTitle>
              <CardDescription>Tentukan hak akses yang akan diberikan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accessRights.map(right => (
                  <div key={right.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={right.id}
                      checked={selectedRights.includes(right.id)}
                      onCheckedChange={(checked) => handleRightChange(right.id, checked as boolean)}
                    />
                    <div className="flex-1">
                      <label 
                        htmlFor={right.id} 
                        className="text-sm font-medium cursor-pointer"
                      >
                        {right.name}
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {right.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Selected Rights */}
        {selectedRights.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Preview Hak Akses</CardTitle>
              <CardDescription>Hak akses yang akan diberikan kepada pengguna</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {selectedRights.map(rightId => {
                  const right = accessRights.find(r => r.id === rightId);
                  return (
                    <Badge key={rightId} variant="outline" className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      {right?.name}
                    </Badge>
                  );
                })}
              </div>
              
              {selectedRights.includes('admin_branch') && selectedBranchData && (
                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium">Admin Cabang:</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedBranchData.name} ({selectedBranchData.code})
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}