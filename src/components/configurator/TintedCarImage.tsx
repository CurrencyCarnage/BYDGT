"use client";

import { useEffect, useRef } from "react";

interface TintedCarImageProps {
  src: string;
  color: string;
  alt: string;
}

type PreviewCacheEntry = {
  width: number;
  height: number;
  source: Uint8ClampedArray;
  mask: Uint8ClampedArray;
};

const previewCache = new Map<string, PreviewCacheEntry>();

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function mix(a: number, b: number, weight: number) {
  return a + (b - a) * weight;
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function createBlurredMask(
  binaryMask: Uint8ClampedArray,
  width: number,
  height: number,
  blurRadius: number
) {
  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = width;
  maskCanvas.height = height;

  const maskContext = maskCanvas.getContext("2d");
  if (!maskContext) {
    return binaryMask;
  }

  const maskImage = maskContext.createImageData(width, height);

  for (let index = 0; index < binaryMask.length; index += 1) {
    const offset = index * 4;
    const value = binaryMask[index];

    maskImage.data[offset] = value;
    maskImage.data[offset + 1] = value;
    maskImage.data[offset + 2] = value;
    maskImage.data[offset + 3] = 255;
  }

  maskContext.putImageData(maskImage, 0, 0);

  const blurredCanvas = document.createElement("canvas");
  blurredCanvas.width = width;
  blurredCanvas.height = height;

  const blurredContext = blurredCanvas.getContext("2d");
  if (!blurredContext) {
    return binaryMask;
  }

  blurredContext.filter = `blur(${blurRadius}px)`;
  blurredContext.drawImage(maskCanvas, 0, 0);

  const blurredMask = blurredContext.getImageData(0, 0, width, height).data;
  const result = new Uint8ClampedArray(width * height);

  for (let index = 0; index < result.length; index += 1) {
    result[index] = blurredMask[index * 4];
  }

  return result;
}

function buildPreviewCacheEntry(image: HTMLImageElement) {
  const width = image.naturalWidth;
  const height = image.naturalHeight;

  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = width;
  sourceCanvas.height = height;

  const sourceContext = sourceCanvas.getContext("2d", {
    willReadFrequently: true,
  });

  if (!sourceContext) {
    throw new Error("Could not prepare source canvas");
  }

  sourceContext.drawImage(image, 0, 0, width, height);
  const sourceImageData = sourceContext.getImageData(0, 0, width, height);
  const source = new Uint8ClampedArray(sourceImageData.data);
  const candidateMask = new Uint8Array(width * height);

  for (let pixelIndex = 0; pixelIndex < width * height; pixelIndex += 1) {
    const offset = pixelIndex * 4;
    const r = source[offset];
    const g = source[offset + 1];
    const b = source[offset + 2];
    const a = source[offset + 3];

    if (a < 235) {
      continue;
    }

    const maxChannel = Math.max(r, g, b);
    const minChannel = Math.min(r, g, b);
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const saturation = maxChannel === 0 ? 0 : (maxChannel - minChannel) / maxChannel;
    const channelSpread = Math.max(
      Math.abs(r - g),
      Math.abs(g - b),
      Math.abs(r - b)
    );

    if (luminance > 125 && saturation < 0.18 && channelSpread < 26) {
      candidateMask[pixelIndex] = 255;
    }
  }

  const componentMask = new Uint8ClampedArray(width * height);
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  const minComponentSize = Math.max(1200, Math.floor(width * height * 0.004));

  for (let pixelIndex = 0; pixelIndex < candidateMask.length; pixelIndex += 1) {
    if (!candidateMask[pixelIndex] || visited[pixelIndex]) {
      continue;
    }

    let queueStart = 0;
    let queueEnd = 0;
    const component: number[] = [];

    queue[queueEnd] = pixelIndex;
    queueEnd += 1;
    visited[pixelIndex] = 1;

    while (queueStart < queueEnd) {
      const currentIndex = queue[queueStart];
      queueStart += 1;
      component.push(currentIndex);

      const x = currentIndex % width;
      const y = Math.floor(currentIndex / width);

      if (x > 0) {
        const left = currentIndex - 1;
        if (candidateMask[left] && !visited[left]) {
          visited[left] = 1;
          queue[queueEnd] = left;
          queueEnd += 1;
        }
      }

      if (x < width - 1) {
        const right = currentIndex + 1;
        if (candidateMask[right] && !visited[right]) {
          visited[right] = 1;
          queue[queueEnd] = right;
          queueEnd += 1;
        }
      }

      if (y > 0) {
        const top = currentIndex - width;
        if (candidateMask[top] && !visited[top]) {
          visited[top] = 1;
          queue[queueEnd] = top;
          queueEnd += 1;
        }
      }

      if (y < height - 1) {
        const bottom = currentIndex + width;
        if (candidateMask[bottom] && !visited[bottom]) {
          visited[bottom] = 1;
          queue[queueEnd] = bottom;
          queueEnd += 1;
        }
      }
    }

    if (component.length >= minComponentSize) {
      for (const index of component) {
        componentMask[index] = 255;
      }
    }
  }

  const blurRadius = Math.max(1.8, Math.min(3.2, width / 260));
  const mask = createBlurredMask(componentMask, width, height, blurRadius);

  return {
    width,
    height,
    source,
    mask,
  };
}

function applyTint(
  entry: PreviewCacheEntry,
  color: { r: number; g: number; b: number },
  context: CanvasRenderingContext2D
) {
  const output = new Uint8ClampedArray(entry.source);
  const { source, mask } = entry;
  const normalizedColor = {
    r: color.r / 255,
    g: color.g / 255,
    b: color.b / 255,
  };
  const neutralBias =
    (normalizedColor.r + normalizedColor.g + normalizedColor.b) / 3;
  const mutedColor = {
    r: mix(normalizedColor.r, neutralBias, 0.22),
    g: mix(normalizedColor.g, neutralBias, 0.22),
    b: mix(normalizedColor.b, neutralBias, 0.22),
  };

  for (let pixelIndex = 0; pixelIndex < mask.length; pixelIndex += 1) {
    const offset = pixelIndex * 4;
    const alpha = source[offset + 3];

    if (alpha === 0) {
      continue;
    }

    const intensity = mask[pixelIndex] / 255;
    if (intensity <= 0) {
      continue;
    }

    const r = source[offset];
    const g = source[offset + 1];
    const b = source[offset + 2];
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const shade = luminance / 255;
    const midtoneWeight = clamp01(1 - Math.abs(shade - 0.58) / 0.58);
    const highlightProtection = shade * shade;
    const blendAmount =
      intensity *
      (0.52 + 0.18 * midtoneWeight) *
      (1 - 0.16 * highlightProtection);
    const sourceChannels = {
      r: r / 255,
      g: g / 255,
      b: b / 255,
    };
    const metallicTint = {
      r: 0.08 + 0.92 * mutedColor.r,
      g: 0.08 + 0.92 * mutedColor.g,
      b: 0.08 + 0.92 * mutedColor.b,
    };

    const tintChannel = (sourceChannel: number, tintChannelValue: number) => {
      const panelBase = tintChannelValue * (0.16 + 0.84 * shade);
      const sourceDetail = sourceChannel - shade;
      const detailRetention = 0.5 + 0.18 * midtoneWeight + 0.14 * highlightProtection;
      const paintedSurface = clamp01(panelBase + sourceDetail * detailRetention);
      const refinedSurface = mix(sourceChannel, paintedSurface, blendAmount);
      const reflectionLift = 0.05 * highlightProtection;

      return clamp01(mix(refinedSurface, sourceChannel, reflectionLift));
    };

    output[offset] = Math.round(tintChannel(sourceChannels.r, metallicTint.r) * 255);
    output[offset + 1] = Math.round(
      tintChannel(sourceChannels.g, metallicTint.g) * 255
    );
    output[offset + 2] = Math.round(
      tintChannel(sourceChannels.b, metallicTint.b) * 255
    );
  }

  context.putImageData(new ImageData(output, entry.width, entry.height), 0, 0);
}

export default function TintedCarImage({
  src,
  color,
  alt,
}: TintedCarImageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const renderPreview = (entry: PreviewCacheEntry) => {
      if (cancelled || !canvasRef.current) {
        return;
      }

      const targetCanvas = canvasRef.current;
      const targetContext = targetCanvas.getContext("2d");

      if (!targetContext) {
        return;
      }

      targetCanvas.width = entry.width;
      targetCanvas.height = entry.height;
      applyTint(entry, hexToRgb(color), targetContext);
    };

    const cached = previewCache.get(src);
    if (cached) {
      renderPreview(cached);
      return () => {
        cancelled = true;
      };
    }

    const image = new window.Image();
    image.decoding = "async";
    image.onload = () => {
      if (cancelled) {
        return;
      }

      const entry = buildPreviewCacheEntry(image);
      previewCache.set(src, entry);
      renderPreview(entry);
    };
    image.src = src;

    return () => {
      cancelled = true;
    };
  }, [color, src]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={alt}
      className="block h-auto w-full"
    />
  );
}
