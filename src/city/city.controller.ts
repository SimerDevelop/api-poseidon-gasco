import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CityService } from './city.service';
import { City } from './entities/city.entity';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get('all')
  async findAll(): Promise<City[]> {
    return this.cityService.findAll();
  }

  @Get('getById/:id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.cityService.findOne(id);
  }

  @Post('create')
  async create(@Body() cityData: City): Promise<City> {
    return this.cityService.create(cityData);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() cityData: City): Promise<any> {
    return this.cityService.update(id, cityData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return this.cityService.remove(id);
  }
}
