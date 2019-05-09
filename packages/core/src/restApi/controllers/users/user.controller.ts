import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';

import { formatOneMeta } from '../../../common/utils';
import { User } from '../../../entity';
import { UserService } from '../../../service';
import { UserDto } from '../../dtos/user.dto';
import { JwtAuthGuard } from '../../middleware/guards/auth.guard';

@Controller('users')
export class UserController {

  constructor(
    private readonly userService: UserService,
  ) {
  }

  @Post()
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
  @UseGuards(JwtAuthGuard)
  async oneself(@Req() request: any) {
    const user = await this.userService.findByIdentifier(request.user.identifier);
    if (user) {
      formatOneMeta(user);
      return user;
    }
    return null;
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.getDetailById(id);
  }
}
