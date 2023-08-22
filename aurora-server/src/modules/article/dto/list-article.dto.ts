import { ApiProperty } from '@nestjs/swagger';
import { PaginationReq } from '../../../pojo/pagination-req';
import { IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

export class ListArticleDto extends PaginationReq {
  @ApiProperty({
    description: '搜索文章名',
    example: 'Spring',
  })
  searchArticleName: string;

  @ApiProperty({
    description: '文章状态, 0-全部, 1-公开, 2-私密, 3-草稿, 4-回收站',
    enum: [0, 1, 2, 3, 4],
    example: 0,
  })
  @IsEnum([0, 1, 2, 3, 4], {
    message: '文章状态不合法, 0-全部, 1-公开, 2-私密, 3-草稿, 4-回收站',
  })
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  status: number;

  @ApiProperty({
    description: '文章类型, 0-全部, 1-原创, 2-转载, 3-翻译',
    enum: [0, 1, 2, 3],
    example: 0,
  })
  @IsEnum([0, 1, 2, 3], {
    message: '文章状态不合法, 0-全部, 1-原创, 2-转载, 3-翻译',
  })
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  type: number;

  @ApiProperty({
    description: '分类id',
    example: 1,
  })
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  categoryId: number | null;

  @ApiProperty({
    description: '标签id',
    example: 1,
  })
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  tagId: number | null;
}
