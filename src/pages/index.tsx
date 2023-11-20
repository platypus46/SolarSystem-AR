import React, { Suspense, useEffect, useRef,  useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { DirectionalLight as ThreeDirectionalLight, Object3D } from 'three';

interface DirectionalLightProps {
  position: [number, number, number];
  intensity: number;
  color: string;
}

const ORBIT_SCALE = 2; 
const EARTH_ORBIT_SPEED = 2 * Math.PI / 100;
const EARTH_ROTATION_SPEED = EARTH_ORBIT_SPEED * 365.25;
const earthPosition = { x: 0, y: 0, z: 0 };

function calculateSpeeds(planetDayLength: number, planetOrbitPeriod: number): { orbitSpeed: number, rotationSpeed: number } {
  return {
    orbitSpeed: EARTH_ORBIT_SPEED / planetOrbitPeriod,
    rotationSpeed: (planetDayLength < 0 ? -1 : 1) * EARTH_ROTATION_SPEED / Math.abs(planetDayLength),
  };
}

interface PlanetModelProps {
  modelPath: string;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  orbitalInclination: number;
  orbitalEccentricity: number;
  isEarth?: boolean;
}

function PlanetFunc({ modelPath, orbitRadius, orbitSpeed, rotationSpeed, orbitalInclination, orbitalEccentricity, isEarth = false }: PlanetModelProps) {
  const planetRef = useRef<Object3D>(null);
  const gltf = useGLTF(modelPath);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const orbitAngle = elapsedTime * orbitSpeed;
    const rotationAngle = elapsedTime * rotationSpeed;

    if (planetRef.current) {
      const a = orbitRadius; 
      const b = orbitRadius * Math.sqrt(1 - Math.pow(orbitalEccentricity, 2)); 
      const x = a * Math.cos(orbitAngle);
      const z = b * Math.sin(orbitAngle);
      const y = x * Math.tan(orbitalInclination * Math.PI / 180);

      planetRef.current.position.set(x, y, z);
      planetRef.current.rotation.y = rotationAngle;

      if (isEarth) {
        earthPosition.x = x;
        earthPosition.y = y;
        earthPosition.z = z;
      }
    }
  });

  return <primitive ref={planetRef} object={gltf.scene} />;
}

function SunModel() {
  const gltf = useGLTF('/images/SolarSystemElements/sun.gltf');
  return <primitive object={gltf.scene} />;
}

function MercuryModel() {
  const { orbitSpeed, rotationSpeed } = calculateSpeeds(58.6, 0.24);
  return (
    <PlanetFunc
      modelPath="/images/SolarSystemElements/mercury.gltf"
      orbitRadius={57.9 * ORBIT_SCALE}
      orbitSpeed={orbitSpeed}
      rotationSpeed={rotationSpeed}
      orbitalInclination={7.0} 
      orbitalEccentricity={0.2056} 
    />
  );
}

function VenusModel() {
  const { orbitSpeed, rotationSpeed } = calculateSpeeds(-243, 0.62);
  return (
    <PlanetFunc
      modelPath="/images/SolarSystemElements/venus.gltf"
      orbitRadius={108.2 * ORBIT_SCALE}
      orbitSpeed={orbitSpeed}
      rotationSpeed={rotationSpeed}
      orbitalInclination={3.39} 
      orbitalEccentricity={0.0068} 
    />
  );
}

function EarthModel() {
  const { orbitSpeed, rotationSpeed } = calculateSpeeds(1, 1);
  return (
    <PlanetFunc
      modelPath="/images/SolarSystemElements/earth.gltf"
      orbitRadius={149.6 * ORBIT_SCALE}
      orbitSpeed={orbitSpeed}
      rotationSpeed={rotationSpeed}
      orbitalInclination={0} 
      orbitalEccentricity={0.0167} 
    />
  );
}


function MarsModel() {
  const { orbitSpeed, rotationSpeed } = calculateSpeeds(1.03, 1.88);
  return (
    <PlanetFunc
      modelPath="/images/SolarSystemElements/mars.gltf"
      orbitRadius={227.9 * ORBIT_SCALE}
      orbitSpeed={orbitSpeed}
      rotationSpeed={rotationSpeed}
      orbitalInclination={1.85} 
      orbitalEccentricity={0.0935} 
    />
  );
}


function JupiterModel() {
  const { orbitSpeed, rotationSpeed } = calculateSpeeds(0.41, 11.86);
  return (
    <PlanetFunc
      modelPath="/images/SolarSystemElements/jupiter.gltf"
      orbitRadius={778.5 * ORBIT_SCALE}
      orbitSpeed={orbitSpeed}
      rotationSpeed={rotationSpeed}
      orbitalInclination={1.31} 
      orbitalEccentricity={0.0489} 
    />
  );
}


function SaturnModel() {
  const { orbitSpeed, rotationSpeed } = calculateSpeeds(0.45, 29.46);
  return (
    <PlanetFunc
      modelPath="/images/SolarSystemElements/saturn.gltf"
      orbitRadius={1433.5 * ORBIT_SCALE}
      orbitSpeed={orbitSpeed}
      rotationSpeed={rotationSpeed}
      orbitalInclination={2.49} 
      orbitalEccentricity={0.0565} 
    />
  );
}

function UranusModel() {
  const { orbitSpeed, rotationSpeed } = calculateSpeeds(-0.72, 84.01);
  return (
    <PlanetFunc
      modelPath="/images/SolarSystemElements/uranus.gltf"
      orbitRadius={2872.5 * ORBIT_SCALE}
      orbitSpeed={orbitSpeed}
      rotationSpeed={rotationSpeed}
      orbitalInclination={0.77} 
      orbitalEccentricity={0.0463} 
    />
  );
}

function NeptuneModel() {
  const { orbitSpeed, rotationSpeed } = calculateSpeeds(0.67, 164.8);
  return (
    <PlanetFunc
      modelPath="/images/SolarSystemElements/neptune.gltf"
      orbitRadius={4495.1 * ORBIT_SCALE}
      orbitSpeed={orbitSpeed}
      rotationSpeed={rotationSpeed}
      orbitalInclination={1.77} 
      orbitalEccentricity={0.0113} 
    />
  );
}

function DirectionalLight(props: DirectionalLightProps) {
  const { scene } = useThree();

  useEffect(() => {
    const light = new ThreeDirectionalLight(props.color, props.intensity);
    light.position.set(...props.position);
    scene.add(light);


    return () => {
      scene.remove(light);
    };
  }, [props, scene]);

  return null;
}

export default function Home() {
  return (
    <div className="bg-cover bg-center h-screen" style={{ backgroundImage: `url('/images/sky.jpg')` }}>
      <Canvas>
        <Suspense fallback={null}>
          <SunModel />
          <MercuryModel/>
          <VenusModel/>
          <EarthModel/>
          <MarsModel/>
          <JupiterModel/>
          <SaturnModel/>
          <UranusModel/>
          <NeptuneModel/>

  
          <DirectionalLight 
            position={[0, 0, 0]} 
            intensity={50} 
            color="white" 
          />

          <Environment preset="sunset" />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}