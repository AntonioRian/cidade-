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

export enum ReportCategory {
  ANIMAL = 'Animal',
  INFRAESTRUTURA = 'Infraestrutura',
  ENERGIA = 'Energia',
  AGUA = 'Água',
  SUJEIRA = 'Sujeira',
  AMBIENTAL = 'Ambiental',
}

export enum ReportStatus {
  AVALIACAO = 'avaliação',
  ABERTO = 'aberto',
  SOLUCIONADO = 'solucionado',
  RECUSADO = 'recusado',
  CONCLUIDO = 'concluído',
  URGENTE = 'urgente',
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ length: 300, nullable: false })
  location: string;

  @Column({
    type: 'enum',
    enum: ReportCategory,
    nullable: false,
  })
  category: ReportCategory;

  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.AVALIACAO,
    nullable: false,
  })
  status: ReportStatus;

  @Column({ length: 500, nullable: true })
  imageUrl: string;

  @Column({ nullable: false })
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
