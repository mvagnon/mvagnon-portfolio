"use client";

/* eslint-disable react-hooks/immutability, react-hooks/refs -- Three.js scene objects are mutated through the R3F frame loop. */

import Image from "next/image";
import type React from "react";
import { useRef, useMemo, useCallback, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

import { FullscreenImageGallery } from "@/components/ui/fullscreen-image-gallery";
import {
  clearGalleryHoverState,
  updateGalleryHoverState,
} from "@/components/ui/gallery-hover-state";
import { getStaggeredIntroOpacity } from "@/components/ui/gallery-intro-opacity";
import { ViewHoverCursor } from "@/components/ui/view-hover-cursor";
import { cn } from "@/lib/utils";

export type ImageItem = string | { src: string; alt?: string };

interface FadeSettings {
  fadeIn: {
    start: number;
    end: number;
  };
  fadeOut: {
    start: number;
    end: number;
  };
}

interface BlurSettings {
  blurIn: {
    start: number;
    end: number;
  };
  blurOut: {
    start: number;
    end: number;
  };
  maxBlur: number;
}

export interface InfiniteGalleryProps {
  images: ImageItem[];
  speed?: number;
  zSpacing?: number;
  visibleCount?: number;
  falloff?: { near: number; far: number };
  fadeSettings?: FadeSettings;
  blurSettings?: BlurSettings;
  className?: string;
  style?: React.CSSProperties;
}

interface PlaneData {
  index: number;
  z: number;
  imageIndex: number;
  x: number;
  y: number;
}

type NormalizedImageItem = {
  src: string;
  alt: string;
};

type TextureImage = {
  width: number;
  height: number;
};

const DEFAULT_DEPTH_RANGE = 50;
const MAX_HORIZONTAL_OFFSET = 8;
const MAX_VERTICAL_OFFSET = 8;
const INTRO_FADE_DURATION = 0.6;
const INTRO_STAGGER_DELAY = 0.12;

function getTextureAspect(texture: THREE.Texture) {
  const image = texture.image;

  if (isTextureImage(image) && image.height > 0) {
    return image.width / image.height;
  }

  return 1;
}

function isTextureImage(image: unknown): image is TextureImage {
  return (
    typeof image === "object" &&
    image !== null &&
    "width" in image &&
    "height" in image &&
    typeof image.width === "number" &&
    typeof image.height === "number"
  );
}

const createClothMaterial = () => {
  return new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      map: { value: null },
      opacity: { value: 0.0 },
      blurAmount: { value: 0.0 },
      scrollForce: { value: 0.0 },
      cornerRadius: { value: 0.025 },
    },
    vertexShader: `
      uniform float scrollForce;
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        vUv = uv;
        vNormal = normal;

        vec3 pos = position;

        // Create smooth curving based on scroll force
        float curveIntensity = scrollForce * 0.3;

        // Base curve across the plane based on distance from center
        float distanceFromCenter = length(pos.xy);
        float curve = distanceFromCenter * distanceFromCenter * curveIntensity;

        // Add gentle cloth-like ripples
        float ripple1 = sin(pos.x * 2.0 + scrollForce * 3.0) * 0.02;
        float ripple2 = sin(pos.y * 2.5 + scrollForce * 2.0) * 0.015;
        float clothEffect = (ripple1 + ripple2) * abs(curveIntensity) * 2.0;

        // Apply Z displacement for curving effect (inverted) with cloth ripples
        pos.z -= (curve + clothEffect);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      uniform float opacity;
      uniform float blurAmount;
      uniform float scrollForce;
      uniform float cornerRadius;
      varying vec2 vUv;
      varying vec3 vNormal;

      float roundedRectAlpha(vec2 uv, float radius) {
        vec2 distanceFromCenter = abs(uv - 0.5);
        vec2 cornerDistance = distanceFromCenter - vec2(0.5 - radius);
        float outsideDistance = length(max(cornerDistance, 0.0)) - radius;

        return 1.0 - smoothstep(0.0, 0.006, outsideDistance);
      }

      void main() {
        vec4 color = texture2D(map, vUv);

        // Simple blur approximation
        if (blurAmount > 0.0) {
          vec2 texelSize = 1.0 / vec2(textureSize(map, 0));
          vec4 blurred = vec4(0.0);
          float total = 0.0;

          for (float x = -2.0; x <= 2.0; x += 1.0) {
            for (float y = -2.0; y <= 2.0; y += 1.0) {
              vec2 offset = vec2(x, y) * texelSize * blurAmount;
              float weight = 1.0 / (1.0 + length(vec2(x, y)));
              blurred += texture2D(map, vUv + offset) * weight;
              total += weight;
            }
          }
          color = blurred / total;
        }

        // Add subtle lighting effect based on curving
        float curveHighlight = abs(scrollForce) * 0.05;
        color.rgb += vec3(curveHighlight * 0.1);

        float cornerAlpha = roundedRectAlpha(vUv, cornerRadius);
        float alpha = color.a * opacity * cornerAlpha;

        if (alpha < 0.01) {
          discard;
        }

        gl_FragColor = vec4(color.rgb, alpha);
      }
    `,
  });
};

