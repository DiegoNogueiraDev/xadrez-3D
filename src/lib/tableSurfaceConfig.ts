export interface TableSurfaceConfig {
  size: number;
  position: [number, number, number];
  color: string;
  roughness: number;
  metalness: number;
  materialType: 'felt' | 'wood';
}

export const TABLE_SURFACE_CONFIG: TableSurfaceConfig = {
  size: 16,
  position: [0, -0.08, 0],
  color: '#1A0E06',
  roughness: 0.75,
  metalness: 0,
  materialType: 'wood',
};
