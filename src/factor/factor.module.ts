import { Module } from '@nestjs/common';
import { FactorService } from './factor.service';
import { FactorController } from './factor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factor } from './entities/factor.entity';

@Module({
  imports : [
    TypeOrmModule.forFeature([Factor])
  ],
  controllers: [FactorController],
  providers: [FactorService],
})
export class FactorModule {}
