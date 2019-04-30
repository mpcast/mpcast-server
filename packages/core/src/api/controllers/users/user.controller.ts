import { CreateUserDto } from '../../dtos/user.dto';
import { JwtAuthGuard } from '../../middleware/guards/auth.guard';
import { formatOneMeta } from '../../../common/utils';
import { UserEntity } from '../../../entity';
import { UserService } from '../../../service';
import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';

@Controller('users')
export class UserController {

  constructor(
    private readonly userService: UserService,
  ) {
  }

  @Post()
  createUser(@Body() userInput: CreateUserDto): Promise<UserEntity> {
    return this.userService.create({
      identifier: userInput.identifier,
      passwordHash: userInput.passwordHash,
    });
  }

  // @Get(':type')
  // findByType(@Param('type') type: string): Promise<Users> {
  //     return this.userService.getDetailById(id);
  // }
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async oneself(@Req() request): Promise<UserEntity> {
    const user = await this.userService.findByIdentifier(request.user.identifier);
    if (user) {
      formatOneMeta(user);
      return user;
    }
    return null;
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<UserEntity> {
    return this.userService.getDetailById(id);
  }
}
