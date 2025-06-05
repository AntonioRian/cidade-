import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/auth/decorator/public.decorator';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.usersService.create(createUserDto);
    return {
      statusCode: 201,
      message: 'Usuario criado com sucesso',
      data: newUser,
    };
  }

  @Roles(Role.Admin)
  @Get()
  async getAll() {
    return await this.usersService.findAll();
  }

  @Get(':email')
  async findUser(@Param('email') email: string) {
    const user = await this.usersService.findOne(undefined, email);
    return {
      statusCode: 200,
      data: user,
    };
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    return {
      statusCode: 200,
      data: user,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.update(+id, updateUserDto);
    return {
      statusCode: 200,
      message: 'Usuario atualizado com sucesso',
      data: updatedUser,
    };
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedUser = await this.usersService.remove(+id);
    return {
      statusCode: 200,
      message: deletedUser,
    };
  }
}
