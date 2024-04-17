import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { City } from './entities/city.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from 'src/department/entities/department.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([City, Department]),
  ],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}
