import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RouteEvent } from './entities/route-event.entity';
import { Repository } from 'typeorm';
import { ResponseUtil } from 'src/utils/response.util';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RouteEventsService {
  constructor(
    @InjectRepository(RouteEvent) private routeEventRepository: Repository<RouteEvent>,
  ) { }

  async create(routeEventData: RouteEvent): Promise<any> {
    try {
      if (routeEventData) {
        const newRouteEvent = this.routeEventRepository.create({
          ...routeEventData,
          id: uuidv4(), // Generar un nuevo UUID
          state: 'ACTIVO'
        });
        const createdRouteEvent = await this.routeEventRepository.save(newRouteEvent);

        if (createdRouteEvent) {
          return ResponseUtil.success(
            200,
            'Evento de ruta creado exitosamente',
            createdRouteEvent
          );
        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear el evento de ruta'
          );
        }
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al crear el evento de ruta'
      );
    }
  }

  async findAll(): Promise<any> {
    try {
      const routeEvents = await this.routeEventRepository.find({ where: { state: 'ACTIVO' } });

      if (routeEvents.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado Eventos de ruta'
        );
      }

      return ResponseUtil.success(
        200,
        'Eventos de ruta encontrados',
        routeEvents
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los Eventos de ruta'
      );
    }
  }

  async findOne(id: string) {
    try {
      const routeEvent = await this.routeEventRepository.findOneBy({
        id: id
      });

      if (routeEvent) {
        return ResponseUtil.success(
          200,
          'Evento de ruta encontrado',
          routeEvent
        );
      } else {
        return ResponseUtil.error(
          404,
          'Evento de ruta no encontrado'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener el evento de ruta'
      );
    }
  }

  async update(id, routeEventData) {
    try {
      const existingRouteEvent = await this.routeEventRepository.findOne({
        where: { id },
      });

      if (!existingRouteEvent) {
        throw new NotFoundException('Evento de ruta no encontrado');
      }

      const updatedRouteEvent = await this.routeEventRepository.save({
        ...existingRouteEvent,
        ...routeEventData,
      });

      return ResponseUtil.success(
        200,
        'Evento de ruta actualizado exitosamente',
        updatedRouteEvent
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ResponseUtil.error(
          404,
          'Evento de ruta no encontrado'
        );
      }
      return ResponseUtil.error(
        500,
        'Error al actualizar el evento de ruta'
      );
    }
  }

  async remove(id: string): Promise<any> {
    try {
      const existingRouteEvent = await this.routeEventRepository.findOne({
        where: { id },
      });

      if (!existingRouteEvent) {
        return ResponseUtil.error(404, 'Evento de ruta no encontrado');
      }

      existingRouteEvent.state = 'INACTIVO';
      const updatedZone = await this.routeEventRepository.save(existingRouteEvent);

      if (updatedZone) {
        return ResponseUtil.success(
          200,
          'Evento de ruta eliminado exitosamente',
          updatedZone
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar el evento de ruta'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar el evento de ruta'
      );
    }
  }
  
}
