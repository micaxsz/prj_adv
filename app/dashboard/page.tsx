"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { CardTutorial } from "@/components/card-tutorial";
import { TutorialModal } from "@/components/modal-tutorial";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AuthService } from "@/service/auth-service";
import { tutorialService } from "@/service/tutorial-service";
import { Tutorial } from "@/tipe/tutorial-tipe";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type MataKuliah = {
  kdmk: string;
  nama: string;
};

export default function Page() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [open, setOpen] = useState(false);
  const [mataKuliahList, setMataKuliahList] = useState<MataKuliah[]>([]);
  const [loading, setLoading] = useState(false);

  // Callback setelah berhasil tambah tutorial
  const handleSuccess = async () => {
    setOpen(false);
    await fetchTutorials();
    toast.success("Tutorial berhasil ditambahkan!");
  };

  // Ambil semua tutorial dari server
  const fetchTutorials = async () => {
    try {
      setLoading(true);
      const data = await tutorialService.getTutorials();
      setTutorials(data);
    } catch (error) {
      console.error("Error fetching tutorials:", error);
      toast.error("Gagal memuat daftar tutorial.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getMatkulList = async () => {
      try {
        setLoading(true);
        const response = await AuthService.getMatkul();
        setMataKuliahList(response);
      } catch (error) {
        console.error("Error fetching mata kuliah list:", error);
        toast.error("Gagal memuat daftar mata kuliah.");
      } finally {
        setLoading(false);
      }
    };
    fetchTutorials();
    getMatkulList();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-vertical:h-4 data-vertical:self-auto"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Build Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex justify-end px-20">
              <button
                className="bg-blue-700 hover:bg-blue-600 text-white transition-colors px-4 py-2 rounded-md"
                onClick={() => setOpen(true)}
              >
                Add Tutorial
              </button>
            </div>
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              {tutorials.map((t) => (
                <CardTutorial
                  key={t.id}
                  id={t.id}
                  judul={t.judul}
                  foto={t.foto}
                  kode_matkul={t.kode_matkul}
                  matkul={t.matkul}
                />
              ))}
              {/* <CardTutorial
              judul="Membuat Hello World"
              foto="https://avatar.vercel.sh/shadcn1"
              kode_matkul="IF3170"
              matkul="Pemograman Berbasis Web"
            />
            <CardTutorial
              judul="Membuat Component"
              foto="https://avatar.vercel.sh/shadcn2"
              kode_matkul="IF3170"
              matkul="Pemograman Berbasis Web"
            />
            <CardTutorial
              judul="Membuat Layout"
              foto="https://avatar.vercel.sh/shadcn3"
              kode_matkul="IF3170"
              matkul="Pemograman Berbasis Web"
            />
            <CardTutorial
              judul="Membuat Routing"
              foto="https://avatar.vercel.sh/shadcn4"
              kode_matkul="IF3170"
              matkul="Pemograman Berbasis Web"
            /> */}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
      <TutorialModal
        open={open}
        onOpenChange={setOpen}
        onSuccess={handleSuccess}
        mataKuliahList={mataKuliahList || []}
      />
    </>
  );
}
