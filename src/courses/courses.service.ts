import { Injectable, NotFoundException } from '@nestjs/common';
import { Course } from './entities/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseUtil } from 'src/utils/response.util';
import { v4 as uuidv4 } from 'uuid';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Location } from 'src/locations/entities/location.entity';
import { CommonService } from 'src/common-services/common.service';
import { Order } from 'src/orders/entities/order.entity';
import { PropaneTruck } from 'src/propane-truck/entities/propane-truck.entity';

@Injectable()
export class CoursesService {

  constructor(
    @InjectRepository(Course) private courseRepository: Repository<Course>,
    @InjectRepository(Usuario) private userRepository: Repository<Usuario>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Location) private locationRepository: Repository<Location>,
    @InjectRepository(PropaneTruck) private propaneTruckRepository: Repository<PropaneTruck>,
    private commonService: CommonService
  ) { }

  async create(courseData: Course): Promise<any> {
    try {
      const operator = await this.userRepository.findOne({
        where: { idNumber: courseData.operator_id },
      });

      const propane_truck = await this.propaneTruckRepository.findOne({
        where: { plate: courseData.propane_truck.plate },
      });

      const orders = await this.orderRepository.findByIds(courseData.orders);

      const newCourse = this.courseRepository.create({
        ...courseData,
        id: uuidv4(), // Generar un nuevo UUID
        state: 'ACTIVO',
        operator: operator,
        orders: orders,
        propane_truck: propane_truck
      });

      const createdCourse = await this.courseRepository.save(newCourse);

      console.log('==============Derrotero Creado:', createdCourse);

      if (createdCourse) {
        const status = {
          'status': 'EN CURSO'
        }

        for (let i = 0; i < orders.length; i++) {
          await this.commonService.updateOrder(orders[i].id, status);
        }

        await this.commonService.updatePropaneTruckStatus(propane_truck.id, status)
        await this.commonService.updateUserStatus(operator.id, status)
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
          'propane_truck',
          'orders',
          'orders.branch_office',
          'orders.branch_office.client',
          'orders.branch_office.client.occupation',
          'orders.branch_office.city',
          'orders.branch_office.city.department',
          'orders.branch_office.zone',
          'orders.branch_office.factor'
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
          'propane_truck',
          'orders',
          'orders.branch_office',
          'orders.branch_office.client',
          'orders.branch_office.client.occupation',
          'orders.branch_office.city',
          'orders.branch_office.city.department',
          'orders.branch_office.zone',
          'orders.branch_office.factor'
        ],
      });

      if (course) {
        this.commonService.findCoursesByOperatorNameAndLastName(course.operator.firstName, course.operator.lastName);

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
      console.log(operatorId);

      const courses = await this.courseRepository
        .createQueryBuilder('courses')
        .leftJoinAndSelect('courses.operator', 'operator')
        .leftJoinAndSelect('courses.orders', 'orders')
        .leftJoinAndSelect('courses.propane_truck', 'propane_truck')
        .leftJoinAndSelect('orders.branch_office', 'branch_office')
        .leftJoinAndSelect('branch_office.city', 'city')
        .leftJoinAndSelect('city.department', 'department')
        .leftJoinAndSelect('branch_office.client', 'client')
        .leftJoinAndSelect('client.occupation', 'occupation')
        .leftJoinAndSelect('branch_office.factor', 'factor')
        .leftJoinAndSelect('branch_office.zone', 'zone')
        .leftJoinAndSelect('branch_office.stationary_tanks', 'stationary_tanks')
        .where('operator.id = :operatorId', { operatorId })
        .getOne();

      console.log('=====================DERROTERO CONSULTADO=====================');
      console.log(courses);
      console.log('==============================================================');

      if (!courses) {
        return ResponseUtil.error(
          400,
          'No se han encontrado derrotero'
        );
      }

      this.commonService.findCoursesByOperatorNameAndLastName(courses.operator.firstName, courses.operator.lastName);

      return ResponseUtil.success(
        200,
        'derrotero encontrado',
        courses
      );

    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener el derrotero'
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

      const operator = await this.userRepository.findOne({
        where: { id: courseData.operator.toString() }
      });

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
        relations: ['operator', 'propane_truck', 'orders']
      });

      if (!existingCourse) {
        return ResponseUtil.error(404, 'Derrotero no encontrado');
      }

      console.log(`==============DERROTERO ${id} ELIMINADO=============`);

      await this.courseRepository.remove(existingCourse);

      const status = {
        'status': 'DISPONIBLE'
      }

      for (let i = 0; i < existingCourse.orders.length; i++) {
        await this.commonService.updateOrder(existingCourse.orders[i].id, status);
      }
      await this.commonService.updateUserStatus(existingCourse.operator.id, status);
      await this.commonService.updatePropaneTruckStatus(existingCourse.propane_truck.id, status);

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
