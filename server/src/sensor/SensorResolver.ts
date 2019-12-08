import { Arg, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import SensorService from './SensorService';
import { Sensor } from './SensorEntity';
import { Plant } from '../plants/PlantEntity';
import { PlantService } from '../plants/PlantService';

@Resolver(Sensor)
class SensorResolver {
  private readonly sensorService: SensorService;
  private readonly plantService: PlantService;

  constructor() {
    this.sensorService = new SensorService();
    this.plantService = new PlantService();
  }

  @Query(returns => Sensor)
  sensor(@Arg('sensorId') sensorId: string) {
    return this.sensorService.getUserSensor(sensorId);
  }

  @Query(returns => [Sensor])
  sensors() {
    return this.sensorService.getUserSensors();
  }

  @FieldResolver(returns => Plant)
  plant(@Root() sensor: Sensor) {
    return this.plantService.getPlantBySensorId(sensor.id);
  }
}

export default SensorResolver;
