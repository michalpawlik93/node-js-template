import { Permission } from './permission';

export const BASE_ACCESS_ROLE = 'base_access';

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
}
