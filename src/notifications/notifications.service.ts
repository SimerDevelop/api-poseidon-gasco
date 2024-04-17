import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseUtil } from 'src/utils/response.util';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'domain';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification) private notificationRepository: Repository<Notification>,
  ) { }

  async create(notificationData: Notification): Promise<any> {
    try {
      const existingnotificationData = await this.notificationRepository.findOne({
        where: { type: 'TABLET', status: 'NO LEIDO', message: notificationData.message, state: 'ACTIVO' },
      });

      if (existingnotificationData) {
        return ResponseUtil.error(
          400,
          'La Notificación ya existe'
        );
      }

      if (notificationData) {
        const newNotification = this.notificationRepository.create({
          ...notificationData,
          id: uuidv4(), // Generar un nuevo UUID
          state: 'ACTIVO'
        });
        const createdNotification = await this.notificationRepository.save(newNotification);
      
        if (createdNotification) {
          return ResponseUtil.success(
            200,
            'Notificación creada exitosamente',
            createdNotification
          );
        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear la Notificación'
          );
        }
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al crear la Notificación'
      );
    }
  }

  async findAll(): Promise<any> {
    try {
      const notifications = await this.notificationRepository.find({
        where: { state: 'ACTIVO' },
      });

      if (notifications.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrada Notificaciones'
        );
      }

      return ResponseUtil.success(
        200,
        'Notificaciones encontradas',
        notifications
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener las Notificaciones'
      );
    }
  }


  async findOne(id: string) {
    try {
      const notification = await this.notificationRepository.findOne({
        where: { id },
      });

      if (notification) {
        return ResponseUtil.success(
          200,
          'Notificación encontrada',
          notification
        );
      } else {
        return ResponseUtil.error(
          404,
          'Notificación no encontrada'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener la Notificación'
      );
    }
  }

  async update(id, notificationData) {
    try {
      const existingNotification = await this.notificationRepository.findOne({
        where: { id },
      });

      if (!existingNotification) {
        throw new NotFoundException('Notificación no encontrada');
      }

      const updatedNotification = await this.notificationRepository.save({
        ...existingNotification,
        ...notificationData,
      });

      return ResponseUtil.success(
        200,
        'Notificación actualizada exitosamente',
        updatedNotification
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ResponseUtil.error(
          404,
          'Notificación no encontrada'
        );
      }
      return ResponseUtil.error(
        500,
        'Error al actualizar la Notificación'
      );
    }
  }

  async remove(id: string): Promise<any> {
    try {
      const existingNotification = await this.notificationRepository.findOne({
        where: { id },
      });

      if (!existingNotification) {
        return ResponseUtil.error(404, 'Notificación no encontrada');
      }

      existingNotification.state = 'INACTIVO';
      const updatedNotification = await this.notificationRepository.save(existingNotification);

      if (updatedNotification) {
        return ResponseUtil.success(
          200,
          'Notificación eliminada exitosamente',
          updatedNotification
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar la Notificación'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar la Notificación'
      );
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////

  async findUnread(): Promise<any> {
    try {
      const notifications = await this.notificationRepository.find({
        where: { status: 'NO LEIDO' },
      });

      if (notifications.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrada Notificaciones'
        );
      }

      return ResponseUtil.success(
        200,
        'Notificaciones encontradas',
        notifications
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener las Notificaciones'
      );
    }
  }
}
