import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { getProvinces, getCities, getDistricts, getSubdistricts, Region } from '@/lib/indonesia-regions';

interface MemberFormProps {
  formData: any;
  setFormData: (data: any) => void;
  files: any;
  setFiles: (files: any) => void;
  editingMember: any;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function MemberForm({ 
  formData, 
  setFormData, 
  files, 
  setFiles, 
  editingMember, 
  onSubmit, 
  onCancel 
}: MemberFormProps) {
  const [provinces, setProvinces] = useState<Region[]>([]);
  const [cities, setCities] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [subdistricts, setSubdistricts] = useState<Region[]>([]);
  
  // State untuk alamat domisili cascading
  const [domicileCities, setDomicileCities] = useState<Region[]>([]);
  const [domicileDistricts, setDomicileDistricts] = useState<Region[]>([]);
  const [domicileSubdistricts, setDomicileSubdistricts] = useState<Region[]>([]);
  
  // Local state untuk checkbox
  // HAPUS: const [isSameAsKtp, setIsSameAsKtp] = useState(false);

  useEffect(() => {
    setProvinces(getProvinces());
  }, []);

  // Debug: Monitor formData changes (only when same_as_ktp changes)
  useEffect(() => {
    console.log('same_as_ktp changed to:', formData.same_as_ktp);
  }, [formData.same_as_ktp]);

  // Memoized checkbox handler - using local state
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    console.log('Checkbox clicked:', isChecked);
    
    // HAPUS: setIsSameAsKtp(isChecked);
    
    if (isChecked) {
      console.log('Copying KTP address to domicile');
      setFormData(prev => {
        console.log('Current KTP data:', {
          address: prev.ktp_address,
          province: prev.ktp_province,
          city: prev.ktp_city,
          district: prev.ktp_district,
          subdistrict: prev.ktp_subdistrict,
          postal_code: prev.ktp_postal_code
        });
        
        const newFormData = {
          ...prev,
          same_as_ktp: true,
          domicile_address: prev.ktp_address || '',
          domicile_province: prev.ktp_province || '',
          domicile_city: prev.ktp_city || '',
          domicile_district: prev.ktp_district || '',
          domicile_subdistrict: prev.ktp_subdistrict || '',
          domicile_postal_code: prev.ktp_postal_code || ''
        };
        console.log('New formData will be:', newFormData);
        return newFormData;
      });
    } else {
      console.log('Clearing domicile address');
      setFormData(prev => {
        const newFormData = {
          ...prev,
          same_as_ktp: false,
          domicile_address: '',
          domicile_province: '',
          domicile_city: '',
          domicile_district: '',
          domicile_subdistrict: '',
          domicile_postal_code: ''
        };
        console.log('New formData will be:', newFormData);
        return newFormData;
      });
    }
  }; // Only depend on setFormData, not formData

  useEffect(() => {
    if (formData.ktp_province) {
      const cityList = getCities(formData.ktp_province);
      setCities(cityList);
    }
  }, [formData.ktp_province]);

  useEffect(() => {
    if (formData.ktp_province && formData.ktp_city) {
      const districtList = getDistricts(formData.ktp_province, formData.ktp_city);
      setDistricts(districtList);
    }
  }, [formData.ktp_province, formData.ktp_city]);

  useEffect(() => {
    if (formData.ktp_province && formData.ktp_city && formData.ktp_district) {
      const subdistrictList = getSubdistricts(formData.ktp_province, formData.ktp_city, formData.ktp_district);
      setSubdistricts(subdistrictList);
    }
  }, [formData.ktp_province, formData.ktp_city, formData.ktp_district]);

  // useEffect untuk alamat domisili cascading - hanya jalankan jika checkbox tidak dicentang
  useEffect(() => {
    if (formData.domicile_province && !formData.same_as_ktp) {
      const cityList = getCities(formData.domicile_province);
      setDomicileCities(cityList);
    }
  }, [formData.domicile_province, formData.same_as_ktp]);

  useEffect(() => {
    if (formData.domicile_province && formData.domicile_city && !formData.same_as_ktp) {
      const districtList = getDistricts(formData.domicile_province, formData.domicile_city);
      setDomicileDistricts(districtList);
    }
  }, [formData.domicile_province, formData.domicile_city, formData.same_as_ktp]);

