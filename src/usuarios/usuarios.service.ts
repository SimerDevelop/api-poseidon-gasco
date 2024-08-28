import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { ResponseUtil } from 'src/utils/response.util';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario) private usuariosRepository: Repository<Usuario>,
  ) { }

  async createUser(userData: Usuario): Promise<any> {
    try {
      if (userData) {
        console.log(userData);
        // Verificar si ya existe un usuario con el numero de identificación
        const existingUser = await this.usuariosRepository
          .createQueryBuilder('usuario')
          .where('usuario.idNumber = :idNumber OR usuario.email = :email', { idNumber: userData.idNumber, email: userData.email})
          .getOne();

        if (existingUser) {
          return ResponseUtil.error(400, 'El numero de identificación o email ya esta registrado');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const newUser = this.usuariosRepository.create({
          ...userData,
          password: hashedPassword, // Asigna la contraseña cifrada
          id: uuidv4(), // Generar un nuevo UUID
          state: 'ACTIVO',
          status: 'DISPONIBLE'
        });
        const createdUser = await this.usuariosRepository.save(newUser);

        if (createdUser) {
          return ResponseUtil.success(
            200,
            'Usuario creado exitosamente',
            createdUser
          );
        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear el usuario'
          );
        }
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al crear el usuario',
        error.message
      );
    }
  }

  async loginUser(credentials: string, password: string): Promise<any> {
    try {
      const user = await this.usuariosRepository
        .createQueryBuilder('usuario')
        .leftJoinAndSelect('usuario.role', 'rol')
        .where('usuario.email = :credentials OR usuario.idNumber = :credentials', { credentials })
        .getOne();

      if (!user) {
        return ResponseUtil.error(
          404,
          'Usuario no encontrado'
        );
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return ResponseUtil.error(
          401,
          'Contraseña incorrecta'
        );
      }

      // Generar un token de acceso
      const accessToken = jwt.sign({ userId: user.id, key: 'poseidon-gasco.9010' }, 'poseidon', { expiresIn: '1h' });

      console.log('====================================Usuario logueado====================================');
      console.log(user);
      console.log('========================================================================================');

      return ResponseUtil.success(
        200,
        'Inicio de sesión exitoso',
        { user, accessToken } // Incluye el token en la respuesta
      );

    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al iniciar sesión'
      );
    }
  }

  async findAll(): Promise<any> {
    try {
      const users = await this.usuariosRepository
        .createQueryBuilder('usuario')
        .leftJoinAndSelect('usuario.role', 'rol')
        .getMany();

      if (users.length < 1) {
        return ResponseUtil.error(
          400,
          'Usuarios no encontrados',
        );
      } else {
        return ResponseUtil.success(
          200,
          'Usuarios encontrados',
          users
        );
      }

    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los usuarios'
      );
    }
  }

  async findAvaiableOperators(): Promise<any> {
    try {
      const users = await this.usuariosRepository
        .createQueryBuilder('usuario')
        .leftJoinAndSelect('usuario.role', 'rol')
        .where('rol.name = :role', { role: 'Operario' }) // Filtra por el rol "Operario"
        .andWhere('usuario.status = :status', { status: 'DISPONIBLE' }) // Filtra por el estado "DISPONIBLE"
        .getMany();

      if (users.length < 1) {
        return ResponseUtil.error(
          404, // Cambiado a 404 si no se encontraron usuarios
          'No se encontraron usuarios con el rol "Operario"'
        );

      }
      return ResponseUtil.success(
        200,
        'Usuarios encontrados',
        users
      );

    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los usuarios'
      );
    }
  }

  async findAllOperators(): Promise<any> {
    try {
      const users = await this.usuariosRepository
        .createQueryBuilder('usuario')
        .leftJoinAndSelect('usuario.role', 'rol')
        .where('rol.name = :role', { role: 'Operario' }) // Filtra por el rol "Operario"
        .andWhere('usuario.state = :state', { state: 'ACTIVO' }) // Filtra por el estado "DISPONIBLE"
        .getMany();

      if (users.length < 1) {
        return ResponseUtil.error(
          404, // Cambiado a 404 si no se encontraron usuarios
          'No se encontraron usuarios con el rol "Operario"'
        );

      }
      return ResponseUtil.success(
        200,
        'Usuarios encontrados',
        users
      );

    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los usuarios'
      );
    }
  }

  async deleteUserById(id: string): Promise<any> {
    try {
      const existingTablet = await this.usuariosRepository.findOne({
        where: { id },
      });

      if (!existingTablet) {
        return ResponseUtil.error(404, 'Usuario no encontrado');
      }

      existingTablet.state = 'INACTIVO';
      const updatedTablet = await this.usuariosRepository.save(existingTablet);

      if (updatedTablet) {
        return ResponseUtil.success(
          200,
          'Usuario eliminado exitosamente',
          updatedTablet
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar el Usuario'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar el Usuario'
      );
    }
  }

  async activateUserById(id: string): Promise<any> {
    try {
      const existingTablet = await this.usuariosRepository.findOne({
        where: { id },
      });

      if (!existingTablet) {
        return ResponseUtil.error(404, 'Usuario no encontrado');
      }

      existingTablet.state = 'ACTIVO';
      const updatedTablet = await this.usuariosRepository.save(existingTablet);

      if (updatedTablet) {
        return ResponseUtil.success(
          200,
          'Usuario eliminado exitosamente',
          updatedTablet
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar el Usuario'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar el Usuario'
      );
    }
  }

  async findUserById(id: string): Promise<any> {
    try {
      const user = await this.usuariosRepository
        .createQueryBuilder('usuario')
        .leftJoinAndSelect('usuario.role', 'rol')
        .leftJoinAndSelect('rol.permissions', 'permissions')
        .where('usuario.id = :id', { id })
        .getOne();

      if (user) {
        return ResponseUtil.success(
          200,
          'Usuario encontrado',
          user
        );
      } else {
        return ResponseUtil.error(
          404,
          'Usuario no encontrado'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener el usuario'
      );
    }
  }

  async updateUserById(id: string, userData: Usuario): Promise<any> {
    try {
      const existingUser = await this.usuariosRepository
        .createQueryBuilder('usuario')
        .leftJoinAndSelect('usuario.role', 'rol')
        .where('usuario.id = :id', { id })
        .getOne();

      if (!existingUser) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const updatedUser = await this.usuariosRepository.save({
        ...existingUser,
        ...userData,
        password: hashedPassword,
      });

      return ResponseUtil.success(
        200,
        'Usuario actualizado exitosamente',
        updatedUser
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ResponseUtil.error(
          404,
          'Usuario no encontrado'
        );
      }
      return ResponseUtil.error(
        500,
        'Error al actualizar el usuario'
      );
    }
  }

  ///////////////////////////////////////////////////////////////////////////


  async createMultiple(data: any): Promise<any> {
    const chunkSize = 500;
    const createdUsers = [];

    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const promises = chunk.map((item: any) => this.createUser(item));
      const responses = await Promise.all(promises);

      const successfulUsers = responses
        .filter(response => response.statusCode === 200)
        .map(response => response.data.id);

      createdUsers.push(...successfulUsers);
    }

    return ResponseUtil.success(
      200,
      'Usuarios creados exitosamente',
      createdUsers
    );
  }
}



