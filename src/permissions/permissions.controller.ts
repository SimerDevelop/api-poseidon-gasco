import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { Permissions } from './entities/permission.entity';

@Controller('permissions')
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
