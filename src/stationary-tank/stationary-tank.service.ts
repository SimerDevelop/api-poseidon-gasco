import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StationaryTank } from './entities/stationary-tank.entity';
import { BranchOffices } from 'src/branch-offices/entities/branch-office.entity';
import { Repository } from 'typeorm';
import { ResponseUtil } from 'src/utils/response.util';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StationaryTankService {
  constructor(
    @InjectRepository(StationaryTank) private stationaryTankRepository: Repository<StationaryTank>,
    @InjectRepository(BranchOffices) private branchOfficesRepository: Repository<BranchOffices>,
  ) { }

  async create(stationaryTankData: StationaryTank): Promise<any> {
    try {

      const existingStationaryTank = await this.stationaryTankRepository.findOne({
        where: { serial: stationaryTankData.serial },
      });

      if (existingStationaryTank) {
        const updatedStationaryTank = await this.stationaryTankRepository.save({
          ...existingStationaryTank,
          ...stationaryTankData,
        });

        return ResponseUtil.success(
          200,
          'Tanque estacionario actualizado exitosamente',
          updatedStationaryTank
        );
      }

      if (stationaryTankData) {
        const newStationaryTank = this.stationaryTankRepository.create({
          ...stationaryTankData,
          id: uuidv4(), // Generar un nuevo UUID
          state: 'ACTIVO',
          status: 'NO ASIGNADO',
        });
        const createdStationaryTank = await this.stationaryTankRepository.save(newStationaryTank);

        if (createdStationaryTank) {
          return ResponseUtil.success(
            200,
            'Tanque estacionario creado exitosamente',
            createdStationaryTank
          );
        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear el Tanque estacionario'
          );
        }
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al crear el Tanque estacionario'
      );
    }
  }

  async findAll(): Promise<any> {
    try {
      const stationaryTanks = await this.stationaryTankRepository.find({
        where: { state: 'ACTIVO' },
      });
  
      if (stationaryTanks.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado Tanque estacionarios'
        );
      }
  
      return ResponseUtil.success(
        200,
        'Tanque estacionarios encontrados',
        stationaryTanks
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los Tanque estacionarios',
        error.message
      );
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      // Buscar el tanque estacionario por su ID
      const propaneTank = await this.stationaryTankRepository.findOne({
        where: { id }
      });
  
      if (!propaneTank) {
        return ResponseUtil.error(
          404,
          'Tanque estacionario no encontrado'
        );
      }
  
      // Buscar las sucursales que contienen el tanque estacionario
      const branchOffices = await this.branchOfficesRepository
        .createQueryBuilder('branch_office')
        .leftJoinAndSelect('branch_office.stationary_tanks', 'stationary_tank')
        .where('stationary_tank.id = :id', { id })
        .getMany();
  
      // Incluir las sucursales en la respuesta del tanque estacionario
      const result = {
        ...propaneTank,
        branchOffices
      };
  
      return ResponseUtil.success(
        200,
        'Tanque estacionario encontrado',
        result
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener el Tanque estacionario',
        error.message
      );
    }
  }

  async update(id, stationaryTankData) {
    try {
      const existingPropaneTank = await this.stationaryTankRepository.findOne({
        where: [
          { id: id },
          { serial: id }
        ]
      });

      if (!existingPropaneTank) {
        throw new NotFoundException('Tanque estacionario no encontrado');
      }

      const updatedPropaneTank = await this.stationaryTankRepository.save({
        ...existingPropaneTank,
        ...stationaryTankData,
      });

      return ResponseUtil.success(
        200,
        'Tanque estacionario actualizado exitosamente',
        updatedPropaneTank
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ResponseUtil.error(
          404,
          'Tanque estacionario no encontrado'
        );
      }
      return ResponseUtil.error(
        500,
        'Error al actualizar el Tanque estacionario'
      );
    }
  }

  async remove(id: string): Promise<any> {
    try {
      const existingPropaneTank = await this.stationaryTankRepository.findOne({
        where: { id },
      });

      if (!existingPropaneTank) {
        return ResponseUtil.error(404, 'Tanque estacionario no encontrado');
      }

      if (existingPropaneTank.status === 'ASIGNADO') {
        return ResponseUtil.error(
          400,
          'No se puede eliminar un Tanque estacionario asignado'
        );
      }

      existingPropaneTank.state = 'INACTIVO';
      const updatedPropaneTank = await this.stationaryTankRepository.save(existingPropaneTank);

      if (updatedPropaneTank) {
        return ResponseUtil.success(
          200,
          'Tanque estacionario eliminado exitosamente',
          updatedPropaneTank
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar el Tanque estacionario'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar el Tanque estacionario'
      );
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////

  async findAllAvailable(): Promise<any> {
    try {
      const propaneTanks = await this.stationaryTankRepository.find({
        where: { status: 'NO ASIGNADO', state: 'ACTIVO' }
      });

      if (propaneTanks.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado Tanque estacionarios'
        );
      }

      return ResponseUtil.success(
        200,
        'Tanque estacionarios encontrados',
        propaneTanks
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los Tanque estacionarios'
      );
    }
  }

  async updateMultiple(ids): Promise<any> {

    console.log(ids.length);

    const updatedIds = []; // Array para almacenar los IDs de las sucursales creadas

    for (let i = 0; i < ids.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 150)); // Espera 1 segundo
      const response = await this.setNotAssign(ids[i]);
      if (response.statusCode === 200) {
        updatedIds.push(response.data.id);
      }
    }

    return ResponseUtil.success(
      200,
      'Tanques estacionarios actualizados exitosamente',
      updatedIds
    );
  }

  async setNotAssign(id) {
    try {
      const existingPropaneTank = await this.stationaryTankRepository.findOne({
        where: { id },
      });

      if (!existingPropaneTank) {
        throw new NotFoundException('Tanque estacionario no encontrado');
      }

      const updatedPropaneTank = await this.stationaryTankRepository.save({
        ...existingPropaneTank,
        status: "NO ASIGNADO"
      });

      return ResponseUtil.success(
        200,
        'Tanque estacionario actualizado exitosamente',
        updatedPropaneTank
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ResponseUtil.error(
          404,
          'Tanque estacionario no encontrado'
        );
      }
      return ResponseUtil.error(
        500,
        'Error al actualizar el Tanque estacionario'
      );
    }
  }

  async createMultiple(data: any): Promise<any> {
    const chunkSize = 500;
    const createdStationaryTanks = [];

    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const promises = chunk.map((item: any) => this.create(item));
      const responses = await Promise.all(promises);

      const successfulStationaryTanks = responses
        .filter(response => response.statusCode === 200)
        .map(response => response.data.id);

      createdStationaryTanks.push(...successfulStationaryTanks);
    }

    return ResponseUtil.success(
      200,
      'Tanques estacionarios creados exitosamente',
      createdStationaryTanks
    );
  }


}
