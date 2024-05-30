import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { Department } from './entities/department.entity';
import { ApiKeyGuard } from 'src/auth/api-key.middleware';

@Controller('department')
@UseGuards(ApiKeyGuard)
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) { }

  @Get('all')
  async findAll(): Promise<Department[]> {
    return this.departmentService.findAll();
  }

  @Get('getById/:id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.departmentService.findOne(id);
  }

  @Post('create')
  async create(@Body() departmentData: Department): Promise<Department> {
    return this.departmentService.create(departmentData);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() departmentData: Department): Promise<any> {
    return this.departmentService.update(id, departmentData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return this.departmentService.remove(id);
  }

}
