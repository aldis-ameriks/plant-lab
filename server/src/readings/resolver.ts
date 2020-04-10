import { Arg, Authorized, Ctx, ID, Mutation, Query, Resolver } from 'type-graphql';
import { Context } from '../common/authChecker';
import { DeviceService } from '../devices/service';
import { Reading, ReadingInput } from './models';
import { ReadingService } from './service';
import { validate } from '../common/validate';

@Resolver(Reading)
export class ReadingResolver {
  private readonly readingService: ReadingService;
  private readonly deviceService: DeviceService;

  constructor() {
    this.readingService = new ReadingService();
    this.deviceService = new DeviceService();
  }

  @Query((returns) => [Reading])
  @Authorized()
  async readings(
    @Ctx() ctx: Context,
    @Arg('deviceId', (type) => ID) deviceId: string,
    @Arg('date', { nullable: true }) date?: string
  ): Promise<Reading> {
    const userId = ctx.user.id;
    await this.deviceService.verifyUserOwnsDevice(deviceId, userId);
    return this.readingService.getReadings(deviceId, date);
  }

  @Query((returns) => Reading, { nullable: true })
  @Authorized()
  async lastReading(@Ctx() ctx: Context, @Arg('deviceId', (type) => ID) deviceId: string): Promise<Reading> {
    const userId = ctx.user.id;
    await this.deviceService.verifyUserOwnsDevice(deviceId, userId);
    return this.readingService.getLastReading(deviceId);
  }

  @Query((returns) => Date, { nullable: true })
  @Authorized()
  async lastWateredTime(@Ctx() ctx: Context, @Arg('deviceId', (type) => ID) deviceId: string): Promise<Date> {
    const userId = ctx.user.id;
    await this.deviceService.verifyUserOwnsDevice(deviceId, userId);
    return this.readingService.getLastWateredTime(deviceId);
  }

  @Mutation((returns) => String)
  @Authorized('HUB')
  async saveReading(@Ctx() ctx: Context, @Arg('input') input: string) {
    console.log('Received input:', input);
    const parsedInput = input.split(';');
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

    const readingInput = new ReadingInput({
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
    });
    await validate(readingInput);

    const userId = ctx.user.id;
    await this.deviceService.verifyUserOwnsDevice(device_id, userId);
    await this.readingService.saveReading(device_id, readingInput);
    return 'success';
  }
}
