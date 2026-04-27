"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface DeleteTutorialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tutorialJudul: string;
  onConfirm: () => void;
  loading: boolean;
}

// Modal konfirmasi hapus tutorial
export function DeleteTutorialModal({
  open,
  onOpenChange,
  tutorialJudul,
  onConfirm,
  loading,
}: DeleteTutorialModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] gap-0 p-0 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <DialogTitle className="text-base font-bold tracking-tight text-zinc-100">
              Hapus Tutorial
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="px-6 py-5">
          <p className="text-sm text-zinc-400">
            Apakah kamu yakin ingin menghapus tutorial{" "}
            <span className="font-semibold text-zinc-100">"{tutorialJudul}"</span>?
            Semua detail tutorial akan ikut dihapus dan tidak dapat dikembalikan.
          </p>
        </div>
        <DialogFooter className="px-6 pb-6 flex gap-2">
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
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-500 text-white font-semibold hover:bg-red-600 rounded-xl h-10 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" /> Hapus
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
