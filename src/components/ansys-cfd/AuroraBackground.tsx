'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '@/app/ansys-cfd/ansys-cfd.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Fondo fijo único detrás de toda la página. Las secciones se pintan con
 * navy semitransparente encima, así estas manchas se asoman en todas —
 * no solo en el hero. El drift lento es CSS puro; el desplazamiento
 * ligado al scroll (parallax real, cada mancha a distinta velocidad) es GSAP.
 */
export default function AuroraBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !ref.current) return;

    const blobs = ref.current.querySelectorAll<HTMLElement>('[data-parallax]');
    const ctx = gsap.context(() => {
      blobs.forEach((blob) => {
        const speed = Number(blob.dataset.parallax) || 1;
        gsap.to(blob, {
          y: () => -window.innerHeight * speed * 0.6,
          ease: 'none',
          scrollTrigger: { trigger: document.body, start: 0, end: 'max', scrub: 1 + speed * 0.4 },
        });
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.aurora} ref={ref} aria-hidden="true">
      <div
        data-parallax="0.6"
        className={styles.auroraBlob}
        style={{
          width: '52vw', height: '52vw', top: '-12%', left: '-10%',
          background: 'radial-gradient(circle, rgba(26,95,214,0.42), transparent 70%)',
          animation: 'auroraDrift1 46s ease-in-out infinite',
        }}
      />
      <div
        data-parallax="1"
        className={styles.auroraBlob}
        style={{
          width: '42vw', height: '42vw', top: '18%', right: '-12%',
          background: 'radial-gradient(circle, rgba(53,198,240,0.3), transparent 70%)',
          animation: 'auroraDrift2 54s ease-in-out infinite',
        }}
      />
      <div
        data-parallax="0.8"
        className={styles.auroraBlob}
        style={{
          width: '46vw', height: '46vw', top: '55%', left: '8%',
          background: 'radial-gradient(circle, rgba(217,140,61,0.22), transparent 70%)',
          animation: 'auroraDrift3 60s ease-in-out infinite',
        }}
      />
      <div
        data-parallax="1.2"
        className={styles.auroraBlob}
        style={{
          width: '38vw', height: '38vw', bottom: '-8%', right: '10%',
          background: 'radial-gradient(circle, rgba(26,95,214,0.3), transparent 70%)',
          animation: 'auroraDrift1 50s ease-in-out infinite reverse',
        }}
      />
    </div>
  );
}
