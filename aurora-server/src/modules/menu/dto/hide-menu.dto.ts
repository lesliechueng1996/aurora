import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class HideMenuDto {
  @IsBoolean({
    message: '是否隐藏必须是布尔值',
  })
  @ApiProperty({
    description: '是否隐藏',
    example: true,
  })
  isHide: boolean;
}
