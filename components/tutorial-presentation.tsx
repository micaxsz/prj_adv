// components/tutorial/tutorial-presentation.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Code2,
  Link2,
  Type,
  Image as ImageIcon,
  ExternalLink,
  Copy,
  Check,
  ChevronLeft,
  Clock,
  User,
  Hash,
  Layers,
  EyeOff,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { DetailTutorial, Tutorial } from "@/tipe/tutorial-tipe";

function tokenizeLine(line: string): React.ReactNode[] {
  const tokenRe =
    /(\/\/.*$)|(["'`])(?:(?!\2)[^\\]|\\.)*\2|(<\/?[A-Za-z][A-Za-z0-9.]*(?:\s[^>]*)?>)|\b(import|export|from|const|let|var|function|return|async|await|if|else|for|while|class|new|this|default|typeof|null|undefined|true|false|of|in)\b|\b(\d+\.?\d*)\b|([A-Za-z_$][A-Za-z0-9_$]*)\s*(?=\()/g;

  const colorMap: Record<string, string> = {
    comment: "#64748b",
    string: "#86efac",
    jsx: "#f472b6",
    keyword: "#818cf8",
    number: "#fb923c",
    function: "#38bdf8",
    plain: "#e2e8f0",
  };

  const segments: { text: string; type: string }[] = [];
  const re = new RegExp(tokenRe.source, "gm");
  let lastIndex = 0,
    match: RegExpExecArray | null;

  while ((match = re.exec(line)) !== null) {
    if (match.index > lastIndex)
      segments.push({
        text: line.slice(lastIndex, match.index),
        type: "plain",
      });
    if (match[1]) segments.push({ text: match[1], type: "comment" });
    else if (match[2]) segments.push({ text: match[0], type: "string" });
    else if (match[3]) segments.push({ text: match[3], type: "jsx" });
    else if (match[4]) segments.push({ text: match[4], type: "keyword" });
    else if (match[5]) segments.push({ text: match[5], type: "number" });
    else if (match[6])
      segments.push({ text: match[0].replace(/\s*\($/, ""), type: "function" });
    else segments.push({ text: match[0], type: "plain" });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < line.length)
    segments.push({ text: line.slice(lastIndex), type: "plain" });

  return segments.map((seg, i) => (
    <span key={i} style={{ color: colorMap[seg.type] }}>
      {seg.text}
    </span>
  ));
}

function TextBlock({ content }: { content: string }) {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className="text-slate-300 leading-relaxed text-[15px] font-light tracking-wide">
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </p>
  );
}

function ImageBlock({ content }: { content: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-700/40 bg-slate-800/40">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
          <ImageIcon size={24} className="text-slate-600" />
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={content}
        alt="Tutorial content"
        onLoad={() => setLoaded(true)}
        className={cn(
          "w-full object-cover transition-all duration-500",
          loaded ? "opacity-100" : "opacity-0 h-40",
        )}
      />
    </div>
  );
}

function CodeBlock({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);
  const lines = content.split("\n");
  const lang =
    content.includes("import") || content.includes("function")
      ? "tsx"
      : content.includes("def ")
        ? "python"
        : content.includes("<")
          ? "html"
          : "code";

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/50 bg-[#0d1117]">
      {/* Titlebar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/60 border-b border-slate-700/40">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <Badge
            variant="outline"
            className="text-[10px] font-mono text-slate-500 border-slate-700 bg-transparent px-1.5 py-0 h-4"
          >
            {lang}
          </Badge>
        </div>
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-6 px-2 text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-700/50 gap-1.5"
              >
                {copied ? (
                  <>
                    <Check size={11} className="text-emerald-400" /> Tersalin!
                  </>
                ) : (
                  <>
                    <Copy size={11} /> Salin
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="text-xs">
              Salin kode
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Lines */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                <td className="select-none text-right pr-4 pl-4 py-0 text-xs text-slate-600 font-mono w-10 align-top leading-6 border-r border-slate-800">
                  {i + 1}
                </td>
                <td className="pl-4 pr-4 py-0 font-mono text-[13px] leading-6 whitespace-pre">
                  {tokenizeLine(line)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UrlBlock({ content }: { content: string }) {
  let domain = "",
    path = "";
  try {
    const u = new URL(content);
    domain = u.hostname;
    path = u.pathname + u.search;
  } catch {
    domain = content;
  }

  return (
    <a // Tag <a> pembuka untuk link URL
      href={content}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 p-3.5 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/60 hover:border-sky-500/30 transition-all duration-200"
    >
      <div className="w-8 h-8 rounded-lg bg-slate-700/60 border border-slate-600/40 flex items-center justify-center flex-shrink-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
          alt=""
          className="w-4 h-4 object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-300 group-hover:text-white transition-colors font-medium truncate">
          {domain}
        </p>
        <p className="text-xs text-slate-600 truncate font-mono">
          {path || "/"}
        </p>
      </div>
      <div className="flex-shrink-0 flex items-center gap-1 text-slate-600 group-hover:text-sky-400 transition-colors">
        <span className="text-xs hidden group-hover:inline">Buka</span>
        <ExternalLink size={13} />
      </div>
    </a>
  );
}

function ContentBlock({
  detail,
  index,
}: {
  detail: DetailTutorial;
  index: number;
}) {
  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {detail.tipe === "text" && <TextBlock content={detail.isi ?? ""} />}
      {detail.tipe === "gambar" && <ImageBlock content={detail.isi ?? ""} />}
      {detail.tipe === "code" && <CodeBlock content={detail.isi ?? ""} />}
      {detail.tipe === "url" && <UrlBlock content={detail.isi ?? ""} />}
    </div>
  );
}

interface TutorialPresentationProps {
  tutorial: Tutorial;
  details: DetailTutorial[];
  isFinished?: boolean;
}

export function TutorialPresentation({
  tutorial,
  details,
  isFinished = false,
}: TutorialPresentationProps) {
  const handleExport = () => {
    window.print();
  };
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  let visible;
  let hiddenCount;

  // Filter detail berdasarkan mode
  if (isFinished) {
    visible = details.sort((a, b) => a.order - b.order);
    hiddenCount = 0;
  } else {
    visible = details
      .filter((d) => d.status === "show")
      .sort((a, b) => a.order - b.order);
    hiddenCount = details.filter((d) => d.status === "hide").length;
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  if (!mounted) return null;

  return (
    <div
      className="min-h-screen bg-[#090d14] text-slate-100"
      style={{ fontFamily: "'Instrument Sans', sans-serif" }}
    >
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-sky-600/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -right-40 w-80 h-80 bg-violet-600/6 rounded-full blur-[80px]" />
      </div>

      {/* ── Navbar ── */}
      {isFinished ? (
        <nav className="sticky top-0 z-40 border-b border-slate-800/60 bg-[#090d14]/80 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto px-6 h-12 flex items-center justify-end">
            <div className="flex items-center gap-3">
              <Button
                onClick={handleExport}
                size="sm"
                asChild
                className="text-white-500 bg-blue-600 hover:text-slate-300 h-7 px-2 gap-1"
              >
                <p>Export</p>
              </Button>
              <Separator orientation="vertical" className="h-4 bg-slate-700" />
            </div>
          </div>
        </nav>
      ) : null}

      {/* ── Main ── */}
      <main className="max-w-3xl mx-auto px-6 pb-24">
        {/* ── Hero ── */}
        <div className="pt-12 pb-10 border-b border-slate-800/60">
          {/* Cover */}
          <div className="w-full h-40 rounded-2xl overflow-hidden mb-8 border border-slate-700/30 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Image
              src={tutorial.foto}
              alt={tutorial.judul}
              width={1200}
              height={400}
              className="w-full h-full object-cover"
              unoptimized
              priority
            />
          </div>

          {/* Chips */}
          <div className="flex flex-wrap items-center gap-2 mb-4 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-150 fill-mode-both">
            <Badge className="gap-1.5 text-[11px] font-mono bg-sky-500/10 border border-sky-500/20 text-sky-400 hover:bg-sky-500/15">
              <Hash size={10} /> {tutorial.kode_matkul}
            </Badge>
            <Badge
              variant="outline"
              className="gap-1.5 text-[11px] text-slate-400 border-slate-700 bg-slate-800/60"
            >
              <BookOpen size={10} /> {tutorial.matkul}
            </Badge>
            <Badge
              variant="outline"
              className="gap-1.5 text-[11px] text-slate-400 border-slate-700 bg-slate-800/60"
            >
              <Layers size={10} /> {visible.length} blok
            </Badge>
          </div>

          {/* Title */}
          <h1
            className="text-3xl font-medium text-white leading-tight mb-4 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-150 fill-mode-both"
            style={{ fontFamily: "'Lora', Georgia, serif" }}
          >
            {tutorial.judul}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-slate-500 animate-in fade-in duration-500 delay-300 fill-mode-both">
            <span className="flex items-center gap-1.5">
              <User size={13} /> {tutorial.creator_email}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} /> Diperbarui {formatDate(tutorial.updated_at)}
            </span>
          </div>
        </div>

        {/* ── Content Blocks ── */}
        <div className="pt-8 space-y-5">
          {visible.length === 0 ? (
            <div className="text-center py-24">
              <BookOpen size={40} className="text-slate-800 mx-auto mb-4" />
              <p className="text-slate-600">
                Tidak ada konten yang ditampilkan.
              </p>
            </div>
          ) : (
            visible.map((detail, idx) => {
              const prev = visible[idx - 1];
              const showSep =
                prev &&
                ((prev.tipe === "code" && detail.tipe !== "code") ||
                  (prev.tipe !== "url" && detail.tipe === "url") ||
                  (prev.tipe === "url" && detail.tipe !== "url"));
              return (
                <div key={detail.id}>
                  {showSep && <Separator className="my-2 bg-slate-800/80" />}
                  <ContentBlock detail={detail} index={idx} />
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
