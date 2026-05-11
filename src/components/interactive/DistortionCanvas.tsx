"use client";

import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import * as THREE from "three";
import { FluidDistortionMaterialImpl } from "./DistortionShaderMaterial";

// Register the custom material with R3F
extend({ FluidDistortionMaterial: FluidDistortionMaterialImpl });

function Scene() {
  const materialRef = useRef<any>(null);
  const { viewport, size } = useThree();

  const mouse = useRef(new THREE.Vector2(0, 0));
  const prevMouse = useRef(new THREE.Vector2(0, 0));
  const targetVelocity = useRef(0);
  const velocity = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates to 0..1 for shaders
      const x = e.clientX / window.innerWidth;
      const y = 1.0 - (e.clientY / window.innerHeight);

      prevMouse.current.copy(mouse.current);
      mouse.current.set(x, y);

      // Calculate velocity
      const dist = mouse.current.distanceTo(prevMouse.current);
      targetVelocity.current = Math.min(dist * 50.0, 1.0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      // Smooth velocity interpolation (inertia)
      velocity.current += (targetVelocity.current - velocity.current) * 0.1;
      targetVelocity.current *= 0.95; // Decay

      materialRef.current.uTime = state.clock.elapsedTime;
      materialRef.current.uMouse = mouse.current;
      materialRef.current.uPrevMouse = prevMouse.current;
      materialRef.current.uVelocity = velocity.current;
      materialRef.current.uResolution = new THREE.Vector2(size.width, size.height);
      materialRef.current.uHasTexture = false;
      
      // Update hover state if needed
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
    setShouldHide(window.location.pathname.startsWith("/dashboard/new-scan"));
  }, []);

  if (shouldHide) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden mix-blend-screen opacity-45">
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]} gl={{ antialias: false, alpha: true }}>
        <Scene />
      </Canvas>
    </div>
  );
}
