import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { ArticleDraftDto } from './article-draft.dto';
import { ArticleType } from 'src/pojo/article.enum';

export class ArticleSaveDto extends ArticleDraftDto {
  @ApiProperty({
    description: '分类ID',
    example: 1,
    required: false,
  })
  categoryId?: number;

  @ApiProperty({
    description: '标签ID',
    example: 1,
    required: false,
  })
  tagId?: number;

  @ApiProperty({
    description: '文章类型',
    example: 1,
  })
  @IsOptional()
  @IsEnum([ArticleType.ORIGINAL, ArticleType.REPRINT, ArticleType.TRANSLATE], {
    message: '文章类型必须是原创、转载或翻译',
  })
  type: number;

  @ApiProperty({
    description: '原文链接',
    example: 'https://xxx.com/xxx/xxx',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: '原文链接必须是URL地址' })
  @MaxLength(255, {
    message: '原文链接长度不能超过255个字符',
  })
  originalUrl?: string;

  @ApiProperty({
    description: '封面图片ID',
    example: 'xxxx-xxxx-xxxx-xxxx',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '封面图片ID必须是字符串' })
  @MaxLength(1024, {
    message: '封面图片ID长度不能超过1024个字符',
  })
  image?: string;

  @ApiProperty({
    description: '是否置顶',
    example: false,
  })
  @IsBoolean({ message: '是否置顶必须是布尔值' })
  isTop: boolean;

  @ApiProperty({
    description: '是否推荐',
    example: false,
  })
  @IsBoolean({ message: '是否推荐必须是布尔值' })
  isFeatured: boolean;

  @ApiProperty({
    description: '访问密码',
    example: 'xxxx-xxxx-xxxx-xxxx',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '访问密码必须是字符串' })
  @MaxLength(255, {
    message: '访问密码长度不能超过255个字符',
  })
  password?: string;
}
