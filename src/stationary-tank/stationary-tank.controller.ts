import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { StationaryTankService } from './stationary-tank.service';
import { StationaryTank } from './entities/stationary-tank.entity';

@Controller('stationary-tank')
export class StationaryTankController {
  constructor(private readonly stationaryTankService: StationaryTankService) {}

  @Get('all')
  async findAll(): Promise<StationaryTank[]> {
    return this.stationaryTankService.findAll();
  }

  @Get('getById/:id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.stationaryTankService.findOne(id);
  }

  @Post('create')
  async create(@Body() stationaryTankData: StationaryTank): Promise<StationaryTank> {
    return this.stationaryTankService.create(stationaryTankData);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() stationaryTankData: StationaryTank): Promise<any> {
    return this.stationaryTankService.update(id, stationaryTankData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return this.stationaryTankService.remove(id);
  }

  /////////////////////////////////////////////////////////////////////////////////////////////

  @Get('allAvailable')
  async findAllAvailable(): Promise<StationaryTank[]> {
    return this.stationaryTankService.findAllAvailable();
  }

  @Put('updateMultiple')
  async updateMultiple(@Body() ids: any, data: any): Promise<any> {
    return this.stationaryTankService.updateMultiple(ids);
  }

  @Post('createMultiple')
  async createMultiple(@Body() stationaryTankData: StationaryTank): Promise<StationaryTank> {
      return this.stationaryTankService.createMultiple(stationaryTankData);
  }

}
