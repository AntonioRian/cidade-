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
  Query,
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
import { ReportCategory } from './enums/report-category.enum';
import { FilterReportDto } from './dto/filter-report.dto';

@Controller('reports')
@UseInterceptors(TransformInterceptor)
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly storageService: StorageService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ResponseClass(ReportResponseDto)
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

  @Get('/search')
  @ResponseClass(ReportResponseDto)
  findByFilter(@Query() filterDto: FilterReportDto) {
    return this.reportsService.findByFilter(filterDto);
  }

  @Roles(Role.Admin, Role.Secretaria)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.update(+id, updateReportDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportsService.remove(+id);
  }
}
