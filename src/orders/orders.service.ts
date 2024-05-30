import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { ResponseUtil } from 'src/utils/response.util';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
  ) { }

  async create(orderData: Order): Promise<any> {
    try {

      const lastOrder = await this.orderRepository.findOne({ order: { folio: 'DESC' } });
      let folio = 1;
      if (lastOrder) {
        folio = lastOrder.folio + 1;
      }

      if (orderData) {
        const newOccupation = this.orderRepository.create({
          ...orderData,
          id: uuidv4(), // Generar un nuevo UUID
          state: 'ACTIVO',
          folio: folio,
        });

        const createdOccupation = await this.orderRepository.save(newOccupation);

        if (createdOccupation) {
          return ResponseUtil.success(
            200,
            'Pedido creado exitosamente',
            createdOccupation
          );
        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear el Pedido'
          );
        }
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al crear el Pedido'
      );
    }
  }

  async findAll(): Promise<any> {
    try {
      const occupations = await this.orderRepository.find({
        where: { state: 'ACTIVO' },
      });

      if (occupations.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado Pedidos'
        );
      }

      return ResponseUtil.success(
        200,
        'Pedidos encontrados',
        occupations
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los Pedidos'
      );
    }
  }

  async findOne(id: string) {
    try {
      const occupation = await this.orderRepository.findOne({
        where: { id },
      });

      if (occupation) {
        return ResponseUtil.success(
          200,
          'Pedido encontrado',
          occupation
        );
      } else {
        return ResponseUtil.error(
          404,
          'Pedido no encontrado'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener el Pedido'
      );
    }
  }

  async update(id, occupationData) {
    try {
      const existingOccupation = await this.orderRepository.findOne({
        where: { id },
      });

      if (!existingOccupation) {
        return ResponseUtil.error(
          400,
          'Pedido no encontrado'
        );
      }

      const updatedOccupation = await this.orderRepository.save({
        ...existingOccupation,
        ...occupationData,
      });

      return ResponseUtil.success(
        200,
        'Pedido actualizada exitosamente',
        updatedOccupation
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ResponseUtil.error(
          404,
          'Pedido no encontrado'
        );
      }
      return ResponseUtil.error(
        500,
        'Error al actualizar el Pedido'
      );
    }
  }

  async remove(id: string): Promise<any> {
    try {
      const existingOccupation = await this.orderRepository.findOne({
        where: { id },
      });

      if (!existingOccupation) {
        return ResponseUtil.error(404, 'Pedido no encontrado');
      }

      existingOccupation.state = 'INACTIVO';
      const updatedOccupation = await this.orderRepository.save(existingOccupation);

      if (updatedOccupation) {
        return ResponseUtil.success(
          200,
          'Pedido eliminada exitosamente',
          updatedOccupation
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar el Pedido'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar el Pedido'
      );
    }
  }
}
