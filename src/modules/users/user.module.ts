import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Users} from '@app/entity';
import {UsersController} from '@app/modules/users/users.controller';
import {UsersService} from '@app/modules/users/users.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Users,
        ]),
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UserModule {
}
