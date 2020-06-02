import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';

import { Context } from 'common/types/context';
import { UserSetting, UserSettingInput } from 'user/models';
import { UserService } from 'user/service';

@Service()
@Resolver()
export class UserResolver {
  @Inject()
  private readonly userService: UserService;

  @Authorized()
  @Query((_returns) => [UserSetting])
  async userSettings(@Ctx() ctx: Context): Promise<UserSetting[]> {
    const result = await this.userService.getUserSettings(ctx.user.id);
    return result.map((entry) => UserSetting.from(entry));
  }

  @Authorized()
  @Query((_returns) => UserSetting, { nullable: true })
  async userSetting(@Ctx() ctx: Context, @Arg('name') name: string): Promise<UserSetting> {
    const result = await this.userService.getUserSetting(ctx.user.id, name);
    return result ? UserSetting.from(result) : undefined;
  }

  @Authorized()
  @Mutation((_returns) => UserSetting)
  async updateUserSetting(
    @Ctx() ctx: Context,
    @Arg('input', (_type) => UserSettingInput) input: UserSettingInput
  ): Promise<UserSetting> {
    const result = await this.userService.updateUserSetting(ctx.user.id, input);
    return UserSetting.from(result);
  }
}
