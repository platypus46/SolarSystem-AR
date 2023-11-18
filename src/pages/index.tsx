import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useThree,  useFrame  } from '@react-three/fiber';
import { Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { DirectionalLight as ThreeDirectionalLight,Object3D } from 'three';

interface DirectionalLightProps {
  position: [number, number, number];
  intensity: number;
  color: string;
}


const earthPosition = { x: 0, y: 0, z: 0 };

interface PlanetModelProps {
  modelPath: string;
  orbitRadius: number;
  orbitSpeed: number;
  isEarth?: boolean; 
}

function PlanetFunc({ modelPath, orbitRadius, orbitSpeed, isEarth = false }: PlanetModelProps) {
  const planetRef = useRef<Object3D>(null);
  const gltf = useGLTF(modelPath);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const angle = elapsedTime * orbitSpeed;

    if (planetRef.current) {
      const x = orbitRadius * Math.cos(angle);
      const z = orbitRadius * Math.sin(angle);

      planetRef.current.position.set(x, 0, z);

      if (isEarth) {
        earthPosition.x = x;
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
  return (
    <PlanetFunc
      modelPath="/images/SolarSystemElements/mercury.gltf"
      orbitRadius={100}
      orbitSpeed={4.15} 
    />
  );
}

function VenusModel() {
  return (
    <PlanetFunc
      modelPath="/images/SolarSystemElements/venus.gltf"
      orbitRadius={200}
      orbitSpeed={1.62} 
    />
  );
}

function EarthModel() {
  return (
    <PlanetFunc
      modelPath="/images/SolarSystemElements/earth.gltf"
      orbitRadius={300}
      orbitSpeed={1.0}
      isEarth={true}
    />
  );
}

function MoonModel() {
  const moonRef = useRef<Object3D>(null);
  const gltf = useGLTF('/images/SolarSystemElements/moon.gltf');

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const angle = elapsedTime * 13.38;

    if (moonRef.current) {
      const x = earthPosition.x + (20 * Math.cos(angle));
      const z = earthPosition.z + (20 * Math.sin(angle));
      moonRef.current.position.set(x, 0, z);
    }
  });

  return <primitive ref={moonRef} object={gltf.scene} />;
}


function MarsModel() {
  return (
    <PlanetFunc
      modelPath="/images/SolarSystemElements/mars.gltf"
      orbitRadius={500}
      orbitSpeed={0.53} 
    />
  );
}

function JupiterModel() {
  return (
    <PlanetFunc
      modelPath="/images/SolarSystemElements/jupiter.gltf"
      orbitRadius={600}
      orbitSpeed={0.084}
    />
  );
}

function SaturnModel() {
  return (
    <PlanetFunc
      modelPath="/images/SolarSystemElements/saturn.gltf"
      orbitRadius={700}
      orbitSpeed={0.034} 
    />
  );
}

function UranusModel() {
  return (
    <PlanetFunc
      modelPath="/images/SolarSystemElements/uranus.gltf"
      orbitRadius={800}
      orbitSpeed={0.012} 
    />
  );
}

function NeptuneModel() {
  return (
    <PlanetFunc
      modelPath="/images/SolarSystemElements/neptune.gltf"
      orbitRadius={900}
      orbitSpeed={0.006} 
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
          <MoonModel/>
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

