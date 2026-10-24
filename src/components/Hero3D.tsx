import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, MeshDistortMaterial, Float as FloatDrei } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '@/src/context/ThemeContext';

const NeuralNodes = () => {
  const { theme } = useTheme();
  const count = 40;
  
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < count; i++) {
      p.push(new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ));
    }
    return p;
  }, []);

  return (
    <group>
      {points.map((pos, i) => (
        <Float key={i} speed={2} rotationIntensity={2} floatIntensity={2}>
          <mesh position={pos}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial 
              color={theme.primaryColor} 
              emissive={theme.primaryColor} 
              emissiveIntensity={2} 
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

const PulsingCore = () => {
  const { theme } = useTheme();
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.2;
    meshRef.current.rotation.y = t * 0.3;
  });

  return (
    <FloatDrei speed={3} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1, 0.4, 128, 32]} />
        <MeshDistortMaterial
          color={theme.primaryColor}
          emissive={theme.secondaryColor}
          emissiveIntensity={2}
          speed={3}
          distort={0.4}
          radius={1}
        />
      </mesh>
    </FloatDrei>
  );
};

export const Hero3D = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-60">
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#7000ff" intensity={1} />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <NeuralNodes />
        <PulsingCore />
        
        <fog attach="fog" args={['#020203', 5, 20]} />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-t from-[#020203]/80 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

