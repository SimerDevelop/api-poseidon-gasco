import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PropaneTruck } from './entities/propane-truck.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ResponseUtil } from 'src/utils/response.util';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class PropaneTruckService {
  constructor(
    @InjectRepository(PropaneTruck) private propaneTruckRepository: Repository<PropaneTruck>,
    @InjectRepository(Usuario) private usuariosRepository: Repository<Usuario>,
  ) { }

  async create(propaneTruckData: PropaneTruck): Promise<any> {
    try {

      const existingPropaneTruck = await this.propaneTruckRepository.findOne({
        where: { plate: propaneTruckData.plate },
      });

      if (existingPropaneTruck) {
        return ResponseUtil.error(
          400,
          'El Auto Tanque ya existe'
        );
      }

      // Asegúrate de que propaneTruckData.operator sea un array
      const operatorIdsOrNumbers = Array.isArray(propaneTruckData.operator) ? propaneTruckData.operator : [propaneTruckData.operator];

      const operator = await this.usuariosRepository
        .createQueryBuilder("usuarios")
        .where("usuarios.id IN (:...ids) OR usuarios.idNumber IN (:...idNumbers)", {
          ids: operatorIdsOrNumbers,
          idNumbers: operatorIdsOrNumbers
        })
        .getMany();

      if (operator.length < 1) {
        return ResponseUtil.error(400, 'Los operadores no existen');
      }

      console.log(operator);

      if (propaneTruckData) {
        const newPropaneTruck = this.propaneTruckRepository.create({
          ...propaneTruckData,
          id: uuidv4(), // Generar un nuevo UUID
          state: 'ACTIVO',
          status: 'DISPONIBLE',
          operator: operator,
          plate: propaneTruckData.plate.toUpperCase()
        });

        const createdPropaneTruck = await this.propaneTruckRepository.save(newPropaneTruck);

        if (createdPropaneTruck) {
          return ResponseUtil.success(
            200,
            'Auto Tanque creado exitosamente',
            createdPropaneTruck
          );
        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear el Auto Tanque'
          );
        }
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al crear el Auto Tanque'
      );
    }
  }

  async findAll(): Promise<any> {
    try {
      const propaneTanks = await this.propaneTruckRepository.find({
        relations: ['operator']
      });

      if (propaneTanks.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado Auto Tanques'
        );
      }

      return ResponseUtil.success(
        200,
        'Auto Tanques encontrados',
        propaneTanks
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los Auto Tanques'
      );
    }
  }

  async findOne(id: string) {
    try {
      const propaneTank = await this.propaneTruckRepository.findOne({
        where: { id },
        relations: ['operator']
      });

      console.log(propaneTank);


      if (propaneTank) {
        return ResponseUtil.success(
          200,
          'Auto Tanque encontrado',
          propaneTank
        );
      } else {
        return ResponseUtil.error(
          404,
          'Auto Tanque no encontrado'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener el Auto Tanque'
      );
    }
  }

  async update(id, propaneTruckData) {
    try {

      console.log('propaneTruckData::', propaneTruckData);

      const existingPropaneTank = await this.propaneTruckRepository.findOne({
        where: { id },
      });

      if (!existingPropaneTank) {
        throw new NotFoundException('Auto Tanque no encontrado');
      }

      const operator = await this.usuariosRepository.findByIds(
        propaneTruckData.operator
      );

      const updatedPropaneTank = await this.propaneTruckRepository.save({
        ...existingPropaneTank,
        ...propaneTruckData,
        operator: operator,
        plate: propaneTruckData.plate.toUpperCase()
      });

      return ResponseUtil.success(
        200,
        'Auto Tanque actualizado exitosamente',
        updatedPropaneTank
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ResponseUtil.error(
          404,
          'Auto Tanque no encontrado'
        );
      }
      return ResponseUtil.error(
        500,
        'Error al actualizar el Auto Tanque'
      );
    }
  }

  async remove(id: string): Promise<any> {
    try {
      const existingPropaneTank = await this.propaneTruckRepository.findOne({
        where: { id },
      });

      if (!existingPropaneTank) {
        return ResponseUtil.error(404, 'Auto Tanque no encontrado');
      }

      existingPropaneTank.state = 'INACTIVO';
      const updatedPropaneTank = await this.propaneTruckRepository.save(existingPropaneTank);

      if (updatedPropaneTank) {
        return ResponseUtil.success(
          200,
          'Auto Tanque eliminado exitosamente',
          updatedPropaneTank
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar el Auto Tanque'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar el Auto Tanque'
      );
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  async activate(id: string): Promise<any> {
    try {
      const existingPropaneTank = await this.propaneTruckRepository.findOne({
        where: { id },
      });

      if (!existingPropaneTank) {
        return ResponseUtil.error(404, 'Auto Tanque no encontrado');
      }

      existingPropaneTank.state = 'ACTIVO';
      const updatedPropaneTank = await this.propaneTruckRepository.save(existingPropaneTank);

      if (updatedPropaneTank) {
        return ResponseUtil.success(
          200,
          'Auto Tanque activado exitosamente',
          updatedPropaneTank
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al activar el Auto Tanque'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al activar el Auto Tanque'
      );
    }
  }

  async getByOperatorId(operatorId: number): Promise<any> {
    try {
      const trucks = await this.propaneTruckRepository
        .createQueryBuilder('propane_truck')
        .innerJoin('propane_truck.operator', 'operator')
        .where('operator.id = :operatorId OR operator.idNumber = :operatorId', { operatorId })
        .getMany();

      if (trucks.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado camiones de propano para este operador'
        );
      }

      return ResponseUtil.success(
        200,
        'Camiones de propano encontrados',
        trucks
      );

    } catch (error) {
      return ResponseUtil.error(
        500,
        'Ha ocurrido un error al obtener los camiones de propano',
        error.message
      );
    }
  }

  async updateStatus(id, propaneTruckData) {
    try {
      console.log('propaneTruckData::', propaneTruckData);
      const existingPropaneTank = await this.propaneTruckRepository.findOne({
        where: { id },
      });



      if (!existingPropaneTank) {
        throw new NotFoundException('Auto Tanque no encontrado');
      }

      const updatedPropaneTank = await this.propaneTruckRepository.save({
        ...existingPropaneTank,
        ...propaneTruckData,
      });

      return ResponseUtil.success(
        200,
        'Auto Tanque actualizado exitosamente',
        updatedPropaneTank
      );

    } catch (error) {
      if (error instanceof NotFoundException) {
        return ResponseUtil.error(
          404,
          'Auto Tanque no encontrado'
        );
      }
      return ResponseUtil.error(
        500,
        'Error al actualizar el Auto Tanque'
      );
    }
  }

  async createMultiple(data: any): Promise<any> {
    const chunkSize = 500;
    const createdPropaneTrucks = [];

    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const promises = chunk.map((item: any) => this.create(item));
      const responses = await Promise.all(promises);

      const successfulPropaneTrucks = responses
        .filter(response => response.statusCode === 200)
        .map(response => response.data.plate);

      createdPropaneTrucks.push(...successfulPropaneTrucks);
    }

    return ResponseUtil.success(
      200,
      'Auto Tanques creados exitosamente',
      createdPropaneTrucks
    );
  }

}
