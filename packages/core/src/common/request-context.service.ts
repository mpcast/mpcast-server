import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { ConfigService } from '../config';

@Injectable()
export class RequestContextService {
    constructor(private configService: ConfigService) {
    }
}
