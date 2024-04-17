import { Module } from '@nestjs/common';
import { TabletService } from './tablet.service';
import { TabletController } from './tablet.controller';
import { Tablet } from './entities/tablet.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Notification } from 'src/notifications/entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tablet, Usuario, Notification])
  ],
  controllers: [TabletController],
  providers: [TabletService, NotificationsService],
})
export class TabletModule {}
