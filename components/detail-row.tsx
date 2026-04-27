import { DetailTutorial, Status, Tipe } from "@/tipe/tutorial-tipe";
import { Eye, EyeOff, GripVertical, Trash2 } from "lucide-react";
import { tipeConfig } from "./modal-add-detail";

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Badge({ tipe }: { tipe: Tipe }) {
  const cfg = tipeConfig[tipe];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs font-medium ${cfg.color} ${cfg.bg}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function StatusToggle({
  status,
  onChange,
}: {
  status: Status;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 border ${
        status === "show"
          ? "bg-emerald-400/10 border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/20"
          : "bg-slate-700/50 border-slate-600/30 text-slate-500 hover:bg-slate-700"
      }`}
    >
      {status === "show" ? <Eye size={12} /> : <EyeOff size={12} />}
      {status === "show" ? "Tampil" : "Tersembunyi"}
    </button>
  );
}

export function DetailRow({
  detail,
  isDragging,
  isDragOver,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onToggleStatus,
  onDelete,
}: {
  detail: DetailTutorial;
  isDragging: boolean;
  isDragOver: boolean;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onDragEnd: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`group flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 select-none ${
        isDragging
          ? "opacity-40 scale-95 border-sky-500/40 bg-sky-500/5"
          : isDragOver
            ? "border-sky-400/60 bg-sky-400/10 scale-[1.01] shadow-lg shadow-sky-500/10"
            : "border-slate-700/50 bg-slate-800/40 hover:border-slate-600/60 hover:bg-slate-800/60"
      }`}
    >
      {/* Drag handle */}
      <div className="flex-shrink-0 mt-0.5 cursor-grab active:cursor-grabbing text-slate-600 group-hover:text-slate-400 transition-colors">
        <GripVertical size={18} />
      </div>

      {/* Order badge */}
      <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-slate-700/60 border border-slate-600/40 flex items-center justify-center text-xs font-bold text-slate-400 mt-0.5">
        {detail.order}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge tipe={detail.tipe} />
          <StatusToggle status={detail.status} onChange={onToggleStatus} />
          <span className="text-xs text-slate-600 ml-auto">
            {formatDate(detail.updated_at)}
          </span>
        </div>

        {detail.isi && (
          <div
            className={`text-xs rounded-lg px-3 py-2 truncate border ${
              detail.tipe === "code"
                ? "bg-slate-900/60 border-slate-700/40 text-emerald-300 font-mono"
                : detail.tipe === "url"
                  ? "bg-slate-900/40 border-slate-700/40 text-sky-400"
                  : "bg-slate-900/40 border-slate-700/40 text-slate-300"
            }`}
          >
            {detail.isi}
          </div>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all mt-0.5"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
