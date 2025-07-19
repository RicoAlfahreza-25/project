import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Save, Plus, Trash2 } from 'lucide-react';

export function SettingsPKA() {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [pkaSettings, setPkaSettings] = useState({
    minPaymentPeriod: '',
    maxDiscountRate: '',
    penaltyRate: '',
    adminFee: '',
    processingFee: ''
  });

  const [calculationComponents, setCalculationComponents] = useState([
    { name: 'Sisa Pokok Pinjaman', percentage: 100, isActive: true },
    { name: 'Bunga Berjalan', percentage: 100, isActive: true },
    { name: 'Denda (jika ada)', percentage: 100, isActive: false },
    { name: 'Biaya Admin PKA', percentage: 0, isActive: true },
    { name: 'Diskon Bunga', percentage: -10, isActive: true },
  ]);

  const [discountTiers, setDiscountTiers] = useState([
    { minMonths: 6, maxMonths: 12, discountRate: 5 },
    { minMonths: 13, maxMonths: 24, discountRate: 10 },
    { minMonths: 25, maxMonths: 36, discountRate: 15 },
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
      title: "Pengaturan PKA Berhasil Disimpan",
      description: `Pengaturan pelunasan percepat untuk produk telah berhasil disimpan`,
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

  const addDiscountTier = () => {
    setDiscountTiers([...discountTiers, { minMonths: 0, maxMonths: 0, discountRate: 0 }]);
  };

  const removeDiscountTier = (index: number) => {
    setDiscountTiers(discountTiers.filter((_, i) => i !== index));
  };

  const updateDiscountTier = (index: number, field: string, value: number) => {
    const newTiers = [...discountTiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    setDiscountTiers(newTiers);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Settings PKA</h1>
            <p className="text-muted-foreground">Konfigurasi pengaturan Pelunasan Percepat (PKA) berdasarkan produk</p>
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
            <CardDescription>Pilih produk yang akan dikonfigurasi pengaturan PKA</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih produk untuk konfigurasi PKA" />
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Pengaturan Dasar</TabsTrigger>
            <TabsTrigger value="discount">Tingkat Diskon</TabsTrigger>
            <TabsTrigger value="calculation">Komponen Perhitungan</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Dasar PKA</CardTitle>
                <CardDescription>Konfigurasi parameter dasar untuk pelunasan percepat</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="minPaymentPeriod">Minimum Periode Bayar (Bulan)</Label>
                    <Input
                      id="minPaymentPeriod"
                      placeholder="6"
                      value={pkaSettings.minPaymentPeriod}
                      onChange={(e) => setPkaSettings({...pkaSettings, minPaymentPeriod: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxDiscountRate">Maksimum Diskon (%)</Label>
                    <Input
                      id="maxDiscountRate"
                      placeholder="20"
                      value={pkaSettings.maxDiscountRate}
                      onChange={(e) => setPkaSettings({...pkaSettings, maxDiscountRate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="penaltyRate">Denda Keterlambatan (%)</Label>
                    <Input
                      id="penaltyRate"
                      placeholder="5"
                      value={pkaSettings.penaltyRate}
                      onChange={(e) => setPkaSettings({...pkaSettings, penaltyRate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminFee">Biaya Admin PKA (Rp)</Label>
                    <Input
                      id="adminFee"
                      placeholder="100000"
                      value={pkaSettings.adminFee}
                      onChange={(e) => setPkaSettings({...pkaSettings, adminFee: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="processingFee">Biaya Proses (%)</Label>
                    <Input
                      id="processingFee"
                      placeholder="1"
                      value={pkaSettings.processingFee}
                      onChange={(e) => setPkaSettings({...pkaSettings, processingFee: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discount" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tingkat Diskon Berdasarkan Sisa Tenor</CardTitle>
                <CardDescription>Atur tingkat diskon berdasarkan sisa periode pinjaman</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {discountTiers.map((tier, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <Label>Sisa Tenor Min (Bulan)</Label>
                        <Input
                          type="number"
                          value={tier.minMonths}
                          onChange={(e) => updateDiscountTier(index, 'minMonths', parseInt(e.target.value) || 0)}
                          placeholder="6"
                        />
                      </div>
                      <div className="flex-1">
                        <Label>Sisa Tenor Max (Bulan)</Label>
                        <Input
                          type="number"
                          value={tier.maxMonths}
                          onChange={(e) => updateDiscountTier(index, 'maxMonths', parseInt(e.target.value) || 0)}
                          placeholder="12"
                        />
                      </div>
                      <div className="flex-1">
                        <Label>Diskon Rate (%)</Label>
                        <Input
                          type="number"
                          value={tier.discountRate}
                          onChange={(e) => updateDiscountTier(index, 'discountRate', parseFloat(e.target.value) || 0)}
                          placeholder="5"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeDiscountTier(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button onClick={addDiscountTier} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Tingkat Diskon
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Komponen Perhitungan PKA</CardTitle>
                <CardDescription>Tentukan komponen yang akan dihitung dalam pelunasan percepat</CardDescription>
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
                <CardTitle>Preview Perhitungan PKA</CardTitle>
                <CardDescription>Simulasi perhitungan berdasarkan komponen yang aktif</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid gap-2">
                    <Label>Contoh Sisa Pinjaman: Rp 5,000,000 (Sisa 10 bulan)</Label>
                    {calculationComponents.filter(c => c.isActive).map((component, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="text-sm">{component.name}</span>
                        <span className="text-sm font-medium">
                          {component.percentage}% = Rp {((5000000 * component.percentage) / 100).toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center p-2 bg-primary/10 rounded font-medium">
                      <span>Total PKA</span>
                      <span>
                        Rp {calculationComponents
                          .filter(c => c.isActive)
                          .reduce((total, c) => total + (5000000 * c.percentage) / 100, 0)
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