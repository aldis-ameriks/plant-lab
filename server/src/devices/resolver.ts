import { Arg, Authorized, Ctx, ID, Mutation, Query, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';

import { Device, NewDeviceInput, PairDeviceInput } from './models';
import { DeviceService } from './service';

import { Context } from 'common/types/context';

@Service()
@Resolver(Device)
export class DeviceResolver {
  @Inject()
  private readonly deviceService: DeviceService;

  @Query((_returns) => Device)
  @Authorized()
  async device(@Ctx() ctx: Context, @Arg('deviceId', (_type) => ID) deviceId: string): Promise<Device> {
    const userId = ctx.user.id;
    const result = await this.deviceService.getUserDevice(deviceId, userId);
    return Device.from(result);
  }

  @Query((_returns) => [Device])
  @Authorized()
  async devices(@Ctx() ctx: Context): Promise<Device[]> {
    const userId = ctx.user.id;
    const result = await this.deviceService.getUserDevices(userId);
    return result.map((entry) => Device.from(entry));
  }

  @Mutation((_returns) => Device)
  @Authorized()
  async updateDeviceName(
    @Ctx() ctx: Context,
    @Arg('deviceId', (_type) => ID) deviceId: string,
    @Arg('name') name: string
  ): Promise<Device> {
    const userId = ctx.user.id;
    await this.deviceService.verifyUserOwnsDevice(deviceId, userId);
    const result = await this.deviceService.updateDeviceName(deviceId, name);
    return Device.from(result);
  }

  @Mutation((_returns) => Device)
  @Authorized()
  async updateDeviceRoom(
    @Ctx() ctx: Context,
    @Arg('deviceId', (_type) => ID) deviceId: string,
    @Arg('room') room: string
  ): Promise<Device> {
    const userId = ctx.user.id;
    await this.deviceService.verifyUserOwnsDevice(deviceId, userId);
    const result = await this.deviceService.updateDeviceRoom(deviceId, room);
    return Device.from(result);
  }

  @Mutation((_returns) => ID)
  @Authorized()
  async removeDevice(@Ctx() ctx: Context, @Arg('deviceId', (_type) => ID) deviceId: string): Promise<string> {
    const userId = ctx.user.id;
    await this.deviceService.verifyUserOwnsDevice(deviceId, userId);
    await this.deviceService.removeDevice(deviceId, userId);
    return deviceId;
  }

  @Mutation((_returns) => Device)
  @Authorized()
  async addDevice(
    @Ctx() ctx: Context,
    @Arg('input', (_type) => NewDeviceInput) input: NewDeviceInput
  ): Promise<Device> {
    const userId = ctx.user.id;
    const result = await this.deviceService.addDevice(input, userId);
    return Device.from(result);
  }

  @Mutation((_returns) => Boolean)
  @Authorized()
  async pairDevice(@Ctx() ctx: Context, @Arg('input') input: PairDeviceInput): Promise<boolean> {
    const userId = ctx.user.id;
    const { ip } = ctx;
    ctx.log.info('Pair device request', input);
    return this.deviceService.pairDevice(ctx.log, input.version, userId, ip);
  }
}
