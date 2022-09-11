import { IsNotEmpty } from 'class-validator';

export class WineQueryDto {
  @IsNotEmpty()
  name: string;
}
