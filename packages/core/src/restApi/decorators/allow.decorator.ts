import { SetMetadata } from '@nestjs/common';

import { Permission } from '../../common/generated-types';

export const PERMISSIONS_METADATA_KEY = '__permissions__';

export const Allow = (...permissions: Permission[]) =>
    SetMetadata(PERMISSIONS_METADATA_KEY, permissions);
