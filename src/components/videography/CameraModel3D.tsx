
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useAnimation } from '@/contexts/AnimationContext';
import * as THREE from 'three';

interface CameraModelProps {
  className?: string;
  autoRotate?: boolean;
  wireframe?: boolean;
  color?: string;
  lightColor?: string;
  interactive?: boolean;
}

// Component to render the 3D camera model
const CameraModel: React.FC<{
  wireframe?: boolean;
  color?: string;
  lightColor?: string;
}> = ({ 
  wireframe = false,
  color = '#ff00ff',
  lightColor = '#ffffff'
}) => {
  const cameraBodyRef = useRef<THREE.Mesh>(null);
  const lensRef = useRef<THREE.Mesh>(null);
  
  // Animation logic
  useFrame(({ clock }) => {
    if (lensRef.current) {
      // Subtle lens rotation
      lensRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.5) * 0.05;
    }
  });
  
  return (
    <group position={[0, 0, 0]}>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} color={lightColor} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color={lightColor} />
      <pointLight position={[0, 0, 5]} intensity={0.8} color={lightColor} />
      
      {/* Camera body */}
      <mesh ref={cameraBodyRef} position={[0, 0, 0]}>
        <boxGeometry args={[2, 1.2, 1]} />
        <meshStandardMaterial 
          color={color} 
          wireframe={wireframe} 
          roughness={0.3} 
          metalness={0.7}
        />
      </mesh>
      
      {/* Camera grip */}
      <mesh position={[0.9, -0.8, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.8]} />
        <meshStandardMaterial 
          color={color} 
          wireframe={wireframe} 
          roughness={0.5} 
          metalness={0.3}
        />
      </mesh>
      
      {/* Camera lens */}
      <mesh ref={lensRef} position={[-1.2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.6, 0.8, 32]} />
        <meshStandardMaterial 
          color={color} 
          wireframe={wireframe} 
          roughness={0.2} 
          metalness={0.8}
        />
      </mesh>
      
      {/* Lens details */}
      <mesh position={[-1.7, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <ringGeometry args={[0.3, 0.5, 32]} />
        <meshStandardMaterial 
          color="#000000" 
          wireframe={wireframe} 
          roughness={0.1} 
          metalness={0.9}
        />
      </mesh>
      
      {/* Camera viewfinder */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[0.6, 0.4, 0.6]} />
        <meshStandardMaterial 
          color="#000000" 
          wireframe={wireframe} 
          roughness={0.3} 
          metalness={0.5}
        />
      </mesh>
      
      {/* Top controls */}
      <mesh position={[0.6, 0.7, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.2, 16]} />
        <meshStandardMaterial 
          color="#777777" 
          wireframe={wireframe} 
          roughness={0.4} 
          metalness={0.6}
        />
      </mesh>
    </group>
  );
};

// Controls wrapper with auto-rotation
const SceneWithControls: React.FC<{
  autoRotate: boolean;
  wireframe?: boolean;
  color?: string;
  lightColor?: string;
  interactive?: boolean;
}> = ({ 
  autoRotate, 
  wireframe, 
  color, 
  lightColor,
  interactive = true
}) => {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  
  useEffect(() => {
    // Position camera
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  return (
    <>
      <OrbitControls 
        ref={controlsRef}
        autoRotate={autoRotate}
        autoRotateSpeed={2}
        enableZoom={interactive}
        enablePan={interactive}
        enableRotate={interactive}
        minDistance={3}
        maxDistance={10}
      />
      <CameraModel wireframe={wireframe} color={color} lightColor={lightColor} />
    </>
  );
};

// Main component that renders the 3D scene
const CameraModel3D: React.FC<CameraModelProps> = ({
  className,
  autoRotate = true,
  wireframe = false,
  color = '#ff00ff',
  lightColor = '#ffffff',
  interactive = true
}) => {
  const { prefersReducedMotion } = useAnimation();

  return (
    <div className={className}>
      <Canvas shadows className="w-full h-full">
        <PerspectiveCamera makeDefault fov={45} />
        <SceneWithControls 
          autoRotate={autoRotate && !prefersReducedMotion} 
          wireframe={wireframe}
          color={color}
          lightColor={lightColor}
          interactive={interactive}
        />
      </Canvas>
    </div>
  );
};

export default CameraModel3D;
