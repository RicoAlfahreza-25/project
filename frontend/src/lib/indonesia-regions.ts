export interface Region {
  id: string;
  name: string;
}

export interface Province extends Region {
  cities: City[];
}

export interface City extends Region {
  districts: District[];
}

export interface District extends Region {
  subdistricts: Subdistrict[];
}

export interface Subdistrict extends Region {}

export const indonesiaRegions: Province[] = [
  {
    id: "32",
    name: "Jawa Barat",
    cities: [
      {
        id: "3201",
        name: "Kabupaten Bogor",
        districts: [
          {
            id: "320101",
            name: "Cibinong",
            subdistricts: [
              { id: "32010101", name: "Pakansari" },
              { id: "32010102", name: "Cibinong" },
              { id: "32010103", name: "Pakansari" }
            ]
          },
          {
            id: "320102",
            name: "Cibungbulang",
            subdistricts: [
              { id: "32010201", name: "Cibungbulang" },
              { id: "32010202", name: "Cimanggu" }
            ]
          }
        ]
      },
      {
        id: "3202",
        name: "Kabupaten Sukabumi",
        districts: [
          {
            id: "320201",
            name: "Cibadak",
            subdistricts: [
              { id: "32020101", name: "Cibadak" },
              { id: "32020102", name: "Cicurug" }
            ]
          }
        ]
      },
      {
        id: "3271",
        name: "Kota Bandung",
        districts: [
          {
            id: "327101",
            name: "Bandung Wetan",
            subdistricts: [
              { id: "32710101", name: "Citarum" },
              { id: "32710102", name: "Tamansari" }
            ]
          },
          {
            id: "327102",
            name: "Bandung Kulon",
            subdistricts: [
              { id: "32710201", name: "Cigondewah Kidul" },
              { id: "32710202", name: "Cigondewah Kaler" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "31",
    name: "DKI Jakarta",
    cities: [
      {
        id: "3171",
        name: "Kota Jakarta Pusat",
        districts: [
          {
            id: "317101",
            name: "Menteng",
            subdistricts: [
              { id: "31710101", name: "Menteng" },
              { id: "31710102", name: "Cikini" },
              { id: "31710103", name: "Gondangdia" }
            ]
          },
          {
            id: "317102",
            name: "Tanah Abang",
            subdistricts: [
              { id: "31710201", name: "Kebon Melati" },
              { id: "31710202", name: "Kebon Kacang" }
            ]
          },
          {
            id: "317103",
            name: "Kemayoran",
            subdistricts: [
              { id: "31710301", name: "Kemayoran" },
              { id: "31710302", name: "Kebon Kosong" }
            ]
          }
        ]
      },
      {
        id: "3172",
        name: "Kota Jakarta Utara",
        districts: [
          {
            id: "317201",
            name: "Penjaringan",
            subdistricts: [
              { id: "31720101", name: "Penjaringan" },
              { id: "31720102", name: "Pluit" }
            ]
          }
        ]
      },
      {
        id: "3173",
        name: "Kota Jakarta Barat",
        districts: [
          {
            id: "317301",
            name: "Cengkareng",
            subdistricts: [
              { id: "31730101", name: "Cengkareng Barat" },
              { id: "31730102", name: "Cengkareng Timur" }
            ]
          }
        ]
      },
      {
        id: "3174",
        name: "Kota Jakarta Selatan",
        districts: [
          {
            id: "317401",
            name: "Kebayoran Baru",
            subdistricts: [
              { id: "31740101", name: "Senayan" },
              { id: "31740102", name: "Grogol Utara" }
            ]
          }
        ]
      },
      {
        id: "3175",
        name: "Kota Jakarta Timur",
        districts: [
          {
            id: "317501",
            name: "Matraman",
            subdistricts: [
              { id: "31750101", name: "Pisangan Baru" },
              { id: "31750102", name: "Utan Kayu Utara" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "33",
    name: "Jawa Tengah",
    cities: [
      {
        id: "3371",
        name: "Kota Semarang",
        districts: [
          {
            id: "337101",
            name: "Semarang Tengah",
            subdistricts: [
              { id: "33710101", name: "Pekunden" },
              { id: "33710102", name: "Sekayu" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "35",
    name: "Jawa Timur",
    cities: [
      {
        id: "3571",
        name: "Kota Surabaya",
        districts: [
          {
            id: "357101",
            name: "Tegalsari",
            subdistricts: [
              { id: "35710101", name: "Tegalsari" },
              { id: "35710102", name: "Wonokromo" }
            ]
          }
        ]
      }
    ]
  }
];

export const getProvinces = (): Region[] => {
  return indonesiaRegions.map(province => ({ id: province.id, name: province.name }));
};

export const getCities = (provinceId: string): Region[] => {
  const province = indonesiaRegions.find(p => p.id === provinceId);
  return province ? province.cities.map(city => ({ id: city.id, name: city.name })) : [];
};

export const getDistricts = (provinceId: string, cityId: string): Region[] => {
  const province = indonesiaRegions.find(p => p.id === provinceId);
  if (!province) return [];
  
  const city = province.cities.find(c => c.id === cityId);
  return city ? city.districts.map(district => ({ id: district.id, name: district.name })) : [];
};

export const getSubdistricts = (provinceId: string, cityId: string, districtId: string): Region[] => {
  const province = indonesiaRegions.find(p => p.id === provinceId);
  if (!province) return [];
  
  const city = province.cities.find(c => c.id === cityId);
  if (!city) return [];
  
  const district = city.districts.find(d => d.id === districtId);
  return district ? district.subdistricts.map(subdistrict => ({ id: subdistrict.id, name: subdistrict.name })) : [];
}; 