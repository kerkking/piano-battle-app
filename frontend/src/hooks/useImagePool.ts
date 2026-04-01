import { useEffect, useState, useRef, useCallback } from "react";

interface UseImagePoolResult {
  images: string[];
  isLoading: boolean;
  pickRandom: () => string | null;
  refresh: () => void;
}

export function useImagePool(): UseImagePoolResult {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const bagRef = useRef<string[]>([]);
  const indexRef = useRef(0);

  const fetchImages = useCallback(() => {
    setIsLoading(true);
    fetch("/api/images")
      .then((res) => res.json())
      .then((data: { images: string[] }) => {
        const urls = data.images.map((name) => `/processed_images/${name}`);
        setImages(urls);
        // Preload images
        urls.forEach((url) => {
          const img = new Image();
          img.src = url;
        });
      })
      .catch(() => {
        // Backend may not be running; ignore
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Shuffle bag for fair random distribution
  const shuffle = useCallback((arr: string[]) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j]!, a[i]!];
    }
    return a;
  }, []);

  const pickRandom = useCallback(() => {
    if (images.length === 0) return null;
    if (indexRef.current >= bagRef.current.length) {
      bagRef.current = shuffle(images);
      indexRef.current = 0;
    }
    const pick = bagRef.current[indexRef.current]!;
    indexRef.current++;
    return pick;
  }, [images, shuffle]);

  return { images, isLoading, pickRandom, refresh: fetchImages };
}
