import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseUtil } from 'src/utils/response.util';
import { v4 as uuidv4 } from 'uuid';
import { Permissions } from './entities/permission.entity';


@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permissions) private permissionsRepository: Repository<Permissions>,
  ) { }


  async create(permissionData: Permissions): Promise<any> {
    try {
      if (permissionData) {
        // Verificar si ya existe un permiso con el mismo nombre
        const existingUser = await this.permissionsRepository.findOne({
          where: { name: permissionData.name },
        });

        if (existingUser) {
          return ResponseUtil.error(400, 'El permiso ya existe');
        }

        const newPermission = this.permissionsRepository.create({
          ...permissionData,
          id: uuidv4(), // Generar un nuevo UUID
          state: 'ACTIVO'
        });
        const createdPermission = await this.permissionsRepository.save(newPermission);

        if (createdPermission) {
          return ResponseUtil.success(
            200,
            'Permiso creado exitosamente',
            createdPermission
          );
        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear el Permiso'
          );
        }
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al crear el Permiso'
      );
    }
  }

  async findAll(): Promise<any> {
    try {
      const permissions = await this.permissionsRepository.find({ where: { state: 'ACTIVO' } });

      if (permissions) {
        return ResponseUtil.success(
          200,
          'Permisos encontrados',
          permissions
        );
      }

    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los permisos'
      );
    }
  }

  async findPermissionById(id: string) {
    try {
      const permission = await this.permissionsRepository.findOneBy({
        id: id
      });

      if (permission) {
        return ResponseUtil.success(
          200,
          'permiso encontrado',
          permission
        );
      } else {
        return ResponseUtil.error(
          404,
          'permiso no encontrado'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener el permiso'
      );
    }
  }

  async updatePermissionById(id, permissionData) {
    try {
      const existingPermission = await this.permissionsRepository.findOne({
        where: { id },
      });

      if (!existingPermission) {
        throw new NotFoundException('Permiso no encontrado');
      }

      const updatedUser = await this.permissionsRepository.save({
        ...existingPermission,
        ...permissionData,
      });

      return ResponseUtil.success(
        200,
        'Permiso actualizado exitosamente',
        updatedUser
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ResponseUtil.error(
          404,
          'Permiso no encontrado'
        );
      }
      return ResponseUtil.error(
        500,
        'Error al actualizar el Permiso'
      );
    }
  }

  async deletePermission(id: string): Promise<any> {
    try {
      const existingPermission = await this.permissionsRepository.findOne({
        where: { id },
      });

      if (!existingPermission) {
        return ResponseUtil.error(404, 'Permiso no encontrado');
      }

      existingPermission.state = 'INACTIVO';
      const updatedPermission = await this.permissionsRepository.save(existingPermission);

      if (updatedPermission) {
        return ResponseUtil.success(
          200,
          'Permiso eliminado exitosamente',
          updatedPermission
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar el Permiso'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar el Permiso'
      );
    }
  }
  
}
