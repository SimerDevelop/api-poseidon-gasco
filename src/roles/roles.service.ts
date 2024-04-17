import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseUtil } from 'src/utils/response.util';
import { v4 as uuidv4 } from 'uuid';
import { Roles } from './entities/roles.entity';
import { Permissions } from 'src/permissions/entities/permission.entity'

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Roles) private rolesRepository: Repository<Roles>,
        @InjectRepository(Permissions) private permissionsRepository: Repository<Permissions>
    ) { }

    async findAll(): Promise<any> {
        try {
            const roles = await this.rolesRepository.find({
                where: { state: 'ACTIVO' },
                relations: ['permissions'], // Cargar relaciones
            });

            if (roles) {
                return ResponseUtil.success(
                    200,
                    'Roles encontrados',
                    roles
                );
            }
        } catch (error) {
            return ResponseUtil.error(
                500,
                'Error al obtener los roles'
            );
        }
    }

    async findOne(id): Promise<any> {
        try {
            const role = await this.rolesRepository.findOne({
                where: { id },
                relations: ['permissions'], // Cargar relaciones
            });

            if (role) {
                return ResponseUtil.success(
                    200,
                    'Rol encontrado',
                    role
                );
            } else {
                return ResponseUtil.error(
                    404,
                    'Rol no encontrado'
                );
            }
        } catch (error) {
            return ResponseUtil.error(
                500,
                'Error al obtener el rol'
            );
        }
    }

    async create(rolesData: Roles): Promise<any> {
        try {
            if (rolesData) {
                // Verificar si ya existe un rol con el mismo nombre
                const existingRole = await this.rolesRepository.findOne({
                    where: { name: rolesData.name },
                    relations: ['permissions'], // Cargar relaciones
                });

                if (existingRole) {
                    return ResponseUtil.error(
                        400,
                        'El rol ya existe'
                    );
                }

                const permissions = await this.permissionsRepository.findByIds(
                    rolesData.permissions
                );

                const newRole = this.rolesRepository.create({
                    ...rolesData,
                    id: uuidv4(), // Generar un nuevo UUID
                    state: 'ACTIVO',
                    permissions: permissions
                });

                // Guarda el nuevo rol en la base de datos
                const createdRole = await this.rolesRepository.save(newRole);

                if (createdRole) {
                    return ResponseUtil.success(
                        200,
                        'Rol creado exitosamente',
                        createdRole
                    );
                }

            }

        } catch (error) {
            return ResponseUtil.error(
                500,
                'Error al crear el Rol'
            );
        }
    }

    async remove(id: string): Promise<any> {
        try {
            const existingRol = await this.rolesRepository.findOne({
                where: { id },
            });

            if (!existingRol) {
                return ResponseUtil.error(404, 'Rol no encontrado');
            }

            existingRol.state = 'INACTIVO'; // Cambiar el estado a 'INACTIVO'
            const updatedRol = await this.rolesRepository.save(existingRol);

            if (updatedRol) {
                return ResponseUtil.success(
                    200,
                    'Rol eliminado exitosamente',
                    updatedRol
                );
            } else {
                return ResponseUtil.error(
                    500,
                    'Ha ocurrido un problema al eliminar el Rol'
                );
            }
        } catch (error) {
            return ResponseUtil.error(
                500,
                'Error al eliminar el Rol'
            );
        }
    }

    async update(id, roleData) {
        try {
            const existingRol = await this.rolesRepository.findOne({
                where: { id },
            });

            if (!existingRol) {
                throw new NotFoundException('Rol no encontrado');
            }

            // Obtén los permisos a partir de los IDs proporcionados en roleData.permissions
            const permissions = await this.permissionsRepository.findByIds(
                roleData.permissions
            );

            // Actualiza el rol con los datos proporcionados y la lista de permisos
            const updatedUser = await this.rolesRepository.save({
                ...existingRol,
                ...roleData,
                permissions: permissions, // Asigna los nuevos permisos al rol
            });

            return ResponseUtil.success(
                200,
                'Rol actualizado exitosamente',
                updatedUser
            );
        } catch (error) {
            if (error instanceof NotFoundException) {
                return ResponseUtil.error(
                    404,
                    'Rol no encontrado'
                );
            }
            return ResponseUtil.error(
                500,
                'Error al actualizar el Rol'
            );
        }
    }

}
