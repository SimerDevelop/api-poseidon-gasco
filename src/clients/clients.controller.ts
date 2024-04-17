import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';

@Controller('client')
export class ClientsController {
  constructor(private readonly clientstService: ClientsService) { }

  @Get('all')
  async findAll(): Promise<Client[]> {
    return this.clientstService.findAll();
  }

  @Get('getById/:id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.clientstService.findOne(id);
  }

  @Post('create')
  async create(@Body() clientData: Client): Promise<Client> {    
    return this.clientstService.create(clientData);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() clientData: Client): Promise<any> {
    return this.clientstService.update(id, clientData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return this.clientstService.remove(id);
  }


  /////////////////////////////////////////////////////////////////////////

  @Get('getByBranchOfficeId/:id')
  async getByBranchOfficeId(@Param('id') id: string): Promise<any> {
    return this.clientstService.getByBranchOfficeId(id);
  }
}
