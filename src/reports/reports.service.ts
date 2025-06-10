import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { UsersService } from 'src/users/user.service';
import { ReportCategory } from './enums/report-category.enum';
import { ReportStatus } from './enums/report-status.enum';
import { FilterReportDto } from './dto/filter-report.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportRepository: Repository<Report>,
    private userService: UsersService,
  ) {}

  async create(createReportDto: CreateReportDto) {
    if (createReportDto.category === ReportCategory.AMBIENTAL) {
      createReportDto.status = ReportStatus.URGENTE;
    }
    const reportEntity = this.reportRepository.create({
      ...createReportDto,
    });

    const newReport = await this.reportRepository.save(reportEntity);
    return newReport;
  }

  @Roles(Role.Admin)
  async findAll() {
    const reports = await this.reportRepository.find({
      relations: { user: true },
    });

    return reports;
  }

  async findAllByUserId(id: number) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const reports = await this.reportRepository.find({
      where: { userId: user.id },
      relations: { user: true },
    });

    return reports;
  }

  async findByFilter(filterDto: FilterReportDto) {
    const { status, category } = filterDto;
    const query = this.reportRepository.createQueryBuilder('report');

    query.where('report.status = :status OR report.category = :category', {
      status,
      category,
    });

    return await query.getMany();
  }

  async update(id: number, updateReportDto: UpdateReportDto) {
    const reportToUpdate = await this.reportRepository.findOneBy({ id });
    if (!reportToUpdate) {
      throw new Error('Reporte não encontrado');
    }

    await this.reportRepository.update(id, updateReportDto);
    return {
      report: reportToUpdate,
      message: 'O reporte foi atualizado com sucesso!',
    };
  }

  async remove(id: number) {
    const reportToDelete = await this.reportRepository.findOneBy({ id });
    if (!reportToDelete) {
      throw new Error('Reporte não encontrado');
    }

    await this.reportRepository.delete(id);
    return {
      report: reportToDelete,
      message: 'O reporte foi deletado com sucesso!',
    };
  }
}
