import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Building2, Plus, Edit, Trash2, MapPin, Phone, User } from 'lucide-react';

const branches = [
  {
    id: 1,
    name: 'Cabang Jakarta Pusat',
    code: 'JKT-01',
    address: 'Jl. Thamrin No. 1, Jakarta Pusat',
    phone: '021-1234567',
    manager: 'John Doe',
    status: 'active',
    established: '2023-01-15'
  },
  {
    id: 2,
    name: 'Cabang Surabaya',
    code: 'SBY-01',
    address: 'Jl. Pemuda No. 25, Surabaya',
    phone: '031-7654321',
    manager: 'Jane Smith',
    status: 'active',
    established: '2023-03-10'
  },
  {
    id: 3,
    name: 'Cabang Bandung',
    code: 'BDG-01',
    address: 'Jl. Asia Afrika No. 50, Bandung',
    phone: '022-9876543',
    manager: 'Bob Johnson',
    status: 'inactive',
    established: '2023-05-20'
  },
];

export function ManagementBranches() {
  const [branchData, setBranchData] = useState(branches);
  const [editingBranch, setEditingBranch] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    phone: '',
    manager: '',
    status: 'active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBranch) {
      // Update existing branch
      setBranchData(prev => prev.map(branch => 
        branch.id === editingBranch.id 
          ? { ...branch, ...formData }
          : branch
      ));
      toast({
        title: "Cabang Berhasil Diperbarui",
        description: `Cabang ${formData.name} telah berhasil diperbarui`,
      });
    } else {
      // Add new branch
      const newBranch = {
        id: Date.now(),
        ...formData,
        established: new Date().toISOString().split('T')[0]
      };
      setBranchData(prev => [...prev, newBranch]);
      toast({
        title: "Cabang Berhasil Ditambahkan",
        description: `Cabang ${formData.name} telah berhasil ditambahkan`,
      });
    }
    
    setFormData({
      name: '',
      code: '',
      address: '',
      phone: '',
      manager: '',
      status: 'active'
    });
    setEditingBranch(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (branch: any) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      code: branch.code,
      address: branch.address,
      phone: branch.phone,
      manager: branch.manager,
      status: branch.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setBranchData(prev => prev.filter(branch => branch.id !== id));
    toast({
      title: "Cabang Berhasil Dihapus",
      description: "Cabang telah berhasil dihapus dari sistem",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Management Cabang</h1>
            <p className="text-muted-foreground">Kelola cabang koperasi</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-primary to-primary-muted"
                onClick={() => {
                  setEditingBranch(null);
                  setFormData({
                    name: '',
                    code: '',
                    address: '',
                    phone: '',
                    manager: '',
                    status: 'active'
                  });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Cabang
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingBranch ? 'Edit Cabang' : 'Tambah Cabang Baru'}
                </DialogTitle>
                <DialogDescription>
                  {editingBranch ? 'Perbarui informasi cabang' : 'Tambahkan cabang baru ke sistem'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Cabang</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Cabang Jakarta Pusat"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Kode Cabang</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      placeholder="JKT-01"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Alamat</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Jl. Thamrin No. 1, Jakarta Pusat"
                    required
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telepon</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="021-1234567"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manager">Manager</Label>
                    <Input
                      id="manager"
                      value={formData.manager}
                      onChange={(e) => setFormData({...formData, manager: e.target.value})}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingBranch ? 'Perbarui' : 'Tambah'} Cabang
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Batal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Daftar Cabang
            </CardTitle>
            <CardDescription>Daftar semua cabang koperasi</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama Cabang</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branchData.map(branch => (
                  <TableRow key={branch.id}>
                    <TableCell className="font-medium">{branch.code}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{branch.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {branch.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{branch.address}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 text-muted-foreground" />
                        <span>{branch.manager}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={branch.status === 'active' ? 'default' : 'secondary'}>
                        {branch.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(branch)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(branch.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}