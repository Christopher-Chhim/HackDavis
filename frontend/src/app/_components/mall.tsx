import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Edges, Text3D } from '@react-three/drei';

interface StoreData {
  name: string;
  position: [number, number, number?];
  size: [number, number, number?];
}

interface WallData {
  position: [number, number, number?];
  size: [number, number, number?];
  rotation?: [number, number, number];
  color: string;
}

interface DoorData {
  name: string;
  position: [number, number, number?];
  size: [number, number, number?];
  rotation?: [number, number, number];
}

// add state to target stores
const storeData: StoreData[] = [
  // 7 stores
  {
    name: 'Banana Store',
    position: [11, 0, -10],
    size: [8, 3, 10],
  },
  {
    name: 'Lululime',
    position: [11, 0, 0],
    size: [8, 3, 10],
  },
  {
    name: 'Victoria',
    position: [11, 0, 12.5],
    size: [8, 3, 5],
  },
  {
    name: 'PayMore',
    position: [-6.25, 0, 12.5],
    size: [17.5, 3, 5],
  },
  {
    name: 'StudyStart',
    position: [-11, 0, -11],
    size: [8, 3, 8],
  },
  {
    name: 'HandLocker',
    position: [-8.75, 0, 1.5],
    size: [12.5, 3, 8],
  },
  {
    name: 'Orange Republic',
    position: [0, 0, -4.75],
    size: [5, 3, 20.5],
  },
];

const wallsData: WallData[] = [
  { position: [11, 0.25, -15], size: [8, 0.5], color: 'gray' }, // Left Wall
  { position: [0, 0.25, -15], size: [5, 0.5], color: 'gray' },
  { position: [-11, 0.25, -15], size: [8, 0.5], color: 'gray' },

  { position: [11, 0.25, 15], size: [8, 0.5], color: 'gray' }, // Right Wall
  { position: [-6.25, 0.25, 15], size: [17.5, 0.5], color: 'gray' },

  // Top Wall
  {
    position: [15, 0.25, 12.5],
    size: [5, 0.5],
    rotation: [0, Math.PI / 2, 0],
    color: 'gray',
  },
  {
    position: [15, 0.25, -5],
    size: [20, 0.5],
    rotation: [0, Math.PI / 2, 0],
    color: 'gray',
  },

  // Bottom Wall
  {
    position: [-15, 0.25, -11],
    size: [8, 0.5],
    rotation: [0, Math.PI / 2, 0],
    color: 'gray',
  },
  {
    position: [-15, 0.25, 1.5],
    size: [8, 0.5],
    rotation: [0, Math.PI / 2, 0],
    color: 'gray',
  },
  {
    position: [-15, 0.25, 12.5],
    size: [5, 0.5],
    rotation: [0, Math.PI / 2, 0],
    color: 'gray',
  },
];

