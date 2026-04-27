"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BookOpen, ImageIcon, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { tutorialService } from "@/service/tutorial-service";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────
interface MataKuliah {
  kdmk: string;
  nama: string;
}

interface TutorialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** List mata kuliah untuk dropdown */
  mataKuliahList?: MataKuliah[];
  /** Callback setelah submit berhasil */
  onSuccess?: (data: TutorialFormData) => void;
  /** Data untuk mode edit, null/undefined untuk mode add */
  editData?: (TutorialFormData & { id: number }) | null;
}

export interface TutorialFormData {
  judul: string;
  kode_matkul: string;
  matkul: string;
  foto: string;
  creator_email: string;
}

// ── Component ──────────────────────────────────────────────────────
export function TutorialModal({
  open,
  onOpenChange,
  mataKuliahList,
  onSuccess,
  editData,
}: TutorialModalProps) {
  const isEditMode = !!editData;
  const [judul, setJudul] = useState(isEditMode ? editData.judul : "");
  const [selectedMatkul, setSelectedMatkul] = useState<MataKuliah | null>(
    isEditMode && editData
      ? { kdmk: editData.kode_matkul, nama: editData.matkul }
      : null,
  );
  const [foto, setFoto] = useState(isEditMode ? editData.foto : "");
  const [fotoError, setFotoError] = useState(false);
  const [creator_email, setCreatorEmail] = useState(
    isEditMode ? editData.creator_email : "",
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof TutorialFormData, string>>
  >({});

  // preview gambar
  const fotoValid = foto.trim() !== "" && !fotoError;

  // Ambil objek mata kuliah lengkap dari list berdasarkan kode yang dipilih
  // Ini diperlukan karena kita perlu nama matkul, bukan cuma kode
  function handleMatkulChange(kode: string) {
    if (!mataKuliahList) return;
    const mk = mataKuliahList.find((m) => m.kdmk === kode) ?? null;
    setSelectedMatkul(mk);
    setErrors((e) => ({ ...e, kode_matkul: undefined }));
  }

  // Validasi semua field sebelum submit
  function validate(): boolean {
    const next: typeof errors = {};
    if (!judul.trim()) next.judul = "Judul tidak boleh kosong.";
    if (!selectedMatkul)
      next.kode_matkul = "Pilih mata kuliah terlebih dahulu.";
    if (!foto.trim()) next.foto = "URL foto tidak boleh kosong.";
    else if (fotoError) next.foto = "URL foto tidak valid atau gagal dimuat.";
    if (!creator_email.trim())
      next.creator_email = "Email pembuat tidak boleh kosong.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  // Kirim data ke server (create atau update tergantung mode)
  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);

    const payload: TutorialFormData = {
      judul,
      kode_matkul: selectedMatkul!.kdmk,
      matkul: selectedMatkul!.nama,
      foto,
      creator_email,
    };

    try {
      let response;
      if (isEditMode && editData) {
        response = await tutorialService.updateTutorial(editData.id, payload);
        toast.success("Tutorial berhasil diperbarui!");
      } else {
        response = await tutorialService.addTutorial(payload);
        toast.success("Tutorial berhasil ditambahkan!");
      }
      if (!response.id) {
        throw new Error("Failed to save tutorial");
      }
      onSuccess?.(response);
    } catch (error) {
      console.error("Error saving tutorial:", error);
      toast.error("Gagal menyimpan tutorial. Silakan coba lagi.");
      return;
    }
    handleReset();
    onOpenChange(false);
  }

  function handleReset() {
    setJudul("");
    setSelectedMatkul(null);
    setFoto("");
    setFotoError(false);
    setErrors({});
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!loading) {
          handleReset();
          onOpenChange(v);
        }
      }}
    >
      <DialogContent className="sm:max-w-[480px] gap-0 p-0 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl">
        {/* ── Header ── */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20">
              <BookOpen className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold tracking-tight text-zinc-100">
                {isEditMode ? "Edit Tutorial" : "Tambah Tutorial Baru"}
              </DialogTitle>
              <p className="text-xs text-zinc-500 mt-0.5">
                {isEditMode ? "Ubah data tutorial di bawah ini" : "Isi semua field di bawah ini"}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* ── Body ── */}
        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Foto preview */}
          <div className="relative w-full h-36 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 flex items-center justify-center">
            {fotoValid ? (
              <Image
                src={foto}
                alt="Preview foto"
                fill
                className="object-cover"
                onError={() => setFotoError(true)}
                unoptimized
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-zinc-600">
                <ImageIcon className="w-8 h-8" />
                <span className="text-xs">
                  Preview foto akan muncul di sini
                </span>
              </div>
            )}
            {fotoValid && (
              <button
                onClick={() => {
                  setFoto("");
                  setFotoError(false);
                }}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            )}
          </div>

          {/* Judul */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="judul"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
            >
              Judul Tutorial
            </Label>
            <Input
              id="judul"
              value={judul}
              onChange={(e) => {
                setJudul(e.target.value);
                setErrors((er) => ({ ...er, judul: undefined }));
              }}
              placeholder="Contoh: Pengenalan HTML & CSS"
              className={cn(
                "bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-amber-400/30 focus-visible:border-amber-400/60 rounded-xl h-10 text-sm",
                errors.judul &&
                  "border-red-500/60 focus-visible:border-red-500/60",
              )}
            />
            {errors.judul && (
              <p className="text-xs text-red-400">{errors.judul}</p>
            )}
          </div>

          {/* Mata Kuliah */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Mata Kuliah
            </Label>
            <Select onValueChange={handleMatkulChange} value={selectedMatkul?.kdmk || ""}>
              <SelectTrigger
                className={cn(
                  "bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-amber-400/30 focus:border-amber-400/60 rounded-xl h-10 text-sm",
                  errors.kode_matkul && "border-red-500/60",
                )}
              >
                <SelectValue placeholder="Pilih mata kuliah..." />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100 rounded-xl">
                {mataKuliahList?.map((mk) => (
                  <SelectItem
                    key={mk.kdmk}
                    value={mk.kdmk}
                    className="focus:bg-zinc-800 focus:text-zinc-100 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
                        {mk.kdmk}
                      </span>
                      <span>{mk.nama}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.kode_matkul && (
              <p className="text-xs text-red-400">{errors.kode_matkul}</p>
            )}
          </div>

          {/* Foto URL */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="foto"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
            >
              URL Foto Cover
            </Label>
            <Input
              id="foto"
              value={foto}
              onChange={(e) => {
                setFoto(e.target.value);
                setFotoError(false);
                setErrors((er) => ({ ...er, foto: undefined }));
              }}
              placeholder="https://example.com/cover.png"
              className={cn(
                "bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-amber-400/30 focus-visible:border-amber-400/60 rounded-xl h-10 text-sm font-mono",
                errors.foto &&
                  "border-red-500/60 focus-visible:border-red-500/60",
              )}
            />
            {errors.foto && (
              <p className="text-xs text-red-400">{errors.foto}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
            >
              Email Pembuat
            </Label>
            <Input
              id="email"
              type="email"
              value={creator_email}
              onChange={(e) => {
                setCreatorEmail(e.target.value);
                setErrors((er) => ({ ...er, creator_email: undefined }));
              }}
              placeholder="placeholder@gmail.com"
              className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-amber-400/30 focus-visible:border-amber-400/60 rounded-xl h-10 text-sm font-mono"
            />
            {errors.creator_email && (
              <p className="text-xs text-red-400">{errors.creator_email}</p>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <DialogFooter className="px-6 pb-6 flex gap-2 sm:gap-2">
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={loading}
              className="flex-1 border-zinc-800 bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 rounded-xl h-10"
            >
              Batal
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-amber-400 text-zinc-950 font-semibold hover:bg-amber-300 rounded-xl h-10 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...
              </>
            ) : isEditMode ? (
              "Simpan Perubahan"
            ) : (
              "Tambah Tutorial"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
