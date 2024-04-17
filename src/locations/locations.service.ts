import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ResponseUtil } from 'src/utils/response.util';
import { BranchOffices } from 'src/branch-offices/entities/branch-office.entity';

@Injectable()
export class LocationsService {

  constructor(
    @InjectRepository(Location) private locationRepository: Repository<Location>,
    @InjectRepository(BranchOffices) private branchOfficeRepository: Repository<BranchOffices>,
  ) { }

  async create(locationData: Location): Promise<any> {
    try {      
      if (locationData) {

        const branch_offices = await this.branchOfficeRepository.findByIds(
          locationData.branch_offices
        );
        
        console.log("esto es branch_offices::", branch_offices);
        
        const newLocation = this.locationRepository.create({
          ...locationData,
          id: uuidv4(), // Generar un nuevo UUID
          state: 'ACTIVO',
          branch_offices: branch_offices
        });

        const createdLocation = await this.locationRepository.save(newLocation);

        if (createdLocation) {
          return ResponseUtil.success(
            200,
            'Location creado exitosamente',
            createdLocation
          );
        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear el Location'
          );
        }
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al crear el Location'
      );
    }
  }

  async findAll(): Promise<any> {
    try {
      const locations = await this.locationRepository.find({
        where: { state: 'ACTIVO' },
        relations: ['branch_offices']
      });

      if (locations.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado Locations'
        );
      }

      return ResponseUtil.success(
        200,
        'Locations encontrados',
        locations
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los Locations'
      );
    }
  }

  async findOne(id: string) {
    try {
      const location = await this.locationRepository.findOne({
        where: { id },
        relations: ['branch_offices']
      });

      if (location) {
        return ResponseUtil.success(
          200,
          'Location encontrado',
          location
        );
      } else {
        return ResponseUtil.error(
          404,
          'Location no encontrado'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener el Location'
      );
    }
  }

  async update(id, locationData) {
    try {
      const existingLocation = await this.locationRepository.findOne({
        where: { id },
        relations: ['branch_offices']
      });

      if (!existingLocation) {
        throw new NotFoundException('Location no encontrado');
      }

      const updatedLocation = await this.locationRepository.save({
        ...existingLocation,
        ...locationData,
      });

      return ResponseUtil.success(
        200,
        'Location actualizado exitosamente',
        updatedLocation
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ResponseUtil.error(
          404,
          'Location no encontrado'
        );
      }
      return ResponseUtil.error(
        500,
        'Error al actualizar el Location'
      );
    }
  }

  async remove(id: string): Promise<any> {
    try {
      const existingLocation = await this.locationRepository.findOne({
        where: { id },
      });

      if (!existingLocation) {
        return ResponseUtil.error(404, 'Location no encontrado');
      }

      existingLocation.state = 'INACTIVO';
      const updatedLocation = await this.locationRepository.save(existingLocation);

      if (updatedLocation) {
        return ResponseUtil.success(
          200,
          'Location eliminado exitosamente',
          updatedLocation
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar el Location'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar el Location'
      );
    }
  }
}
