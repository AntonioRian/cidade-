import { User } from 'src/users/entities/user.entity';
import { ReportCategory } from '../enums/report-category.enum';
import { ReportStatus } from '../enums/report-status.enum';
import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty({ message: 'O titulo é obrigatório' })
  title: string;

  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  description: string;

  @IsNotEmpty({ message: 'A localização é obrigatória' })
  location: string;

  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  @IsEnum(ReportCategory, { message: 'Categoria deve ser um valor válido' })
  category: ReportCategory;

  @IsOptional()
  @IsEnum(ReportStatus, { message: 'Status deve ser um valor válido' })
  status?: ReportStatus;

  @IsOptional()
  image?: string;

  @IsNotEmpty({ message: 'O usuário é obrigatório' })
  userId: User['id'];
}
