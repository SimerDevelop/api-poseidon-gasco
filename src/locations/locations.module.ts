import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { BranchOffices } from 'src/branch-offices/entities/branch-office.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location, BranchOffices])],
  controllers: [LocationsController],
  providers: [LocationsService],
})
export class LocationsModule { }
