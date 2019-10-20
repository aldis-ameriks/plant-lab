import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import { Reading } from './ReadingEntity';
import ReadingService from './ReadingService';

@Resolver(Reading)
class ReadingResolver {
  private readonly readingService: ReadingService;

  constructor() {
    this.readingService = new ReadingService();
  }

  @Query(returns => [[Reading]])
  readings(
    @Arg('nodeIds', type => [String]) nodeIds: string[],
    @Arg('date', { nullable: true }) date?: string
  ): Promise<Reading[]> {
    return Promise.all(nodeIds.map(nodeId => this.readingService.getReadings(nodeId, date)));
  }

  @Query(returns => Reading)
  lastReading(@Arg('nodeId', type => String) nodeId: string): Promise<Reading> {
    return this.readingService.getLastReading(nodeId);
  }

  @Query(returns => Date, { nullable: true })
  lastWateredTime(@Arg('nodeId', type => String) nodeId: string): Promise<Date> {
    return this.readingService.getLastWateredTime(nodeId);
  }

  @Mutation(returns => String)
  @Authorized()
  async saveReading(@Arg('input') readingInput: string) {
    console.log('Received input:', readingInput);
    const parsedInput = readingInput.split(';');
    const node_id = parsedInput[0];
    const moisture_raw = Number(parsedInput[1]);
    const moisture = Number(parsedInput[2]);
    const moisture_min = Number(parsedInput[3]);
    const moisture_max = Number(parsedInput[4]);
    const temperature = Number(parsedInput[5]);
    const light = Number(parsedInput[6]) || null; // Some of the sensors have their light sensor covered and send 0
    const battery_voltage = Number(parsedInput[7]);
    const timestamp = new Date();
    const reading = {
      node_id,
      moisture,
      moisture_raw,
      moisture_min,
      moisture_max,
      temperature,
      battery_voltage,
      light,
      timestamp,
    };

    await this.readingService.saveReading(node_id, reading);
    return 'success';
  }
}

export default ReadingResolver;
