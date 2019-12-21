import { Arg, Query, Resolver } from 'type-graphql';
import { Device } from './DeviceEntity';
import { DeviceService } from './DeviceService';

@Resolver(Device)
export class DeviceResolver {
  private readonly deviceService: DeviceService;

  constructor() {
    this.deviceService = new DeviceService();
  }

  @Query(returns => Device)
  device(@Arg('deviceId') deviceId: string) {
    return this.deviceService.getUserDevice(deviceId);
  }

  @Query(returns => [Device])
  async devices() {
    return this.deviceService.getUserDevices();
  }
}
