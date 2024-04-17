import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './entities/usuario.entity';

@Controller('usuarios')
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) { }

  /**
   * Obtiene una lista de todos los usuarios en la base de datos.
   * @returns Una lista de usuarios.
   */
  @Get('all')
  async findAll(): Promise<Usuario[]> {
    return this.usuariosService.findAll();
  }

  /**
 * Obtiene una lista de todos los operarios en la base de datos.
 * @returns Una lista de operarios.
 */
  @Get('all/available/operators')
  async findAvaiableOperators(): Promise<Usuario[]> {
    return this.usuariosService.findAvaiableOperators();
  }

  /**
 * Obtiene una lista de todos los operarios en la base de datos.
 * @returns Una lista de operarios.
 */
  @Get('all/operators')
  async findAllOperators(): Promise<Usuario[]> {
    return this.usuariosService.findAllOperators();
  }

  /**
 * Obtiene un usuario por su ID.
 * @param id - ID del usuario a buscar.
 * @returns Información sobre el resultado de la operación.
 */
  @Get('getById/:id')
  async findUserById(@Param('id') id: string): Promise<any> {
    return this.usuariosService.findUserById(id);
  }

  /**
   * Crea un nuevo usuario en la base de datos.
   * @param userData - Datos del usuario a crear.
   * @returns Información sobre el resultado de la operación.
   */
  @Post('create')
  async createUser(@Body() userData: Usuario): Promise<Usuario> {
    return this.usuariosService.createUser(userData);
  }

  /**
  * Actualiza un usuario por su ID.
  * @param id - ID del usuario a actualizar.
  * @param userData - Nuevos datos del usuario.
  * @returns Información sobre el resultado de la operación.
  */
  @Put('update/:id')
  async updateUser(@Param('id') id: string, @Body() userData: Usuario): Promise<any> {
    return this.usuariosService.updateUserById(id, userData);
  }

  /**
   * Inicia sesión de un usuario.
   * @param loginData - Datos de inicio de sesión (correo y contraseña).
   * @returns Información sobre el resultado de la operación.
   */
  @Post('login')
  async loginUser(@Body() loginData: { credentials: string; password: string }): Promise<any> {
    console.log('===================USUARIO LOGIN=====================');
    console.log(loginData);
    console.log('=====================================================');
    
    const { credentials, password } = loginData;    
    return this.usuariosService.loginUser(credentials, password);
  }

  /**
  * Elimina un usuario por su ID.
  * @param id - ID del usuario a eliminar.
  * @returns Información sobre el resultado de la operación.
  */
  @Delete('delete/:id')
  async deleteUser(@Param('id') id: string): Promise<any> {
    return this.usuariosService.deleteUserById(id);
  }

  @Delete('activate/:id')
  async activateUserById(@Param('id') id: string): Promise<any> {
    return this.usuariosService.activateUserById(id);
  }
}

