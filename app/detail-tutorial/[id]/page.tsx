"use client";

import { useState, useRef, useEffect } from "react";
import {
  GripVertical,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Code2,
  Link2,
  Type,
  Image,
  Edit3,
  Save,
  X,
  ChevronLeft,
  BookOpen,
  LayoutList,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
import { Tipe, Status, Tutorial, DetailTutorial } from "@/tipe/tutorial-tipe";
import { DetailRow, formatDate } from "@/components/detail-row";
import { AddDetailModal, tipeConfig } from "@/components/modal-add-detail";
import { tutorialService } from "@/service/tutorial-service";
import { useParams, useRouter } from "next/navigation";
import { status } from "@/generated/prisma/enums";
import { TutorialModal } from "@/components/modal-tutorial";
import { AuthService } from "@/service/auth-service";
import { DeleteTutorialModal } from "@/components/modal-delete-tutorial";
import { toast } from "sonner";

export default function TutorialDetailManagement() {
  const [tutorial, setTutorial] = useState<Tutorial>();
  const [details, setDetails] = useState<DetailTutorial[]>([]);
  const [showEditTutorial, setShowEditTutorial] = useState(false);
  const [showAddDetail, setShowAddDetail] = useState(false);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const nextId = useRef(100);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const router = useRouter();
  const [mataKuliahList, setMataKuliahList] = useState<
    { kdmk: string; nama: string }[]
  >([]);
  const [showDeleteTutorial, setShowDeleteTutorial] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Ambil data tutorial & mata kuliah saat page dimuat
  useEffect(() => {
    const getInitialTutorial = async (id: number) => {
      setLoading(true);
      try {
        const data = await tutorialService.getTutorialById(id);
        console.log("Fetched tutorial:", data);
        if (data) {
          setTutorial(data);
          setDetails(data.detail_tutorial || []);
        } else {
          console.error("Tutorial not found");
        }
      } catch (error) {
        console.error("Error fetching tutorial:", error);
      } finally {
        setLoading(false);
      }
    };
    const getMatkulList = async () => {
      try {
        setLoading(true);
        const response = await AuthService.getMatkul();
        setMataKuliahList(response);
      } catch (error) {
        console.error("Error fetching mata kuliah list:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      getInitialTutorial(id as unknown as number);
    }
    getMatkulList();
  }, [id]);

  // ── Drag & Drop — handle perpindahan item saat drag selesai ──

  const handleDragStart = (id: number) => setDraggingId(id);

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverId(null);
  };

  const handleDragOver = (e: React.DragEvent, id: number) => {
    e.preventDefault();
    setDragOverId(id);
  };

  const handleDrop = async (targetId: number) => {
    if (draggingId === null || draggingId === targetId) return;

    let updatedData: any[] = [];

    setDetails((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);

      const fromIdx = sorted.findIndex((d) => d.id === draggingId);
      const toIdx = sorted.findIndex((d) => d.id === targetId);

      const [moved] = sorted.splice(fromIdx, 1);
      sorted.splice(toIdx, 0, moved);

      updatedData = sorted.map((d, i) => ({
        ...d,
        order: i + 1,
      }));

      return updatedData;
    });

    setDraggingId(null);
    setDragOverId(null);

    try {
      await Promise.all(
        updatedData.map((item) =>
          tutorialService.updateDetailTutorial(item.id.toString(), {
            order: item.order,
          }),
        ),
      );
    } catch (error) {
      console.log("Error update order:", error);
    }
  };

  // ── Toggle visibility status ──
  // Ubah status detail antara "show" dan "hide"
  const toggleStatus = async (id: number, status: string) => {
    try {
      const response = await tutorialService.updateDetailTutorial(
        id.toString(),
        {
          status: status == "hide" ? "show" : "hide",
        },
      );
      if (!response.id) {
        console.log("Error menguvah status");
      }
      setDetails((prev) =>
        prev.map((d) =>
          d.id === id
            ? { ...d, status: d.status === "show" ? "hide" : "show" }
            : d,
        ),
      );
      toast.success("Status berhasil diubah!");
    } catch (error) {
      console.log(error);
      toast.error("Gagal mengubah status.");
    }
  };

  // ── Hapus detail dari server ──
  const deleteDetail = async (id: number) => {
    try {
      const response = await tutorialService.deleteDetailTutorial(
        id.toString(),
      );
      if (!response.id) {
        console.log("Error menguvah status");
      }
      setDetails((prev) => {
        const filtered = prev.filter((d) => d.id !== id);
        return filtered
          .sort((a, b) => a.order - b.order)
          .map((d, i) => ({ ...d, order: i + 1 }));
      });
      toast.success("Detail tutorial berhasil dihapus!");
    } catch (error) {
      console.log(error);
      toast.error("Gagal menghapus detail tutorial.");
    }
  };

  // ── Hapus seluruh tutorial ──
  // Panggil API DELETE /api/tutorial/{id} lalu redirect ke dashboard
  const handleDeleteTutorial = async () => {
    if (!tutorial) return;
    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/tutorial/${tutorial.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        toast.success("Tutorial berhasil dihapus!");
        router.push("/dashboard");
      } else {
        console.error("Failed to delete tutorial");
        toast.error("Gagal menghapus tutorial.");
      }
    } catch (error) {
      console.error("Error deleting tutorial:", error);
      toast.error("Terjadi kesalahan saat menghapus tutorial.");
    } finally {
      setDeleteLoading(false);
      setShowDeleteTutorial(false);
    }
  };

  // ── Tambah detail baru ke server ──
  // Kirim data detail baru ke API, lalu update state lokal
  const addDetail = async (
    data: Omit<DetailTutorial, "id" | "created_at" | "updated_at">,
  ) => {
    try {
      const response = await tutorialService.addDetailTutorial({
        tutorialId: Number(tutorial?.id),
        isi: data.content ?? "",
        tipe: data.tipe,
        order: details.length + 1,
        status: "show",
      });

      if (!response.id) {
        throw new Error("Failed to add tutorial");
      }

      setDetails((prev) => [...prev, response]);
      toast.success("Detail tutorial berhasil ditambahkan!");
    } catch (error) {
      console.error("Error adding tutorial:", error);
      toast.error("Gagal menambahkan detail tutorial.");
      return;
    }
  };

  const sortedDetails = [...details].sort((a, b) => a.order - b.order);
  const showCount = details.filter((d) => d.status === "show").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080e1a] text-slate-500">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-slate-500" />
        <span className="ml-3 text-sm">Memuat tutorial...</span>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080e1a] text-slate-500">
        Tutorial tidak ditemukan.
      </div>
    );
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #080e1a; font-family: 'DM Sans', sans-serif; }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
      `}</style>

      <div className="min-h-screen bg-[#080e1a] text-white">
        {/* Ambient background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-600/6 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-violet-600/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <ChevronLeft size={14} />
            <span
              className="hover:text-slate-300 cursor-pointer transition-colors"
              onClick={() => {
                router.push("/dashboard");
              }}
            >
              Tutorial
            </span>
            <span>/</span>
            <span className="text-slate-300">Manajemen Detail</span>
          </div>

          {/* ── Tutorial Card ── */}
          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 overflow-hidden mb-6 backdrop-blur-sm">
            <div className="flex items-start gap-4 p-5">
              <img
                src={tutorial.foto}
                alt={tutorial.judul}
                className="w-20 h-14 object-cover rounded-xl flex-shrink-0 border border-slate-700/50"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-sky-500/15 border border-sky-500/25 text-sky-400">
                        {tutorial.kode_matkul}
                      </span>
                      <span className="text-xs text-slate-500">
                        {tutorial.matkul}
                      </span>
                    </div>
                    <h1 className="text-lg font-semibold text-white leading-snug">
                      {tutorial.judul}
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {tutorial.creator_email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowEditTutorial(true)}
                      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-600/50 text-slate-400 hover:border-sky-500/40 hover:text-sky-400 hover:bg-sky-500/5 transition-all"
                    >
                      <Edit3 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteTutorial(true)}
                      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-600/50 text-slate-400 hover:border-red-500/40 hover:text-red-400 hover:bg-red-500/5 transition-all"
                    >
                      <Trash2 size={12} /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-4 divide-x divide-slate-700/50 border-t border-slate-700/50">
              {[
                { label: "Total Item", value: details.length },
                { label: "Ditampilkan", value: showCount },
                {
                  label: "Dibuat",
                  value: formatDate(tutorial.created_at.toString()),
                },
                {
                  label: "Diperbarui",
                  value: formatDate(tutorial.updated_at.toString()),
                },
              ].map((stat) => (
                <div key={stat.label} className="px-4 py-3 text-center">
                  <div className="text-sm font-semibold text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Detail Header ── */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LayoutList size={16} className="text-slate-400" />
              <h2 className="text-sm font-semibold text-white">
                Detail Tutorial
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/60 border border-slate-600/40 text-slate-400 font-mono">
                {sortedDetails.length}
              </span>
            </div>
            <button
              onClick={() => setShowAddDetail(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-blue-700 bg-blue-600 text-white transition-colors"
            >
              <Plus size={13} /> Tambah Item
            </button>
          </div>

          {/* ── Tipe Legend ── */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {(Object.keys(tipeConfig) as Tipe[]).map((t) => {
              const cfg = tipeConfig[t];
              const count = details.filter((d) => d.tipe === t).length;
              return (
                <span
                  key={t}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs ${cfg.color} ${cfg.bg}`}
                >
                  {cfg.icon} {cfg.label}
                  <span className="font-bold">{count}</span>
                </span>
              );
            })}
          </div>

          {/* ── Drag hint ── */}
          <p className="text-xs text-slate-600 mb-3 flex items-center gap-1.5">
            <GripVertical size={12} /> Seret item untuk mengubah urutan
          </p>

          {/* ── Detail List ── */}
          <div className="space-y-2">
            {sortedDetails.map((detail) => (
              <DetailRow
                key={detail.id}
                detail={detail}
                isDragging={draggingId === detail.id}
                isDragOver={dragOverId === detail.id}
                onDragStart={() => handleDragStart(detail.id)}
                onDragOver={(e) => handleDragOver(e, detail.id)}
                onDrop={() => handleDrop(detail.id)}
                onDragEnd={handleDragEnd}
                onToggleStatus={() => toggleStatus(detail.id, detail.status)}
                onDelete={() => deleteDetail(detail.id)}
              />
            ))}

            {sortedDetails.length === 0 && (
              <div className="text-center py-16 rounded-2xl border border-dashed border-slate-700/50">
                <BookOpen size={32} className="text-slate-700 mx-auto mb-3" />
                <p className="text-sm text-slate-500">
                  Belum ada detail tutorial.
                </p>
                <button
                  onClick={() => setShowAddDetail(true)}
                  className="mt-3 text-xs text-sky-400 hover:text-sky-300 transition-colors"
                >
                  + Tambah item
                </button>
              </div>
            )}
          </div>

          {/* ── URL Links ── */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {[
              {
                label: "URL Presentasi",
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/presentation/${tutorial.url_presentation}`,
              },
              {
                label: "URL Selesai",
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/finished/${tutorial.url_finished}`,
              },
            ].map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:border-slate-600/60 hover:bg-slate-800/50 transition-all group"
              >
                <Link2
                  size={14}
                  className="text-slate-500 group-hover:text-sky-400 transition-colors flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
                    {link.label}
                  </p>
                  <p className="text-xs text-slate-600 truncate">{link.url}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {showEditTutorial && (
        <TutorialModal
          open={showEditTutorial}
          editData={tutorial}
          onOpenChange={setShowEditTutorial}
          onSuccess={(updatedTutorial) => {
            setTutorial({
              ...tutorial,
              judul: updatedTutorial.judul,
              foto: updatedTutorial.foto,
              kode_matkul: updatedTutorial.kode_matkul,
              matkul: updatedTutorial.matkul,
            });
            setShowEditTutorial(false);
          }}
          mataKuliahList={mataKuliahList}
        />
      )}
      {showAddDetail && (
        <AddDetailModal
          tutorialId={tutorial.id}
          onAdd={addDetail}
          onClose={() => setShowAddDetail(false)}
        />
      )}
      {showDeleteTutorial && (
        <DeleteTutorialModal
          open={showDeleteTutorial}
          onOpenChange={setShowDeleteTutorial}
          tutorialJudul={tutorial?.judul || ""}
          onConfirm={handleDeleteTutorial}
          loading={deleteLoading}
        />
      )}
    </>
  );
}
