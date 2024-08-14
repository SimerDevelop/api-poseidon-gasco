import { Module } from '@nestjs/common';
import { RouteEventsService } from './route-events.service';
import { RouteEventsController } from './route-events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteEvent } from './entities/route-event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RouteEvent]),
  ],
  controllers: [RouteEventsController],
  providers: [RouteEventsService],
})
export class RouteEventsModule {}
