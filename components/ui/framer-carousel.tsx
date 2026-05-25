"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { animate, motion, useMotionValue } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";

export type FramerCarouselImage = {
  src: string;
  alt?: string;
};

type FramerCarouselProps = {
  images: FramerCarouselImage[];
  initialIndex?: number;
  className?: string;
  viewportClassName?: string;
};

function clampIndex(index: number, imageCount: number) {
  if (imageCount <= 0) {
    return 0;
  }

  return Math.min(Math.max(index, 0), imageCount - 1);
}

export function FramerCarousel({
  images,
  initialIndex = 0,
  className,
  viewportClassName,
}: FramerCarouselProps) {
  const [index, setIndex] = useState(() =>
    clampIndex(initialIndex, images.length),
  );
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const activeIndex = clampIndex(index, images.length);
  const canGoPrevious = activeIndex > 0;
  const canGoNext = activeIndex < images.length - 1;

  const goToPrevious = useCallback(() => {
    setIndex((currentIndex) =>
      clampIndex(clampIndex(currentIndex, images.length) - 1, images.length),
    );
  }, [images.length]);

  const goToNext = useCallback(() => {
    setIndex((currentIndex) =>
      clampIndex(clampIndex(currentIndex, images.length) + 1, images.length),
    );
  }, [images.length]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const updateContainerWidth = () => {
      setContainerWidth(container.offsetWidth);
    };

    updateContainerWidth();

    const resizeObserver = new ResizeObserver(updateContainerWidth);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const controls = animate(x, -activeIndex * containerWidth, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });

    return () => controls.stop();
  }, [activeIndex, containerWidth, x]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        event.stopPropagation();
        goToPrevious();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        event.stopPropagation();
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);

    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [goToNext, goToPrevious]);

  if (images.length === 0) {
    return null;
  }

  return (
    <div className={cn("relative flex h-full w-full flex-col", className)}>
      <div
        className={cn(
          "relative h-full min-h-0 overflow-hidden",
          viewportClassName,
        )}
        ref={containerRef}
      >
        <motion.div className="flex h-full" style={{ x }}>
          {images.map((image, imageIndex) => (
            <div
              key={`${image.src}-${imageIndex}`}
              className="relative h-full w-full shrink-0"
            >
              <Image
                src={image.src}
                alt={image.alt ?? ""}
                fill
                priority={imageIndex === activeIndex}
                sizes="100vw"
                className="select-none object-contain"
                draggable={false}
              />
            </div>
          ))}
        </motion.div>

        <IconButton
          aria-label="Image precedente"
          disabled={!canGoPrevious}
          onClick={goToPrevious}
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 sm:left-6"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </IconButton>

        <IconButton
          aria-label="Image suivante"
          disabled={!canGoNext}
          onClick={goToNext}
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 sm:right-6"
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </IconButton>

        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full border border-white/15 bg-black/35 p-2 backdrop-blur">
          {images.map((image, imageIndex) => (
            <button
              key={`${image.src}-indicator-${imageIndex}`}
              type="button"
              aria-label={`Afficher l'image ${imageIndex + 1}`}
              aria-current={imageIndex === activeIndex}
              onClick={() => setIndex(imageIndex)}
              className={cn(
                "h-2 cursor-pointer rounded-full bg-white/45 transition-all",
                imageIndex === activeIndex ? "w-8 bg-white" : "w-2",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
