import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ReportStatus } from '../enums/report-status.enum';
import { ReportCategory } from '../enums/report-category.enum';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ length: 500, nullable: false })
  location: string;

  @Column({
    type: 'text',
    enum: ReportCategory,
    nullable: false,
  })
  category: ReportCategory;

  @Column({
    type: 'text',
    enum: ReportStatus,
    default: ReportStatus.AVALIACAO,
    nullable: false,
  })
  status: ReportStatus;

  @Column({ length: 500, nullable: true })
  image: string;

  @Column({ nullable: false })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
