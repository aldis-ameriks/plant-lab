import { Arg, Authorized, Ctx, ID, Mutation, Query, Resolver } from 'type-graphql';

import { Device, NewDeviceInput, PairDeviceInput } from './models';
import { DeviceService } from './service';

import { Context } from 'types/context';

@Resolver(Device)
export class DeviceResolver {
  private readonly deviceService: DeviceService;

  constructor() {
    this.deviceService = new DeviceService();
  }

  @Query((_returns) => Device)
  @Authorized()
  device(@Ctx() ctx: Context, @Arg('deviceId', (_type) => ID) deviceId: string) {
    const userId = ctx.user.id;
    return this.deviceService.getUserDevice(deviceId, userId);
  }

  @Query((_returns) => [Device])
  @Authorized()
  devices(@Ctx() ctx: Context) {
    const userId = ctx.user.id;
    return this.deviceService.getUserDevices(userId);
  }

  @Mutation((_returns) => Device)
  @Authorized()
  async updateDeviceName(
    @Ctx() ctx: Context,
    @Arg('deviceId', (_type) => ID) deviceId: string,
    @Arg('name') name: string
  ) {
    const userId = ctx.user.id;
    await this.deviceService.verifyUserOwnsDevice(deviceId, userId);
    return this.deviceService.updateDeviceName(deviceId, name);
  }

  @Mutation((_returns) => Device)
  @Authorized()
  async updateDeviceRoom(
    @Ctx() ctx: Context,
    @Arg('deviceId', (_type) => ID) deviceId: string,
    @Arg('room') room: string
  ) {
    const userId = ctx.user.id;
    await this.deviceService.verifyUserOwnsDevice(deviceId, userId);
    return this.deviceService.updateDeviceRoom(deviceId, room);
  }

  @Mutation((_returns) => ID)
  @Authorized()
  async removeDevice(@Ctx() ctx: Context, @Arg('deviceId', (_type) => ID) deviceId: string) {
    const userId = ctx.user.id;
    await this.deviceService.verifyUserOwnsDevice(deviceId, userId);
    await this.deviceService.removeDevice(deviceId, userId);
    return deviceId;
  }

  @Mutation((_returns) => Device)
  @Authorized()
  async addDevice(@Ctx() ctx: Context, @Arg('input', (_type) => NewDeviceInput) input: NewDeviceInput) {
    const userId = ctx.user.id;
    return this.deviceService.addDevice(input, userId);
  }

  @Mutation((_returns) => Boolean)
  @Authorized()
  async pairDevice(@Ctx() ctx: Context, @Arg('input') input: PairDeviceInput) {
    const userId = ctx.user.id;
    const address = ctx.ip;
    return this.deviceService.pairDevice(input.type, userId, address);
  }
}