// add state to target doors
const doorsData: DoorData[] = [
  // top doors
  {
    name: 'door 16',
    position: [15, 1.5, 7.5],
    size: [5, 3, 0.1],
    rotation: [0, Math.PI / 2, 0],
  },
  // bottom doors
  {
    name: 'door 13',
    position: [-15, 1.5, -4.75],
    size: [4.5, 3, 0.1],
    rotation: [0, Math.PI / 2, 0],
  },
  {
    name: 'door 14',
    position: [-15, 1.5, 7.75],
    size: [4.5, 3, 0.1],
    rotation: [0, Math.PI / 2, 0],
  },
  // left doors
  {
    name: 'door 11',
    position: [4.75, 1.5, -15],
    size: [4.5, 3, 0.1],
    rotation: [0, 0, 0],
  },
  {
    name: 'door 12',
    position: [-4.75, 1.5, -15],
    size: [4.5, 3, 0.1],
    rotation: [0, 0, 0],
  },

  // right door
  {
    name: 'door 15',
    position: [4.75, 1.5, 15],
    size: [4.5, 3, 0.1],
    rotation: [0, Math.PI, 0],
  },

  // store doors
  {
    name: 'door 1',
    position: [7, 1.5, -10],
    size: [3, 3, 0.1],
    rotation: [0, Math.PI / 2, 0],
  },
  {
    name: 'door 2',
    position: [7, 1.5, 0],
    size: [3, 3, 0.1],
    rotation: [0, Math.PI / 2, 0],
  },
  {
    name: 'door 3',
    position: [7, 1.5, 12.5],
    size: [3, 3, 0.1],
    rotation: [0, Math.PI / 2, 0],
  },
  {
    name: 'door 4',
    position: [2.5, 1.5, 12.5],
    size: [3, 3, 0.1],
    rotation: [0, Math.PI / 2, 0],
  },
  {
    name: 'door 5',
    position: [2.5, 1.5, 0],
    size: [3, 3, 0.1],
    rotation: [0, Math.PI / 2, 0],
  },
  {
    name: 'door 6',
    position: [-2.5, 1.5, -9],
    size: [3, 3, 0.1],
    rotation: [0, Math.PI / 2, 0],
  },
  {
    name: 'door 7',
    position: [-2.5, 1.5, 1],
    size: [3, 3, 0.3],
    rotation: [0, Math.PI / 2, 0],
  },
  {
    name: 'door 8',
    position: [-10, 1.5, -2.5],
    size: [3, 3, 0.1],
    rotation: [0, 0, 0],
  },
  {
    name: 'door 9',
    position: [-7, 1.5, -11],
    size: [3, 3, 0.1],
    rotation: [0, Math.PI / 2, 0],
  },
  {
    name: 'door 10',
    position: [-8, 1.5, 5.5],
    size: [3, 3, 0.1],
    rotation: [0, 0, 0],
  },
];

const Mall3D: React.FC = () => {
  return (
    <div
      style={{ width: '100vw', height: 'calc(100vh - 100px)', margin: 0, overflow: 'hidden' }}
    >
      <Canvas camera={{ position: [-15, 25, 0], fov: 80, far: 500 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls enableZoom={true} enablePan={false} />

        {/* Floor */}
        <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color='lightgray' />
        </mesh>

        {/* Walls */}
        {wallsData.map((wall, index) => (
          <mesh
            key={index}
            position={[
              wall.position[0],
              wall.position[1],
              wall.position[2] || 0,
            ]}
            rotation={[
              wall.rotation ? wall.rotation[0] : 0,
              wall.rotation ? wall.rotation[1] : 0,
              wall.rotation ? wall.rotation[2] : 0,
            ]}
          >
            <boxGeometry args={[wall.size[0], wall.size[1], 0.25]} />
            <meshStandardMaterial color={wall.color} />
          </mesh>
        ))}

        {/* Stores */}
        {storeData.map((store, index) => (
          <mesh
            key={index}
            position={[
              store.position[0],
              store.size[1] / 2,
              store.position[2] || 0,
            ]}
          >
            <boxGeometry
              args={[store.size[0], store.size[1], store.size[2] || 0.25]}
            />
            <meshStandardMaterial color={'lime'} />
            <Edges
              linewidth={3}
              scale={1}
              threshold={15} // Display edges only when the angle between two faces exceeds this value (default=15 degrees)
              color='black'
            />
            <Text3D
              font='/fonts/Inter_Regular.json'
              position={[0, 3, -3]}
              lineHeight={0.3}
              size={0.75}
              height={0.2}
              curveSegments={128}
              rotation={[0, (3 * Math.PI) / 2, 0]}
            >
              {store.name}
              <meshStandardMaterial color='orchid' />
            </Text3D>
          </mesh>
        ))}

        {/* Doors */}
        {doorsData.map((door, index) => (
          <mesh
            key={index}
            position={[
              door.position[0],
              door.position[1],
              door.position[2] || 0,
            ]}
            rotation={[
              door.rotation ? door.rotation[0] : 0,
              door.rotation ? door.rotation[1] : 0,
              door.rotation ? door.rotation[2] : 0,
            ]}
          >
            <boxGeometry args={[door.size[0], door.size[1], door.size[2]]} />
            <meshStandardMaterial color={'green'} />
            <Edges
              linewidth={3}
              scale={1}
              threshold={15} // Display edges only when the angle between two faces exceeds this value (default=15 degrees)
              color='black'
            />
          </mesh>
        ))}
      </Canvas>
    </div>
  );
};

export default Mall3D;
