import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BranchOffices } from 'src/branch-offices/entities/branch-office.entity';
import { ResponseUtil } from 'src/utils/response.util';
import { Course } from 'src/courses/entities/course.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class CommonService {
    constructor(
        @InjectRepository(BranchOffices)
        private branchOfficeRepository: Repository<BranchOffices>,
        @InjectRepository(Course)
        private courseRepository: Repository<Course>,
        @InjectRepository(Usuario)
        private userRepository: Repository<Usuario>,
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
        private notificationsService: NotificationsService
    ) { }

    async updateBranchOfficeStatus(id, branchOfficeData) {
        console.log('branchOfficeData', branchOfficeData);
        try {
            const existingBranchOffice = await this.branchOfficeRepository.findOne({
                where: [
                    { id: id },
                    { branch_office_code: id }
                ]
            });

            if (!existingBranchOffice) {
                return ResponseUtil.error(
                    404,
                    'Sucursal no encontrada'
                );
            }

            const updatedBranchOffice = await this.branchOfficeRepository.save({
                ...existingBranchOffice,
                ...branchOfficeData,
            });

            return ResponseUtil.success(
                200,
                'Sucursal actualizada exitosamente',
                updatedBranchOffice
            );

        } catch (error) {
            return ResponseUtil.error(
                500,
                'Error al actualizar la Sucursal'
            );
        }
    }

    async updateUserStatus(id, userData) {
        console.log('userData', userData);
        try {
            const existingUserData = await this.userRepository.findOne({
                where: [
                    { id: id },
                    { idNumber: id }
                ]
            });

            if (!existingUserData) {
                return ResponseUtil.error(
                    404,
                    'Usuario no encontrado'
                );
            }

            const updatedBranchOffice = await this.userRepository.save({
                ...existingUserData,
                ...userData,
            });

            return ResponseUtil.success(
                200,
                'Usuario actualizado exitosamente',
                updatedBranchOffice
            );

        } catch (error) {
            console.log(error);

            return ResponseUtil.error(
                500,
                'Error al actualizar el usuario'
            );
        }
    }

    async findCoursesByOperatorNameAndLastName(firstName: string, lastName: string) {        
        try {
            const courses = await this.courseRepository
                .createQueryBuilder('courses')
                .innerJoinAndSelect('courses.locations', 'locations') // carga la relación con locations
                .innerJoinAndSelect('locations.branch_offices', 'branch_offices') // carga la relación con branch_offices
                .innerJoinAndSelect('courses.operator', 'operator')
                .where('operator.firstName = :firstName AND operator.lastName = :lastName', { firstName, lastName }) // busca por firstName y lastName
                .getMany();

            if (!courses || courses.length === 0) {
                return ResponseUtil.error(
                    404,
                    'No se encontraron cursos para el operario'
                );
            }

            for (let course of courses) {
                let allBranchOfficesLoaded = await this.areAllBranchOfficesLoaded(course);

                // Si todas las branch_offices tienen el estado 'CARGADO', actualiza su estado a 'EFECTIVO' y elimina el curso
                if (allBranchOfficesLoaded) {
                    for (let location of course.locations) {
                        for (let branch_office of location.branch_offices) {
                            branch_office.status = 'EFECTIVO';
                            await this.branchOfficeRepository.save(branch_office); // asumiendo que tienes un repositorio para branch_offices
                        }
                    }
                    
                    await this.courseRepository.delete(course.id);

                    const statusUser = {
                        "status": "DISPONIBLE"
                    }

                    await this.updateUserStatus(course.operator[0].idNumber, statusUser);

                    const notificationData = this.notificationRepository.create({
                        status: "NO LEIDO",
                        message: `Se ha completado el derrotero con el código ${course.id} creado en ${course.create} asignado a ${firstName} ${lastName}`,
                        title: `Derrotero completado`,
                        type: "DERROTERO",
                        intercourse: course.operator[0].id
                    })

                    this.notificationsService.create(notificationData);


                    console.log('===============================DERROTERO COMPLETADO==============================');
                    console.log(firstName, lastName, 'ID: ', course.operator[0].idNumber, 'ha completado el Derrotero:', course.id);
                    console.log('Fecha de asignación: ', course.create)
                    console.log('=================================================================================');
                }
            }

            return ResponseUtil.success(
                200,
                'Cursos completado exitosamente',
            );

        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            return ResponseUtil.error(
                500,
                'Error al buscar los cursos'
            );
        }
    }

    async areAllBranchOfficesLoaded(course) {
        for (let location of course.locations) {
            for (let branch_office of location.branch_offices) {
                if (branch_office.status !== 'CARGADO') {
                    // Si alguna branch_office no tiene el estado 'CARGADO', retorna false
                    return false;
                }
            }
        }
        // Si todas las branch_offices tienen el estado 'CARGADO', retorna true
        return true;
    }

}