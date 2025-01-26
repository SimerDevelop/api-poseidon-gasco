import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { RequestService } from './request.service';
import { Request } from './entities/request.entity';
import { ApiKeyGuard } from 'src/auth/api-key.middleware';

@Controller('request')
@UseGuards(ApiKeyGuard)
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post('all')
  async findAll(@Body('pageData') pageData: any): Promise<Request[]> {
    return this.requestService.findAll(pageData);
  }

  @Get('getById/:id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.requestService.findOne(id);
  }

  @Post('create')
  async create(@Body() requestData: Request): Promise<Request> {
    return this.requestService.create(requestData);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() requestData: Request): Promise<any> {
    return this.requestService.update(id, requestData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return this.requestService.remove(id);
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////

  @Get('getByPlate/:id')
  async findRequestByPlate(@Param('id') id: any): Promise<any> {
    return this.requestService.findRequestByPlate(id);
  }

  @Post('findRequestByQuery')
  async findRequestByQuery(@Body() query: any): Promise<any> {
    return this.requestService.findRequestByQuery(query);
  }
  
}
