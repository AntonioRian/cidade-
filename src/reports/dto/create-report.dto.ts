import { User } from 'src/users/entities/user.entity';
import { ReportCategory } from '../enums/report-category.enum';
import { ReportStatus } from '../enums/report-status.enum';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty({ message: 'O titulo é obrigatório' })
  title: string;

  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  description: string;

  @IsNotEmpty({ message: 'A localização é obrigatória' })
  location: string;

  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  category: ReportCategory;

  @IsNotEmpty({ message: 'O status é obrigatório' })
  status: ReportStatus;

  @IsNotEmpty({ message: 'A imagem é obrigatória' })
  imageUrl: string;

  @IsNotEmpty({ message: 'O usuário é obrigatório' })
  userId: User['id'];
}
