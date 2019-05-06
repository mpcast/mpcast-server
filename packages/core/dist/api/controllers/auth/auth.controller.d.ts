import { ITokenResult } from '../../../common/types/common-types';
import { IQueryParamsResult } from '../../../decorators/query-params.decorator';
import { AuthService } from '../../../service';
import { AuthLogin } from '../../dtos/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    createToken({ visitors: { ip } }: IQueryParamsResult, body: AuthLogin): Promise<ITokenResult>;
    getUser(req: any): Promise<import("../../../entity/index").UserEntity>;
    checkToken(): string;
}
