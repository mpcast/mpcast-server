import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class AuthLogin {
  @IsDefined()
  @IsNotEmpty({ message: '用户名？' })
  @IsString({ message: '字符串？' })
  identifier: string;

  @IsDefined()
  @IsNotEmpty({ message: '密码？' })
  @IsString({ message: '字符串？' })
  password: string;
}
