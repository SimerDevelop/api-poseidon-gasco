import { Module } from '@nestjs/common';
import { ConfigurationSheetService } from './configuration-sheet.service';
import { ConfigurationSheetController } from './configuration-sheet.controller';
import { ConfigurationSheet } from './entities/configuration-sheet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConfigurationSheet]),
  ],
  controllers: [ConfigurationSheetController],
  providers: [ConfigurationSheetService],
})
export class ConfigurationSheetModule {
  exports: [ConfigurationSheetService];
}
