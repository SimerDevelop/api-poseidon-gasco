import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { TabletService } from './tablet.service';
import { Tablet } from './entities/tablet.entity';

@Controller('tablet')
export class TabletController {
  constructor(private readonly tabletService: TabletService) {}

  @Get('all')
  async findAll(): Promise<Tablet[]> {
    return this.tabletService.findAll();
  }

  @Get('getById/:id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.tabletService.findOne(id);
  }

  @Post('create')
  async create(@Body() TabletData: Tablet): Promise<Tablet> {
    return this.tabletService.create(TabletData);
  }

  @Post('update/:id')
  async update(@Param('id') id: string, @Body() TabletData: Tablet): Promise<any> {
    return this.tabletService.update(id, TabletData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return this.tabletService.remove(id);
  }
}
