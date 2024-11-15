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
    @InjectRepository(Request) private requestRepository: Repository<Request>,
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

  async findAll(pageData: any): Promise<any> {
    try {
      const [orders, total] = await this.orderRepository.findAndCount({
        where: {
          state: 'ACTIVO'
        },
        relations: [
          'branch_office'
        ],
        skip: (pageData.page - 1) * pageData.limit,
        take: pageData.limit,
        order: {
          create: 'DESC', // Ordenar por el campo 'created' en orden descendente
          folio: 'DESC' // Ordenar por el campo 'internal_folio' en orden descendente
        }
      });

      if (orders.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado Pedidos'
        );
      }

      return ResponseUtil.success(
        200,
        'Pedidos encontrados',
        {
          orders,
          total,
          page: pageData.page,
          limit: pageData.limit,
        }
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
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: ['branch_office'],
      });

      if (order) {
        return ResponseUtil.success(
          200,
          'Pedido encontrado',
          order
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

  async update(id, orderData) {
    try {
      const existingOrder = await this.orderRepository.findOne({
        where: { id },
      });

      if (!existingOrder) {
        return ResponseUtil.error(
          400,
          'Pedido no encontrado'
        );
      }

      const updatedOrder = await this.orderRepository.save({
        ...existingOrder,
        ...orderData,
      });

      return ResponseUtil.success(
        200,
        'Pedido actualizada exitosamente',
        updatedOrder
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
      const existingOrder = await this.orderRepository.findOne({
        where: { id },
      });

      if (!existingOrder) {
        return ResponseUtil.error(404, 'Pedido no encontrado');
      }

      // Verifica si el estado del pedido es 'DISPONIBLE' o 'EN CURSO'
      if (existingOrder.status === 'EN CURSO') {
        return ResponseUtil.error(
          400,
          'No se puede eliminar un Pedido que esté EN CURSO'
        );
      }

      existingOrder.state = 'INACTIVO';
      const updatedOrder = await this.orderRepository.save(existingOrder);

      if (updatedOrder) {
        return ResponseUtil.success(
          200,
          'Pedido eliminada exitosamente',
          updatedOrder
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
      console.log('id', id);

      const existingOrder = await this.orderRepository.findOne({
        where: { id },
        relations: ['branch_office'] // Asegúrate de incluir todas las relaciones necesarias
      });

      if (!existingOrder) {
        return ResponseUtil.error(404, 'Pedido no encontrado');
      }

      // Verifica si el estado del pedido es 'DISPONIBLE' o 'EN CURSO'
      if (existingOrder.status === 'EN CURSO') {
        return ResponseUtil.error(
          400,
          'No se puede eliminar un Pedido que esté EN CURSO'
        );
      }

      // No elimines la sucursal relacionada, solo elimina el pedido
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
      const orders = await this.orderRepository.find({
        where: {
          status: 'DISPONIBLE',
          state: 'ACTIVO'
        },
        relations: ['branch_office'],
      });

      if (orders.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado Pedidos'
        );
      }

      return ResponseUtil.success(
        200,
        'Pedidos encontrados',
        orders
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los Pedidos'
      );
    }
  }

  async createMultiple(data: any): Promise<any> {
    const chunkSize = 500;
    const createdOrders = [];

    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);

      for (const item of chunk) {
        const response = await this.create(item);

        if (response.statusCode === 200) {
          createdOrders.push(response.data.id);
        }
      }
    }

    return ResponseUtil.success(
      200,
      'Pedidos creados exitosamente',
      createdOrders
    );
  }

  async findAllOrders(pageData: any): Promise<any> {
    try {
      const [orders, total] = await this.orderRepository.findAndCount({
        where: {
          state: 'ACTIVO'
        },
        relations: [
          'branch_office'
        ],
        skip: (pageData.page - 1) * pageData.limit,
        take: pageData.limit,
        order: {
          create: 'DESC', // Ordenar por el campo 'created' en orden descendente
          folio: 'DESC' // Ordenar por el campo 'internal_folio' en orden descendente
        }
      });

      if (orders.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado Pedidos'
        );
      }

      return ResponseUtil.success(
        200,
        'Pedidos encontrados',
        {
          orders,
          total,
          page: pageData.page,
          limit: pageData.limit,
        }
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los Pedidos'
      );
    }
  }

}
