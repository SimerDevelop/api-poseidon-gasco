import { Module } from '@nestjs/common';
import { StationaryTankService } from './stationary-tank.service';
import { StationaryTankController } from './stationary-tank.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StationaryTank } from './entities/stationary-tank.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StationaryTank])
  ],
  controllers: [StationaryTankController],
  providers: [StationaryTankService],
})
export class StationaryTankModule {}
