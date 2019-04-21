import { IsString, IsDefined, IsNotEmpty } from 'class-validator';

export class AuthLogin {
  @IsDefined()
  @IsNotEmpty({ message: '密码？' })
  @IsString({ message: '字符串？' })
  password: string;
}
