import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class ReportResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  category: string;

  @Expose()
  status: string;

  @Expose()
  image?: string;

  @Type(() => UserResponseDto)
  @Expose()
  user: UserResponseDto;
}
