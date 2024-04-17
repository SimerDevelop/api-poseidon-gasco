import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ResponseUtil } from 'src/utils/response.util';

@Injectable()
export class DepartmentService {

  constructor(
    @InjectRepository(Department) private departmentRepository: Repository<Department>,
  ) { }

  async create(departmentData: Department): Promise<any> {
    try {
      if (departmentData) {
        const newDepartment = this.departmentRepository.create({
          ...departmentData,
          id: uuidv4(), // Generar un nuevo UUID
          state: 'ACTIVO'
        });
        const createdDepartment = await this.departmentRepository.save(newDepartment);

        if (createdDepartment) {
          return ResponseUtil.success(
            200,
            'Departamento creado exitosamente',
            createdDepartment
          );
        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear el Departamento'
          );
        }
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al crear el Departamento'
      );
    }
  }

  async findAll(): Promise<any> {
    try {
      const departments = await this.departmentRepository.find({
        where: { state: 'ACTIVO' },
      });

      if (departments.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado Departamentos'
        );
      }

      return ResponseUtil.success(
        200,
        'Departamentos encontrados',
        departments
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los Departamentos'
      );
    }
  }

  async findOne(id: string) {
    try {
      const department = await this.departmentRepository.findOne({
        where: { id },
      });

      if (department) {
        return ResponseUtil.success(
          200,
          'Departamento encontrado',
          department
        );
      } else {
        return ResponseUtil.error(
          404,
          'Departamento no encontrado'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener el Departamento'
      );
    }
  }

  async update(id, departmentData) {
    try {
      const existingDepartment = await this.departmentRepository.findOne({
        where: { id },
      });

      if (!existingDepartment) {
        throw new NotFoundException('Departamento no encontrado');
      }

      const updatedDepartment = await this.departmentRepository.save({
        ...existingDepartment,
        ...departmentData,
      });

      return ResponseUtil.success(
        200,
        'Departamento actualizado exitosamente',
        updatedDepartment
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ResponseUtil.error(
          404,
          'Departamento no encontrado'
        );
      }
      return ResponseUtil.error(
        500,
        'Error al actualizar el Departamento'
      );
    }
  }

  async remove(id: string): Promise<any> {
    try {
      const existingDepartment = await this.departmentRepository.findOne({
        where: { id },
      });

      if (!existingDepartment) {
        return ResponseUtil.error(404, 'Departamento no encontrado');
      }

      existingDepartment.state = 'INACTIVO';
      const updatedDepartment = await this.departmentRepository.save(existingDepartment);

      if (updatedDepartment) {
        return ResponseUtil.success(
          200,
          'Departamento eliminado exitosamente',
          updatedDepartment
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar el Departamento'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar el Departamento'
      );
    }
  }

}
