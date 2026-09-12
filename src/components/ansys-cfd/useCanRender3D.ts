'use client';

import { useEffect, useState } from 'react';

/**
 * Gate de capacidad: solo habilita el modelo 3D (Three.js/R3F, ~varios cientos de KB)
 * en pantallas de escritorio con hardware razonable. La mayoría del tráfico de esta
 * landing entra desde WhatsApp/redes en móvil, así que ahí siempre se usa la imagen
 * estática — el bundle 3D ni siquiera se descarga.
 */
export function useCanRender3D(): boolean {
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    const width = window.innerWidth;
    const cores = navigator.hardwareConcurrency ?? 4;
    const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 8;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isLowEnd = cores <= 4 && mem <= 4;

    setCanRender(width >= 768 && !isLowEnd && !reduceMotion);
  }, []);

  return canRender;
}
