import { UserEntity } from '@app/entity';
import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from '@app/modules/users/user.service';
import { CreateUserDto } from '@app/modules/users/user.dto';
import { JwtAuthGuard } from '@app/guards/auth.guard';

@Controller('user')
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
    const user = await this.userService.findByIdentifier(request.user);
    if (user) {
      return user;
    }
    return null;
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<UserEntity> {
    return this.userService.getDetailById(id);
  }
}
