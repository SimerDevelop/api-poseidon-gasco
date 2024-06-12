import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { BranchOffices } from 'src/branch-offices/entities/branch-office.entity';
import { CommonModule } from 'src/common-services/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, BranchOffices]),
    CommonModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
