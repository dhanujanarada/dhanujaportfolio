import { useGLTF } from "@react-three/drei";

/**
 * Procedural stand-in until /public/models/sword.glb exists. Convention for the
 * real asset: baked transforms, blade along +Y, origin at the grip centre,
 * one scene unit = one Three unit, tangents included for anisotropy.
 * Flip USE_GLB when the file is dropped in; the Draco/meshopt decoders are
 * fetched by drei (Draco from gstatic) only when the model path is used.
 */
const USE_GLB = false;
const SWORD_MODEL_URL = "/models/sword.glb";

const blade = {
  color: "#cfd3d6",
  metalness: 1,
  roughness: 0.22,
  anisotropy: 0.6,
  envMapIntensity: 1.1,
};

const bronze = {
  color: "#8a6a3f",
  metalness: 0.9,
  roughness: 0.38,
};

export function Sword() {
  return USE_GLB ? <GltfSword /> : <ProceduralSword />;
}

function GltfSword() {
  const { scene } = useGLTF(SWORD_MODEL_URL, true, true);
  return <primitive object={scene} />;
}

function ProceduralSword() {
  return (
    <group name="sword">
      {/* Blade: diamond section, tapered over the last 19%, 0.9 long */}
      <mesh position={[0, 0.6, 0]} scale={[1, 1, 0.22]}>
        <cylinderGeometry args={[0.055, 0.06, 0.9, 4, 1]} />
        <meshPhysicalMaterial {...blade} />
      </mesh>
      <mesh position={[0, 1.145, 0]} scale={[1, 1, 0.22]}>
        <cylinderGeometry args={[0, 0.055, 0.19, 4, 1]} />
        <meshPhysicalMaterial {...blade} />
      </mesh>

      {/* Fuller: a recessed strip on each face, 60% of the blade length */}
      {[1, -1].map((side) => (
        <mesh key={side} position={[0, 0.52, side * 0.0134]}>
          <boxGeometry args={[0.03, 0.54, 0.0016]} />
          <meshStandardMaterial color="#8f9498" metalness={0.85} roughness={0.42} />
        </mesh>
      ))}

      {/* Crossguard: straight bar, rounded ends, slight forward sweep */}
      <mesh position={[0, 0.145, 0]}>
        <boxGeometry args={[0.2, 0.02, 0.045]} />
        <meshStandardMaterial {...bronze} />
      </mesh>
      {[1, -1].map((side) => (
        <mesh key={side} position={[side * 0.105, 0.149, 0]}>
          <sphereGeometry args={[0.014, 12, 8]} />
          <meshStandardMaterial {...bronze} />
        </mesh>
      ))}

      {/* Grip: 0.26 long with wrap rings */}
      <mesh>
        <cylinderGeometry args={[0.018, 0.022, 0.26, 12]} />
        <meshStandardMaterial color="#201e1b" roughness={0.9} />
      </mesh>
      {[-0.1, -0.06, -0.02, 0.02, 0.06, 0.1].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.021, 0.0025, 6, 16]} />
          <meshStandardMaterial color="#141311" roughness={0.95} />
        </mesh>
      ))}

      {/* Disc pommel */}
      <mesh position={[0, -0.152, 0]}>
        <cylinderGeometry args={[0.038, 0.038, 0.024, 20]} />
        <meshStandardMaterial {...bronze} />
      </mesh>
    </group>
  );
}
