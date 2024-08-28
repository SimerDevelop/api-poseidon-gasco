import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { LogReportService } from './log-report.service';
import { LogReport } from './entities/log-report.entity';

@Controller('log-report')
export class LogReportController {
  constructor(private readonly logReportService: LogReportService) {}

  @Post('create')
  async create(@Body() logReportData: LogReport): Promise<LogReport> {
    return this.logReportService.create(logReportData);
  }
  
  @Get('all')
  async findAll(): Promise<LogReport[]> {
    return this.logReportService.findAll();
  }

  @Get('getById/:id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.logReportService.findOne(id);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() logReportData: LogReport): Promise<any> {
    return this.logReportService.update(id, logReportData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return this.logReportService.remove(id);
  }
}
