import { IsNotEmpty, IsString, IsDateString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTravelRequestDto {
  @ApiProperty({ example: 'Annual Summit' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Going for API training and evaluating UI frameworks.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Conference' })
  @IsString()
  @IsNotEmpty()
  purpose: string;

  @ApiProperty({ example: 'San Francisco, USA' })
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ApiProperty({ example: '2026-07-10T00:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ example: '2026-07-15T00:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ example: 120000.0 })
  @IsNumber()
  @Min(0)
  estimatedCost: number;
}