  useEffect(() => {
    if (formData.domicile_province && formData.domicile_city && formData.domicile_district && !formData.same_as_ktp) {
      const subdistrictList = getSubdistricts(formData.domicile_province, formData.domicile_city, formData.domicile_district);
      setDomicileSubdistricts(subdistrictList);
    }
  }, [formData.domicile_province, formData.domicile_city, formData.domicile_district, formData.same_as_ktp]);

  // Sinkronisasi data domisili dengan data KTP jika checkbox dicentang
  useEffect(() => {
    if (formData.same_as_ktp) {
      setFormData(prev => ({
        ...prev,
        domicile_address: prev.ktp_address || '',
        domicile_province: prev.ktp_province || '',
        domicile_city: prev.ktp_city || '',
        domicile_district: prev.ktp_district || '',
        domicile_subdistrict: prev.ktp_subdistrict || '',
        domicile_postal_code: prev.ktp_postal_code || ''
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData.same_as_ktp,
    formData.ktp_address,
    formData.ktp_province,
    formData.ktp_city,
    formData.ktp_district,
    formData.ktp_subdistrict,
    formData.ktp_postal_code
  ]);

  return (
    <form onSubmit={onSubmit} className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
      <div className="space-y-6">
        {/* Kategori Pensiunan */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary border-b pb-2">Kategori Pensiunan</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pensioner_category">Kategori Pensiunan</Label>
              <Select value={formData.pensioner_category} onValueChange={(value) => setFormData({...formData, pensioner_category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TASPEN">TASPEN</SelectItem>
                  <SelectItem value="ASABRI">ASABRI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pension_type">Jenis Pensiunan</Label>
              <Input
                id="pension_type"
                value={formData.pension_type}
                onChange={(e) => setFormData({...formData, pension_type: e.target.value})}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="nopen">Nopen</Label>
              <Input
                id="nopen"
                value={formData.nopen}
                onChange={(e) => setFormData({...formData, nopen: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="book_number">No Buku Karip</Label>
              <Input
                id="book_number"
                value={formData.book_number}
                onChange={(e) => setFormData({...formData, book_number: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skep_number">No SKEP</Label>
              <Input
                id="skep_number"
                value={formData.skep_number}
                onChange={(e) => setFormData({...formData, skep_number: e.target.value})}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="skep_date">Tanggal SKEP</Label>
              <Input
                id="skep_date"
                type="date"
                value={formData.skep_date}
                onChange={(e) => setFormData({...formData, skep_date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skep_name">Atas Nama SK</Label>
              <Input
                id="skep_name"
                value={formData.skep_name}
                onChange={(e) => setFormData({...formData, skep_name: e.target.value})}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="skep_status">Keberadaan SKEP</Label>
              <Select value={formData.skep_status} onValueChange={(value) => setFormData({...formData, skep_status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ON HAND">ON HAND</SelectItem>
                  <SelectItem value="PUSAT">PUSAT</SelectItem>
                  <SelectItem value="BANK LAIN">BANK LAIN</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_bank">Bank Pembayar</Label>
              <Input
                id="payment_bank"
                value={formData.payment_bank}
                onChange={(e) => setFormData({...formData, payment_bank: e.target.value})}
                placeholder="Pilihan dari mitra kerja sama"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pension_account">Norek Pensiun</Label>
              <Input
                id="pension_account"
                value={formData.pension_account}
                onChange={(e) => setFormData({...formData, pension_account: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pension_salary">Gaji Pensiun</Label>
              <Input
                id="pension_salary"
                value={formData.pension_salary}
                onChange={(e) => setFormData({...formData, pension_salary: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Data Pribadi */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary border-b pb-2">Data Pribadi</h3>
          <div className="space-y-2">
            <Label htmlFor="name">Nama Anggota</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="mother_name">Nama Ibu Kandung</Label>
              <Input
                id="mother_name"
                value={formData.mother_name}
                onChange={(e) => setFormData({...formData, mother_name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="id_number">No KTP</Label>
              <Input
                id="id_number"
                value={formData.id_number}
                onChange={(e) => setFormData({...formData, id_number: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="npwp">NPWP</Label>
              <Input
                id="npwp"
                value={formData.npwp}
                onChange={(e) => setFormData({...formData, npwp: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birth_place">Tempat Lahir</Label>
              <Input
                id="birth_place"
                value={formData.birth_place}
                onChange={(e) => setFormData({...formData, birth_place: e.target.value})}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="birth_date">Tanggal Lahir</Label>
              <Input
                id="birth_date"
                type="date"
                value={formData.birth_date}
                onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Jenis Kelamin</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LAKI LAKI">LAKI LAKI</SelectItem>
                  <SelectItem value="PEREMPUAN">PEREMPUAN</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor HP Anggota</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency_phone">Nomor Emergency Call</Label>
              <Input
                id="emergency_phone"
                value={formData.emergency_phone}
                onChange={(e) => setFormData({...formData, emergency_phone: e.target.value})}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="emergency_relation">Hubungan atas No HP</Label>
              <Select value={formData.emergency_relation} onValueChange={(value) => setFormData({...formData, emergency_relation: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih hubungan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ANAK">ANAK</SelectItem>
                  <SelectItem value="SAUDARA">SAUDARA</SelectItem>
                  <SelectItem value="RT">RT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency_name">Atas Nama HP</Label>
              <Input
                id="emergency_name"
                value={formData.emergency_name}
                onChange={(e) => setFormData({...formData, emergency_name: e.target.value})}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="marital_status">Status Pernikahan</Label>
              <Select value={formData.marital_status} onValueChange={(value) => setFormData({...formData, marital_status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status pernikahan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MENIKAH">MENIKAH</SelectItem>
                  <SelectItem value="JANDA">JANDA</SelectItem>
                  <SelectItem value="DUDA">DUDA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="religion">Agama</Label>
              <Select value={formData.religion} onValueChange={(value) => setFormData({...formData, religion: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih agama" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ISLAM">ISLAM</SelectItem>
                  <SelectItem value="KRISTEN">KRISTEN</SelectItem>
                  <SelectItem value="KATOLIK">KATOLIK</SelectItem>
                  <SelectItem value="HINDU">HINDU</SelectItem>
                  <SelectItem value="BUDDHA">BUDDHA</SelectItem>
                  <SelectItem value="KONGHUCU">KONGHUCU</SelectItem>
                  <SelectItem value="LAINNYA">LAINNYA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="occupation">Pekerjaan</Label>
              <Select value={formData.occupation} onValueChange={(value) => setFormData({...formData, occupation: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih pekerjaan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WIRAUSAHA">WIRAUSAHA</SelectItem>
                  <SelectItem value="PENSIUNAN">PENSIUNAN</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="house_ownership">Status Kepemilikan Rumah</Label>
            <Select value={formData.house_ownership} onValueChange={(value) => setFormData({...formData, house_ownership: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MILIK SENDIRI">MILIK SENDIRI</SelectItem>
                <SelectItem value="SEWA">SEWA</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Alamat KTP */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary border-b pb-2">Alamat KTP</h3>
          <div className="space-y-2">
            <Label htmlFor="ktp_address">Alamat Lengkap</Label>
            <Input
              id="ktp_address"
              value={formData.ktp_address}
              onChange={(e) => setFormData({...formData, ktp_address: e.target.value})}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ktp_province">Provinsi</Label>
              <Select value={formData.ktp_province} onValueChange={(value) => setFormData({...formData, ktp_province: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Provinsi" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province.id} value={province.id}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ktp_city">Kabupaten/Kota</Label>
              <Select value={formData.ktp_city} onValueChange={(value) => setFormData({...formData, ktp_city: value})} disabled={!formData.ktp_province}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Kota/Kabupaten" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ktp_district">Kecamatan</Label>
              <Select value={formData.ktp_district} onValueChange={(value) => setFormData({...formData, ktp_district: value})} disabled={!formData.ktp_city}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Kecamatan" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district.id} value={district.id}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ktp_subdistrict">Kelurahan</Label>
              <Select value={formData.ktp_subdistrict} onValueChange={(value) => setFormData({...formData, ktp_subdistrict: value})} disabled={!formData.ktp_district}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Kelurahan" />
                </SelectTrigger>
                <SelectContent>
                  {subdistricts.map((subdistrict) => (
                    <SelectItem key={subdistrict.id} value={subdistrict.id}>
                      {subdistrict.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ktp_postal_code">Kode Pos</Label>
            <Input
              id="ktp_postal_code"
              value={formData.ktp_postal_code}
              onChange={(e) => setFormData({...formData, ktp_postal_code: e.target.value})}
            />
          </div>
        </div>

        {/* Alamat Domisili */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary border-b pb-2">Alamat Domisili</h3>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="same_as_ktp"
              checked={!!formData.same_as_ktp}
              onChange={handleCheckboxChange}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
            />
            <Label htmlFor="same_as_ktp" className="cursor-pointer select-none">Sama dengan alamat KTP</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="domicile_address">Alamat Lengkap</Label>
            <Input
              id="domicile_address"
              value={formData.domicile_address}
              onChange={(e) => setFormData({...formData, domicile_address: e.target.value})}
              disabled={!!formData.same_as_ktp}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="domicile_province">Provinsi</Label>
              <Select value={formData.domicile_province} onValueChange={(value) => setFormData({...formData, domicile_province: value})} disabled={!!formData.same_as_ktp}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Provinsi" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province.id} value={province.id}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="domicile_city">Kabupaten/Kota</Label>
              <Select value={formData.domicile_city} onValueChange={(value) => setFormData({...formData, domicile_city: value})} disabled={!formData.domicile_province || !!formData.same_as_ktp}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Kota/Kabupaten" />
                </SelectTrigger>
                <SelectContent>
                  {domicileCities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="domicile_district">Kecamatan</Label>
              <Select value={formData.domicile_district} onValueChange={(value) => setFormData({...formData, domicile_district: value})} disabled={!formData.domicile_city || !!formData.same_as_ktp}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Kecamatan" />
                </SelectTrigger>
                <SelectContent>
                  {domicileDistricts.map((district) => (
                    <SelectItem key={district.id} value={district.id}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="domicile_subdistrict">Kelurahan</Label>
              <Select value={formData.domicile_subdistrict} onValueChange={(value) => setFormData({...formData, domicile_subdistrict: value})} disabled={!formData.domicile_district || !!formData.same_as_ktp}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Kelurahan" />
                </SelectTrigger>
                <SelectContent>
                  {domicileSubdistricts.map((subdistrict) => (
                    <SelectItem key={subdistrict.id} value={subdistrict.id}>
                      {subdistrict.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="domicile_postal_code">Kode Pos</Label>
              <Input
                id="domicile_postal_code"
                value={formData.domicile_postal_code}
                onChange={(e) => setFormData({...formData, domicile_postal_code: e.target.value})}
                disabled={!!formData.same_as_ktp}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rt_number">RT/Tetangga</Label>
              <Input
                id="rt_number"
                value={formData.rt_number}
                onChange={(e) => setFormData({...formData, rt_number: e.target.value})}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="rt_name">Nama RT/Tetangga</Label>
              <Input
                id="rt_name"
                value={formData.rt_name}
                onChange={(e) => setFormData({...formData, rt_name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone1">Nomor HP 1</Label>
              <Input
                id="phone1"
                value={formData.phone1}
                onChange={(e) => setFormData({...formData, phone1: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone2">Nomor HP 2</Label>
              <Input
                id="phone2"
                value={formData.phone2}
                onChange={(e) => setFormData({...formData, phone2: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Marketing & Cabang */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary border-b pb-2">Marketing & Cabang</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="marketing_id">Marketing</Label>
              <Select value={formData.marketing_id} onValueChange={(value) => setFormData({...formData, marketing_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Marketing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Marketing Jakarta Pusat</SelectItem>
                  <SelectItem value="2">Marketing Jakarta Utara</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch_id">Cabang</Label>
              <Select value={formData.branch_id} onValueChange={(value) => setFormData({...formData, branch_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Cabang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Cabang Jakarta Pusat</SelectItem>
                  <SelectItem value="2">Cabang Jakarta Utara</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Upload Berkas */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary border-b pb-2">Upload Berkas</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ktp_file">Upload KTP (PDF)</Label>
              <Input
                id="ktp_file"
                type="file"
                accept=".pdf"
                onChange={(e) => setFiles({...files, ktp_file: e.target.files?.[0] || null})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="member_form">Upload Form Anggota (PDF)</Label>
              <Input
                id="member_form"
                type="file"
                accept=".pdf"
                onChange={(e) => setFiles({...files, member_form: e.target.files?.[0] || null})}
              />
            </div>
          </div>
        </div>

        {/* Status otomatis pengajuan untuk cabang */}
        <input type="hidden" value="pending" />

        {/* Buttons */}
        <div className="flex gap-4 pt-4 border-t">
          <Button type="submit" className="flex-1">
            {editingMember ? 'Update Anggota' : 'Tambah Anggota'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
        </div>
      </div>
    </form>
  );
} 