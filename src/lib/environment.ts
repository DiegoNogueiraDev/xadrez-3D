export interface EnvironmentConfig {
  path: string;
  sourceId: string;
  resolution: string;
  label: string;
}

export const ENVIRONMENT_CONFIG: EnvironmentConfig = {
  path: '/assets/environment/medieval.hdr',
  sourceId: 'abandoned_hall_01',
  resolution: '1k',
  label: 'Medieval Hall',
};
