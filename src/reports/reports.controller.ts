import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  MaxFileSizeValidator,
  FileTypeValidator,
  UploadedFile,
  ParseFilePipe,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportResponseDto } from './dto/report-response.dto';
import { Role } from 'src/auth/enum/role.enum';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from 'src/storage/storage.service';
import { TransformInterceptor } from 'src/common/interceptors/transform.interceptor';
import { ResponseClass } from 'src/common/decorators/response-class.decorator';

@Controller('reports')
@UseInterceptors(TransformInterceptor) // Aplica o interceptor para todo o controller
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly storageService: StorageService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ResponseClass(ReportResponseDto) // Define qual DTO usar
  async create(
    @Body() createReportDto: CreateReportDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
        fileIsRequired: false,
      }),
    )
    image?: Express.Multer.File,
  ) {
    let imageUrl: string;
    if (image) {
      imageUrl = await this.storageService.uploadFile(image);
      createReportDto.image = imageUrl;
    }

    return this.reportsService.create(createReportDto);
  }

  @Roles(Role.Admin)
  @Get()
  @ResponseClass(ReportResponseDto)
  findAll() {
    return this.reportsService.findAll();
  }

  @Get('/todos/:id')
  @ResponseClass(ReportResponseDto)
  async findAllByUser(@Param('id') id: string) {
    return await this.reportsService.findAllByUserId(Number(id));
  }

  @Roles(Role.Admin, Role.Secretaria)
  @Patch(':id')
  @ResponseClass(ReportResponseDto)
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.update(+id, updateReportDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportsService.remove(+id);
  }
}
