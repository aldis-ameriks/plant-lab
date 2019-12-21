import { Arg, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import DeviceService from './DeviceService';
import { Device } from './DeviceEntity';
import { Plant } from '../plants/PlantEntity';
import { PlantService } from '../plants/PlantService';

@Resolver(Device)
class DeviceResolver {
  private readonly deviceService: DeviceService;
  private readonly plantService: PlantService;

  constructor() {
    this.deviceService = new DeviceService();
    this.plantService = new PlantService();
  }

  @Query(returns => Device)
  sensor(@Arg('sensorId') sensorId: string) {
    return this.deviceService.getUserSensor(sensorId);
  }

  @Query(returns => [Device])
  async sensors() {
    return this.deviceService.getUserSensors();
  }

  @FieldResolver(returns => Plant)
  plant(@Root() sensor: Device) {
    return this.plantService.getPlantBySensorId(sensor.id);
  }
}

export default DeviceResolver;
