import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { BillService } from './bill.service';
import { Bill } from './entities/bill.entity';
import { ApiKeyGuard } from 'src/auth/api-key.middleware';


@Controller('bill')
@UseGuards(ApiKeyGuard)
export class BillController {
  constructor(private billService: BillService) { }

  @Get('all')
  async findAll(): Promise<Bill[]> {
    return this.billService.findAll();
  }

  @Get('getById/:id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.billService.findOne(id);
  }

  @Post('create')
  async create(@Body() billData: Bill): Promise<Bill> {
    return this.billService.create(billData);
  }

  @Post('createMultiple')
  async createMultiple(@Body() billData: any): Promise<Bill> {
    return this.billService.createMultiple(billData);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() billData: Bill): Promise<any> {
    return this.billService.update(id, billData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return this.billService.remove(id);
  }

  ///////////////////////////////////////////////////////////////////

  @Get('getByBranchOfficeCode/:code')
  async findBillsByBranchOffice(@Param('code') code: number): Promise<any> {
    return this.billService.findBillsByBranchOffice(code);
  }

  @Post('getByDate/:code')
  async findByDate(@Param('code') code: number, @Body() billData: any): Promise<any> {    
    return this.billService.findByDate(code, billData);
  }

  @Get('getByOperatorId/:id')
  async findBillsByOperator(@Param('id') id: string): Promise<any> {
    return this.billService.findBillsByOperator(id);
  }
}
