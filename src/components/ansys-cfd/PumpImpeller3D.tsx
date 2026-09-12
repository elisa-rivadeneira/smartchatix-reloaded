'use client';

import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Nota: se intentó servir desde R2 (como las imágenes del hero), pero el bucket
// no tiene CORS habilitado para fetch() cross-origin y las credenciales de la
// API no alcanzan para configurarlo (falta permiso a nivel de bucket, no de
// objeto) — three.js/GLTFLoader necesita CORS explícito, a diferencia de <img>.
// Queda servido localmente hasta que alguien con acceso al dashboard de
// Cloudflare habilite CORS en el bucket "smartchatix-media".
const MODEL_URL = '/models/impeller.glb';

function Loader() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 12, 12]} />
      <meshBasicMaterial color="#35C6F0" wireframe transparent opacity={0.5} />
    </mesh>
  );
}

function Model() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_URL);
  const mouse = useRef({ x: 0, y: 0 });

  // Centra el modelo en el origen y lo normaliza a un tamaño consistente,
  // sin importar las unidades con las que se exportó desde SolidWorks.
  const normalized = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    clone.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    clone.scale.setScalar(2.3 / maxDim);
    return clone;
  }, [scene]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
    };
  }, []);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    // Una vuelta completa cada ~26s (2*PI / 0.24).
    group.rotation.y += delta * 0.24;
    const targetX = mouse.current.y * 0.22;
    const targetZ = -mouse.current.x * 0.14;
    group.rotation.x += (targetX - group.rotation.x) * 0.06;
    group.rotation.z += (targetZ - group.rotation.z) * 0.06;
  });

  return (
    <group ref={groupRef}>
      <primitive object={normalized} />
    </group>
  );
}

export default function PumpImpeller3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 38 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-4, -1, -2]} intensity={0.6} color="#35C6F0" />
      <directionalLight position={[0, -3, 2]} intensity={0.25} color="#D98C3D" />
      <Suspense fallback={<Loader />}>
        <Model />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
