import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './entities/usuario.entity';
import { ApiKeyGuard } from 'src/auth/api-key.middleware';

@Controller('usuarios')
@UseGuards(ApiKeyGuard)
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) { }

  @Get('all')
  async findAll(): Promise<Usuario[]> {
    return this.usuariosService.findAll();
  }

  @Get('all/available/operators')
  async findAvaiableOperators(): Promise<Usuario[]> {
    return this.usuariosService.findAvaiableOperators();
  }

  @Get('all/operators')
  async findAllOperators(): Promise<Usuario[]> {
    return this.usuariosService.findAllOperators();
  }

  @Get('getById/:id')
  async findUserById(@Param('id') id: string): Promise<any> {
    return this.usuariosService.findUserById(id);
  }

  @Post('create')
  async createUser(@Body() userData: Usuario): Promise<Usuario> {
    return this.usuariosService.createUser(userData);
  }

  @Put('update/:id')
  async updateUser(@Param('id') id: string, @Body() userData: Usuario): Promise<any> {
    return this.usuariosService.updateUserById(id, userData);
  }

  @Post('login')
  async loginUser(@Body() loginData: { credentials: string; password: string }): Promise<any> {
    console.log('===================USUARIO LOGIN=====================');
    console.log(loginData);
    console.log('=====================================================');
    
    const { credentials, password } = loginData;    
    return this.usuariosService.loginUser(credentials, password);
  }

  @Delete('delete/:id')
  async deleteUser(@Param('id') id: string): Promise<any> {
    return this.usuariosService.deleteUserById(id);
  }

  @Delete('activate/:id')
  async activateUserById(@Param('id') id: string): Promise<any> {
    return this.usuariosService.activateUserById(id);
  }
}