function ImagePlane({
  texture,
  position,
  scale,
  material,
  isHoverEnabled,
  onHoverChange,
  onSelect,
}: {
  texture: THREE.Texture;
  position: [number, number, number];
  scale: [number, number, number];
  material: THREE.ShaderMaterial;
  isHoverEnabled: boolean;
  onHoverChange: (isHovered: boolean) => void;
  onSelect: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (material && texture) {
      material.uniforms.map.value = texture;
    }
  }, [material, texture]);

  useFrame(() => {
    const mesh = meshRef.current;

    if (!mesh) {
      return;
    }

    if (!isHoverEnabled) {
      onHoverChange(false);
    }

    mesh.scale.x = THREE.MathUtils.lerp(mesh.scale.x, scale[0], 0.18);
    mesh.scale.y = THREE.MathUtils.lerp(mesh.scale.y, scale[1], 0.18);
    mesh.scale.z = THREE.MathUtils.lerp(mesh.scale.z, scale[2], 0.18);
  });

  const handlePointerEnter = useCallback(() => {
    if (!isHoverEnabled) {
      return;
    }

    onHoverChange(true);
  }, [isHoverEnabled, onHoverChange]);

  const handlePointerLeave = useCallback(() => {
    onHoverChange(false);
  }, [onHoverChange]);

  const handleClick = useCallback(() => {
    if (!isHoverEnabled) {
      return;
    }

    onHoverChange(false);
    onSelect();
  }, [isHoverEnabled, onHoverChange, onSelect]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={scale}
      material={material}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <planeGeometry args={[1, 1, 32, 32]} />
    </mesh>
  );
}

function normalizeImages(images: ImageItem[]): NormalizedImageItem[] {
  return images.map((img) =>
    typeof img === "string"
      ? { src: img, alt: "" }
      : { src: img.src, alt: img.alt ?? "" },
  );
}

