import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsEmail, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email deve ter formato válido' })
  email?: string;

  @IsOptional()
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  password?: string;
}
