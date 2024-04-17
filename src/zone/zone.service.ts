import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Zone } from './entities/zone.entity';
import { Repository } from 'typeorm';
import { ResponseUtil } from 'src/utils/response.util';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ZoneService {
  constructor(
    @InjectRepository(Zone) private zoneRepository: Repository<Zone>,
  ) { }

  async create(zoneData: Zone): Promise<any> {
    try {
      if (zoneData) {
        const newZone = this.zoneRepository.create({
          ...zoneData,
          id: uuidv4(), // Generar un nuevo UUID
          state: 'ACTIVO'
        });
        const createdZone = await this.zoneRepository.save(newZone);

        if (createdZone) {
          return ResponseUtil.success(
            200,
            'Zona creada exitosamente',
            createdZone
          );
        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear la Zona'
          );
        }
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al crear la Zona'
      );
    }
  }

  async findAll(): Promise<any> {
    try {
      const zones = await this.zoneRepository.find({ where: { state: 'ACTIVO' } });

      if (zones.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado zonas'
        );
      }

      return ResponseUtil.success(
        200,
        'Zonas encontradas',
        zones
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener las Zonas'
      );
    }
  }

  async findOne(id: string) {
    try {
      const zone = await this.zoneRepository.findOneBy({
        id: id
      });

      if (zone) {
        return ResponseUtil.success(
          200,
          'Zona encontrada',
          zone
        );
      } else {
        return ResponseUtil.error(
          404,
          'Zona no encontrada'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener la Zona'
      );
    }
  }

  async update(id, zoneData) {
    try {
      const existingZone = await this.zoneRepository.findOne({
        where: { id },
      });

      if (!existingZone) {
        throw new NotFoundException('Zona no encontrada');
      }

      const updatedZone = await this.zoneRepository.save({
        ...existingZone,
        ...zoneData,
      });

      return ResponseUtil.success(
        200,
        'Zona actualizada exitosamente',
        updatedZone
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ResponseUtil.error(
          404,
          'Zona no encontrada'
        );
      }
      return ResponseUtil.error(
        500,
        'Error al actualizar la Zona'
      );
    }
  }

  async remove(id: string): Promise<any> {
    try {
      const existingZone = await this.zoneRepository.findOne({
        where: { id },
      });

      if (!existingZone) {
        return ResponseUtil.error(404, 'Zona no encontrada');
      }

      existingZone.state = 'INACTIVO';
      const updatedZone = await this.zoneRepository.save(existingZone);

      if (updatedZone) {
        return ResponseUtil.success(
          200,
          'Zona eliminada exitosamente',
          updatedZone
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar la Zona'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar la Zona'
      );
    }
  }
}
