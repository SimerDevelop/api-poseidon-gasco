import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class InitialPermissionsController {
  constructor(private readonly authService: AuthService) { }

  @Get('initial-permissions')
  createInitialPermissions() {
    const initialPermissions = this.authService.createInitialPermissions();
    const initialRoles = this.authService.createInitialRoles();
    const initialUser = this.authService.createInitialUser();
    
    return {
      permissions: initialPermissions,
      roles: initialRoles,
      user: initialUser
    };
  }
}
