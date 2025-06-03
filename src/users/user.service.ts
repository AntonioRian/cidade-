import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HashPassword } from 'src/common/utils/hashPassword';
import { Role } from 'src/common/enum/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new Error('O email já está em uso');
    }

    const hashedPassword = await HashPassword.hashPassword(
      createUserDto.password,
    );

    const userData = {
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role || Role.User,
    };

    return this.usersRepository.save(userData);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id?: number, email?: string): Promise<User> {
    try {
      const whereCondition: any = {};

      if (id !== undefined) {
        whereCondition.id = id;
      }

      if (email !== undefined) {
        whereCondition.email = email;
      }

      if (Object.keys(whereCondition).length === 0) {
        throw new Error(
          'É necessário fornecer pelo menos um critério de busca (id ou email)',
        );
      }

      const user = await this.usersRepository.findOne({
        where: whereCondition,
      });

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return user;
    } catch (erro) {
      throw new Error(erro.message || 'Usuário não encontrado');
    }
  }

  async update(id: number, updateUser: UpdateUserDto): Promise<User | null> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new Error('Usuário não encontrado');
      }
      const updatedUser = await this.usersRepository.update(id, updateUser);
      console.log(updatedUser);
      return await this.usersRepository.findOne({ where: { id } });
    } catch (erro) {
      throw new Error('Usuário não foi atualizado');
    }
  }

  async remove(id: number): Promise<string> {
    try {
      const userToRemove = await this.findOne(id);
      await this.usersRepository.remove(userToRemove);
      return 'Usuário removido com sucesso';
    } catch (erro) {
      throw new Error('Usuário não foi removido');
    }
  }
}
