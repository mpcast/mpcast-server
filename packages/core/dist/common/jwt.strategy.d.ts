import { Strategy } from 'passport-jwt';
import { AuthService } from '../service';
declare const JwtStrategy_base: new (...args: any[]) => typeof Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(payload: any): Promise<any>;
}
export {};
