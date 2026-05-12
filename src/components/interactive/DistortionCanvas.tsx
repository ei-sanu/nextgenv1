"use client";

import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import * as THREE from "three";
import { FluidDistortionMaterialImpl } from "./DistortionShaderMaterial";

// Register the custom material with R3F
extend({ FluidDistortionMaterial: FluidDistortionMaterialImpl });

function Scene() {
  const materialRef = useRef<THREE.ShaderMaterial & {
    uTime: number;
    uMouse: THREE.Vector2;
    uPrevMouse: THREE.Vector2;
    uVelocity: number;
    uTexture: THREE.Texture | null;
    uHasTexture: boolean;
    uResolution: THREE.Vector2;
    uHoverState: number;
  }>(null);
  const { viewport, size } = useThree();

  const mouse = useRef(new THREE.Vector2(0, 0));
  const prevMouse = useRef(new THREE.Vector2(0, 0));
  const targetVelocity = useRef(0);
  const velocity = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = 1.0 - e.clientY / window.innerHeight;

      prevMouse.current.copy(mouse.current);
      mouse.current.set(x, y);

      const dist = mouse.current.distanceTo(prevMouse.current);
      targetVelocity.current = Math.min(dist * 50.0, 1.0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      velocity.current += (targetVelocity.current - velocity.current) * 0.1;
      targetVelocity.current *= 0.95;

      // Use the clock provided by R3F state
      materialRef.current.uTime = state.clock.elapsedTime;
      materialRef.current.uMouse = mouse.current;
      materialRef.current.uPrevMouse = prevMouse.current;
      materialRef.current.uVelocity = velocity.current;
      materialRef.current.uResolution = new THREE.Vector2(
        size.width,
        size.height,
      );
      materialRef.current.uHasTexture = false;

      materialRef.current.uHoverState = velocity.current > 0.1 ? 1.0 : 0.0;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <fluidDistortionMaterial ref={materialRef} transparent />
    </mesh>
  );
}

export function DistortionCanvas() {
  const [shouldHide, setShouldHide] = useState(false);

  useEffect(() => {
    // Only access location on mount to avoid hydration mismatch/errors
    setShouldHide(window.location.pathname.startsWith("/dashboard/new-scan"));
  }, []);

  if (shouldHide) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden mix-blend-screen opacity-45">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
