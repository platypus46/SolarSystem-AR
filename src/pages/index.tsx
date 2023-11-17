import React, { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { DirectionalLight as ThreeDirectionalLight } from 'three';

interface DirectionalLightProps {
  position: [number, number, number];
  intensity: number;
  color: string;
}

function SunModel() {
  const gltf = useGLTF('/images/SolarSystemElements/sun.gltf');
  return <primitive object={gltf.scene} />;
}

function MercuryModel() {
  const gltf = useGLTF('/images/SolarSystemElements/mercury.gltf');

  return <primitive object={gltf.scene} position={[100, 0, 0]} />;
}

function VenusModel() {
  const gltf = useGLTF('/images/SolarSystemElements/venus.gltf');

  return <primitive object={gltf.scene} position={[200, 0, 0]} />;
}
function EarthModel() {
  const gltf = useGLTF('/images/SolarSystemElements/earth.gltf');

  return <primitive object={gltf.scene} position={[300, 0, 0]} />;
}
function MoonModel() {
  const gltf = useGLTF('/images/SolarSystemElements/moon.gltf');

  return <primitive object={gltf.scene} position={[400, 0, 0]} />;
}
function MarsModel() {
  const gltf = useGLTF('/images/SolarSystemElements/mars.gltf');

  return <primitive object={gltf.scene} position={[500, 0, 0]} />;
}
function JupiterModel() {
  const gltf = useGLTF('/images/SolarSystemElements/jupiter.gltf');

  return <primitive object={gltf.scene} position={[600, 0, 0]} />;
}
function SaturnModel() {
  const gltf = useGLTF('/images/SolarSystemElements/saturn.gltf');

  return <primitive object={gltf.scene} position={[700, 0, 0]} />;
}
function UranusModel() {
  const gltf = useGLTF('/images/SolarSystemElements/uranus.gltf');

  return <primitive object={gltf.scene} position={[800, 0, 0]} />;
}

function NeptuneModel() {
  const gltf = useGLTF('/images/SolarSystemElements/neptune.gltf');

  return <primitive object={gltf.scene} position={[900, 0, 0]} />;
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
    <div className="bg-cover bg-center h-screen" style={{ backgroundImage: `url('/images/background.png')` }}>
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
            intensity={10} 
            color="white" 
          />

          <Environment preset="sunset" />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}

