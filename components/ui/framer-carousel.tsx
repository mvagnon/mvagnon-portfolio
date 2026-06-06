"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState, type TransitionEvent } from "react";

import { FadeInImage } from "@/components/ui/fade-in-image";
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

function normalizeIndex(index: number, imageCount: number) {
  if (imageCount <= 0) {
    return 0;
  }

  return ((index % imageCount) + imageCount) % imageCount;
}

function getTrackIndex(activeIndex: number, imageCount: number) {
  return imageCount > 1 ? activeIndex + 1 : activeIndex;
}

export function FramerCarousel({
  images,
  initialIndex = 0,
  className,
  viewportClassName,
}: FramerCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(() =>
    normalizeIndex(initialIndex, images.length),
  );
  const [trackIndex, setTrackIndex] = useState(() =>
    getTrackIndex(normalizeIndex(initialIndex, images.length), images.length),
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  const imageCount = images.length;
  const canLoop = imageCount > 1;
  const carouselImages = canLoop
    ? [images[imageCount - 1], ...images, images[0]]
    : images;

  const goToIndex = useCallback(
    (nextIndex: number) => {
      if (isTransitioning) {
        return;
      }

      const nextActiveIndex = normalizeIndex(nextIndex, imageCount);

      if (nextActiveIndex === activeIndex) {
        return;
      }

      setActiveIndex(nextActiveIndex);
      setIsTransitioning(canLoop);
      setTrackIndex(getTrackIndex(nextActiveIndex, imageCount));
    },
    [activeIndex, canLoop, imageCount, isTransitioning],
  );

  const goToPrevious = useCallback(() => {
    if (!canLoop || isTransitioning) {
      return;
    }

    setActiveIndex(normalizeIndex(activeIndex - 1, imageCount));
    setIsTransitioning(true);
    setTrackIndex(activeIndex === 0 ? 0 : activeIndex);
  }, [activeIndex, canLoop, imageCount, isTransitioning]);

  const goToNext = useCallback(() => {
    if (!canLoop || isTransitioning) {
      return;
    }

    setActiveIndex(normalizeIndex(activeIndex + 1, imageCount));
    setIsTransitioning(true);
    setTrackIndex(
      activeIndex === imageCount - 1 ? imageCount + 1 : activeIndex + 2,
    );
  }, [activeIndex, canLoop, imageCount, isTransitioning]);

  const handleTrackTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLDivElement>) => {
      if (
        event.target !== event.currentTarget ||
        event.propertyName !== "transform"
      ) {
        return;
      }

      setIsTransitioning(false);

      if (trackIndex === 0) {
        setTrackIndex(imageCount);
      }

      if (trackIndex === imageCount + 1) {
        setTrackIndex(1);
      }
    },
    [imageCount, trackIndex],
  );

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
      >
        <div
          className={cn(
            "flex h-full",
            isTransitioning &&
              "transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]",
          )}
          onTransitionEnd={handleTrackTransitionEnd}
          style={{ transform: `translate3d(${-trackIndex * 100}%, 0, 0)` }}
        >
          {carouselImages.map((image, imageIndex) => {
            const realImageIndex = canLoop
              ? normalizeIndex(imageIndex - 1, imageCount)
              : imageIndex;

            return (
              <div
                key={`${image.src}-${imageIndex}`}
                className="relative h-full w-full shrink-0"
              >
                <FadeInImage
                  src={image.src}
                  alt={image.alt ?? ""}
                  fill
                  quality={100}
                  priority={realImageIndex === activeIndex}
                  sizes="100vw"
                  className="select-none object-contain"
                  draggable={false}
                />
              </div>
            );
          })}
        </div>

        <IconButton
          aria-label="Image precedente"
          disabled={!canLoop}
          onClick={goToPrevious}
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 sm:left-6"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </IconButton>

        <IconButton
          aria-label="Image suivante"
          disabled={!canLoop}
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
              onClick={() => goToIndex(imageIndex)}
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
