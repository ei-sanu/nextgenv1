"use client";

import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

const FluidDistortionMaterialImpl = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uPrevMouse: new THREE.Vector2(0, 0),
    uVelocity: 0,
    uTexture: null,
    uResolution: new THREE.Vector2(0, 0),
    uHoverState: 0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uPrevMouse;
    uniform float uVelocity;
    uniform sampler2D uTexture;
    uniform vec2 uResolution;
    uniform float uHoverState;
    
    varying vec2 vUv;

    // Simplex 2D noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uv = vUv;
      
      // Aspect ratio correction for mouse distance
      vec2 aspect = vec2(uResolution.x/uResolution.y, 1.0);
      vec2 mouse = uMouse * aspect;
      vec2 st = uv * aspect;
      
      // Distance from current pixel to mouse
      float dist = distance(st, mouse);
      
      // Dynamic ripple effect based on velocity and distance
      float ripple = sin(dist * 20.0 - uTime * 5.0) * exp(-dist * 10.0);
      float mouseArea = smoothstep(0.4, 0.0, dist);
      
      // Calculate directional displacement based on mouse movement vector
      vec2 dir = normalize(uMouse - uPrevMouse);
      if(length(dir) == 0.0) dir = vec2(0.0);
      
      // Add noise to the displacement
      float noiseParams = snoise(uv * 5.0 + uTime * 0.5);
      
      // Total displacement vector
      vec2 displacement = dir * mouseArea * uVelocity * 0.1 * ripple + (noiseParams * 0.02 * mouseArea);
      
      // Apply displacement with RGB split (chromatic aberration)
      float rOffset = 0.005 * uVelocity * mouseArea;
      float bOffset = -0.005 * uVelocity * mouseArea;
      
      vec4 texColor;
      if (uTexture != null) {
          float r = texture2D(uTexture, uv - displacement + dir * rOffset).r;
          float g = texture2D(uTexture, uv - displacement).g;
          float b = texture2D(uTexture, uv - displacement + dir * bOffset).b;
          texColor = vec4(r, g, b, 1.0);
      } else {
          // Fallback ambient gradient if no texture
          vec3 baseColor = vec3(0.02, 0.02, 0.05);
          vec3 highlight = vec3(0.1, 0.3, 0.8) * mouseArea * uVelocity;
          texColor = vec4(baseColor + highlight, 1.0);
      }
      
      // Add subtle glow
      vec3 glowColor = vec3(0.3, 0.6, 1.0) * mouseArea * uHoverState;
      
      gl_FragColor = texColor + vec4(glowColor, 0.0);
    }
  `
);

extend({ FluidDistortionMaterial: FluidDistortionMaterialImpl });

export { FluidDistortionMaterialImpl };

// Add TypeScript support for the extended element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      fluidDistortionMaterial: any;
    }
  }
}
