import { Module } from '@nestjs/common';
import { GraphsService } from './graphs.service';
import { GraphsController } from './graphs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from 'src/bill/entities/bill.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bill])
  ],
  controllers: [GraphsController],
  providers: [GraphsService],
})
export class GraphsModule {}
