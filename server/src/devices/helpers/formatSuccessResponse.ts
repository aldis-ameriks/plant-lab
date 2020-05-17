import { device_type } from 'common/types/entities';

export function formatSuccessResponse(type: device_type, action: 'paired' | 'discover'): string {
  return `success: ${type} ${action}`;
}
