import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, Save, Plus, Trash2 } from 'lucide-react';

export function SettingsTopUp() {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [topUpSettings, setTopUpSettings] = useState({
    minAmount: '',
    maxAmount: '',
    processingFee: '',
    adminFee: '',
    interestRate: '',
    penaltyRate: ''
  });

  const [calculationComponents, setCalculationComponents] = useState([
    { name: 'Pokok Pinjaman', percentage: 100, isActive: true },
    { name: 'Bunga Berjalan', percentage: 0, isActive: true },
    { name: 'Denda Keterlambatan', percentage: 0, isActive: false },
    { name: 'Biaya Admin', percentage: 1, isActive: true },
  ]);

  const { toast } = useToast();

  const handleSave = () => {
    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "Silakan pilih produk terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Pengaturan Top Up Berhasil Disimpan",
      description: `Pengaturan top up untuk produk telah berhasil disimpan`,
    });
  };

  const addCalculationComponent = () => {
    setCalculationComponents([...calculationComponents, { name: '', percentage: 0, isActive: true }]);
  };

  const removeCalculationComponent = (index: number) => {
    setCalculationComponents(calculationComponents.filter((_, i) => i !== index));
  };

  const updateCalculationComponent = (index: number, field: string, value: any) => {
    const newComponents = [...calculationComponents];
    newComponents[index] = { ...newComponents[index], [field]: value };
    setCalculationComponents(newComponents);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Settings Top Up</h1>
            <p className="text-muted-foreground">Konfigurasi pengaturan top up berdasarkan produk</p>
          </div>
          <Button onClick={handleSave} className="bg-gradient-to-r from-success to-success-muted">
            <Save className="w-4 h-4 mr-2" />
            Simpan Pengaturan
          </Button>
        </div>

        {/* Product Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Pilih Produk</CardTitle>
            <CardDescription>Pilih produk yang akan dikonfigurasi pengaturan top up</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih produk untuk konfigurasi top up" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pinjaman-usaha">Pinjaman Usaha Mikro</SelectItem>
                <SelectItem value="pinjaman-konsumsi">Pinjaman Konsumsi</SelectItem>
                <SelectItem value="kredit-modal">Kredit Modal Kerja</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Settings Tabs */}
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Pengaturan Dasar</TabsTrigger>
            <TabsTrigger value="calculation">Komponen Perhitungan</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Dasar Top Up</CardTitle>
                <CardDescription>Konfigurasi parameter dasar untuk top up</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="minAmount">Minimum Amount (Rp)</Label>
                    <Input
                      id="minAmount"
                      placeholder="500000"
                      value={topUpSettings.minAmount}
                      onChange={(e) => setTopUpSettings({...topUpSettings, minAmount: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxAmount">Maximum Amount (Rp)</Label>
                    <Input
                      id="maxAmount"
                      placeholder="10000000"
                      value={topUpSettings.maxAmount}
                      onChange={(e) => setTopUpSettings({...topUpSettings, maxAmount: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="processingFee">Biaya Proses (%)</Label>
                    <Input
                      id="processingFee"
                      placeholder="1"
                      value={topUpSettings.processingFee}
                      onChange={(e) => setTopUpSettings({...topUpSettings, processingFee: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminFee">Biaya Admin (Rp)</Label>
                    <Input
                      id="adminFee"
                      placeholder="50000"
                      value={topUpSettings.adminFee}
                      onChange={(e) => setTopUpSettings({...topUpSettings, adminFee: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interestRate">Suku Bunga (%)</Label>
                    <Input
                      id="interestRate"
                      placeholder="12"
                      value={topUpSettings.interestRate}
                      onChange={(e) => setTopUpSettings({...topUpSettings, interestRate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="penaltyRate">Denda Keterlambatan (%)</Label>
                    <Input
                      id="penaltyRate"
                      placeholder="5"
                      value={topUpSettings.penaltyRate}
                      onChange={(e) => setTopUpSettings({...topUpSettings, penaltyRate: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Komponen Perhitungan Top Up</CardTitle>
                <CardDescription>Tentukan komponen yang akan dihitung dalam top up</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {calculationComponents.map((component, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <Label>Nama Komponen</Label>
                        <Input
                          value={component.name}
                          onChange={(e) => updateCalculationComponent(index, 'name', e.target.value)}
                          placeholder="Masukkan nama komponen"
                        />
                      </div>
                      <div className="w-32">
                        <Label>Persentase (%)</Label>
                        <Input
                          type="number"
                          value={component.percentage}
                          onChange={(e) => updateCalculationComponent(index, 'percentage', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={component.isActive}
                          onChange={(e) => updateCalculationComponent(index, 'isActive', e.target.checked)}
                          className="w-4 h-4"
                        />
                        <Label className="text-sm">Aktif</Label>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeCalculationComponent(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button onClick={addCalculationComponent} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Komponen
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview Calculation */}
            <Card>
              <CardHeader>
                <CardTitle>Preview Perhitungan</CardTitle>
                <CardDescription>Simulasi perhitungan berdasarkan komponen yang aktif</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid gap-2">
                    <Label>Contoh Pinjaman: Rp 10,000,000</Label>
                    {calculationComponents.filter(c => c.isActive).map((component, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="text-sm">{component.name}</span>
                        <span className="text-sm font-medium">
                          {component.percentage}% = Rp {((10000000 * component.percentage) / 100).toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center p-2 bg-primary/10 rounded font-medium">
                      <span>Total Top Up</span>
                      <span>
                        Rp {calculationComponents
                          .filter(c => c.isActive)
                          .reduce((total, c) => total + (10000000 * c.percentage) / 100, 0)
                          .toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}