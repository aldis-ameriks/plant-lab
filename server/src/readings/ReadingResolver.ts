import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import { Reading } from './ReadingEntity';
import { ReadingService } from './ReadingService';

@Resolver(Reading)
export class ReadingResolver {
  private readonly readingService: ReadingService;

  constructor() {
    this.readingService = new ReadingService();
  }

  @Query(returns => [Reading])
  readings(
    @Arg('deviceId', type => String) deviceId: string,
    @Arg('date', { nullable: true }) date?: string
  ): Promise<Reading> {
    return this.readingService.getReadings(deviceId, date);
  }

  @Query(returns => Reading, { nullable: true })
  lastReading(@Arg('deviceId', type => String) deviceId: string): Promise<Reading> {
    return this.readingService.getLastReading(deviceId);
  }

  @Query(returns => Date, { nullable: true })
  lastWateredTime(@Arg('deviceId', type => String) deviceId: string): Promise<Date> {
    return this.readingService.getLastWateredTime(deviceId);
  }

  @Mutation(returns => String)
  @Authorized()
  async saveReading(@Arg('input') readingInput: string) {
    console.log('Received input:', readingInput);
    const parsedInput = readingInput.split(';');
    const device_id = parsedInput[0];
    const moisture_raw = Number(parsedInput[1]);
    const moisture = Number(parsedInput[2]);
    const moisture_min = Number(parsedInput[3]);
    const moisture_max = Number(parsedInput[4]);
    const temperature = Number(parsedInput[5]);
    const light = Number(parsedInput[6]) || null; // Some of the devices have their light sensor covered and send 0
    const battery_voltage = Number(parsedInput[7]);
    const signal = Number(parsedInput[8]);
    const timestamp = new Date();
    const reading = {
      device_id,
      moisture: Math.min(Math.max(moisture, 0), 100),
      moisture_raw,
      moisture_min,
      moisture_max,
      temperature,
      battery_voltage,
      light,
      timestamp,
      signal,
    };

    await this.readingService.saveReading(device_id, reading);
    return 'success';
  }
}
