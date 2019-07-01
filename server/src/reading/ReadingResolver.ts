import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import { Readings } from './ReadingEntity';
import ReadingService from './ReadingService';

@Resolver(Readings)
class ReadingResolver {
  private readonly readingService: ReadingService;

  constructor() {
    this.readingService = new ReadingService();
  }

  @Query(returns => Readings)
  readings(@Arg('nodeId') nodeId: string, @Arg('date') date: string): Promise<Readings> {
    return this.readingService.getReadings(nodeId, date);
  }

  @Mutation(returns => String)
  @Authorized()
  async saveReading(@Arg('input') readingInput: string) {
    console.log('Received input:', readingInput);
    const parsedInput = readingInput.split(';');
    const nodeId = parsedInput[0];
    const moisture = Number(parsedInput[2]);
    const temperature = Number(parsedInput[5]);
    const batteryVoltage = Number(parsedInput[7]);
    const time = new Date();
    const reading = { moisture, temperature, batteryVoltage, time };

    await this.readingService.saveReading(nodeId, reading);
    return 'success';
  }
}

export default ReadingResolver;
