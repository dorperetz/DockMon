import {ContainerUsageStats} from './container-usage-stats';

export interface Container {
  id: string;
  name: string;
  state: string;
  status: string;
  stats: ContainerUsageStats;
}
