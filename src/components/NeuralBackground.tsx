import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '@/src/context/ThemeContext';

const NeuralLink = ({ color, speed, intensity }: { color: string, speed: number, intensity: number }) => {
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < 20; i++) {
      p.push(new THREE.Vector3(
        (Math.random() - 0.5) * 40 * intensity,
        (Math.random() - 0.5) * 40 * intensity,
        (Math.random() - 0.5) * 20 * intensity
      ));
    }
    return p;
  }, [intensity]);

  return (
    <group>
      {points.map((pos, i) => (
        <Float key={i} speed={(Math.random() * 2 + 1) * speed} rotationIntensity={2 * intensity} floatIntensity={2 * intensity}>
          <mesh position={pos}>
            <octahedronGeometry args={[Math.random() * 0.5 * intensity, 0]} />
            <meshStandardMaterial 
              color={color} 
              emissive={color} 
              emissiveIntensity={1 * intensity} 
              wireframe
              transparent
              opacity={0.3}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

export const NeuralBackground = () => {
  const { theme } = useTheme();
  
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#020203]">
      <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
        <color attach="background" args={['#020203']} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color={theme.primaryColor} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color={theme.secondaryColor} />
        
        {theme.backgroundStyle !== 'void' && (
          <Stars 
            radius={100} 
            depth={theme.backgroundStyle === 'nebula' ? 100 : 50} 
            count={(theme.backgroundStyle === 'stars' || theme.backgroundStyle === 'nebula' ? 5000 : 1000) * theme.backgroundIntensity} 
            factor={4 * theme.backgroundIntensity} 
            saturation={theme.backgroundStyle === 'nebula' ? 1 : 0} 
            fade 
            speed={0.5 * theme.backgroundSpeed} 
          />
        )}
        
        {theme.backgroundStyle === 'neural' && (
          <NeuralLink 
            color={theme.primaryColor} 
            speed={theme.backgroundSpeed} 
            intensity={theme.backgroundIntensity} 
          />
        )}
        
        {(theme.backgroundStyle === 'dust' || theme.backgroundStyle === 'nebula') && (
           <group>
             {Array.from({ length: Math.floor(50 * theme.backgroundIntensity) }).map((_, i) => (
                <Float key={i} speed={2 * theme.backgroundSpeed} rotationIntensity={0.5 * theme.backgroundIntensity} floatIntensity={0.5 * theme.backgroundIntensity}>
                  <mesh position={[
                    (Math.random() - 0.5) * 30 * theme.backgroundIntensity,
                    (Math.random() - 0.5) * 30 * theme.backgroundIntensity,
                    (Math.random() - 0.5) * 10 * theme.backgroundIntensity
                  ]}>
                    <sphereGeometry args={[0.02, 8, 8]} />
                    <meshStandardMaterial color={theme.secondaryColor} emissive={theme.secondaryColor} />
                  </mesh>
                </Float>
             ))}
           </group>
        )}
        
        <fog attach="fog" args={['#020203', 10, 50]} />
      </Canvas>
      
      {/* Mesh Overlays */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000" 
        style={{ 
          background: `radial-gradient(circle_at_50%_50%, ${theme.primaryColor}08, transparent 70%)` 
        }} 
      />
      <div className="absolute inset-0 bg-[#020203]/20 backdrop-blur-[1px]" />
      
      {/* Special nebula style overlay */}
      {theme.backgroundStyle === 'nebula' && (
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10 opacity-30 animate-pulse" />
      )}
    </div>
  );
};
