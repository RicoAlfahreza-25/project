import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Save } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function ProductsAdd() {
  const { requireAuth, loading: authLoading, user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    code: '',
    status: 'active'
  });
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading) {
      requireAuth('admin');
    }
  }, [authLoading, requireAuth, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authData') ? JSON.parse(localStorage.getItem('authData')!).token : ''}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Produk Berhasil Ditambahkan",
          description: `Produk ${formData.name} telah berhasil ditambahkan ke sistem`,
        });
        setFormData({
          name: '',
          description: '',
          category: '',
          code: '',
          status: 'active'
        });
      } else {
        toast({
          title: "Gagal Menambahkan Produk",
          description: data.message || "Terjadi kesalahan saat menambahkan produk",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menghubungi server",
        variant: "destructive",
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Tambah Produk</h1>
            <p className="text-muted-foreground">Tambahkan produk simpan pinjam baru</p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-primary-muted">
            <Plus className="w-4 h-4 mr-2" />
            Produk Baru
          </Button>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Informasi Produk</CardTitle>
            <CardDescription>
              Lengkapi informasi dasar produk yang akan ditambahkan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Produk</Label>
                  <Input
                    id="name"
                    placeholder="Misal: Pinjaman Usaha Mikro"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Kode Produk</Label>
                  <Input
                    id="code"
                    placeholder="Misal: PUM-001"
                    value={formData.code}
                    onChange={(e) => handleChange('code', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategori Produk</Label>
                <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori produk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pinjaman">Pinjaman</SelectItem>
                    <SelectItem value="simpanan">Simpanan</SelectItem>
                    <SelectItem value="investasi">Investasi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi Produk</Label>
                <Textarea
                  id="description"
                  placeholder="Masukkan deskripsi lengkap produk..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status Produk</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-gradient-to-r from-success to-success-muted">
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Produk
                </Button>
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}