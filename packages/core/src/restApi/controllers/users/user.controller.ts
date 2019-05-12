import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Permission } from '../../../common/generated-types';

import { formatOneMeta } from '../../../common/utils';
import { User } from '../../../entity';
import { UserService } from '../../../service';
import { Allow } from '../../decorators/allow.decorator';
import { UserDto } from '../../dtos/user.dto';

@Controller('users')
export class UserController {

  constructor(
    private readonly userService: UserService,
  ) {
  }

  @Post()
  @Allow(Permission.CreateCustomer)
  createUser(@Body() userInput: UserDto): Promise<User> {
    return this.userService.create({
      ...userInput,
    });
  }

  // @Get(':type')
  // findByType(@Param('type') type: string): Promise<Users> {
  //     return this.userService.getDetailById(id);
  // }
  @Get('me')
  // @UseGuards(JwtAuthGuard)
  @Allow(Permission.Owner)
  async oneself(@Req() request: any) {
    const user = await this.userService.findByIdentifier(request.user.identifier);
    if (user) {
      formatOneMeta(user);
      return user;
    }
    return null;
  }

  @Get(':id')
  @Allow(Permission.Authenticated)
  findOne(@Param('id') id: number) {
    return this.userService.getDetailById(id);
  }
}
