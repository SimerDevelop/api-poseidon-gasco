import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { ApiKeyGuard } from 'src/auth/api-key.middleware';

@Controller('orders')
@UseGuards(ApiKeyGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post('all')
  async findAll(@Body('pageData') pageData: any): Promise<Request[]> {
    return this.ordersService.findAll(pageData);
  }

  @Get('getById/:id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.ordersService.findOne(id);
  }

  @Post('create')
  async create(@Body() orderData: Order): Promise<Order> {
    return this.ordersService.create(orderData);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() orderData: Order): Promise<any> {
    return this.ordersService.update(id, orderData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return this.ordersService.remove(id);
  }

  //////////////////////////////////////////////////////////////////////////////////////

  @Get('getAvailableOrders')
  async getAvailableOrders(): Promise<Order[]> {
    return this.ordersService.getAvailableOrders();
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string): Promise<any> {
    return this.ordersService.delete(id);
  }

  @Post('createMultiple')
  async createMultiple(@Body() orderData: Order): Promise<Order> {
      return this.ordersService.createMultiple(orderData);
  }
}
