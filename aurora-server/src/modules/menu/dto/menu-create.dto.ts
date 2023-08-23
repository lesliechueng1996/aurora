import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class MenuCreateDto {
  @ApiProperty({
    description: '菜单/目录名称',
    example: '系统管理',
  })
  @IsString({
    message: '菜单/目录名称必须是字符串',
  })
  @IsNotEmpty({
    message: '菜单/目录名称不能为空',
  })
  name: string;

  @ApiProperty({
    description: '图标',
    example: 'i-xxx',
    required: false,
  })
  icon?: string;

  @ApiProperty({
    description: '路由地址',
    example: '/system',
    required: false,
  })
  path?: string;

  @ApiProperty({
    description: '顺序',
    example: 1,
  })
  @IsInt({
    message: '顺序必须是整数',
  })
  orderNum: number;

  @ApiProperty({
    description: '是否隐藏',
    example: false,
  })
  @IsBoolean({
    message: '是否隐藏必须是布尔值',
  })
  isHidden: boolean;
}
