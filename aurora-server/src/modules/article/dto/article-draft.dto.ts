import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ArticleDraftDto {
  @ApiProperty({
    description: '文章ID',
    example: 1,
    required: false,
  })
  id?: number;

  @ApiProperty({
    description: '文章标题',
    example: 'Spring',
  })
  @IsString({
    message: '文章标题必须是字符串',
  })
  @IsNotEmpty({
    message: '文章标题不能为空',
  })
  @MaxLength(50, {
    message: '文章标题不能超过50个字符',
  })
  title: string;

  @ApiProperty({
    description: '文章内容',
    example: 'xxx',
  })
  @IsString({
    message: '文章内容必须是字符串',
  })
  @IsNotEmpty({
    message: '文章内容不能为空',
  })
  content: string;
}
