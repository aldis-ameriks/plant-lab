import { Arg, Authorized, Ctx, ID, Mutation, Query, Resolver } from 'type-graphql';
import { Context } from '../common/authChecker';
import { DeviceService } from './service';
import { Device, NewDeviceInput } from './models';

@Resolver(Device)
export class DeviceResolver {
  private readonly deviceService: DeviceService;

  constructor() {
    this.deviceService = new DeviceService();
  }

  @Query(returns => Device)
  @Authorized()
  device(@Ctx() ctx: Context, @Arg('deviceId', type => ID) deviceId: string) {
    const userId = ctx.user.id;
    return this.deviceService.getUserDevice(deviceId, userId);
  }

  @Query(returns => [Device])
  @Authorized()
  devices(@Ctx() ctx: Context) {
    const userId = ctx.user.id;
    return this.deviceService.getUserDevices(userId);
  }

  @Mutation(returns => Device)
  @Authorized()
  async updateDeviceName(
    @Ctx() ctx: Context,
    @Arg('deviceId', type => ID) deviceId: string,
    @Arg('name') name: string
  ) {
    const userId = ctx.user.id;
    await this.deviceService.verifyUserOwnsDevice(deviceId, userId);
    return this.deviceService.updateDeviceName(deviceId, name);
  }

  @Mutation(returns => Device)
  @Authorized()
  async updateDeviceRoom(
    @Ctx() ctx: Context,
    @Arg('deviceId', type => ID) deviceId: string,
    @Arg('room') room: string
  ) {
    const userId = ctx.user.id;
    await this.deviceService.verifyUserOwnsDevice(deviceId, userId);
    return this.deviceService.updateDeviceRoom(deviceId, room);
  }

  @Mutation(returns => ID)
  @Authorized()
  async removeDevice(@Ctx() ctx: Context, @Arg('deviceId', type => ID) deviceId: string) {
    const userId = ctx.user.id;
    await this.deviceService.verifyUserOwnsDevice(deviceId, userId);
    await this.deviceService.removeDevice(deviceId, userId);
    return deviceId;
  }

  @Mutation(returns => Device)
  @Authorized()
  async addDevice(@Ctx() ctx: Context, @Arg('input', type => NewDeviceInput) input: NewDeviceInput) {
    const userId = ctx.user.id;
    return this.deviceService.addDevice(input, userId);
  }
}
