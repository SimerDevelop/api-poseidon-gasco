import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Roles } from './entities/roles.entity';
import { ApiKeyGuard } from 'src/auth/api-key.middleware';

@Controller('roles')
@UseGuards(ApiKeyGuard)
export class RolesController {
    constructor(private rolesService: RolesService) { }

    @Get('all')
    async findAll(): Promise<Roles[]> {
        return this.rolesService.findAll();
    }

    @Get('getById/:id')
    async findOne(@Param('id') id: string): Promise<any> {
        return this.rolesService.findOne(id);
    }

    @Post('create')
    async create(@Body() rolesData: Roles): Promise<Roles> {
        return this.rolesService.create(rolesData);
    }

    @Put('update/:id')
    async update(@Param('id') id: string, @Body() roleData: Roles): Promise<any> {
        return this.rolesService.update(id, roleData);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<any> {
        return this.rolesService.remove(id);
    }
}
