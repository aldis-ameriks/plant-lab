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
  userSettings(@Ctx() ctx: Context): Promise<UserSetting[]> {
    return this.userService.getUserSettings(ctx.user.id);
  }

  @Authorized()
  @Query((_returns) => UserSetting, { nullable: true })
  userSetting(@Ctx() ctx: Context, @Arg('name') name: string): Promise<UserSetting> {
    return this.userService.getUserSetting(ctx.user.id, name);
  }

  @Authorized()
  @Mutation((_returns) => UserSetting)
  updateUserSetting(
    @Ctx() ctx: Context,
    @Arg('input', (_type) => UserSettingInput) input: UserSettingInput
  ): Promise<UserSetting> {
    return this.userService.updateUserSetting(ctx.user.id, input);
  }
}
