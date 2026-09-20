import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeroCore3DProps {
  activeMoodColor?: string;
  className?: string;
}

export const HeroCore3D: React.FC<HeroCore3DProps> = ({
  activeMoodColor = '#F59E0B',
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const moodColorRef = useRef<string>(activeMoodColor);

  useEffect(() => {
    moodColorRef.current = activeMoodColor;
  }, [activeMoodColor]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth || 600;
    let height = mount.clientHeight || 500;

    // Scene & Orthographic Camera for pixel-perfect shader rendering
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // GLSL Shaders for 4-7-8 Breathing Volumetric Light & Drift Aurora
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform vec3 uColor;
      uniform vec3 uSecondaryColor;
      uniform float uBreathPhase;
      varying vec2 vUv;

      // Smooth 2D Simplex / Perlin noise approximation
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187,
                            0.366025403784439,
                           -0.577350269189626,
                            0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
              + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
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
        vec2 st = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);

        // Slow unhurried time scale
        float t = uTime * 0.18;

        // 1. Aurora / Fluid Gradient Background Waves (Very low contrast, drifting softly)
        float n1 = snoise(vec2(st.x * 1.2 + t * 0.25, st.y * 1.2 - t * 0.2));
        float n2 = snoise(vec2(st.x * 2.0 - t * 0.15, st.y * 2.0 + t * 0.3));
        float aurora = smoothstep(-0.6, 0.8, n1 * 0.6 + n2 * 0.4);

        vec3 auroraColor = mix(vec3(0.035, 0.04, 0.06), uSecondaryColor * 0.12, aurora * 0.55);

        // 2. Volumetric Breathing Light Core (Centered with damped mouse buoyancy)
        vec2 lightCenter = uMouse * 0.15;
        vec2 diff = st - lightCenter;
        float dist = length(diff);

        // Fluid fluidic surface distortion (feels like light through deep water)
        float fluidDistort = snoise(vec2(diff.x * 2.8 + t * 0.4, diff.y * 2.8 - t * 0.35)) * 0.08;
        float fluidDistort2 = snoise(vec2(diff.x * 5.0 - t * 0.2, diff.y * 5.0 + t * 0.25)) * 0.03;
        float warpedDist = dist + fluidDistort + fluidDistort2;

        // 4-7-8 Breathing expansion factor passed from JS
        float breathScale = uBreathPhase;
        float baseRadius = 0.28 * breathScale;

        // Multi-tier exponential Gaussian falloff (strictly ZERO hard edges)
        float innerCore = exp(-pow(warpedDist / (baseRadius * 0.65), 2.4) * 4.0);
        float midGlow   = exp(-pow(warpedDist / (baseRadius * 1.15), 2.0) * 2.8) * 0.75;
        float outerHalo = exp(-pow(dist / (baseRadius * 2.1), 1.6) * 1.8) * 0.35;
        float atmosphericVeil = exp(-pow(dist / 1.1, 1.4) * 1.2) * 0.14;

        float totalGlow = innerCore * 0.95 + midGlow + outerHalo + atmosphericVeil;

        // Gradient color ramp: white-gold center transitioning to mood accent & deep space
        vec3 centerWhite = vec3(0.98, 0.97, 0.94);
        vec3 orbColor = mix(uColor, centerWhite, innerCore * 0.8);
        orbColor = mix(orbColor, uSecondaryColor, (1.0 - innerCore) * 0.3);

        vec3 finalColor = auroraColor + orbColor * totalGlow;

        // Soft vignette to merge completely with background (#090A0F)
        float vignette = 1.0 - smoothstep(0.5, 1.4, length(st));
        finalColor *= vignette;

        // Alpha falloff ensures no bounding box is ever visible
        float alpha = clamp(totalGlow * 1.1 + aurora * 0.18, 0.0, 1.0) * vignette;

        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(width, height) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColor: { value: new THREE.Color(moodColorRef.current) },
      uSecondaryColor: { value: new THREE.Color('#38BDF8') },
      uBreathPhase: { value: 1.0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    // Mouse tracking with heavy fluidic damping
    const mouseTarget = { x: 0, y: 0 };
    const mouseCurrent = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseTarget.x = normX;
      mouseTarget.y = normY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!mount) return;
      width = mount.clientWidth;
      height = mount.clientHeight;
      renderer.setSize(width, height);
      uniforms.uResolution.value.set(width, height);
    });
    resizeObserver.observe(mount);

    // 4-7-8 Breathing Cycle Logic in Animation Loop
    // Total cycle: 4s inhale + 7s hold + 8s exhale = 19.0 seconds
    const CYCLE_DURATION = 19.0;
    const INHALE_DURATION = 4.0;
    const HOLD_DURATION = 7.0;

    let animId: number;
    let clock = new THREE.Clock();

    const currentColor = new THREE.Color(moodColorRef.current);
    const targetColor = new THREE.Color(moodColorRef.current);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      uniforms.uTime.value = elapsed;

      // 4-7-8 Breathing Math
      const cycleTime = elapsed % CYCLE_DURATION;
      let breathScale = 1.0;

      if (cycleTime < INHALE_DURATION) {
        // Inhale: 0s -> 4s (smooth cubic ease in-out from 1.0 to 1.28)
        const t = cycleTime / INHALE_DURATION;
        const ease = t * t * (3.0 - 2.0 * t);
        breathScale = 1.0 + 0.28 * ease;
      } else if (cycleTime < INHALE_DURATION + HOLD_DURATION) {
        // Hold: 4s -> 11s (peak suspension with very slight harmonic float)
        const holdT = cycleTime - INHALE_DURATION;
        breathScale = 1.28 + Math.sin(holdT * 0.8) * 0.015;
      } else {
        // Exhale: 11s -> 19s (slow 8-second release back to 1.0)
        const exhaleT = (cycleTime - (INHALE_DURATION + HOLD_DURATION)) / (CYCLE_DURATION - (INHALE_DURATION + HOLD_DURATION));
        const ease = exhaleT * exhaleT * (3.0 - 2.0 * exhaleT);
        breathScale = 1.28 - 0.28 * ease;
      }

      uniforms.uBreathPhase.value = breathScale;

      // Slow color transition (2.5s+ smooth lerp without abrupt jumps)
      targetColor.set(moodColorRef.current);
      currentColor.lerp(targetColor, 0.025);
      uniforms.uColor.value.copy(currentColor);

      // Mouse inertia damping
      mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.03;
      mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.03;
      uniforms.uMouse.value.set(mouseCurrent.x, mouseCurrent.y);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-[400px] sm:h-[480px] md:h-[540px] flex items-center justify-center select-none pointer-events-none ${className}`}
    />
  );
};
