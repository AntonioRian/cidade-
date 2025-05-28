import { IsEmail, IsString } from 'class-validator';

export class SignInDto {
  @IsEmail({}, { message: 'E-mail invalido' })
  email: string;

  @IsString()
  password: string;
}
