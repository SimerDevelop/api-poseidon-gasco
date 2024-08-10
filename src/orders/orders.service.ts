import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { ResponseUtil } from 'src/utils/response.util';
import { v4 as uuidv4 } from 'uuid';
import { BranchOffices } from 'src/branch-offices/entities/branch-office.entity';
import { CommonService } from 'src/common-services/common.service';
import { MailerService } from 'src/utils/mailer.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(BranchOffices) private branchOfficeRepository: Repository<BranchOffices>,
    private commonService: CommonService
  ) { }

  async create(orderData: Order): Promise<any> {
    try {
      let folio = 1;
      let token = '';

      if (orderData) {

        if (orderData.validate_token == true) {
          token = Math.random().toString(36).substr(2, 6);
        }

        const lastOrder = await this.orderRepository.find({
          order: {
            folio: 'DESC',
          },
          take: 1,
        });

        if (lastOrder && lastOrder.length > 0) {
          folio = lastOrder[0].folio + 1;
        }
      }

      // const existingOrder = await this.orderRepository.findOne({
      //   where: { branch_office_code: orderData.branch_office_code },
      // });

      // if (existingOrder) {
      //   return ResponseUtil.error(
      //     400,
      //     'Ya existe un Pedido con el mismo código de sucursal'
      //   );
      // }

      const branch_office = await this.branchOfficeRepository.findOne({
        where: { branch_office_code: orderData.branch_office_code },
        relations: ['client'],
      });

      const newOrder = this.orderRepository.create({
        ...orderData,
        id: uuidv4(), // Generar un nuevo UUID
        state: 'ACTIVO',
        status: 'DISPONIBLE',
        folio: folio,
        token: token,
        branch_office: branch_office,
      });

      const createdOrder = await this.orderRepository.save(newOrder);

      if (createdOrder) {
        const status = 'PENDIENTE';
        await this.commonService.updateBranchOfficeStatus(branch_office.id, { status });
      }

      if (createdOrder.token != '') {
        MailerService.sendToken(createdOrder, branch_office.client[0].email);
      }

      if (createdOrder) {
        return ResponseUtil.success(
          200,
          'Pedido creado exitosamente',
          createdOrder
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al crear el Pedido'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al crear el Pedido',
        error.message
      );
    }
  }

  async findAll(): Promise<any> {
    try {
      const occupations = await this.orderRepository.find({
        where: { state: 'ACTIVO' },
        relations: ['branch_office'],
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
        relations: ['branch_office'],
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

  async delete(id: string): Promise<any> {
    try {
      const existingOrder = await this.orderRepository.findOne({
        where: { id },
      });

      if (!existingOrder) {
        return ResponseUtil.error(404, 'Pedido no encontrado');
      }

      if (existingOrder.status != 'DISPONIBLE') {
        return ResponseUtil.error(
          400,
          'No se puede eliminar un Pedido que no esté DISPONIBLE'
        );
      }

      await this.orderRepository.remove(existingOrder);

      return ResponseUtil.success(
        200,
        'Pedido eliminado exitosamente'
      );
    } catch (error) {
      console.log(error);

      return ResponseUtil.error(
        500,
        'Error al eliminar el Pedido'
      );
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////

  async getAvailableOrders() {
    try {
      const occupations = await this.orderRepository.find({
        where: { status: 'DISPONIBLE' },
        relations: ['branch_office'],
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

}
