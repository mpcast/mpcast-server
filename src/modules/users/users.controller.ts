import { Users } from '@app/entity';
import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '@app/modules/users/users.service';
import { CreateUserDto } from '@app/modules/users/user.dto';
import { JwtAuthGuard } from '@app/guards/auth.guard';
import { Request } from 'express';

// import {CreateUserInput} from "@app/modules/users/user.interface";

@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService,
  ) {
  }

  @Post()
  createUser(@Body() userInput: CreateUserDto): Promise<Users> {
    return this.usersService.create({
      identifier: userInput.identifier,
      passwordHash: userInput.passwordHash,
    });
  }
  // @Get(':type')
  // findByType(@Param('type') type: string): Promise<Users> {
  //     return this.usersService.getDetailById(id);
  // }
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async oneself(@Req() request): Promise<Users> {
    const user = await this.usersService.findByIdentifier(request.user);
    if (user) {
      return user;
    }
    return null;
  }
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Users> {
    return this.usersService.getDetailById(id);
  }
}
