import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ConfigurationSheetService } from './configuration-sheet.service';
import { ConfigurationSheet } from './entities/configuration-sheet.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('configuration-sheet')
export class ConfigurationSheetController {
  constructor(private readonly configurationSheetService: ConfigurationSheetService) { }

  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    const configurationSheetData = {
      ...body,
      image: file, // Pasar el archivo procesado al servicio
    };
    return this.configurationSheetService.create(configurationSheetData);
  }

  @Get('all')
  async findAll(): Promise<ConfigurationSheet[]> {
    return this.configurationSheetService.findAll();
  }

  @Get('getById/:id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.configurationSheetService.findOne(id);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() configurationSheetData: ConfigurationSheet): Promise<any> {
    return this.configurationSheetService.update(id, configurationSheetData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return this.configurationSheetService.remove(id);
  }
}
