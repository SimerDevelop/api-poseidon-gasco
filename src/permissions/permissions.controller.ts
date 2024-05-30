import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { Permissions } from './entities/permission.entity';
import { ApiKeyGuard } from 'src/auth/api-key.middleware';

@Controller('permissions')
@UseGuards(ApiKeyGuard)
export class PermissionsController {
    constructor(private permissionsService: PermissionsService) { }

    @Get('all')
    async findAll(): Promise<Permissions[]> {
        return this.permissionsService.findAll();
    }

    @Get('getById/:id')
    async findPermissionById(@Param('id') id: string): Promise<any> {
        return this.permissionsService.findPermissionById(id);
    }

    @Post('create')
    async createRol(@Body() permissionData: Permissions): Promise<Permissions> {
        return this.permissionsService.create(permissionData);
    }

    @Put('update/:id')
    async updatePermissionById(@Param('id') id: string, @Body() permissionData: Permissions): Promise<any> {
        return this.permissionsService.updatePermissionById(id, permissionData);
    }

    @Delete(':id')
    async deletePermission(@Param('id') id: string): Promise<any> {
        return this.permissionsService.deletePermission(id);
    }

}
