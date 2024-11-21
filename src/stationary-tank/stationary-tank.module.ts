import { Module } from '@nestjs/common';
import { StationaryTankService } from './stationary-tank.service';
import { StationaryTankController } from './stationary-tank.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StationaryTank } from './entities/stationary-tank.entity';
import { BranchOffices } from 'src/branch-offices/entities/branch-office.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StationaryTank,
      BranchOffices
    ])
  ],
  controllers: [StationaryTankController],
  providers: [StationaryTankService],
})
export class StationaryTankModule {}
