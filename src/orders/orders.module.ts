import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { BranchOffices } from 'src/branch-offices/entities/branch-office.entity';
import { CommonModule } from 'src/common-services/common.module';
import { ConfigurationSheetModule } from 'src/configuration-sheet/configuration-sheet.module';
import { ConfigurationSheetService } from 'src/configuration-sheet/configuration-sheet.service';
import { ConfigurationSheet } from 'src/configuration-sheet/entities/configuration-sheet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, BranchOffices, Request, ConfigurationSheet]),
    CommonModule,
    ConfigurationSheetModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService, ConfigurationSheetService],
})
export class OrdersModule {}
