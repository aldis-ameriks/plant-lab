import { DeviceType } from 'devices/models';

export function formatSuccessResponse(type: DeviceType, action: 'paired' | 'discover'): string {
  return `success: ${type} ${action}`;
}
