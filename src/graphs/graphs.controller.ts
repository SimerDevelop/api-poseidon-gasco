import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { GraphsService } from './graphs.service';
import { ApiKeyGuard } from 'src/auth/api-key.middleware';

@Controller('graphs')
@UseGuards(ApiKeyGuard)
export class GraphsController {
  constructor(private readonly graphsService: GraphsService) { }

  @Get('generateCsv/:id')
  generateCsv(@Param('id') branchOfficeId: number) {
    return this.graphsService.generateCsv(branchOfficeId);
  }

  @Post('generateCsvbyDate/:code')
  async generateCsvbyDate(@Param('code') code: number, @Body() billData: any): Promise<any> {    
    return this.graphsService.generateCsvbyDate(code, billData);
  }

  @Post('daily-purchase')
  dailyPurchase(@Body() dailyPurchaseData: any) {    
    return this.graphsService.dailyPurchase(dailyPurchaseData);
  }

  @Delete('remove/:id')
  remove(@Param('id') id: string) {
    return this.graphsService.remove(id);
  }

  @Delete('remove-all')
  removeAll() {
    return this.graphsService.removeAll();
  }

}
