import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { FactorService } from './factor.service';
import { Factor } from './entities/factor.entity';
import { ApiKeyGuard } from 'src/auth/api-key.middleware';

@Controller('factor')
@UseGuards(ApiKeyGuard)
export class FactorController {
  constructor(private readonly factorService: FactorService) {}

  @Get('all')
  async findAll(): Promise<Factor[]> {
    return this.factorService.findAll();
  }

  @Get('getById/:id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.factorService.findOne(id);
  }

  @Post('create')
  async create(@Body() factorData: Factor): Promise<Factor> {
    return this.factorService.create(factorData);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() factorData: Factor): Promise<any> {
    return this.factorService.update(id, factorData);
  }

}