function GalleryScene({
  images,
  speed = 1,
  zSpacing,
  visibleCount = 8,
  fadeSettings = {
    fadeIn: { start: 0.05, end: 0.15 },
    fadeOut: { start: 0.85, end: 0.95 },
  },
  blurSettings = {
    blurIn: { start: 0.0, end: 0.1 },
    blurOut: { start: 0.9, end: 1.0 },
    maxBlur: 3.0,
  },
  onImageHoverChange,
  onImageSelect,
}: Omit<InfiniteGalleryProps, "className" | "style"> & {
  onImageSelect: (imageIndex: number) => void;
  onImageHoverChange: (planeIndex: number, isHovered: boolean) => void;
}) {
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const introElapsed = useRef(0);
  const lastInteraction = useRef(0);

  const normalizedImages = useMemo(() => normalizeImages(images), [images]);
  const textures = useTexture(normalizedImages.map((img) => img.src));

  // Create materials pool
  const materials = useMemo(
    () => Array.from({ length: visibleCount }, () => createClothMaterial()),
    [visibleCount],
  );

  const spatialPositions = useMemo(() => {
    const positions: { x: number; y: number }[] = [];
    const maxHorizontalOffset = MAX_HORIZONTAL_OFFSET;
    const maxVerticalOffset = MAX_VERTICAL_OFFSET;

    for (let i = 0; i < visibleCount; i++) {
      // Create varied distribution patterns for both axes
      const horizontalAngle = (i * 2.618) % (Math.PI * 2); // Golden angle for natural distribution
      const verticalAngle = (i * 1.618 + Math.PI / 3) % (Math.PI * 2); // Offset angle for vertical

      const horizontalRadius = (i % 3) * 1.2; // Vary the distance from center
      const verticalRadius = ((i + 1) % 4) * 0.8; // Different pattern for vertical

      const x =
        (Math.sin(horizontalAngle) * horizontalRadius * maxHorizontalOffset) /
        3;
      const y =
        (Math.cos(verticalAngle) * verticalRadius * maxVerticalOffset) / 4;

      positions.push({ x, y });
    }

    return positions;
  }, [visibleCount]);

  const totalImages = normalizedImages.length;
  const depthRange = zSpacing
    ? Math.max(zSpacing * visibleCount, 1)
    : DEFAULT_DEPTH_RANGE;

  // Initialize plane data
  const planesData = useRef<PlaneData[]>(
    Array.from({ length: visibleCount }, (_, i) => ({
      index: i,
      z: visibleCount > 0 ? ((depthRange / visibleCount) * i) % depthRange : 0,
      imageIndex: totalImages > 0 ? i % totalImages : 0,
      x: spatialPositions[i]?.x ?? 0, // Use spatial positions for x
      y: spatialPositions[i]?.y ?? 0, // Use spatial positions for y
    })),
  );

  useEffect(() => {
    planesData.current = Array.from({ length: visibleCount }, (_, i) => ({
      index: i,
      z:
        visibleCount > 0
          ? ((depthRange / Math.max(visibleCount, 1)) * i) % depthRange
          : 0,
      imageIndex: totalImages > 0 ? i % totalImages : 0,
      x: spatialPositions[i]?.x ?? 0,
      y: spatialPositions[i]?.y ?? 0,
    }));
  }, [depthRange, spatialPositions, totalImages, visibleCount]);

  // Handle scroll input
  const handleWheel = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();
      setScrollVelocity((prev) => prev + event.deltaY * 0.01 * speed);
      setAutoPlay(false);
      lastInteraction.current = Date.now();
    },
    [speed],
  );

  // Handle keyboard input
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        setScrollVelocity((prev) => prev - 2 * speed);
        setAutoPlay(false);
        lastInteraction.current = Date.now();
      } else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        setScrollVelocity((prev) => prev + 2 * speed);
        setAutoPlay(false);
        lastInteraction.current = Date.now();
      }
    },
    [speed],
  );

  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.addEventListener("wheel", handleWheel, { passive: false });
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        canvas.removeEventListener("wheel", handleWheel);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [handleWheel, handleKeyDown]);

  // Auto-play logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastInteraction.current > 3000) {
        setAutoPlay(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useFrame((_, delta) => {
    introElapsed.current += Math.max(delta, 0);

    // Apply auto-play
    if (autoPlay) {
      setScrollVelocity((prev) => prev + 0.3 * delta);
    }

    // Damping
    setScrollVelocity((prev) => prev * 0.95);

    // Update scroll force uniform for all materials
    materials.forEach((material) => {
      if (material && material.uniforms) {
        material.uniforms.scrollForce.value = scrollVelocity;
      }
    });

    // Update plane positions
    const imageAdvance =
      totalImages > 0 ? visibleCount % totalImages || totalImages : 0;
    const totalRange = depthRange;

    planesData.current.forEach((plane, i) => {
      let newZ = plane.z + scrollVelocity * delta * 10;
      let wrapsForward = 0;
      let wrapsBackward = 0;

      if (newZ >= totalRange) {
        wrapsForward = Math.floor(newZ / totalRange);
        newZ -= totalRange * wrapsForward;
      } else if (newZ < 0) {
        wrapsBackward = Math.ceil(-newZ / totalRange);
        newZ += totalRange * wrapsBackward;
      }

      if (wrapsForward > 0 && imageAdvance > 0 && totalImages > 0) {
        plane.imageIndex =
          (plane.imageIndex + wrapsForward * imageAdvance) % totalImages;
      }

      if (wrapsBackward > 0 && imageAdvance > 0 && totalImages > 0) {
        const step = plane.imageIndex - wrapsBackward * imageAdvance;
        plane.imageIndex = ((step % totalImages) + totalImages) % totalImages;
      }

      plane.z = ((newZ % totalRange) + totalRange) % totalRange;
      plane.x = spatialPositions[i]?.x ?? 0;
      plane.y = spatialPositions[i]?.y ?? 0;

      // Calculate opacity based on fade settings
      const normalizedPosition = plane.z / totalRange; // 0 to 1
      let opacity = 1;

      if (
        normalizedPosition >= fadeSettings.fadeIn.start &&
        normalizedPosition <= fadeSettings.fadeIn.end
      ) {
        // Fade in: opacity goes from 0 to 1 within the fade in range
        const fadeInProgress =
          (normalizedPosition - fadeSettings.fadeIn.start) /
          (fadeSettings.fadeIn.end - fadeSettings.fadeIn.start);
        opacity = fadeInProgress;
      } else if (normalizedPosition < fadeSettings.fadeIn.start) {
        // Before fade in starts: fully transparent
        opacity = 0;
      } else if (
        normalizedPosition >= fadeSettings.fadeOut.start &&
        normalizedPosition <= fadeSettings.fadeOut.end
      ) {
        // Fade out: opacity goes from 1 to 0 within the fade out range
        const fadeOutProgress =
          (normalizedPosition - fadeSettings.fadeOut.start) /
          (fadeSettings.fadeOut.end - fadeSettings.fadeOut.start);
        opacity = 1 - fadeOutProgress;
      } else if (normalizedPosition > fadeSettings.fadeOut.end) {
        // After fade out ends: fully transparent
        opacity = 0;
      }

      // Clamp opacity between 0 and 1
      opacity = Math.max(0, Math.min(1, opacity));

      // Calculate blur based on blur settings
      let blur = 0;

      if (
        normalizedPosition >= blurSettings.blurIn.start &&
        normalizedPosition <= blurSettings.blurIn.end
      ) {
        // Blur in: blur goes from maxBlur to 0 within the blur in range
        const blurInProgress =
          (normalizedPosition - blurSettings.blurIn.start) /
          (blurSettings.blurIn.end - blurSettings.blurIn.start);
        blur = blurSettings.maxBlur * (1 - blurInProgress);
      } else if (normalizedPosition < blurSettings.blurIn.start) {
        // Before blur in starts: full blur
        blur = blurSettings.maxBlur;
      } else if (
        normalizedPosition >= blurSettings.blurOut.start &&
        normalizedPosition <= blurSettings.blurOut.end
      ) {
        // Blur out: blur goes from 0 to maxBlur within the blur out range
        const blurOutProgress =
          (normalizedPosition - blurSettings.blurOut.start) /
          (blurSettings.blurOut.end - blurSettings.blurOut.start);
        blur = blurSettings.maxBlur * blurOutProgress;
      } else if (normalizedPosition > blurSettings.blurOut.end) {
        // After blur out ends: full blur
        blur = blurSettings.maxBlur;
      }

      // Clamp blur to reasonable values
      blur = Math.max(0, Math.min(blurSettings.maxBlur, blur));

      // Update material uniforms
      const material = materials[i];
      if (material && material.uniforms) {
        const introOpacity = getStaggeredIntroOpacity(
          introElapsed.current,
          plane.index,
          INTRO_FADE_DURATION,
          INTRO_STAGGER_DELAY,
        );

        material.uniforms.opacity.value = opacity * introOpacity;
        material.uniforms.blurAmount.value = blur;
      }
    });
  });

  if (normalizedImages.length === 0) return null;

  return (
    <>
      {planesData.current.map((plane, i) => {
        const texture = textures[plane.imageIndex];
        const material = materials[i];

        if (!texture || !material) return null;

        const worldZ = plane.z - depthRange / 2;
        const normalizedPosition = plane.z / depthRange;
        const isHoverEnabled = normalizedPosition < fadeSettings.fadeOut.start;

        // Calculate scale to maintain aspect ratio
        const aspect = getTextureAspect(texture);
        const scale: [number, number, number] =
          aspect > 1 ? [2 * aspect, 2, 1] : [2, 2 / aspect, 1];

        return (
          <ImagePlane
            key={plane.index}
            texture={texture}
            position={[plane.x, plane.y, worldZ]} // Position planes relative to camera center
            scale={scale}
            material={material}
            isHoverEnabled={isHoverEnabled}
            onHoverChange={(isHovered) =>
              onImageHoverChange(plane.index, isHovered)
            }
            onSelect={() => onImageSelect(plane.imageIndex)}
          />
        );
      })}
    </>
  );
}

