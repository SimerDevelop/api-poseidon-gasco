import { Injectable, NotFoundException } from '@nestjs/common';
import { Course } from './entities/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseUtil } from 'src/utils/response.util';
import { v4 as uuidv4 } from 'uuid';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Location } from 'src/locations/entities/location.entity';
import { CommonService } from 'src/common-services/common.service';

@Injectable()
export class CoursesService {

  constructor(
    @InjectRepository(Course) private courseRepository: Repository<Course>,
    @InjectRepository(Usuario) private userRepository: Repository<Usuario>,
    @InjectRepository(Location) private locationRepository: Repository<Location>,
    private commonService: CommonService
  ) { }

  async create(courseData: Course): Promise<any> {
    try {
      const operator = await this.userRepository.findByIds(
        courseData.operator
      );

      const locations = await this.locationRepository.findByIds(
        courseData.locations
      );

      const newCourse = this.courseRepository.create({
        ...courseData,
        id: uuidv4(), // Generar un nuevo UUID
        state: 'ACTIVO',
        operator: operator,
        locations: locations
      });

      const createdCourse = await this.courseRepository.save(newCourse);

      if (createdCourse) {
        const status = {
          'status': 'EN CURSO'
        }

        await this.commonService.updateUserStatus(operator[0].id, status)
      }

      if (!createdCourse) {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al crear el Derrotero'
        );
      }

      return ResponseUtil.success(
        200,
        'Derrotero creado exitosamente',
        createdCourse
      );

    } catch (error) {
      console.log(error);
      
      return ResponseUtil.error(
        500,
        'Error al crear el Derrotero'
      );
    }
  }

  async findAll(): Promise<any> {
    try {
      const courses = await this.courseRepository.find({
        where: { state: 'ACTIVO' },
        relations: [
          'operator',

          'locations',
          'locations.branch_offices',
          'locations.branch_offices.city',
          'locations.branch_offices.client',
          'locations.branch_offices.zone',
          'locations.branch_offices.factor',
        ],
      });

      if (courses.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado derroteros'
        );
      }

      return ResponseUtil.success(
        200,
        'derroteros encontrados',
        courses
      );



    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los derroteros'
      );
    }
  }

  async findOne(id: string) {
    try {
      const course = await this.courseRepository.findOne({
        where: { id },
        relations: [
          'operator',

          'locations',
          'locations.branch_offices',
          'locations.branch_offices.city',
          'locations.branch_offices.city.department',
          'locations.branch_offices.client',
          'locations.branch_offices.client.occupation',
          'locations.branch_offices.zone',
          'locations.branch_offices.factor',
        ],
      });

      if (course) {
        this.commonService.findCoursesByOperatorNameAndLastName(course.operator[0].firstName, course.operator[0].lastName);

        return ResponseUtil.success(
          200,
          'Derrotero encontrado',
          course
        );
      } else {
        return ResponseUtil.error(
          404,
          'Derrotero no encontrado'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener la Derrotero'
      );
    }
  }

  async findCourseByOperatorId(operatorId: string) {
    try {
      const courses = await this.courseRepository
        .createQueryBuilder('courses')
        .leftJoinAndSelect('courses.operator', 'operator')
        .leftJoinAndSelect('courses.locations', 'locations')
        .leftJoinAndSelect('locations.branch_offices', 'branch_offices')
        .leftJoinAndSelect('branch_offices.city', 'city')
        .leftJoinAndSelect('city.department', 'department')
        .leftJoinAndSelect('branch_offices.client', 'client')
        .leftJoinAndSelect('client.occupation', 'occupation')
        .leftJoinAndSelect('branch_offices.factor', 'factor')
        .leftJoinAndSelect('branch_offices.zone', 'zone')
        .leftJoinAndSelect('branch_offices.stationary_tanks', 'stationary_tanks')
        .where('operator.id = :operatorId', { operatorId })
        .getMany();

      console.log('=====================DERROTERO CONSULTADO=====================');
      console.log(courses[0]);
      console.log('==============================================================');

      if (courses.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado derroteros'
        );
      }

      this.commonService.findCoursesByOperatorNameAndLastName(courses[0].operator[0].firstName, courses[0].operator[0].lastName);

      return ResponseUtil.success(
        200,
        'derroteros encontrados',
        courses[0]
      );

    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los derroteros'
      );
    }
  }

  async update(id, courseData) {
    try {
      const existingCourse = await this.courseRepository.findOne({
        where: { id },
      });

      if (!existingCourse) {
        return ResponseUtil.error(
          400,
          'Derrotero no encontrado'
        );
      }

      const operator = await this.userRepository.findByIds(
        courseData.operator
      );

      const locations = await this.locationRepository.findByIds(
        courseData.locations
      );

      const updatedCity = await this.courseRepository.save({
        ...existingCourse,
        operator: operator,
        locations: locations
      });

      if (updatedCity) {
        return ResponseUtil.success(
          200,
          'Derrotero actualizado exitosamente',
          updatedCity
        );
      }

    } catch (error) {
      return ResponseUtil.error(
        404,
        'Derrotero no encontrado'
      );
    }
  }

  async remove(id: string): Promise<any> {
    try {
      const existingCourse = await this.courseRepository.findOne({
        where: { id },
      });

      if (!existingCourse) {
        return ResponseUtil.error(404, 'Derrotero no encontrado');
      }

      existingCourse.state = 'INACTIVO';
      const updatedCity = await this.courseRepository.save(existingCourse);

      if (updatedCity) {
        return ResponseUtil.success(
          200,
          'Derrotero eliminado exitosamente',
          updatedCity
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar el Derrotero'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar el Derrotero'
      );
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const existingCourse = await this.courseRepository.findOne({
        where: { id },
        relations: ['operator']
      });

      if (!existingCourse) {
        return ResponseUtil.error(404, 'Derrotero no encontrado');
      }

      console.log(`==============DERROTERO ${id} ELIMINADO=============`);

      await this.courseRepository.remove(existingCourse);

      const status = {
        'status': 'DISPONIBLE'
      }

      await this.commonService.updateUserStatus(existingCourse.operator[0].id, status);

      return ResponseUtil.success(
        200,
        'Derrotero eliminado exitosamente'
      );
    } catch (error) {
      console.log(error);
      
      return ResponseUtil.error(
        500,
        'Error al eliminar el Derrotero'
      );
    }
  }

}
