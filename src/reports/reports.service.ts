import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { UsersService } from 'src/users/user.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportRepository: Repository<Report>,
    private userService: UsersService,
  ) {}

  async create(createReportDto: CreateReportDto) {
    const reportEntity = this.reportRepository.create({
      ...createReportDto,
    });

    const newReport = await this.reportRepository.save(reportEntity);

    return newReport;
  }

  async findAll() {
    return await this.reportRepository.find({
      relations: {
        user: true,
      },
    });
  }

  async findAllByUserId(id: number): Promise<Report[]> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const response = await this.reportRepository.find({
      where: { userId: user.id },
    });
    return response || [];
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
