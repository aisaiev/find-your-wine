import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { VivinoService } from './vivino.service';

@Module({
  imports: [HttpModule],
  providers: [VivinoService],
  exports: [VivinoService],
})
export class VivinoModule {}
