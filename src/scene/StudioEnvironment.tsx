import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { PMREMGenerator, type Material, type Mesh } from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * Local studio environment for image-based lighting. `PMREMGenerator` turns
 * three's procedural room into a prefiltered map that standard materials use for
 * reflections, so the blade keeps its highlights without the remote HDR that
 * decision 0008 removed.
 */
export function StudioEnvironment() {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    const pmrem = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const target = pmrem.fromScene(room, 0.04);

    scene.environment = target.texture;

    return () => {
      scene.environment = null;
      target.dispose();
      pmrem.dispose();
      room.traverse((object) => {
        const mesh = object as Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry.dispose();
        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        materials.forEach((material: Material) => material.dispose());
      });
    };
  }, [gl, scene]);

  return null;
}
