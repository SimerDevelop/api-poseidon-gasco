import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { Repository } from 'typeorm';
import { ResponseUtil } from 'src/utils/response.util';
import { v4 as uuidv4 } from 'uuid';
import { Department } from 'src/department/entities/department.entity';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City) private cityRepository: Repository<City>,
    @InjectRepository(Department) private departmentRepository: Repository<Department>,
  ) { }

  async create(cityData: City): Promise<any> {
    try {
      if (cityData) {

        const existingCity = await this.cityRepository.findOne({
          where: { name: cityData.name },
        });

        if (existingCity) {
          return ResponseUtil.error(
            400,
            'La ciudad ya existe'
          );
        }

        const department = await this.departmentRepository.findByIds(
          cityData.department
        );

        const newCity = this.cityRepository.create({
          ...cityData,
          id: uuidv4(), // Generar un nuevo UUID
          state: 'ACTIVO',
          department: department,
        });

        const createdCity = await this.cityRepository.save(newCity);

        if (createdCity) {
          return ResponseUtil.success(
            200,
            'Ciudad creada exitosamente',
            createdCity
          );
        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear la Ciudad'
          );
        }
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al crear la Ciudad'
      );
    }
  }

  async findAll(): Promise<any> {
    try {
      const cities = await this.cityRepository.find({
        where: { state: 'ACTIVO' },
        relations: ['department'],
      });

      if (cities.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado ciudades'
        );
      }

      return ResponseUtil.success(
        200,
        'Ciudades encontradas',
        cities
      );

    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener las Ciudades'
      );
    }
  }

  async findOne(id: string) {
    try {
      const city = await this.cityRepository.findOne({
        where: { id },
        relations: ['department']
      });

      if (city) {
        return ResponseUtil.success(
          200,
          'Cuidad encontrada',
          city
        );
      } else {
        return ResponseUtil.error(
          404,
          'Cuidad no encontrada'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener la Cuidad'
      );
    }
  }

  async update(id, cityData) {
    try {      

      const existingCity = await this.cityRepository.findOne({
        where: { id },
      });

      if (!existingCity) {
        return ResponseUtil.error(
          400,
          'Ciudad no encontrada'
        );
      }

      const department = await this.departmentRepository.findByIds(
        cityData.department
      );

      const updatedCity = await this.cityRepository.save({
        ...existingCity,
        ...cityData,
        department: department,
      });      

      if (updatedCity) {
        return ResponseUtil.success(
          200,
          'Ciudad actualizada exitosamente',
          updatedCity
        );
      }

    } catch (error) {
      return ResponseUtil.error(
        404,
        'Ciudad no encontrada'
      );
    }
  }

  async remove(id: string): Promise<any> {
    try {
      const existingCity = await this.cityRepository.findOne({
        where: { id },
      });

      if (!existingCity) {
        return ResponseUtil.error(404, 'Ciudad no encontrada');
      }

      existingCity.state = 'INACTIVO';
      const updatedCity = await this.cityRepository.save(existingCity);

      if (updatedCity) {
        return ResponseUtil.success(
          200,
          'Ciudad eliminada exitosamente',
          updatedCity
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar la Ciudad'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar la Ciudad'
      );
    }
  }
}
