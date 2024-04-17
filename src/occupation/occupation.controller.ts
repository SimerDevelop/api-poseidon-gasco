import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { OccupationService } from './occupation.service';
import { Occupation } from './entities/occupation.entity';

@Controller('occupation')
export class OccupationController {
  constructor(private readonly occupationService: OccupationService) { }

  @Get('all')
  async findAll(): Promise<Occupation[]> {
    return this.occupationService.findAll();
  }

  @Get('getById/:id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.occupationService.findOne(id);
  }

  @Post('create')
  async create(@Body() occupationData: Occupation): Promise<Occupation> {
    return this.occupationService.create(occupationData);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() occupationData: Occupation): Promise<any> {
    return this.occupationService.update(id, occupationData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return this.occupationService.remove(id);
  }
}
