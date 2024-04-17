import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Tablet } from './entities/tablet.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseUtil } from 'src/utils/response.util';
import { v4 as uuidv4 } from 'uuid';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Notification } from 'src/notifications/entities/notification.entity';

@Injectable()
export class TabletService {
  constructor(
    @InjectRepository(Tablet) private tabletRepository: Repository<Tablet>,
    @InjectRepository(Usuario) private usuariosRepository: Repository<Usuario>,
    @InjectRepository(Notification) private notificationRepository: Repository<Notification>,
    @Inject(NotificationsService) private notificationsService: NotificationsService,

  ) { }

  async create(tabletData: Tablet): Promise<any> {
    try {
      const existingTablet = await this.tabletRepository.findOne({
        where: { mac: tabletData.mac },
      });

      if (existingTablet) {
        return ResponseUtil.error(
          400,
          'La Tablet ya existe'
        );
      }

      const operator = await this.usuariosRepository.findByIds(
        tabletData.operator
      );

      if (tabletData) {
        const newTablet = this.tabletRepository.create({
          ...tabletData,
          id: uuidv4(), // Generar un nuevo UUID
          state: 'ACTIVO',
          operator: operator
        });
        
        const createdTablet = await this.tabletRepository.save(newTablet);
        console.log('=====================================TABLET CREADA=====================================');
        console.log(createdTablet);
        console.log('=======================================================================================');
        
        if (createdTablet) {
          return ResponseUtil.success(
            200,
            'Tablet creada exitosamente',
            createdTablet
          );
        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear la Tablet'
          );
        }
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al crear la Tablet'
      );
    }
  }

  async findAll(): Promise<any> {
    try {
      const tablets = await this.tabletRepository.find({
        where: { state: 'ACTIVO' },
        relations: ['operator']
      });

      if (tablets.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado Tablets'
        );
      }

      return ResponseUtil.success(
        200,
        'Tablets encontrados',
        tablets
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los Tablets'
      );
    }
  }

  async findOne(id: string) {
    try {
      const tablet = await this.tabletRepository.findOne({
        where: { id },
        relations: ['operator']
      });

      if (tablet) {
        return ResponseUtil.success(
          200,
          'Tablet encontrada',
          tablet
        );
      } else {
        return ResponseUtil.error(
          404,
          'Tablet no encontrada'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener la Tablet'
      );
    }
  }

  async update(operatorId, tabletData) {
    try {
      const existingTablet = await this.tabletRepository.findOne({
        where: { operator: { id: operatorId } },
        relations: ['operator']
      });

      if (!existingTablet) {
        throw new NotFoundException('Tablet no encontrada');
      }

      const updatedTablet = await this.tabletRepository.save({
        ...existingTablet,
        ...tabletData,
      });

      if (updatedTablet.batteryPercent <= 20) {
        const notificationData = this.notificationRepository.create ({
          status: "NO LEIDO",
          message: `La tablet del operador ${existingTablet.operator[0].firstName} ${existingTablet.operator[0].lastName} con mac: ${updatedTablet.mac} se ha descargado, nivel de batería: ${updatedTablet.batteryPercent}%`,
          title: `Tablet descargada`,
          type: "TABLET",
          intercourse: updatedTablet.id
        })

        this.notificationsService.create(notificationData);
      }

      console.log('=====================================TABLET ACTUALIZADA=====================================');
      console.log(updatedTablet);
      console.log('=======================================================================================');

      return ResponseUtil.success(
        200,
        'Tablet actualizada exitosamente',
        updatedTablet
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ResponseUtil.error(
          404,
          'Tablet no encontrada'
        );
      }
      return ResponseUtil.error(
        500,
        'Error al actualizar la Tablet'
      );
    }
  }

  async remove(id: string): Promise<any> {
    try {
      const existingTablet = await this.tabletRepository.findOne({
        where: { id },
      });

      if (!existingTablet) {
        return ResponseUtil.error(404, 'Tablet no encontrada');
      }

      existingTablet.state = 'INACTIVO';
      const updatedTablet = await this.tabletRepository.save(existingTablet);

      if (updatedTablet) {
        return ResponseUtil.success(
          200,
          'Tablet eliminada exitosamente',
          updatedTablet
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar la Tablet'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar la Tablet'
      );
    }
  }
}
