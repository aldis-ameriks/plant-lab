import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import { Context } from 'common/types/context';
import { UserSetting, UserSettingInput } from 'user/models';
import { UserService } from 'user/service';

@Resolver()
export class UserResolver {
  private readonly userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  @Authorized()
  @Query((_returns) => [UserSetting])
  userSettings(@Ctx() ctx: Context) {
    return this.userService.getUserSettings(ctx.user.id);
  }

  @Authorized()
  @Query((_returns) => UserSetting, { nullable: true })
  userSetting(@Ctx() ctx: Context, @Arg('name') name: string) {
    return this.userService.getUserSetting(ctx.user.id, name);
  }

  @Authorized()
  @Mutation((_returns) => UserSetting)
  updateUserSetting(@Ctx() ctx: Context, @Arg('input', (_type) => UserSettingInput) input: UserSettingInput) {
    return this.userService.updateUserSetting(ctx.user.id, input);
  }
}
