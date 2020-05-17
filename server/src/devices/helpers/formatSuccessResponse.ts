import { DeviceType } from 'common/types/entities';

export function formatSuccessResponse(type: DeviceType, action: 'paired' | 'discover'): string {
  return `success: ${type} ${action}`;
}
