"use client";

import { TutorialPresentation } from "@/components/tutorial-presentation";
import { tutorialService } from "@/service/tutorial-service";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";

// Polling interval 5 detik, debounce 300ms
const POLL_INTERVAL = 5000;
const DEBOUNCE_DELAY = 300;

export default function TutorialPage() {
  const [loading, setLoading] = useState(false);
  const [tutorial, setTutorial] = useState();
  const [details, setDetails] = useState([]);
  const { id } = useParams();

  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  const fetchTutorial = useCallback(async (id: string, isInitial = false) => {
    // Kalau initial fetch, set loading true dulu
    if (isInitial) setLoading(true);
    try {
      const data = await tutorialService.getTutorialByPresentation(id);
      if (!isMountedRef.current) return;
      if (data) {
        setTutorial(data);
        setDetails(data.detail_tutorial || []);
      } else if (isInitial) {
        console.error("Tutorial not found");
      }
    } catch (error) {
      if (isMountedRef.current)
        console.error("Error fetching tutorial:", error);
    } finally {
      if (isInitial && isMountedRef.current) setLoading(false);
    }
  }, []);

  // debounce wrapper — menunda fetch saat `id` berubah cepat
  const debouncedFetch = useCallback(
    (id: string, isInitial = false) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        fetchTutorial(id, isInitial);
      }, DEBOUNCE_DELAY);
    },
    [fetchTutorial],
  );

  useEffect(() => {
    if (!id) return;
    isMountedRef.current = true;

    // initial fetch dengan debounce
    debouncedFetch(id as string, true);

    // mulai polling realtime
    pollingRef.current = setInterval(() => {
      fetchTutorial(id as string, false);
    }, POLL_INTERVAL);

    return () => {
      isMountedRef.current = false;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [id, debouncedFetch, fetchTutorial]);

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

  return <TutorialPresentation tutorial={tutorial} details={details} />;
}
