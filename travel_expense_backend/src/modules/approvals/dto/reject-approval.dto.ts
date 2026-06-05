import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RejectApprovalDto {
  @ApiProperty({ example: 'Estimated cost is too high; please check alternative flights.' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'Rejection reason must be at least 5 characters long.' })
  reason: string;
}
