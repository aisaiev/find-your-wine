import { IsNotEmpty, MaxLength } from 'class-validator';

export class WineQueryDto {
  @IsNotEmpty()
  @MaxLength(64)
  name: string;
}
