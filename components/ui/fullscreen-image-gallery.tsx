"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Variants } from "motion/react";
import { useEffect, useRef } from "react";

import {
  FramerCarousel,
  type FramerCarouselImage,
} from "@/components/ui/framer-carousel";
import { IconButton } from "@/components/ui/icon-button";

type FullscreenImageGalleryProps = {
  images: FramerCarouselImage[];
  open: boolean;
  selectedIndex: number;
  onClose: () => void;
};

const overlayVariants: Variants = {
  closed: {
    opacity: 0,
    transition: { duration: 0.2, ease: [0.32, 0, 0.67, 0] as const },
  },
  enter: {
    opacity: 1,
    transition: { duration: 0.24, ease: [0.76, 0, 0.24, 1] as const },
  },
};

const carouselVariants: Variants = {
  closed: {
    opacity: 0,
    scale: 0.97,
    y: 16,
    transition: { duration: 0.18, ease: [0.32, 0, 0.67, 0] as const },
  },
  enter: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.76, 0, 0.24, 1] as const },
  },
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

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="fullscreen-image-gallery"
          role="dialog"
          aria-modal="true"
          aria-label="Galerie plein ecran"
          animate="enter"
          className="fixed inset-0 z-50 bg-zinc-950/95 text-white backdrop-blur-sm"
          exit="closed"
          initial="closed"
          variants={overlayVariants}
        >
          <IconButton
            ref={closeButtonRef}
            aria-label="Fermer la galerie"
            onClick={onClose}
            className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6"
          >
            <X className="size-5" aria-hidden="true" />
          </IconButton>

          <motion.div
            animate="enter"
            className="h-full"
            exit="closed"
            initial="closed"
            variants={carouselVariants}
          >
            <FramerCarousel
              images={images}
              initialIndex={selectedIndex}
              className="mx-auto h-full max-w-7xl px-4 py-16 sm:px-8 sm:py-20"
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
