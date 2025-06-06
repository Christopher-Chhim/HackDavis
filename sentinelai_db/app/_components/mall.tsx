import React, { useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { OrbitControls, Edges, Text3D, Image } from "@react-three/drei";
import * as THREE from "three";

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

interface HallwayData {
  position: [number, number, number];
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

  // right door
  {
    name: 'door 15',
    position: [4.75, 1.5, 15],
    size: [4.5, 3, 0.1],
    rotation: [0, Math.PI, 0],
  },
  // top doors
  {
    name: 'door 16',
    position: [15, 1.5, 7.5],
    size: [5, 3, 0.1],
    rotation: [0, Math.PI / 2, 0],
  },
];

const hallwayData: HallwayData[] = [
  {
    position: [-6.5, 0.25, -5],
    size: [20, 0.1, 17],
    rotation: [0, Math.PI / 2, 0],
  },
  {
    position: [0, 0, 0],
    size: [30, 0.1, 30],
    rotation: [0, 0, 0],
  },
];

function convertNameToImageSrc(name: string) {
  let joinedName = name.split(' ').join('');
  joinedName = name.substring(0, 1).toLowerCase() + joinedName.substring(1);

  const imageSrc = `/images/${joinedName}.png`;
  console.log(imageSrc);
  return imageSrc;
}

export default function MallCanvas({ doors, zones }: any) {
  // Get the scene from the Three.js context
  const sceneRef = useRef<THREE.Scene | null>(null);
  function determineStoreColor(status: string, index: number) {
    // Hardcoded neighbors for each store
    const neighbors = {
      0: [1, 8],
      1: [0, 8],
      2: [8],
      3: [8],
      4: [7],
      5: [8, 7, 6],
      6: [5, 7, 8],
      7: [4, 5, 6],
      8: [0, 1, 2, 3, 5, 6],
    };

    // Determine the color based on the status and neighbors
    if (status === 'ok') {
      if (
        neighbors[index as keyof typeof neighbors].some(
          (neighbor) => zones[neighbor]?.status === 'danger'
        )
      ) {
        return 'yellow'; // Caution color if any neighbor is in danger
      }
      return 'green';
    } else if (status === 'caution') {
      return 'yellow';
    } else if (status === 'danger') {
      return 'red';
    } else {
      // Default color if status is not recognized
      return 'green';
    }
  }

  const exportToGLB = () => {
    if (!sceneRef.current) return;
    // Create a new GLTFExporter
    const exporter = new GLTFExporter();

    // Parse the scene and export as GLB
    exporter.parse(
      sceneRef.current,
      (gltf: any) => {
        // Create a blob from the exported data
        const blob = new Blob([gltf as ArrayBuffer], {
          type: "application/octet-stream",
        });

        // Create a download link
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "mall-scene.glb";

        // Trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
      },
      (error: any) => {
        console.error("An error occurred during export:", error);
      },
      { binary: true } // Export as binary GLB format
    );
  };
  return (
    <div
      style={{
        width: '100vw',
        height: 'calc(100vh - 100px)',
        margin: 0,
        overflow: 'hidden',
      }}
    >
      <div
        style={{ position: "absolute", top: "20px", right: "20px", zIndex: 10 }}
      >
        <button
          onClick={exportToGLB}
          style={{
            padding: "10px 15px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          }}
        >
          Export Scene
        </button>
      </div>
      <Canvas
        camera={{ position: [-15, 25, 0], fov: 80, far: 500 }}
        onCreated={({ scene }) => {
          sceneRef.current = scene;
        }}
      >
        <ambientLight intensity={1.5} />
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
            <meshStandardMaterial
              color={determineStoreColor(zones[index].status, index)}
            />
            <Edges
              linewidth={3}
              scale={1}
              threshold={15} // Display edges only when the angle between two faces exceeds this value (default=15 degrees)
              color='black'
            />
            <Text3D
              font='/fonts/Inter_Regular.json'
              position={[0, 3, -2.5]}
              lineHeight={0.3}
              size={0.75}
              height={0.2}
              curveSegments={128}
              rotation={[0, (3 * Math.PI) / 2, 0]}
            >
              {store.name}
              <meshStandardMaterial color='orange' />
            </Text3D>
            <Image
              url={convertNameToImageSrc(store.name)}
              position={[0, 1.6, 0]}
              rotation={[-Math.PI / 2, 0, - Math.PI / 2]}
              scale={[4, 4]}
            />
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
            <meshStandardMaterial
              color={doors[index]?.open ? 'green' : 'crimson'}
            />
            <Edges
              linewidth={3}
              scale={1}
              threshold={15} // Display edges only when the angle between two faces exceeds this value (default=15 degrees)
              color='black'
            />
          </mesh>
        ))}

        {/* Hallways */}
        {hallwayData.map((hallway, index) => (
          <mesh
            key={index}
            position={[
              hallway.position[0],
              hallway.position[1],
              hallway.position[2] || 0,
            ]}
            rotation={[
              hallway.rotation ? hallway.rotation[0] : 0,
              hallway.rotation ? hallway.rotation[1] : 0,
              hallway.rotation ? hallway.rotation[2] : 0,
            ]}
          >
            <boxGeometry
              args={[hallway.size[0], hallway.size[1], hallway.size[2]]}
            />
            <meshStandardMaterial
              color={determineStoreColor(zones[index + 7]?.status, index + 7)}
            />
          </mesh>
        ))}
      </Canvas>
    </div>
  );
}
