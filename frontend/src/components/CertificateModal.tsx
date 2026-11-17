"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import type { Certification } from "@/data/skills";

const pill =
  "glass inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-[0.9rem] font-bold transition hover:text-mint";

export default function CertificateModal({
  cert,
  onClose,
}: {
  cert: Certification | null;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!cert) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [cert, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {cert && (
        <motion.div
          key="cert-backdrop"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={cert.title}
            className="flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0a1024]/95 shadow-2xl"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4">
              <div className="min-w-0">
                <h3 className="text-[1.1rem] font-extrabold leading-tight">{cert.title}</h3>
                <p className="mt-0.5 text-[0.9rem] opacity-80">
                  <span className="font-bold text-mint">{cert.issuer}</span> &middot; {cert.date}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a href={cert.file} target="_blank" rel="noopener" className={pill}>Open in new tab</a>
                <a href={cert.file} download className={pill}>Download</a>
                <button type="button" onClick={onClose} aria-label="Close" autoFocus className={pill}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-auto bg-black/30 p-2 sm:p-3">
              {cert.kind === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cert.file} alt={cert.title} className="mx-auto h-auto max-h-[75vh] w-auto max-w-full rounded-lg object-contain" />
              ) : (
                <iframe src={cert.file + "#view=FitH"} title={cert.title} className="h-[75vh] w-full rounded-lg bg-white" />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}