// Fallback component for when WebGL is not available
function FallbackGallery({
  images,
  onImageHoverChange,
  onImageSelect,
}: {
  images: ImageItem[];
  onImageHoverChange: (planeIndex: number, isHovered: boolean) => void;
  onImageSelect: (imageIndex: number) => void;
}) {
  const normalizedImages = useMemo(() => normalizeImages(images), [images]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-4">
      <p className="text-gray-600 mb-4">
        WebGL not supported. Showing image list:
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {normalizedImages.map((img, i) => (
          <button
            key={`${img.src}-${i}`}
            type="button"
            aria-label={`Ouvrir l'image ${i + 1} en plein ecran`}
            onMouseEnter={() => onImageHoverChange(i, true)}
            onMouseLeave={() => onImageHoverChange(i, false)}
            onClick={() => onImageSelect(i)}
            className="relative h-32 w-full overflow-hidden rounded-sm"
          >
            <Image
              src={img.src}
              alt={img.alt ?? ""}
              fill
              sizes="(min-width: 768px) 33vw, 50vw"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function InfiniteGallery({
  images,
  speed,
  zSpacing,
  visibleCount,
  className = "h-96 w-full",
  style,
  fadeSettings = {
    fadeIn: { start: 0.05, end: 0.25 },
    fadeOut: { start: 0.4, end: 0.43 },
  },
  blurSettings = {
    blurIn: { start: 0.0, end: 0.1 },
    blurOut: { start: 0.4, end: 0.43 },
    maxBlur: 8.0,
  },
}: InfiniteGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const [isImageHovered, setIsImageHovered] = useState(false);
  const hoveredPlaneIndexes = useRef(new Set<number>());
  const [webglSupported] = useState(() => {
    if (typeof document === "undefined") {
      return true;
    }

    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      return Boolean(gl);
    } catch {
      return false;
    }
  });
  const normalizedImages = useMemo(() => normalizeImages(images), [images]);
  const clearImageHover = useCallback(() => {
    clearGalleryHoverState(hoveredPlaneIndexes.current);
    setIsImageHovered(false);
  }, []);
  const closeFullscreenGallery = useCallback(() => {
    setSelectedImageIndex(null);
  }, []);
  const handleImageHoverChange = useCallback(
    (planeIndex: number, isHovered: boolean) => {
      const nextHoverState = updateGalleryHoverState(
        hoveredPlaneIndexes.current,
        planeIndex,
        isHovered,
      );

      if (nextHoverState.changed) {
        setIsImageHovered(nextHoverState.active);
      }
    },
    [],
  );
  const selectImage = useCallback(
    (imageIndex: number) => {
      clearImageHover();
      setSelectedImageIndex(imageIndex);
    },
    [clearImageHover],
  );
  const showViewCursor = isImageHovered && selectedImageIndex === null;

  if (!webglSupported) {
    return (
      <div
        className={cn(className, showViewCursor && "cursor-pointer")}
        style={style}
        onPointerLeave={clearImageHover}
      >
        <FallbackGallery
          images={images}
          onImageHoverChange={handleImageHoverChange}
          onImageSelect={selectImage}
        />
        <ViewHoverCursor active={showViewCursor} />
        <FullscreenImageGallery
          images={normalizedImages}
          open={selectedImageIndex !== null}
          selectedIndex={selectedImageIndex ?? 0}
          onClose={closeFullscreenGallery}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(className, showViewCursor && "cursor-pointer")}
      style={style}
      onPointerLeave={clearImageHover}
    >
      <Canvas
        camera={{ position: [0, 0, 0], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
      >
        <GalleryScene
          images={images}
          speed={speed}
          zSpacing={zSpacing}
          visibleCount={visibleCount}
          fadeSettings={fadeSettings}
          blurSettings={blurSettings}
          onImageHoverChange={handleImageHoverChange}
          onImageSelect={selectImage}
        />
      </Canvas>
      <ViewHoverCursor active={showViewCursor} />
      <FullscreenImageGallery
        images={normalizedImages}
        open={selectedImageIndex !== null}
        selectedIndex={selectedImageIndex ?? 0}
        onClose={closeFullscreenGallery}
      />
    </div>
  );
}
