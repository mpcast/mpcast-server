import { JwtService } from '@nestjs/jwt';
import { CacheService } from '../../../cache/cache.service';
import { UserService } from '../../../service';
export declare class WechatController {
    private readonly jwtService;
    private readonly usersService;
    private readonly cacheService;
    private wechatConfig;
    private wx;
    private mp;
    constructor(jwtService: JwtService, usersService: UserService, cacheService: CacheService);
    login(code: string): Promise<{
        token: string;
        expires_in: unknown;
    } | undefined>;
    verifySignature(req: any, body: {
        rawData: string;
        signature: string;
    }): Promise<string>;
    decryptData(req: any, body: {
        encryptedData: string;
        iv: string;
    }): Promise<object | undefined>;
    check(body: {
        rawData: string;
        signature: string;
    }): boolean;
    me(req: any): void;
}
