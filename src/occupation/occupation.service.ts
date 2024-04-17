import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Occupation } from './entities/occupation.entity';
import { ResponseUtil } from 'src/utils/response.util';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OccupationService {
  constructor(
    @InjectRepository(Occupation) private occupationRepository: Repository<Occupation>,
  ) { }

  async create(ocuppationData: Occupation): Promise<any> {
    try {

      const existingOccupation = await this.occupationRepository.findOne({
        where: { name: ocuppationData.name },
      });

      if (existingOccupation) {
        return ResponseUtil.error(
          400, 'La Ocupación ya existe'
        );
      }

      if (ocuppationData) {
        const newOccupation = this.occupationRepository.create({
          ...ocuppationData,
          id: uuidv4(), // Generar un nuevo UUID
          state: 'ACTIVO',
        });

        const createdOccupation = await this.occupationRepository.save(newOccupation);

        if (createdOccupation) {
          return ResponseUtil.success(
            200,
            'Ocupación creada exitosamente',
            createdOccupation
          );
        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear la Ocupación'
          );
        }
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al crear la Ocupación'
      );
    }
  }

  async findAll(): Promise<any> {
    try {
      const occupations = await this.occupationRepository.find({
        where: { state: 'ACTIVO' },
      });

      if (occupations.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado Ocupaciones'
        );
      }

      return ResponseUtil.success(
        200,
        'Ocupaciones encontradas',
        occupations
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener las Ocupaciones'
      );
    }
  }

  async findOne(id: string) {
    try {
      const occupation = await this.occupationRepository.findOne({
        where: { id },
      });

      if (occupation) {
        return ResponseUtil.success(
          200,
          'Ocupación encontrada',
          occupation
        );
      } else {
        return ResponseUtil.error(
          404,
          'Ocupación no encontrada'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener la Ocupación'
      );
    }
  }

  async update(id, occupationData) {
    try {
      const existingOccupation = await this.occupationRepository.findOne({
        where: { id },
      });

      if (!existingOccupation) {
        return ResponseUtil.error(
          400,
          'Ocupación no encontrada'
        );
      }

      const updatedOccupation = await this.occupationRepository.save({
        ...existingOccupation,
        ...occupationData,
      });

      return ResponseUtil.success(
        200,
        'Ocupación actualizada exitosamente',
        updatedOccupation
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ResponseUtil.error(
          404,
          'Ocupación no encontrada'
        );
      }
      return ResponseUtil.error(
        500,
        'Error al actualizar la Ocupación'
      );
    }
  }

  async remove(id: string): Promise<any> {
    try {
      const existingOccupation = await this.occupationRepository.findOne({
        where: { id },
      });

      if (!existingOccupation) {
        return ResponseUtil.error(404, 'Ocupación no encontrada');
      }

      existingOccupation.state = 'INACTIVO';
      const updatedOccupation = await this.occupationRepository.save(existingOccupation);

      if (updatedOccupation) {
        return ResponseUtil.success(
          200,
          'Ocupación eliminada exitosamente',
          updatedOccupation
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar la Ocupación'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar la Ocupación'
      );
    }
  }
}
