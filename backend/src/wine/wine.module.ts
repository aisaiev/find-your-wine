import { Module } from '@nestjs/common';
import { VivinoModule } from 'src/vivino/vivino.module';
import { WineController } from './wine.controller';
import { WineService } from './wine.service';

@Module({
  imports: [VivinoModule],
  controllers: [WineController],
  providers: [WineService],
})
export class WineModule {}
