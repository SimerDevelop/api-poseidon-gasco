import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Factor } from './entities/factor.entity';
import { Repository } from 'typeorm';
import { ResponseUtil } from 'src/utils/response.util';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class FactorService {
  constructor(
    @InjectRepository(Factor) private factorRepository: Repository<Factor>,
  ) { }

  async create(factorData: Factor): Promise<any> {
    try {
      if (factorData) {
        const newFactor = this.factorRepository.create({
          ...factorData,
          id: uuidv4(), // Generar un nuevo UUID
        });
        const createdFactor = await this.factorRepository.save(newFactor);

        if (createdFactor) {
          return ResponseUtil.success(
            200,
            'Factor creado exitosamente',
            createdFactor
          );
        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear el Factor'
          );
        }
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al crear el Factor'
      );
    }
  }

  async findAll(): Promise<any> {
    try {
      const factors = await this.factorRepository.find();

      if (factors.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado Factores'
        );
      }

      return ResponseUtil.success(
        200,
        'Factores encontrados',
        factors[0]
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los Factores'
      );
    }
  }

  async findOne(id: string) {
    try {
      const factor = await this.factorRepository.findOneBy({
        id: id
      });

      if (factor) {
        return ResponseUtil.success(
          200,
          'Factor encontrado',
          factor
        );
      } else {
        return ResponseUtil.error(
          404,
          'Factor no encontrado'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener el Factor'
      );
    }
  }

  async update(id, factorData) {
    try {
      const existingFactor = await this.factorRepository.findOne({
        where: { id },
      });

      if (!existingFactor) {
        throw new NotFoundException('Factor no encontrado');
      }

      const updatedFactor = await this.factorRepository.save({
        ...existingFactor,
        ...factorData,
      });

      return ResponseUtil.success(
        200,
        'Factor actualizada exitosamente',
        updatedFactor
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ResponseUtil.error(
          404,
          'Factor no encontrado'
        );
      }
      return ResponseUtil.error(
        500,
        'Error al actualizar el Factor'
      );
    }
  }

}
