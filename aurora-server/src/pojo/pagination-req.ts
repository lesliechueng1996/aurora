import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsPositive, Max } from 'class-validator';

export class PaginationReq implements IPaginationReq {
  @ApiProperty({
    description: '页码',
    example: 1,
  })
  @IsInt({
    message: '页码应是整数',
  })
  @IsPositive({
    message: '页码应大于0',
  })
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  page: number;

  @ApiProperty({
    description: '每页条数',
    example: 10,
  })
  @IsInt({
    message: '每页条数应是整数',
  })
  @IsPositive({
    message: '每页条数应大于0',
  })
  @Max(50, {
    message: '每页条数应小于等于50',
  })
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  limit: number;
}
