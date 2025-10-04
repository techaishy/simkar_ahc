export interface Alat {
  id: string;
  kode_barcode?: string;        
  nama_alat: string;          
  jumlah?: number;              
  tahun_pembelian?: number;     
  merk?: string;               
  type?: string;                
  fungsi_kalibrasi?: string;   
  status_vendor?: string;       
  kalibrasi_terakhir?: string;  
  created_at?: string;         
  updated_at?: string;          

  units?: AlatUnit[];          
}

export interface AlatUnit {
  id: string;
  alat_id: string;             
  kondisi: string;             
  status: "TERSEDIA" | "DIGUNAKAN" | "MAINTENANCE";              
  kode_unit?: string;          
  nomor_seri?: string;          
  created_at?: string;          
  updated_at?: string;          
}
