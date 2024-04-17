import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { AuthModule } from './auth/auth.module';
import { BranchOfficesModule } from './branch-offices/branch-offices.module';
import { CoursesModule } from './courses/courses.module';
import { BillModule } from './bill/bill.module';
import { CityModule } from './city/city.module';
import { ZoneModule } from './zone/zone.module';
import { DepartmentModule } from './department/department.module';
import { ClientsModule } from './clients/clients.module';
import { OccupationModule } from './occupation/occupation.module';
import { FactorModule } from './factor/factor.module';
import { PropaneTruckModule } from './propane-truck/propane-truck.module';
import { LocationsModule } from './locations/locations.module';
import { NotificationsModule } from './notifications/notifications.module';
import { GraphsModule } from './graphs/graphs.module';
import { TabletModule } from './tablet/tablet.module';
import { StationaryTankModule } from './stationary-tank/stationary-tank.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '123',
      database: 'sistema_registros',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Ruta a las entidades
      synchronize: true,
    }),
    UsuariosModule,
    RolesModule,
    PermissionsModule,
    AuthModule,
    BranchOfficesModule,
    CoursesModule,
    BillModule,
    CityModule,
    ZoneModule,
    DepartmentModule,
    ClientsModule,
    OccupationModule,
    FactorModule,
    PropaneTruckModule,
    LocationsModule,
    NotificationsModule,
    GraphsModule,
    TabletModule,
    StationaryTankModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

