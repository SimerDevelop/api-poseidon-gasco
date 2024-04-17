import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('all')
  async findAll(): Promise<Notification[]> {
    return this.notificationsService.findAll();
  }

  @Get('getById/:id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.notificationsService.findOne(id);
  }

  @Post('create')
  async create(@Body() notificationData: Notification): Promise<Notification> {
    return this.notificationsService.create(notificationData);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() notificationData: Notification): Promise<any> {
    return this.notificationsService.update(id, notificationData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return this.notificationsService.remove(id);
  }

  //////////////////////////////////////////////////////////////////////////////////////////

  @Get('unread')
  async findUnread(): Promise<Notification[]> {
    return this.notificationsService.findUnread();
  }
}
