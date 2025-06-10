import { IsEnum, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ReportCategory } from '../enums/report-category.enum';
import { ReportStatus } from '../enums/report-status.enum';

export class FilterReportDto {
  @IsOptional()
  @IsEnum(ReportStatus, { message: 'O status fornecido não é válido.' })
  status?: ReportStatus;

  @IsOptional()
  @IsEnum(ReportCategory, { message: 'A categoria fornecida não é válida.' })
  category?: ReportCategory;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
