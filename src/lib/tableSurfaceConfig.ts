export interface TableSurfaceConfig {
  size: number;
  position: [number, number, number];
  color: string;
  roughness: number;
  metalness: number;
  materialType: 'felt' | 'wood';
}

export const TABLE_SURFACE_CONFIG: TableSurfaceConfig = {
  size: 14,
  position: [0, -0.05, 0],
  color: '#2D4F2D',
  roughness: 0.9,
  metalness: 0,
  materialType: 'felt',
};
