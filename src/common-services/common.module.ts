// common.module.ts
import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchOffices } from 'src/branch-offices/entities/branch-office.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { Notification } from 'src/notifications/entities/notification.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([BranchOffices, Course, Usuario, Notification]),
        NotificationsModule
    ],
    providers: [CommonService],
    exports: [CommonService], // exporta CommonService para que otros módulos puedan usarlo
})
export class CommonModule { }