import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // IMPORTANTE: Registra a entidade User
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule], // Exporta o TypeOrmModule também
})
export class UsersModule {}
