import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Settings, Save, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function ProductsSettings() {
  const { requireAuth, loading: authLoading, user } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      requireAuth('admin');
    }
  }, [authLoading, requireAuth, user]);

  const [selectedProduct, setSelectedProduct] = useState('');
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({
    maxAge: '',
    maxLimit: '',
    maxTerm: '',
    interestRate: '',
    mandatorySaving: '',
    adminOffice: '',
    adminCenter: '',
    principalSaving: '',
    marketingFee: ''
  });

  const [crkInsurance, setCrkInsurance] = useState([
    { months: 6, percentage: 10 },
    { months: 12, percentage: 15 },
    { months: 24, percentage: 20 },
  ]);

  const [flagging, setFlagging] = useState([
    { name: 'Biaya Administrasi', amount: 50000 },
    { name: 'Biaya Materai', amount: 10000 },
  ]);

  const { toast } = useToast();

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authData') ? JSON.parse(localStorage.getItem('authData')!).token : ''}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setProducts(data.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Fetch product settings when product is selected
  useEffect(() => {
    if (selectedProduct) {
      const fetchProductSettings = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/products/${selectedProduct}/settings`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authData') ? JSON.parse(localStorage.getItem('authData')!).token : ''}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            const settingsData = data.data;
            
            setSettings({
              maxAge: settingsData.max_age || '',
              maxLimit: settingsData.max_limit || '',
              maxTerm: settingsData.max_term_months || '',
              interestRate: settingsData.interest_rate || '',
              mandatorySaving: settingsData.mandatory_saving || '',
              adminOffice: settingsData.admin_office_percentage || '',
              adminCenter: settingsData.admin_center_percentage || '',
              principalSaving: settingsData.principal_saving_percentage || '',
              marketingFee: settingsData.marketing_fee_percentage || ''
            });
            
            if (settingsData.crk_insurance) {
              setCrkInsurance(JSON.parse(settingsData.crk_insurance));
            }
            
            if (settingsData.flagging_fees) {
              setFlagging(JSON.parse(settingsData.flagging_fees));
            }
          }
        } catch (error) {
          console.error('Error fetching product settings:', error);
        }
      };

      fetchProductSettings();
    }
  }, [selectedProduct]);

  const handleSave = async () => {
    if (!selectedProduct) {
      toast({
        title: "Pilih Produk",
        description: "Silakan pilih produk terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/products/${selectedProduct}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authData') ? JSON.parse(localStorage.getItem('authData')!).token : ''}`
        },
        body: JSON.stringify({
          max_age: settings.maxAge,
          max_limit: settings.maxLimit,
          max_term_months: settings.maxTerm,
          interest_rate: settings.interestRate,
          mandatory_saving: settings.mandatorySaving,
          admin_office_percentage: settings.adminOffice,
          admin_center_percentage: settings.adminCenter,
          principal_saving_percentage: settings.principalSaving,
          marketing_fee_percentage: settings.marketingFee,
          crk_insurance: crkInsurance,
          flagging_fees: flagging
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Pengaturan Berhasil Disimpan",
          description: "Semua pengaturan produk telah berhasil disimpan",
        });
      } else {
        toast({
          title: "Gagal Menyimpan Pengaturan",
          description: data.message || "Terjadi kesalahan saat menyimpan pengaturan",
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

  const addCrkInsurance = () => {
    setCrkInsurance([...crkInsurance, { months: 0, percentage: 0 }]);
  };

  const removeCrkInsurance = (index: number) => {
    setCrkInsurance(crkInsurance.filter((_, i) => i !== index));
  };

  const addFlagging = () => {
    setFlagging([...flagging, { name: '', amount: 0 }]);
  };

  const removeFlagging = (index: number) => {
    setFlagging(flagging.filter((_, i) => i !== index));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Settings Produk</h1>
            <p className="text-muted-foreground">Konfigurasi parameter produk simpan pinjam</p>
          </div>
          <Button onClick={handleSave} className="bg-gradient-to-r from-success to-success-muted">
            <Save className="w-4 h-4 mr-2" />
            Simpan Pengaturan
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Product Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Pilih Produk</CardTitle>
              <CardDescription>Pilih produk yang akan dikonfigurasi</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih produk untuk dikonfigurasi" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name} ({product.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Settings Tabs */}
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Pengaturan Dasar</TabsTrigger>
              <TabsTrigger value="insurance">CRK Asuransi</TabsTrigger>
              <TabsTrigger value="fees">Biaya & Fee</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pengaturan Dasar Produk</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="maxAge">Usia Maksimal</Label>
                      <Input
                        id="maxAge"
                        placeholder="60"
                        value={settings.maxAge}
                        onChange={(e) => setSettings({...settings, maxAge: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxLimit">Plafond Maksimal</Label>
                      <Input
                        id="maxLimit"
                        placeholder="50000000"
                        value={settings.maxLimit}
                        onChange={(e) => setSettings({...settings, maxLimit: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxTerm">Jangka Waktu Maksimal (Bulan)</Label>
                      <Input
                        id="maxTerm"
                        placeholder="36"
                        value={settings.maxTerm}
                        onChange={(e) => setSettings({...settings, maxTerm: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interestRate">Suku Bunga (%)</Label>
                      <Input
                        id="interestRate"
                        placeholder="12"
                        value={settings.interestRate}
                        onChange={(e) => setSettings({...settings, interestRate: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mandatorySaving">Simpanan Wajib</Label>
                      <Input
                        id="mandatorySaving"
                        placeholder="100000"
                        value={settings.mandatorySaving}
                        onChange={(e) => setSettings({...settings, mandatorySaving: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="principalSaving">Simpanan Pokok (%)</Label>
                      <Input
                        id="principalSaving"
                        placeholder="5"
                        value={settings.principalSaving}
                        onChange={(e) => setSettings({...settings, principalSaving: e.target.value})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insurance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>CRK Asuransi</CardTitle>
                  <CardDescription>Pengaturan asuransi berdasarkan tenor</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {crkInsurance.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="flex-1">
                          <Label>Tenor (Bulan)</Label>
                          <Input
                            type="number"
                            value={item.months}
                            onChange={(e) => {
                              const newCrk = [...crkInsurance];
                              newCrk[index].months = parseInt(e.target.value);
                              setCrkInsurance(newCrk);
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <Label>Persentase (%)</Label>
                          <Input
                            type="number"
                            value={item.percentage}
                            onChange={(e) => {
                              const newCrk = [...crkInsurance];
                              newCrk[index].percentage = parseFloat(e.target.value);
                              setCrkInsurance(newCrk);
                            }}
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeCrkInsurance(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button onClick={addCrkInsurance} variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Tenor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fees" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Biaya Administrasi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="adminOffice">Adm Kantor (%)</Label>
                      <Input
                        id="adminOffice"
                        placeholder="1"
                        value={settings.adminOffice}
                        onChange={(e) => setSettings({...settings, adminOffice: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adminCenter">Adm Pusat (%)</Label>
                      <Input
                        id="adminCenter"
                        placeholder="0.5"
                        value={settings.adminCenter}
                        onChange={(e) => setSettings({...settings, adminCenter: e.target.value})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Flagging</CardTitle>
                  <CardDescription>Biaya tambahan lainnya</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {flagging.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="flex-1">
                          <Label>Nama Biaya</Label>
                          <Input
                            value={item.name}
                            onChange={(e) => {
                              const newFlagging = [...flagging];
                              newFlagging[index].name = e.target.value;
                              setFlagging(newFlagging);
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <Label>Jumlah (Rp)</Label>
                          <Input
                            type="number"
                            value={item.amount}
                            onChange={(e) => {
                              const newFlagging = [...flagging];
                              newFlagging[index].amount = parseInt(e.target.value);
                              setFlagging(newFlagging);
                            }}
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeFlagging(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button onClick={addFlagging} variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Biaya
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fee Marketing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="marketingFee">Fee Marketing (%)</Label>
                    <Input
                      id="marketingFee"
                      placeholder="2"
                      value={settings.marketingFee}
                      onChange={(e) => setSettings({...settings, marketingFee: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}