export type Tipe = "text" | "gambar" | "code" | "url";
export type Status = "show" | "hide";

export interface Tutorial {
  id: number;
  judul: string;
  foto: string;
  kode_matkul: string;
  matkul: string;
  creator_email: string;
  created_at: Date;
  updated_at: Date;
  url_presentation: string;
  url_finished: string;
}

export interface DetailTutorial {
  id: number;
  tipe: Tipe;
  order: number;
  status: Status;
  created_at: Date;
  updated_at: Date;
  tutorialId: number;
  isi?: string; 
}
