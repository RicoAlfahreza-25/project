import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Users, Plus, Search, Edit, Trash2, Phone, MapPin, Eye } from 'lucide-react';
import { MemberForm } from '@/components/MemberForm';

interface Member {
  id: number;
  member_number: string;
  created_at: string;
  // Kategori Pensiunan
  pensioner_category?: string;
  pension_type?: string;
  nopen?: string;
  book_number?: string;
  skep_number?: string;
  skep_date?: string;
  skep_name?: string;
  skep_status?: string;
  payment_bank?: string;
  pension_account?: string;
  pension_salary?: string;
  
  // Data Pribadi
  name: string;
  mother_name?: string;
  id_number: string;
  npwp?: string;
  birth_place?: string;
  birth_date?: string;
  gender?: string;
  phone: string;
  emergency_phone?: string;
  emergency_relation?: string;
  emergency_name?: string;
  marital_status?: string;
  religion?: string;
  occupation?: string;
  house_ownership?: string;
  
  // Alamat KTP
  ktp_address?: string;
  ktp_province?: string;
  ktp_city?: string;
  ktp_district?: string;
  ktp_subdistrict?: string;
  ktp_postal_code?: string;
  
  // Alamat Domisili
  same_as_ktp?: boolean;
  domicile_address?: string;
  domicile_province?: string;
  domicile_city?: string;
  domicile_district?: string;
  domicile_subdistrict?: string;
  domicile_postal_code?: string;
  rt_number?: string;
  rt_name?: string;
  phone1?: string;
  phone2?: string;
  
  // Marketing & Cabang
  marketing_id?: string;
  branch_id?: string;
  
  // Status
  status: 'pending' | 'active' | 'inactive' | 'suspended';
  
  // File uploads
  ktp_file?: string;
  member_form?: string;
}

