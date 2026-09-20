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

    let width = mount.clientWidth || 550;
    let height = mount.clientHeight || 550;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mount.appendChild(renderer.domElement);

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    // Dim, Warm Ember Volumetric Shader with Zero Hard Edges
    const fragmentShader = `
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform vec3 uColor;
      uniform float uBreathPhase;
      varying vec2 vUv;

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x = a0.x * x0.x + h.x * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 st = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);

        float t = uTime * 0.10;

        // 1. Slow, drifting fluid wave for organic light shape
        float wave1 = snoise(vec2(st.x * 1.2 + t * 0.12, st.y * 1.2 - t * 0.10));
        float wave2 = snoise(vec2(st.x * 1.8 - t * 0.14, st.y * 1.6 + t * 0.12));
        float organicDrift = smoothstep(-0.4, 0.7, wave1 * 0.6 + wave2 * 0.4);

        // 2. Buoyancy & Mouse Interaction
        vec2 center = uMouse * 0.06;
        vec2 diff = st - center;
        float dist = length(diff);

        // Subtle fluid surface warp
        float warp = snoise(vec2(diff.x * 2.0 + t * 0.18, diff.y * 2.0 - t * 0.16)) * 0.05;
        float warpedDist = dist + warp;

        // 4-7-8 Breathing Scale (5-6% gentle expansion)
        float breathScale = uBreathPhase;
        float radius = 0.38 * breathScale;

        // Multi-stage Gaussian falloff for ultra-soft atmospheric illumination
        float amberCore = exp(-pow(warpedDist / (radius * 0.8), 2.0) * 2.5) * 0.65;
        float warmMid   = exp(-pow(warpedDist / (radius * 1.4), 1.8) * 1.8) * 0.40;
        float softHalo  = exp(-pow(dist / 1.1, 1.4) * 1.4) * 0.18;

        float totalGlow = amberCore + warmMid + softHalo;

        // Warm amber/gold primary brand light with subtle deep undertone
        vec3 warmAmber = vec3(0.96, 0.62, 0.04); // #F59E0B
        vec3 softGold = vec3(1.0, 0.78, 0.35);
        vec3 deepAtmosphere = vec3(0.18, 0.12, 0.06);

        vec3 glowColor = mix(warmAmber, softGold, smoothstep(0.05, 0.30, warpedDist));
        glowColor = mix(glowColor, deepAtmosphere, smoothstep(0.25, 0.70, dist));

        vec3 finalColor = glowColor * totalGlow;

        // Smooth atmospheric vignette into #0B0A10 base
        float vignette = 1.0 - smoothstep(0.50, 1.20, length(st));
        finalColor *= vignette;

        float alpha = clamp(totalGlow * 1.25 + organicDrift * 0.08, 0.0, 0.75) * vignette;

        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(width, height) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColor: { value: new THREE.Color(moodColorRef.current) },
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

    const mouseTarget = { x: 0, y: 0 };
    const mouseCurrent = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouseTarget.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseTarget.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      if (!mount) return;
      width = mount.clientWidth;
      height = mount.clientHeight;
      renderer.setSize(width, height);
      uniforms.uResolution.value.set(width, height);
    });
    resizeObserver.observe(mount);

    // 4-7-8 Breathing Cycle (Total: 19s, Inhale: 4s, Hold: 7s, Exhale: 8s)
    // Low amplitude: only 6% scale change (1.00 -> 1.06)
    const CYCLE = 19.0;
    const INHALE = 4.0;
    const HOLD = 7.0;

    let animId: number;
    let clock = new THREE.Clock();

    const currentColor = new THREE.Color(moodColorRef.current);
    const targetColor = new THREE.Color(moodColorRef.current);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      uniforms.uTime.value = elapsed;

      const cycleTime = elapsed % CYCLE;
      let breathScale = 1.0;

      if (cycleTime < INHALE) {
        // 4s Inhale: smooth cubic ease from 1.0 to 1.06
        const t = cycleTime / INHALE;
        const ease = t * t * (3.0 - 2.0 * t);
        breathScale = 1.0 + 0.06 * ease;
      } else if (cycleTime < INHALE + HOLD) {
        // 7s Hold: gentle micro-float
        const holdT = cycleTime - INHALE;
        breathScale = 1.06 + Math.sin(holdT * 0.6) * 0.004;
      } else {
        // 8s Exhale: slow release back to 1.0
        const exhaleT = (cycleTime - (INHALE + HOLD)) / (CYCLE - (INHALE + HOLD));
        const ease = exhaleT * exhaleT * (3.0 - 2.0 * exhaleT);
        breathScale = 1.06 - 0.06 * ease;
      }

      uniforms.uBreathPhase.value = breathScale;

      // 3.0s+ smooth color transition (zero sudden flashes)
      targetColor.set(moodColorRef.current);
      currentColor.lerp(targetColor, 0.02);
      uniforms.uColor.value.copy(currentColor);

      // Heavy mouse inertia damping
      mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.02;
      mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.02;
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
      className={`relative w-full h-full select-none pointer-events-none ${className}`}
      style={{
        filter: 'blur(80px)',
      }}
    />
  );
};
