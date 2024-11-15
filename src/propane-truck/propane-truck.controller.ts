import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { PropaneTruckService } from './propane-truck.service';
import { PropaneTruck } from './entities/propane-truck.entity';
import { ApiKeyGuard } from 'src/auth/api-key.middleware';

@Controller('propane-truck')
@UseGuards(ApiKeyGuard)
export class PropaneTruckController {
  constructor(private readonly propaneTruckService: PropaneTruckService) { }

  @Get('all')
  async findAll(): Promise<PropaneTruck[]> {
    return this.propaneTruckService.findAll();
  }

  @Get('getById/:id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.propaneTruckService.findOne(id);
  }

  @Post('create')
  async create(@Body() propaneTruckData: PropaneTruck): Promise<PropaneTruck> {
    return this.propaneTruckService.create(propaneTruckData);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() propaneTruckData: PropaneTruck): Promise<any> {
    return this.propaneTruckService.update(id, propaneTruckData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return this.propaneTruckService.remove(id);
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////

  @Delete('activate/:id')
  async activate(@Param('id') id: string): Promise<any> {
    return this.propaneTruckService.activate(id);
  }

  @Get('getByOperator/:operator')
  async getByOperatorId(@Param('operator') operator: any): Promise<any> {
    return this.propaneTruckService.getByOperatorId(operator);
  }

  @Put('updateStatus/:id')
  async updateStatus(@Param('id') id: string, @Body() propaneTruckData: PropaneTruck): Promise<any> {
    return this.propaneTruckService.updateStatus(id, propaneTruckData);
  }

  @Post('createMultiple')
  async createMultiple(@Body() propaneTruckData: PropaneTruck): Promise<PropaneTruck> {
      return this.propaneTruckService.createMultiple(propaneTruckData);
  }
}
