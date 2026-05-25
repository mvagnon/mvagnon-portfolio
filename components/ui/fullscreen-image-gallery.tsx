"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";

import {
  FramerCarousel,
  type FramerCarouselImage,
} from "@/components/ui/framer-carousel";

type FullscreenImageGalleryProps = {
  images: FramerCarouselImage[];
  open: boolean;
  selectedIndex: number;
  onClose: () => void;
};

export function FullscreenImageGallery({
  images,
  open,
  selectedIndex,
  onClose,
}: FullscreenImageGalleryProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  useEffect(() => {
    if (open) {
      closeButtonRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Galerie plein ecran"
      className="fixed inset-0 z-50 bg-zinc-950/95 text-white backdrop-blur-sm"
    >
      <button
        ref={closeButtonRef}
        type="button"
        aria-label="Fermer la galerie"
        onClick={onClose}
        className="absolute right-4 top-4 z-20 flex size-10 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur transition hover:bg-white hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:right-6 sm:top-6"
      >
        <X className="size-5" aria-hidden="true" />
      </button>

      <FramerCarousel
        images={images}
        initialIndex={selectedIndex}
        className="mx-auto h-full max-w-7xl px-4 py-16 sm:px-8 sm:py-20"
      />
    </div>
  );
}
