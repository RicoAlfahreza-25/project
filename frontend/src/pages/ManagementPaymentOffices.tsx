import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Plus, Edit, Trash2, MapPin, Phone, Building } from 'lucide-react';

const paymentOffices = [
  {
    id: 1,
    name: 'Bank BRI',
    code: 'BRI-001',
    type: 'bank',
    address: 'Jl. Sudirman No. 1, Jakarta',
    phone: '021-1234567',
    accountNumber: '1234567890',
    status: 'active',
    fee: 2500,
    processingTime: '1-2 hari kerja'
  },
  {
    id: 2,
    name: 'Bank BCA',
    code: 'BCA-001',
    type: 'bank',
    address: 'Jl. Thamrin No. 25, Jakarta',
    phone: '021-7654321',
    accountNumber: '0987654321',
    status: 'active',
    fee: 3000,
    processingTime: '1 hari kerja'
  },
  {
    id: 3,
    name: 'Indomaret',
    code: 'IDM-001',
    type: 'retail',
    address: 'Multiple Locations',
    phone: '1500-280',
    accountNumber: 'IDM-KSP-001',
    status: 'active',
    fee: 2000,
    processingTime: 'Real time'
  },
  {
    id: 4,
    name: 'Alfamart',
    code: 'ALF-001',
    type: 'retail',
    address: 'Multiple Locations',
    phone: '1500-959',
    accountNumber: 'ALF-KSP-001',
    status: 'inactive',
    fee: 2000,
    processingTime: 'Real time'
  },
];

export function ManagementPaymentOffices() {
  const [paymentOfficeData, setPaymentOfficeData] = useState(paymentOffices);
  const [editingOffice, setEditingOffice] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'bank',
    address: '',
    phone: '',
    accountNumber: '',
    status: 'active',
    fee: '',
    processingTime: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingOffice) {
      // Update existing office
      setPaymentOfficeData(prev => prev.map(office => 
        office.id === editingOffice.id 
          ? { ...office, ...formData, fee: parseInt(formData.fee) }
          : office
      ));
      toast({
        title: "Kantor Bayar Berhasil Diperbarui",
        description: `Kantor bayar ${formData.name} telah berhasil diperbarui`,
      });
    } else {
      // Add new office
      const newOffice = {
        id: Date.now(),
        ...formData,
        fee: parseInt(formData.fee)
      };
      setPaymentOfficeData(prev => [...prev, newOffice]);
      toast({
        title: "Kantor Bayar Berhasil Ditambahkan",
        description: `Kantor bayar ${formData.name} telah berhasil ditambahkan`,
      });
    }
    
    setFormData({
      name: '',
      code: '',
      type: 'bank',
      address: '',
      phone: '',
      accountNumber: '',
      status: 'active',
      fee: '',
      processingTime: ''
    });
    setEditingOffice(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (office: any) => {
    setEditingOffice(office);
    setFormData({
      name: office.name,
      code: office.code,
      type: office.type,
      address: office.address,
      phone: office.phone,
      accountNumber: office.accountNumber,
      status: office.status,
      fee: office.fee.toString(),
      processingTime: office.processingTime
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setPaymentOfficeData(prev => prev.filter(office => office.id !== id));
    toast({
      title: "Kantor Bayar Berhasil Dihapus",
      description: "Kantor bayar telah berhasil dihapus dari sistem",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bank':
        return <Building className="w-4 h-4" />;
      case 'retail':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <Building className="w-4 h-4" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'bank':
        return 'Bank';
      case 'retail':
        return 'Retail';
      default:
        return 'Lainnya';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Management Kantor Bayar</h1>
            <p className="text-muted-foreground">Kelola kantor bayar dan partner pembayaran</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-primary to-primary-muted"
                onClick={() => {
                  setEditingOffice(null);
                  setFormData({
                    name: '',
                    code: '',
                    type: 'bank',
                    address: '',
                    phone: '',
                    accountNumber: '',
                    status: 'active',
                    fee: '',
                    processingTime: ''
                  });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Kantor Bayar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingOffice ? 'Edit Kantor Bayar' : 'Tambah Kantor Bayar Baru'}
                </DialogTitle>
                <DialogDescription>
                  {editingOffice ? 'Perbarui informasi kantor bayar' : 'Tambahkan kantor bayar baru ke sistem'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Kantor Bayar</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Bank BRI"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Kode</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      placeholder="BRI-001"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipe Kantor Bayar</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Bank</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="other">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Alamat</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Jl. Sudirman No. 1, Jakarta"
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
                    <Label htmlFor="accountNumber">Nomor Akun/Kode</Label>
                    <Input
                      id="accountNumber"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                      placeholder="1234567890"
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fee">Biaya Transaksi (Rp)</Label>
                    <Input
                      id="fee"
                      type="number"
                      value={formData.fee}
                      onChange={(e) => setFormData({...formData, fee: e.target.value})}
                      placeholder="2500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="processingTime">Waktu Proses</Label>
                    <Input
                      id="processingTime"
                      value={formData.processingTime}
                      onChange={(e) => setFormData({...formData, processingTime: e.target.value})}
                      placeholder="1-2 hari kerja"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="inactive">Tidak Aktif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingOffice ? 'Perbarui' : 'Tambah'} Kantor Bayar
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
              <CreditCard className="w-5 h-5" />
              Daftar Kantor Bayar
            </CardTitle>
            <CardDescription>Daftar semua kantor bayar dan partner pembayaran</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama & Tipe</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Akun/Kode</TableHead>
                  <TableHead>Biaya</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentOfficeData.map(office => (
                  <TableRow key={office.id}>
                    <TableCell className="font-medium">{office.code}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(office.type)}
                        <div>
                          <p className="font-medium">{office.name}</p>
                          <p className="text-sm text-muted-foreground">{getTypeName(office.type)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm">{office.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm">{office.address}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{office.accountNumber}</p>
                        <p className="text-sm text-muted-foreground">{office.processingTime}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">Rp {office.fee.toLocaleString('id-ID')}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={office.status === 'active' ? 'default' : 'secondary'}>
                        {office.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(office)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(office.id)}
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