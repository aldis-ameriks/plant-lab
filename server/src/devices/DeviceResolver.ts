import { Arg, Query, Resolver } from 'type-graphql';
import { DeviceService } from './DeviceService';
import { Device } from './DeviceEntity';

@Resolver(Device)
export class DeviceResolver {
  private readonly deviceService: DeviceService;

  constructor() {
    this.deviceService = new DeviceService();
  }

  @Query(returns => Device)
  sensor(@Arg('sensorId') sensorId: string) {
    return this.deviceService.getUserSensor(sensorId);
  }

  @Query(returns => [Device])
  async sensors() {
    return this.deviceService.getUserSensors();
  }
}
