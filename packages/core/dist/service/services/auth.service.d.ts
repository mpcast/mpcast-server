import { JwtService } from '@nestjs/jwt';
import { Connection } from 'typeorm';
import { ID } from '../../common/shared-types';
import { ITokenResult } from '../../common/types/common-types';
import { UserEntity } from '../../entity';
import { PasswordCiper } from '../helpers/password-cipher/password-ciper';
export declare class AuthService {
    private connection;
    private passwordCipher;
    private readonly jwtService;
    constructor(connection: Connection, passwordCipher: PasswordCiper, jwtService: JwtService);
    validateAuthData(payload: any): Promise<any>;
    authenticate(identifier: string, password: string): Promise<ITokenResult>;
    verifyUserPassword(userId: ID, password: string): Promise<boolean>;
    getUserFromIdentifier(identifier: string): Promise<UserEntity>;
}
