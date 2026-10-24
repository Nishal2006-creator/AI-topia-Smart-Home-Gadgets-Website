import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, MeshDistortMaterial, MeshWobbleMaterial, Sphere, Box, Torus, Cylinder } from '@react-three/drei';
import { useTheme } from '@/src/context/ThemeContext';

interface Product3DModelProps {
  category: string;
  isActive?: boolean;
}

const GadgetGeometry = ({ category, isActive }: { category: string; isActive?: boolean }) => {
  const { theme } = useTheme();
  const color = isActive ? theme.primaryColor : '#ffffff';
  const emissive = isActive ? theme.primaryColor : '#111111';

  // Return different geometries based on gadget category
  switch (category.toLowerCase()) {
    case 'audio':
      return (
        <group>
          <Sphere args={[1.2, 32, 32]}>
            <MeshDistortMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={isActive ? 2 : 0.5}
              distort={isActive ? 0.4 : 0.2}
              speed={2}
              transparent
              opacity={0.8}
            />
          </Sphere>
          <Torus args={[1.4, 0.05, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color={theme.secondaryColor} emissive={theme.secondaryColor} emissiveIntensity={1} />
          </Torus>
        </group>
      );
    case 'lighting':
      return (
        <group>
          <Cylinder args={[0.3, 0.3, 2, 32]}>
            <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
          </Cylinder>
          <Sphere args={[0.8, 32, 32]} position={[0, 1.2, 0]}>
            <MeshWobbleMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={isActive ? 5 : 1}
              factor={0.2}
              speed={2}
            />
          </Sphere>
        </group>
      );
    case 'security':
      return (
        <group>
          <Box args={[1.5, 1.5, 0.5]}>
            <meshStandardMaterial color="#111" metalness={1} roughness={0.05} />
          </Box>
          <Torus args={[0.6, 0.05, 16, 100]} position={[0, 0, 0.3]}>
            <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={2} />
          </Torus>
          <Sphere args={[0.2, 32, 32]} position={[0, 0, 0.3]}>
            <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={isActive ? 5 : 0.5} />
          </Sphere>
        </group>
      );
    case 'central control':
      return (
        <group>
          <Box args={[2, 1.2, 0.1]} rotation={[0.2, 0, 0]}>
            <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
          </Box>
          <Box args={[1.8, 1, 0.05]} position={[0, 0, 0.06]} rotation={[0.2, 0, 0]}>
            <MeshDistortMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={1}
              distort={0.1}
              speed={1}
              transparent
              opacity={0.9}
            />
          </Box>
        </group>
      );
    case 'health':
      return (
        <group>
          <Torus args={[1, 0.2, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
            <MeshDistortMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={isActive ? 2 : 0.5}
              distort={0.3}
              speed={3}
            />
          </Torus>
          <Sphere args={[0.5, 32, 32]}>
            <meshStandardMaterial color={theme.accentColor} emissive={theme.accentColor} emissiveIntensity={1} />
          </Sphere>
        </group>
      );
    case 'climate':
      return (
        <group>
          <Cylinder args={[1, 1, 0.2, 32]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#333" />
          </Cylinder>
          <Torus args={[0.8, 0.1, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
            <MeshWobbleMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={isActive ? 3 : 0.5}
              factor={0.5}
              speed={5}
            />
          </Torus>
        </group>
      );
    case 'furniture':
      return (
        <group>
          <Box args={[2, 0.5, 1.5]}>
            <meshStandardMaterial color={color} metalness={0.2} roughness={0.8} />
          </Box>
          <Box args={[1.8, 0.1, 1.3]} position={[0, 0.3, 0]}>
             <meshStandardMaterial color="#fff" emissive={emissive} emissiveIntensity={0.2} />
          </Box>
        </group>
      );
    default:
      return (
        <Box args={[1.2, 1.2, 1.2]}>
          <MeshWobbleMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={1}
            factor={0.1}
            speed={1}
          />
        </Box>
      );
  }
};

export const Product3DViewer: React.FC<Product3DModelProps> = ({ category, isActive }) => {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <OrbitControls 
            enableZoom={true} 
            enablePan={false} 
            minDistance={3} 
            maxDistance={7}
            autoRotate={!isActive}
            autoRotateSpeed={0.5}
          />
          
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

          <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <GadgetGeometry category={category} isActive={isActive} />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
};
