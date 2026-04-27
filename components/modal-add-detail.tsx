import { DetailTutorial, Tipe } from "@/tipe/tutorial-tipe";
import { Code2, Image, Link2, Plus, Type, X } from "lucide-react";
import { useState } from "react";

// Konfigurasi tampilan untuk tiap tipe konten (text/gambar/code/url)
export const tipeConfig: Record<
  Tipe,
  { icon: React.ReactNode; label: string; color: string; bg: string }
> = {
  text: {
    icon: <Type size={14} />,
    label: "Teks",
    color: "text-sky-400",
    bg: "bg-sky-400/10 border-sky-400/30",
  },
  gambar: {
    icon: <Image size={14} />,
    label: "Gambar",
    color: "text-violet-400",
    bg: "bg-violet-400/10 border-violet-400/30",
  },
  code: {
    icon: <Code2 size={14} />,
    label: "Kode",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/30",
  },
  url: {
    icon: <Link2 size={14} />,
    label: "URL",
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/30",
  },
};

export function AddDetailModal({
  tutorialId,
  onAdd,
  onClose,
}: {
  tutorialId: number;
  onAdd: (d: Omit<DetailTutorial, "id" | "created_at" | "updated_at">) => void;
  onClose: () => void;
}) {
  const [tipe, setTipe] = useState<Tipe>("text");
  const [content, setContent] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-[#0f1929] border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/60 bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Plus size={15} className="text-emerald-400" />
            </div>
            <h2 className="text-base font-semibold text-white">
              Tambah Detail
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Tipe Konten
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(tipeConfig) as Tipe[]).map((t) => {
                const cfg = tipeConfig[t];
                return (
                  <button
                    key={t}
                    onClick={() => setTipe(t)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${
                      tipe === t
                        ? `${cfg.color} ${cfg.bg} scale-105`
                        : "border-slate-700/60 text-slate-500 hover:border-slate-600 hover:text-slate-300"
                    }`}
                  >
                    {cfg.icon}
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Konten
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder={
                tipe === "text"
                  ? "Masukkan teks konten..."
                  : tipe === "gambar"
                    ? "https://..."
                    : tipe === "code"
                      ? "// kode di sini..."
                      : "https://..."
              }
              className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/60 transition-colors resize-none font-mono"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-700/60 bg-slate-800/40">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => {
              onAdd({
                tipe,
                order: 999,
                status: "show",
                tutorial_id: tutorialId,
                content,
              });
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-emerald-500 hover:bg-emerald-400 text-white flex items-center gap-2 transition-colors"
          >
            <Plus size={14} /> Tambah
          </button>
        </div>
      </div>
    </div>
  );
}
