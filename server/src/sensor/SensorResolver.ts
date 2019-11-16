import { FieldResolver, Query, Resolver, Root } from 'type-graphql';
import SensorService from './SensorService';
import { Sensor } from './SensorEntity';
import { Plant } from '../plants/PlantEntity';
import { PlantService } from '../plants/PlantService';
import { Reading } from '../reading/ReadingEntity';
import ReadingService from '../reading/ReadingService';

@Resolver(Sensor)
class SensorResolver {
  private readonly sensorService: SensorService;
  private readonly plantService: PlantService;
  private readonly readingService: ReadingService;

  constructor() {
    this.sensorService = new SensorService();
    this.plantService = new PlantService();
    this.readingService = new ReadingService();
  }

  @Query(returns => [Sensor])
  sensors() {
    return this.sensorService.getUserSensors();
  }

  @FieldResolver(returns => Plant)
  plant(@Root() sensor: Sensor) {
    return this.plantService.getPlantBySensorId(sensor.id);
  }

  @FieldResolver(returns => Reading)
  lastReading(@Root() sensor: Sensor) {
    return this.readingService.getLastReading(sensor.id);
  }
}

export default SensorResolver;
