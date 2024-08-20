import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permissions } from 'src/permissions/entities/permission.entity';
import { Roles } from 'src/roles/entities/roles.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { RouteEvent } from 'src/route-events/entities/route-event.entity';
import { route_events } from './route-events-structure';
import { RouteEventsService } from 'src/route-events/route-events.service';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Permissions)
    private readonly permissionsRepository: Repository<Permissions>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
    @InjectRepository(RouteEvent)
    private readonly routeEventRepository: Repository<RouteEvent>,
    private routeEventsService: RouteEventsService
  ) { }

  async createInitialPermissions() {

    let existingPermissions: Permissions[] = [];

    const initialPermissions = [
      { id: uuidv4(), name: 'Escritura', accessCode: 'w', state: 'ACTIVO', description: 'La escritura permite al usuario añadir información a los parámetros del sistema.' },
      { id: uuidv4(), name: 'Lectura', accessCode: 'r', state: 'ACTIVO', description: 'La lectura permite al usuario visualizar la información de los parámetros del sistema.' },
      { id: uuidv4(), name: 'Edición', accessCode: 'e', state: 'ACTIVO', description: 'La edición permite al usuario cambiar la información de los parámetros del sistema.' },
    ];

    for (let i = 0; i < initialPermissions.length; i++) {
      const permission = await this.permissionsRepository.findOne({
        where: { name: initialPermissions[i].name },
      });

      if (permission) {
        existingPermissions.push(permission);
      }
    }

    if (existingPermissions.length < 1) {
      const createdPermissions = await this.permissionsRepository.save(initialPermissions);
    }

  }

  async createInitialRoles() {
    const permissionsSisCom: any[] = [];
    const permissionsOp: any[] = [];
    const permissions = await this.permissionsRepository.find();

    permissionsSisCom.push(permissions[1], permissions[2]);
    permissionsOp.push(permissions[0]);

    const roleNames = [
      'Administrador General',
      'Administrador Comercial',
      'Administrador de sistemas',
      'Operario'
    ];

    const adminRole = new Roles();
    const comercialRole = new Roles();
    const sistemasRole = new Roles();
    const operarioRole = new Roles();

    for (let i = 0; i < roleNames.length; i++) {

      switch (roleNames[i]) {
        case 'Administrador General':
          adminRole.id = uuidv4();
          adminRole.name = roleNames[i];
          adminRole.state = 'ACTIVO';
          adminRole.permissions = permissions;
          break;

        case 'Administrador Comercial':
          comercialRole.id = uuidv4();
          comercialRole.name = roleNames[i];
          comercialRole.state = 'ACTIVO';
          comercialRole.permissions = permissionsSisCom;
          break;

        case 'Administrador de sistemas':
          sistemasRole.id = uuidv4();
          sistemasRole.name = roleNames[i];
          sistemasRole.state = 'ACTIVO';
          sistemasRole.permissions = permissionsSisCom;
          break;

        case 'Operario':
          operarioRole.id = uuidv4();
          operarioRole.name = roleNames[i];
          operarioRole.state = 'ACTIVO';
          operarioRole.permissions = permissionsOp;
          break;

        default:
          break;
      }

    }

    const existingRole = await this.rolesRepository.findOne({
      where: { name: adminRole.name || comercialRole.name || sistemasRole.name || operarioRole.name },
    });

    if (!existingRole) {
      let roles: any[] = [];
      roles.push(adminRole, comercialRole, sistemasRole, operarioRole);
      return await this.rolesRepository.save(roles);
    }

  }

  async createInitialUser() {
    const roleData = await this.rolesRepository.findOne({
      where: { name: 'Administrador General' }
    });

    const hashedPassword = await bcrypt.hash('6ebS#r&#^B6n', 10);

    const userBase = new Usuario();
    userBase.id = uuidv4();
    userBase.state = 'ACTIVO';
    userBase.firstName = 'Usuario';
    userBase.lastName = 'Admin';
    userBase.email = 'adminuser@admin.com';
    userBase.password = hashedPassword;
    userBase.role = roleData;
    userBase.idNumber = '123456';

    const existingUser = await this.usuarioRepository.findOne({
      where: { email: userBase.email }, // Busca por email en lugar de name
    });

    if (!existingUser) {
      return this.usuarioRepository.save(userBase);
    }
  }

  async createRouteEvents() {
    try {
      let RoutEvents = route_events;
      for (const event of RoutEvents) {
        const newCourse = this.routeEventRepository.create({
          ...event,
          id: uuidv4(), // Generar un nuevo UUID
          state: 'ACTIVO',
        });

        await this.routeEventsService.create(newCourse);
      }
    } catch (error) {
      console.log(error);
    }
  }

}
