import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';

interface Member {
  id: number;
  name: string;
  nopen?: string;
  birth_date?: string;
  payment_bank?: string;
  pension_account?: string;
  pension_salary?: string;
  skep_number?: string;
  skep_date?: string;
  skep_status?: string;
  phone?: string;
  pensioner_category?: string;
}

interface Product {
  id: number;
  name: string;
  code: string;
}

interface ProductSettings {
  maxAge: string;
  maxLimit: string;
  maxTerm: string;
  interestRate: string;
  mandatorySaving: string;
  adminOffice: string;
  adminCenter: string;
  principalSaving: string;
  marketingFee: string;
  crkInsurance: Array<{ months: number; percentage: number }>;
  flagging: Array<{ name: string; amount: number }>;
}

export default function BranchLoans() {
  const { user, loading: authLoading, requireAuth } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productSettings, setProductSettings] = useState<ProductSettings | null>(null);
  const [plafond, setPlafond] = useState('');
  const [tenor, setTenor] = useState('');
  const [calculation, setCalculation] = useState<any>({});
  const [loanList, setLoanList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [angsuranDimuka, setAngsuranDimuka] = useState(1);
  const [posisiSK, setPosisiSK] = useState('SK ON HAND');

  // Helper format angka
  const formatRupiah = (num: number) => num.toLocaleString('id-ID');
  // Helper hitung usia
  const hitungUsia = (birthDateStr: string) => {
    if (!birthDateStr) return null;
    const birthDate = new Date(birthDateStr);
    const now = new Date();
    const years = differenceInYears(now, birthDate);
    const months = differenceInMonths(now, birthDate) % 12;
    const days = differenceInDays(now, new Date(birthDate.getFullYear() + years, birthDate.getMonth() + months, birthDate.getDate()));
    return `${years} Tahun ${months} Bulan ${days} Hari`;
  };

  useEffect(() => {
    if (!authLoading) requireAuth('branch');
  }, [authLoading, requireAuth]);

  // Fetch anggota aktif cabang
  useEffect(() => {
    const fetchMembers = async () => {
      if (!user?.branchId) return;
      try {
        const response = await fetch(`http://localhost:5000/api/branches/${user.branchId}/members`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authData') ? JSON.parse(localStorage.getItem('authData')!).token : ''}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setMembers(data.data.filter((m: any) => m.status === 'approve'));
        }
      } catch (e) { }
    };
    fetchMembers();
  }, [user]);

  // Fetch produk
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products/loans', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authData') ? JSON.parse(localStorage.getItem('authData')!).token : ''}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setProducts(data.data);
        }
      } catch (e) { }
    };
    fetchProducts();
  }, []);

  // Fetch settings produk
  useEffect(() => {
    if (!selectedProduct) return;
    const fetchSettings = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${selectedProduct.id}/settings/loans`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authData') ? JSON.parse(localStorage.getItem('authData')!).token : ''}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setProductSettings({
            maxAge: data.data.max_age,
            maxLimit: data.data.max_limit,
            maxTerm: data.data.max_term_months,
            interestRate: data.data.interest_rate,
            mandatorySaving: data.data.mandatory_saving,
            adminOffice: data.data.admin_office_percentage,
            adminCenter: data.data.admin_center_percentage,
            principalSaving: data.data.principal_saving_percentage,
            marketingFee: data.data.marketing_fee_percentage,
            crkInsurance: data.data.crk_insurance ? JSON.parse(data.data.crk_insurance) : [],
            flagging: data.data.flagging_fees ? JSON.parse(data.data.flagging_fees) : [],
          });
        }
      } catch (e) { }
    };
    fetchSettings();
  }, [selectedProduct]);

  // Fetch data pengajuan pinjaman cabang
  const fetchLoans = async () => {
    if (!user?.branchId) return;
    try {
      const response = await fetch(`http://localhost:5000/api/branches/${user.branchId}/loans`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authData') ? JSON.parse(localStorage.getItem('authData')!).token : ''}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setLoanList(data.data);
      }
    } catch (e) { }
    setLoading(false);
  };
  useEffect(() => { fetchLoans(); }, [user]);

  // Perhitungan otomatis
  useEffect(() => {
    if (!selectedProduct || !productSettings || !plafond || !tenor || !selectedMember) {
      setCalculation({});
      return;
    }
    // Rumus perhitungan sesuai contoh Excel
    const plafondNum = parseFloat(plafond);
    const tenorNum = parseInt(tenor);
    const bungaTahun = parseFloat(productSettings.interestRate) / 100;
    const bungaBulan = bungaTahun / 12;
    // Rumus anuitas
    let angsuran = 0;
    if (bungaBulan > 0) {
      angsuran = (plafondNum * bungaBulan) / (1 - Math.pow(1 + bungaBulan, -tenorNum));
    } else {
      angsuran = plafondNum / tenorNum;
    }
    const simpananWajib = parseFloat(productSettings.mandatorySaving) || 0;
    const simpananPokok = (plafondNum * (parseFloat(productSettings.principalSaving) || 0) / 100) || 0;
    // Kategori pensiunan & flagging sesuai kategori
    const kategori = selectedMember.pensioner_category?.toUpperCase() || '';
    let flagging = 0;
    if (kategori === 'TASPEN') {
      flagging = productSettings.flagging.find(f => f.name.toUpperCase().includes('TASPEN'))?.amount || 0;
    } else if (kategori === 'ASABRI') {
      flagging = productSettings.flagging.find(f => f.name.toUpperCase().includes('ASABRI'))?.amount || 0;
    }
    // CRK/Asuransi (ambil dari crkInsurance sesuai tenor, jika ada)
    let crk = 0;
    if (productSettings.crkInsurance && productSettings.crkInsurance.length > 0) {
      const crkRow = productSettings.crkInsurance.find(c => c.months === tenorNum);
      if (crkRow) crk = plafondNum * (crkRow.percentage / 100);
    }
    // Adm kantor/pusat
    const adminKantor = (plafondNum * (parseFloat(productSettings.adminOffice) || 0) / 100) || 0;
    const adminPusat = (plafondNum * (parseFloat(productSettings.adminCenter) || 0) / 100) || 0;
    // Fee marketing
    const feeMarketing = (plafondNum * (parseFloat(productSettings.marketingFee) || 0) / 100) || 0;
    // Total potongan
    const totalPotongan = crk + adminKantor + adminPusat + simpananPokok + flagging + feeMarketing;
    // Jumlah diterima cabang
    const totalDiterima = plafondNum - totalPotongan;
    // Hitung usia
    let usia = null;
    let usiaTahun = null;
    if (selectedMember.birth_date) {
      const birthDate = new Date(selectedMember.birth_date);
      const now = new Date();
      usiaTahun = differenceInYears(now, birthDate);
      usia = hitungUsia(selectedMember.birth_date);
    }
    // Cek usia maksimal
    let usiaMelebihi = false;
    if (productSettings.maxAge && usiaTahun !== null) {
      usiaMelebihi = usiaTahun > parseInt(productSettings.maxAge);
    }
    // Total debet angsuran
    const totalDebetAngsuran = angsuran + simpananWajib;
    // Angsuran dibayar di muka (angsuran + simpanan wajib) x bulan
    const angsuranDimukaTotal = totalDebetAngsuran * angsuranDimuka;
    // Blockir Dana SK jika posisi SK DI MITRA
    let blockirDanaSK = 0;
    if (posisiSK === 'SK DI MITRA') {
      blockirDanaSK = plafondNum * 0.1;
    }
    // Jumlah diterima cabang dikurangi angsuran dibayar di muka dan blockir dana SK
    const totalDiterimaFinal = totalDiterima - angsuranDimukaTotal - blockirDanaSK;
    setCalculation({
      angsuran: Math.round(angsuran),
      simpananWajib,
      simpananPokok: Math.round(simpananPokok),
      crk: Math.round(crk),
      adminKantor: Math.round(adminKantor),
      adminPusat: Math.round(adminPusat),
      flagging: Math.round(flagging),
      feeMarketing: Math.round(feeMarketing),
      totalPotongan: Math.round(totalPotongan),
      totalDiterima: Math.round(totalDiterima),
      angsuranDimuka: Math.round(angsuranDimukaTotal),
      totalDiterimaFinal: Math.round(totalDiterimaFinal),
      totalDebetAngsuran: Math.round(totalDebetAngsuran),
      blockirDanaSK: Math.round(blockirDanaSK),
      usia,
      usiaMelebihi
    });
  }, [selectedProduct, productSettings, plafond, tenor, selectedMember, angsuranDimuka, posisiSK]);

  const resetForm = () => {
    setSelectedMember(null);
    setSelectedProduct(null);
    setProductSettings(null);
    setPlafond('');
    setTenor('');
    setCalculation({});
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!selectedMember || !selectedProduct || !plafond || !tenor) {
      toast({ title: 'Lengkapi form!', variant: 'destructive' });
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/loans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authData') ? JSON.parse(localStorage.getItem('authData')!).token : ''}`
        },
        body: JSON.stringify({
          member_id: selectedMember.id,
          branch_id: user?.branchId,
          product_id: selectedProduct.id,
          plafond: parseFloat(plafond),
          tenor: parseInt(tenor),
          ...calculation,
        })
      });
      if (response.ok) {
        toast({ title: 'Pengajuan berhasil dikirim!' });
        setIsDialogOpen(false);
        resetForm();
        fetchLoans();
      } else {
        toast({ title: 'Gagal mengirim pengajuan', variant: 'destructive' });
      }
    } catch (e) {
      toast({ title: 'Gagal mengirim pengajuan', variant: 'destructive' });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Data Pinjaman</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)} className="bg-primary">Tambah Baru</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Form Pengajuan Pinjaman</DialogTitle>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Pilih Anggota Aktif</label>
                    <Select value={selectedMember?.id?.toString() || ''} onValueChange={val => setSelectedMember(members.find(m => m.id === parseInt(val)) || null)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih anggota" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map(m => (
                          <SelectItem key={m.id} value={m.id.toString()}>{m.name} ({m.nopen})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block mb-1">Pilih Produk Pinjaman</label>
                    <Select value={selectedProduct?.id?.toString() || ''} onValueChange={val => setSelectedProduct(products.find(p => p.id === parseInt(val)) || null)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih produk" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map(p => (
                          <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block mb-1">Plafond</label>
                    <Input type="number" value={plafond} onChange={e => setPlafond(e.target.value)} min={0} max={productSettings?.maxLimit || undefined} required />
                  </div>
                  <div>
                    <label className="block mb-1">Tenor (bulan)</label>
                    <Input type="number" value={tenor} onChange={e => setTenor(e.target.value)} min={1} max={productSettings?.maxTerm || undefined} required />
                  </div>
                  <div>
                    <label className="block mb-1">Angsuran Dibayar di Muka (bulan)</label>
                    <Input type="number" value={angsuranDimuka} min={1} max={tenor || 1} onChange={e => setAngsuranDimuka(Number(e.target.value))} required />
                  </div>
                  <div>
                    <label className="block mb-1">Posisi SK</label>
                    <Select value={posisiSK} onValueChange={setPosisiSK}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih posisi SK" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SK ON HAND">SK ON HAND</SelectItem>
                        <SelectItem value="SK DI PUSAT">SK DI PUSAT</SelectItem>
                        <SelectItem value="SK DI MITRA">SK DI MITRA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* Data anggota dan cabang otomatis */}
                {selectedMember && (
                  <div className="mt-4 p-4 bg-gray-50 rounded">
                    <div className="font-semibold mb-2">Data Pemohon</div>
                    <div>Nama: {selectedMember.name}</div>
                    <div>NOPEN: {selectedMember.nopen}</div>
                    <div>Tanggal Lahir: {selectedMember.birth_date ? new Date(selectedMember.birth_date).toLocaleDateString('id-ID') : ''}</div>
                    <div>Kategori Pensiunan: {selectedMember.pensioner_category}</div>
                    <div>Bank Bayar: {selectedMember.payment_bank}</div>
                    <div>No Rekening: {selectedMember.pension_account}</div>
                    <div>Gaji: {formatRupiah(Number(selectedMember.pension_salary) || 0)}</div>
                    <div>No. SKEP: {selectedMember.skep_number}</div>
                    <div>Tgl SKEP: {selectedMember.skep_date}</div>
                    <div>Status SKEP: {selectedMember.skep_status}</div>
                    <div>Telp/HP: {selectedMember.phone}</div>
                  </div>
                )}
                {user && (
                  <div className="mt-4 p-4 bg-gray-50 rounded">
                    <div className="font-semibold mb-2">Data Cabang Pemohon</div>
                    <div>Cabang: {user.branchName}</div>
                    <div>Marketing: {user.name}</div>
                    <div>No. SPK: -</div>
                  </div>
                )}
                {/* Parameter produk otomatis */}
                {productSettings && (
                  <div className="mt-4 p-4 bg-gray-50 rounded">
                    <div className="font-semibold mb-2">Parameter Produk</div>
                    <div>Suku Bunga: {productSettings.interestRate}%</div>
                    <div>Simpanan Wajib: {productSettings.mandatorySaving}</div>
                    <div>Simpanan Pokok: {productSettings.principalSaving}%</div>
                    <div>Fee Marketing: {productSettings.marketingFee}%</div>
                    <div>Adm Kantor: {productSettings.adminOffice}%</div>
                    <div>Adm Pusat: {productSettings.adminCenter}%</div>
                    <div>Flagging: {productSettings.flagging.map(f => `${f.name}: Rp${f.amount}`).join(', ')}</div>
                  </div>
                )}
                {/* Hasil perhitungan otomatis */}
                {calculation.angsuran && (
                  <div className="mt-4 p-4 bg-gray-50 rounded">
                    <div className="font-semibold mb-2">Hasil Perhitungan</div>
                    {calculation.usia && (
                      <div>Usia Pemohon: {calculation.usia}</div>
                    )}
                    {calculation.usiaMelebihi && (
                      <div className="text-red-600 font-semibold">Usia Melewati Ketentuan Produk!</div>
                    )}
                    <div>Suku Bunga: {productSettings?.interestRate}%</div>
                    <div>Angsuran/Bulan: Rp{formatRupiah(calculation.angsuran)}</div>
                    <div>Total Debet Angsuran: Rp{formatRupiah(calculation.totalDebetAngsuran)}</div>
                    <div>Angsuran Dibayar di Muka: Rp{formatRupiah(calculation.angsuranDimuka)} ({angsuranDimuka}x)</div>
                    <div>Simpanan Wajib: Rp{formatRupiah(calculation.simpananWajib)}</div>
                    <div>Simpanan Pokok: Rp{formatRupiah(calculation.simpananPokok)}</div>
                    <div>CRK/Asuransi: Rp{formatRupiah(calculation.crk)}</div>
                    <div>Adm Kantor: Rp{formatRupiah(calculation.adminKantor)}</div>
                    <div>Adm Pusat: Rp{formatRupiah(calculation.adminPusat)}</div>
                    <div>Flagging: Rp{formatRupiah(calculation.flagging)}</div>
                    <div>Fee Marketing: Rp{formatRupiah(calculation.feeMarketing)}</div>
                    <div>Total Potongan: Rp{formatRupiah(calculation.totalPotongan)}</div>
                    {posisiSK === 'SK DI MITRA' && (
                      <div>Blockir Dana SK: Rp{formatRupiah(calculation.blockirDanaSK)}</div>
                    )}
                    <div className="font-semibold">Jumlah Diterima Cabang: Rp{formatRupiah(calculation.totalDiterimaFinal)}</div>
                  </div>
                )}
                <div className="pt-4">
                  <Button type="submit" className="w-full">Ajukan Pinjaman</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        {/* Tabel data pengajuan pinjaman cabang */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Data Pengajuan Pinjaman Cabang</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Anggota</TableHead>
                    <TableHead>Produk</TableHead>
                    <TableHead>Plafond</TableHead>
                    <TableHead>Tenor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loanList.map((loan, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{loan.member_name}</TableCell>
                      <TableCell>{loan.product_name}</TableCell>
                      <TableCell>Rp{loan.plafond}</TableCell>
                      <TableCell>{loan.tenor} bulan</TableCell>
                      <TableCell>{loan.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
    </div>
    </DashboardLayout>
  );
} 