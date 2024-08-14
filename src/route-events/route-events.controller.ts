import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { RouteEventsService } from './route-events.service';
import { ApiKeyGuard } from 'src/auth/api-key.middleware';
import { RouteEvent } from './entities/route-event.entity';

@Controller('route-events')
@UseGuards(ApiKeyGuard)
export class RouteEventsController {
  constructor(private readonly routeEventsService: RouteEventsService) {}

  @Get('all')
  async findAll(): Promise<RouteEvent[]> {
    return this.routeEventsService.findAll();
  }

  @Get('getById/:id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.routeEventsService.findOne(id);
  }

  @Post('create')
  async create(@Body() routeEventData: RouteEvent): Promise<RouteEvent> {
    return this.routeEventsService.create(routeEventData);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() routeEventData: RouteEvent): Promise<any> {
    return this.routeEventsService.update(id, routeEventData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return this.routeEventsService.remove(id);
  }
}
