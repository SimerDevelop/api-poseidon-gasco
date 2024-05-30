import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { ZoneService } from './zone.service';
import { Zone } from './entities/zone.entity';
import { ApiKeyGuard } from 'src/auth/api-key.middleware';

@Controller('zone')
@UseGuards(ApiKeyGuard)
export class ZoneController {
  constructor(private readonly zoneService: ZoneService) { }

  @Get('all')
  async findAll(): Promise<Zone[]> {
    return this.zoneService.findAll();
  }

  @Get('getById/:id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.zoneService.findOne(id);
  }

  @Post('create')
  async create(@Body() zoneData: Zone): Promise<Zone> {
    return this.zoneService.create(zoneData);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() zoneData: Zone): Promise<any> {
    return this.zoneService.update(id, zoneData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return this.zoneService.remove(id);
  }
}
