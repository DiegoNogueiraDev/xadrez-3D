export interface TextureSet {
  label: string;
  sourceId: string;
  diffuse: string;
  normal: string;
  roughness: string;
}

export type TextureSetId = 'marble_light' | 'marble_dark' | 'wood';

export const TEXTURE_SETS: Record<TextureSetId, TextureSet> = {
  marble_light: {
    label: 'Light Marble',
    sourceId: 'grey_cartago_01',
    diffuse: '/assets/textures/marble_light/diffuse.jpg',
    normal: '/assets/textures/marble_light/normal.jpg',
    roughness: '/assets/textures/marble_light/roughness.jpg',
  },
  marble_dark: {
    label: 'Dark Granite',
    sourceId: 'granite_tile_03',
    diffuse: '/assets/textures/marble_dark/diffuse.jpg',
    normal: '/assets/textures/marble_dark/normal.jpg',
    roughness: '/assets/textures/marble_dark/roughness.jpg',
  },
  wood: {
    label: 'Fine Wood',
    sourceId: 'fine_grained_wood',
    diffuse: '/assets/textures/wood/diffuse.jpg',
    normal: '/assets/textures/wood/normal.jpg',
    roughness: '/assets/textures/wood/roughness.jpg',
  },
};
