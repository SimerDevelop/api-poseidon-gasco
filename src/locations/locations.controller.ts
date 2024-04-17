import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { Location } from './entities/location.entity';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('all')
  async findAll(): Promise<Location[]> {
    return this.locationsService.findAll();
  }

  @Get('getById/:id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.locationsService.findOne(id);
  }

  @Post('create')
  async create(@Body() locationData: Location): Promise<Location> {
    return this.locationsService.create(locationData);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() locationData: Location): Promise<any> {
    return this.locationsService.update(id, locationData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return this.locationsService.remove(id);
  }
}
