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
import { Role } from 'src/auth/enum/role.enum';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from 'src/storage/storage.service';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly storageService: StorageService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createReportDto: CreateReportDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
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
  findAll() {
    return this.reportsService.findAll();
  }

  @Get('todos/:id')
  async findAllByUser(@Param('id') id: string) {
    return await this.reportsService.findAllByUserId(Number(id));
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
