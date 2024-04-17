import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { BranchOffices } from 'src/branch-offices/entities/branch-office.entity';
import { Occupation } from 'src/occupation/entities/occupation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, Occupation])
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule { }
