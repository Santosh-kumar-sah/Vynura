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

    // Dimensions
    const width = mount.clientWidth || 400;
    const height = mount.clientHeight || 400;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    // Group for mouse/scroll parallax
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Inner Geometric Core: TorusKnot for organic harmonic resonance
    const innerGeometry = new THREE.TorusKnotGeometry(1.05, 0.32, 128, 32, 2, 3);
    const innerMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x111420,
      emissive: new THREE.Color(moodColorRef.current),
      emissiveIntensity: 0.18,
      roughness: 0.2,
      metalness: 0.85,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15,
      wireframe: false,
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    coreGroup.add(innerMesh);

    // Outer Geometric Orbital Lattice (Wireframe Shell)
    const outerGeometry = new THREE.IcosahedronGeometry(2.0, 2);
    const outerMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const outerMesh = new THREE.Mesh(outerGeometry, outerMaterial);
    coreGroup.add(outerMesh);

    // Subtle Satellite Nodes
    const particleCount = 48;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2.2 + Math.random() * 0.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(moodColorRef.current),
      size: 0.04,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    coreGroup.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const pointLight = new THREE.PointLight(new THREE.Color(moodColorRef.current), 3.0, 10);
    pointLight.position.set(-3, -2, 2);
    scene.add(pointLight);

    // Mouse Tracking with Eased Damping
    const targetRotation = { x: 0, y: 0 };
    const targetPosition = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      const normX = (clientX / rect.width) * 2 - 1;
      const normY = -(clientY / rect.height) * 2 + 1;

      targetRotation.y = normX * 0.7;
      targetRotation.x = -normY * 0.5;
      targetPosition.x = normX * 0.2;
      targetPosition.y = normY * 0.2;
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      coreGroup.position.y = -scrollY * 0.0008;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!mount) return;
      const newWidth = mount.clientWidth;
      const newHeight = mount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });
    resizeObserver.observe(mount);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const currentColor = new THREE.Color(moodColorRef.current);
    const targetColor = new THREE.Color(moodColorRef.current);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth color transition
      targetColor.set(moodColorRef.current);
      currentColor.lerp(targetColor, 0.05);
      innerMaterial.emissive.copy(currentColor);
      pointLight.color.copy(currentColor);
      particleMaterial.color.copy(currentColor);

      // Autonomous gentle harmonic rotation
      innerMesh.rotation.x += delta * 0.22;
      innerMesh.rotation.y += delta * 0.35;
      outerMesh.rotation.x -= delta * 0.08;
      outerMesh.rotation.y -= delta * 0.12;
      particles.rotation.y += delta * 0.05;

      // Mouse Parallax Damping
      coreGroup.rotation.x += (targetRotation.x - coreGroup.rotation.x) * 0.05;
      coreGroup.rotation.y += (targetRotation.y - coreGroup.rotation.y) * 0.05;
      coreGroup.position.x += (targetPosition.x - coreGroup.position.x) * 0.05;

      // Floating harmonic breathing
      innerMesh.position.y = Math.sin(elapsed * 1.5) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();

      innerGeometry.dispose();
      innerMaterial.dispose();
      outerGeometry.dispose();
      outerMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-[360px] sm:h-[440px] md:h-[500px] flex items-center justify-center select-none pointer-events-auto cursor-grab active:cursor-grabbing ${className}`}
    />
  );
};
