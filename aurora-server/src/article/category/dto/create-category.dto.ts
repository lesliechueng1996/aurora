import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({
    message: '分类名称不能为空',
  })
  @MaxLength(20, {
    message: '分类名称不能超过20个字符',
  })
  categoryName: string;
}
