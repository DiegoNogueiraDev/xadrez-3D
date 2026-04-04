import { TABLE_SURFACE_CONFIG } from '../lib/tableSurfaceConfig';

export default function TableSurface() {
  const { size, position, color, roughness, metalness } = TABLE_SURFACE_CONFIG;

  return (
    <mesh
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      name="table-surface"
      raycast={() => {}}
    >
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </mesh>
  );
}