export function BranchMembers() {
  const { requireAuth, loading: authLoading, user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    // Kategori Pensiunan
    pensioner_category: '',
    pension_type: '',
    nopen: '',
    book_number: '',
    skep_number: '',
    skep_date: '',
    skep_name: '',
    skep_status: '',
    payment_bank: '',
    pension_account: '',
    pension_salary: '',
    
    // Data Pribadi
    name: '',
    mother_name: '',
    id_number: '',
    npwp: '',
    birth_place: '',
    birth_date: '',
    gender: '',
    phone: '',
    emergency_phone: '',
    emergency_relation: '',
    emergency_name: '',
    marital_status: '',
    religion: '',
    occupation: '',
    house_ownership: '',
    
    // Alamat KTP
    ktp_address: '',
    ktp_province: '',
    ktp_city: '',
    ktp_district: '',
    ktp_subdistrict: '',
    ktp_postal_code: '',
    
    // Alamat Domisili
    same_as_ktp: false,
    domicile_address: '',
    domicile_province: '',
    domicile_city: '',
    domicile_district: '',
    domicile_subdistrict: '',
    domicile_postal_code: '',
    rt_number: '',
    rt_name: '',
    phone1: '',
    phone2: '',
    
    // Marketing & Cabang
    marketing_id: '',
    branch_id: '',
    
    // Status otomatis pending untuk cabang
    status: 'pending'
  });
  
  const [files, setFiles] = useState({
    ktp_file: null,
    member_form: null
  });
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading) {
      requireAuth('branch');
    }
  }, [authLoading, requireAuth, user]);

  // Fetch members for current branch
  useEffect(() => {
    if (user?.branchId) {
      fetchMembers();
    }
  }, [user?.branchId]);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/branches/${user?.branchId}/members`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authData') ? JSON.parse(localStorage.getItem('authData')!).token : ''}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMembers(data.data);
      } else {
        toast({
          title: "Error",
          description: "Gagal mengambil data anggota",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menghubungi server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // PATCH: pastikan branch_id selalu diisi dengan user.branchId
    const formDataWithBranchId = {
      ...formData,
      branch_id: user?.branchId || ''
    };

    try {
      const url = editingMember 
        ? `http://localhost:5000/api/branches/${user?.branchId}/members/${editingMember.id}`
        : `http://localhost:5000/api/branches/${user?.branchId}/members`;
      
      const method = editingMember ? 'PUT' : 'POST';

      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add all form data
      Object.entries(formDataWithBranchId).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });

      // Add files if they exist
      if (files.ktp_file) {
        formDataToSend.append('ktp_file', files.ktp_file);
      }
      if (files.member_form) {
        formDataToSend.append('member_form', files.member_form);
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authData') ? JSON.parse(localStorage.getItem('authData')!).token : ''}`
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: editingMember ? "Anggota Berhasil Diupdate" : "Anggota Berhasil Ditambahkan",
          description: data.message,
        });
        
        setIsAddDialogOpen(false);
        setEditingMember(null);
        resetForm();
        fetchMembers();
      } else {
        toast({
          title: "Gagal",
          description: data.message || "Terjadi kesalahan",
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

  const handleDelete = async (memberId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus anggota ini?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/branches/${user?.branchId}/members/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authData') ? JSON.parse(localStorage.getItem('authData')!).token : ''}`
        }
      });

      if (response.ok) {
        toast({
          title: "Anggota Berhasil Dihapus",
          description: "Data anggota telah dihapus dari sistem",
        });
        fetchMembers();
      } else {
        toast({
          title: "Gagal Menghapus",
          description: "Terjadi kesalahan saat menghapus anggota",
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

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setFormData({
      // Kategori Pensiunan
      pensioner_category: member.pensioner_category || '',
      pension_type: member.pension_type || '',
      nopen: member.nopen || '',
      book_number: member.book_number || '',
      skep_number: member.skep_number || '',
      skep_date: member.skep_date || '',
      skep_name: member.skep_name || '',
      skep_status: member.skep_status || '',
      payment_bank: member.payment_bank || '',
      pension_account: member.pension_account || '',
      pension_salary: member.pension_salary || '',
      
      // Data Pribadi
      name: member.name,
      mother_name: member.mother_name || '',
      id_number: member.id_number,
      npwp: member.npwp || '',
      birth_place: member.birth_place || '',
      birth_date: member.birth_date || '',
      gender: member.gender || '',
      phone: member.phone,
      emergency_phone: member.emergency_phone || '',
      emergency_relation: member.emergency_relation || '',
      emergency_name: member.emergency_name || '',
      marital_status: member.marital_status || '',
      religion: member.religion || '',
      occupation: member.occupation || '',
      house_ownership: member.house_ownership || '',
      
      // Alamat KTP
      ktp_address: member.ktp_address || '',
      ktp_province: member.ktp_province || '',
      ktp_city: member.ktp_city || '',
      ktp_district: member.ktp_district || '',
      ktp_subdistrict: member.ktp_subdistrict || '',
      ktp_postal_code: member.ktp_postal_code || '',
      
      // Alamat Domisili
      same_as_ktp: member.same_as_ktp || false,
      domicile_address: member.domicile_address || '',
      domicile_province: member.domicile_province || '',
      domicile_city: member.domicile_city || '',
      domicile_district: member.domicile_district || '',
      domicile_subdistrict: member.domicile_subdistrict || '',
      domicile_postal_code: member.domicile_postal_code || '',
      rt_number: member.rt_number || '',
      rt_name: member.rt_name || '',
      phone1: member.phone1 || '',
      phone2: member.phone2 || '',
      
      // Marketing & Cabang
      marketing_id: member.marketing_id || '',
      branch_id: member.branch_id || String(user?.branchId || ''),
      
      // Status
      status: member.status
    });
    setIsAddDialogOpen(true);
  };

  const handleView = (member: Member) => {
    setViewingMember(member);
    setIsViewDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      // Kategori Pensiunan
      pensioner_category: '',
      pension_type: '',
      nopen: '',
      book_number: '',
      skep_number: '',
      skep_date: '',
      skep_name: '',
      skep_status: '',
      payment_bank: '',
      pension_account: '',
      pension_salary: '',
      
      // Data Pribadi
      name: '',
      mother_name: '',
      id_number: '',
      npwp: '',
      birth_place: '',
      birth_date: '',
      gender: '',
      phone: '',
      emergency_phone: '',
      emergency_relation: '',
      emergency_name: '',
      marital_status: '',
      religion: '',
      occupation: '',
      house_ownership: '',
      
      // Alamat KTP
      ktp_address: '',
      ktp_province: '',
      ktp_city: '',
      ktp_district: '',
      ktp_subdistrict: '',
      ktp_postal_code: '',
      
      // Alamat Domisili
      same_as_ktp: false,
      domicile_address: '',
      domicile_province: '',
      domicile_city: '',
      domicile_district: '',
      domicile_subdistrict: '',
      domicile_postal_code: '',
      rt_number: '',
      rt_name: '',
      phone1: '',
      phone2: '',
      
      // Marketing & Cabang
      marketing_id: '',
      branch_id: String(user?.branchId || ''),
      
      // Status otomatis pending untuk cabang
      status: 'pending'
    });
    setFiles({ ktp_file: null, member_form: null });
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.id_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pengajuan':
        return <Badge className="bg-yellow-100 text-yellow-800">Pengajuan</Badge>;
      case 'approve':
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Disetujui</Badge>;
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Tidak Aktif</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Ditangguhkan</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Mapping label Bahasa Indonesia untuk detail anggota
  const fieldLabels: Record<string, string> = {
    member_number: "Nomor Anggota",
    name: "Nama",
    phone: "No HP",
    id_number: "Nomor KTP",
    branch_id: "Cabang",
    status: "Status",
    pensioner_category: "Kategori Pensiunan",
    pension_type: "Jenis Pensiunan",
    nopen: "Nopen",
    book_number: "No Buku Karip",
    skep_number: "No SKEP",
    skep_date: "Tanggal SKEP",
    skep_name: "Atas Nama SK",
    skep_status: "Keberadaan SKEP",
    payment_bank: "Bank Pembayar",
    pension_account: "Norek Pensiun",
    pension_salary: "Gaji Pensiun",
    mother_name: "Nama Ibu Kandung",
    npwp: "NPWP",
    birth_place: "Tempat Lahir",
    birth_date: "Tanggal Lahir",
    gender: "Jenis Kelamin",
    emergency_phone: "No HP Emergency",
    emergency_relation: "Hubungan Emergency",
    emergency_name: "Nama Emergency",
    marital_status: "Status Pernikahan",
    religion: "Agama",
    occupation: "Pekerjaan",
    house_ownership: "Status Kepemilikan Rumah",
    ktp_address: "Alamat KTP",
    ktp_province: "Provinsi KTP",
    ktp_city: "Kota/Kabupaten KTP",
    ktp_district: "Kecamatan KTP",
    ktp_subdistrict: "Kelurahan KTP",
    ktp_postal_code: "Kode Pos KTP",
    same_as_ktp: "Sama dengan Alamat KTP",
    domicile_address: "Alamat Domisili",
    domicile_province: "Provinsi Domisili",
    domicile_city: "Kota/Kabupaten Domisili",
    domicile_district: "Kecamatan Domisili",
    domicile_subdistrict: "Kelurahan Domisili",
    domicile_postal_code: "Kode Pos Domisili",
    rt_number: "RT/Tetangga",
    rt_name: "Nama RT/Tetangga",
    phone1: "No HP 1",
    phone2: "No HP 2",
    marketing_id: "Marketing",
    ktp_file: "KTP File",
    member_form: "Form Anggota"
  };

  // Dummy mapping marketing id to name (replace with real data if available)
  const marketingNames: Record<string, string> = {
    '1': 'Marketing Jakarta Pusat',
    '2': 'Marketing Jakarta Utara',
    '': '-' // fallback
  };

  // Mapping bagian dan field untuk detail anggota
  const memberSections = [
    {
      title: 'Data Pribadi',
      fields: ['member_number', 'name', 'phone', 'id_number', 'status', 'mother_name', 'npwp', 'birth_place', 'birth_date', 'gender', 'marital_status', 'religion', 'occupation', 'house_ownership']
    },
    {
      title: 'Kategori Pensiunan',
      fields: ['pensioner_category', 'pension_type', 'nopen', 'book_number', 'skep_number', 'skep_date', 'skep_name', 'skep_status', 'payment_bank', 'pension_account', 'pension_salary']
    },
    {
      title: 'Alamat KTP',
      fields: ['ktp_address', 'ktp_province', 'ktp_city', 'ktp_district', 'ktp_subdistrict', 'ktp_postal_code']
    },
    {
      title: 'Alamat Domisili',
      fields: ['domicile_address', 'domicile_province', 'domicile_city', 'domicile_district', 'domicile_subdistrict', 'domicile_postal_code', 'rt_number', 'rt_name']
    },
    {
      title: 'Kontak Darurat',
      fields: ['emergency_phone', 'emergency_relation', 'emergency_name', 'phone1', 'phone2']
    },
    {
      title: 'Marketing & Cabang',
      fields: ['marketing_id']
    },
    {
      title: 'Berkas',
      fields: ['ktp_file', 'member_form']
    }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Memuat data anggota...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Anggota</h1>
            <p className="text-muted-foreground">Kelola anggota aktif cabang {user?.branchName}</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingMember(null); resetForm(); }}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Anggota
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
              <DialogHeader className="sticky top-0 bg-white z-10 pb-4 border-b">
                <DialogTitle>
                  {editingMember ? 'Edit Anggota' : 'Tambah Anggota Baru'}
                </DialogTitle>
                <DialogDescription>
                  {editingMember ? 'Edit informasi anggota' : 'Tambahkan anggota baru ke cabang ini'}
                </DialogDescription>
              </DialogHeader>
              <MemberForm
                formData={formData}
                setFormData={setFormData}
                files={files}
                setFiles={setFiles}
                editingMember={editingMember}
                onSubmit={handleSubmit}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

          {/* View Member Dialog */}
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Detail Anggota</DialogTitle>
                <DialogDescription>Informasi lengkap anggota</DialogDescription>
              </DialogHeader>
              {viewingMember && (
                <div className="space-y-8">
                  {memberSections.map((section) => (
                    <div key={section.title}>
                      <h3 className="text-lg font-semibold mb-2 mt-4 bg-blue-50 text-blue-800 px-2 py-1 rounded">{section.title}</h3>
                      <div className="space-y-2">
                        {section.fields.map((key) => {
                          if (key === 'ktp_file' && viewingMember.ktp_file) {
                            return (
                              <div key={key} className="grid grid-cols-2 gap-4">
                                <p className="font-medium">{fieldLabels[key]}</p>
                                <div>
                                  <a href={`http://localhost:5000/uploads/${viewingMember.ktp_file}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{viewingMember.ktp_file}</a>
                                  <div className="mt-2">
                                    <object data={`http://localhost:5000/uploads/${viewingMember.ktp_file}`} type="application/pdf" width="100%" height="400px">
                                      <p>Preview tidak tersedia. <a href={`http://localhost:5000/uploads/${viewingMember.ktp_file}`} target="_blank" rel="noopener noreferrer">Klik di sini untuk membuka file PDF.</a></p>
                                    </object>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          if (key === 'member_form' && viewingMember.member_form) {
                            return (
                              <div key={key} className="grid grid-cols-2 gap-4">
                                <p className="font-medium">{fieldLabels[key]}</p>
                                <div>
                                  <a href={`http://localhost:5000/uploads/${viewingMember.member_form}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{viewingMember.member_form}</a>
                                  <div className="mt-2">
                                    <object data={`http://localhost:5000/uploads/${viewingMember.member_form}`} type="application/pdf" width="100%" height="400px">
                                      <p>Preview tidak tersedia. <a href={`http://localhost:5000/uploads/${viewingMember.member_form}`} target="_blank" rel="noopener noreferrer">Klik di sini untuk membuka file PDF.</a></p>
                                    </object>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          if (key === 'marketing_id') {
                            return (
                              <div key={key} className="grid grid-cols-2 gap-4">
                                <p className="font-medium">{fieldLabels[key]}</p>
                                <p>{marketingNames[viewingMember.marketing_id as string] || '-'}</p>
                              </div>
                            );
                          }
                          if (key === 'same_as_ktp') {
                            return null; // Hilangkan field sama dengan alamat KTP
                          }
                          if (key === 'branch_id') {
                            return null; // Sembunyikan branch_id, bisa diganti dengan nama cabang jika ada mapping
                          }
                          if (key === 'status') {
                            return (
                              <div key={key} className="grid grid-cols-2 gap-4">
                                <p className="font-medium">{fieldLabels[key]}</p>
                                <p>{getStatusBadge(viewingMember.status)}</p>
                              </div>
                            );
                          }
                          if (key === 'id' || key === 'updated_at') {
                            return null; // Sembunyikan id dan updated_at
                          }
                          if (key === 'created_at') {
                            return null; // Tampilkan di bawah
                          }
                          return (
                            <div key={key} className="grid grid-cols-2 gap-4">
                              <p className="font-medium">{fieldLabels[key] || key.replace(/_/g, ' ')}</p>
                              <p>{viewingMember[key as keyof Member] ? viewingMember[key as keyof Member]?.toString() : '-'}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  {/* Tanggal pengajuan di bawah */}
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <p className="font-medium">Tanggal Pengajuan</p>
                    <p>{viewingMember.created_at ? new Date(viewingMember.created_at).toLocaleDateString('id-ID') : '-'}</p>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari anggota berdasarkan nama, nomor KTP, atau nomor HP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Members Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Anggota ({filteredMembers.length})</CardTitle>
            <CardDescription>Anggota aktif cabang {user?.branchName}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Nomor Anggota</TableHead>
                  <TableHead>No HP</TableHead>
                  <TableHead>Tanggal Pengajuan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.id_number}</p>
                      </div>
                    </TableCell>
                    <TableCell>{member.member_number}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>{new Date(member.created_at).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell>{getStatusBadge(member.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(member)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(member)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredMembers.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Tidak ada anggota ditemukan</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 