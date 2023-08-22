import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateTagDto {
  @IsNotEmpty({
    message: '标签名称不能为空',
  })
  @MaxLength(20, {
    message: '标签名称不能超过20个字符',
  })
  @ApiProperty({
    description: '标签名称',
    example: 'ReactJS',
  })
  tagName: string;
}
