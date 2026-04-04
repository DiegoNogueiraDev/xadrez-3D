export interface EnvironmentConfig {
  path: string;
  sourceId: string;
  resolution: string;
  label: string;
}

export const ENVIRONMENT_CONFIG: EnvironmentConfig = {
  path: '/assets/environment/studio.hdr',
  sourceId: 'brown_photostudio_02',
  resolution: '1k',
  label: 'Brown Photo Studio',
};
