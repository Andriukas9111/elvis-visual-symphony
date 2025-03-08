
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';
import { Group } from 'three';

interface Logo3DProps {
  text?: string;
  color?: string;
  position?: [number, number, number];
}

const Logo3D: React.FC<Logo3DProps> = ({
  text = "ELVIS",
  color = "#FF00FF",
  position = [0, 0, 0]
}) => {
  const groupRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Center>
        <Text3D
          font="/fonts/Inter_Bold.json"
          size={1}
          height={0.2}
          curveSegments={4}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          {text}
          <meshStandardMaterial color={color} />
        </Text3D>
      </Center>
    </group>
  );
};

export default Logo3D;
