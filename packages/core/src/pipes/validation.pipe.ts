import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { ValidationError } from '../common/errors/validation.error';

/**
 * @class ValidationPipe
 * @classdesc 验证所有使用 class-validator 的地方的 class 模型
 */
@Injectable()
export class ValidationPipe implements PipeTransform<any> {

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const errorMessage = errors.map(error => Object.values(error.constraints).join(';')).join(';');
      throw new ValidationError(errorMessage);
    }
    return value;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find(type => metatype === type);
  }
}
