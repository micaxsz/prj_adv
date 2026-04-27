import { status, tipe } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export const tutorialService = {
  getTutorials: async () => {
    try {
      const data = await fetch("/api/tutorial").then((res) => res.json());
      return data;
    } catch (error) {
      console.error("Error fetching tutorials:", error);
      return [];
    }
  },

  getTutorialById: async (id: number) => {
    try {
      const data = await fetch(`/api/tutorial/${id}`).then((res) => res.json());
      return data;
    } catch (error) {
      console.error("Error fetching tutorial by ID:", error);
      return null;
    }
  },

  getTutorialByPresentation: async (slug: string) => {
    try {
      const data = await fetch(`/api/presentation/${slug}`).then((res) =>
        res.json(),
      );
      return data;
    } catch (error) {
      console.error("Error fetching tutorial by Slug:", error);
      return null;
    }
  },

  getTutorialByFinished: async (slug: string) => {
    try {
      const data = await fetch(`/api/finished/${slug}`).then((res) =>
        res.json(),
      );
      return data;
    } catch (error) {
      console.error("Error fetching tutorial by Slug:", error);
      return null;
    }
  },

  addTutorial: async (payload: {
    judul: string;
    foto: string;
    kode_matkul: string;
    matkul: string;
    creator_email: string;
  }) => {
    try {
      const response = await fetch("/api/tutorial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding tutorial:", error);
      throw error;
    }
  },

  addDetailTutorial: async (payload: {
    tutorialId: number;
    isi: string;
    tipe: tipe;
    status: status;
    order: number;
  }) => {
    try {
      const response = await fetch("/api/detail-tutorial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding tutorial:", error);
      throw error;
    }
  },

  updateDetailTutorial: async (
    id: string,
    payload: {
      tutorialId?: number;
      isi?: string;
      tipe?: tipe;
      status?: string;
      order?: number;
    },
  ) => {
    try {
      const response = await fetch(`/api/detail-tutorial/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding tutorial:", error);
      throw error;
    }
  },

  deleteDetailTutorial: async (id: string) => {
    try {
      const response = await fetch(`/api/detail-tutorial/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding tutorial:", error);
      throw error;
    }
  },

  updateTutorial: async (
    id: number,
    payload: {
      judul?: string;
      foto?: string;
      kode_matkul?: string;
      matkul?: string;
      creator_email?: string;
    },
  ) => {
    try {
      const response = await fetch(`/api/tutorial/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating tutorial:", error);
      throw error;
    }
  },
};
