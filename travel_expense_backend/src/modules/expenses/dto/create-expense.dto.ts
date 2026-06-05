import { IsNotEmpty, IsString, IsNumber, Min, IsArray, ValidateNested, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExpenseItemDto {
  @ApiProperty({ example: 'meals' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 450.0 })
  @IsNumber()
  @Min(0.01, { message: 'Expense amount must be greater than zero.' })
  amount: number;

  @ApiProperty({ example: 'Business lunch with clients' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'http://localhost:9000/travel-receipts/hash.png', required: false })
  @IsString()
  @IsOptional()
  receiptUrl?: string;
}

export class CreateExpenseClaimDto {
  @ApiProperty({ example: 'travel-request-uuid-here', required: false })
  @IsUUID()
  @IsOptional()
  travelRequestId?: string;

  @ApiProperty({ type: [CreateExpenseItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExpenseItemDto)
  items: CreateExpenseItemDto[];
}
