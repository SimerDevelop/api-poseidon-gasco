import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { BranchOfficesService } from './branch-offices.service';
import { BranchOffices } from './entities/branch-office.entity';
import { ApiKeyGuard } from 'src/auth/api-key.middleware';

@Controller('branch-offices')
@UseGuards(ApiKeyGuard)
export class BranchOfficesController {
    constructor(private branchOfficesService: BranchOfficesService) { }

    @Post('all')
    async findAll(@Body('pageData') pageData: any): Promise<Request[]> {
      return this.branchOfficesService.findAll(pageData);
    }

    @Get('all/pending')
    async findAllPending(): Promise<Permissions[]> {
        return this.branchOfficesService.findAllPending();
    }

    @Get('getById/:id')
    async findOne(@Param('id') id: string): Promise<any> {
        return this.branchOfficesService.findOne(id);
    }

    @Post('create')
    async create(@Body() branchOfficeData: BranchOffices): Promise<BranchOffices> {
        return this.branchOfficesService.create(branchOfficeData);
    }

    @Put('update/:id')
    async update(@Param('id') id: string, @Body() branchOfficeData: BranchOffices): Promise<any> {
        return this.branchOfficesService.update(id, branchOfficeData);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<any> {
        return this.branchOfficesService.delete(id);
    }

    //////////////////////////////////////////////////////////////////////////

    @Delete('approve/:id')
    async approveBranchOffice(@Param('id') id: string): Promise<any> {
        return this.branchOfficesService.approveBranchOffice(id);
    }

    @Get('getWithBills')
    async findBranchOfficesWithBills(): Promise<Permissions[]> {
        return this.branchOfficesService.findBranchOfficesWithBills();
    }

    @Get('getAvailableBranchOffices')
    async getAvailableBranchOffices(): Promise<Permissions[]> {
        return this.branchOfficesService.getAvailableBranchOffices();
    }

    @Put('updateStatus/:id')
    async updateStatus(@Param('id') id: string, @Body() branchOfficeData: BranchOffices): Promise<any> {
        return this.branchOfficesService.updateStatus(id, branchOfficeData);
    }

    @Post('createMultiple')
    async createMultiple(@Body() branchOfficeData: BranchOffices): Promise<BranchOffices> {
        return this.branchOfficesService.createMultiple(branchOfficeData);
    }

    @Get('all')
    async findAlls(): Promise<Location[]> {
      return this.branchOfficesService.findAlls();
    }
    
}
