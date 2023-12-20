import { Module } from '@nestjs/common';
import { WineModule } from './wine/wine.module';
import { VivinoModule } from './vivino/vivino.module';

@Module({
  imports: [WineModule, VivinoModule],
})
export class AppModule {}
