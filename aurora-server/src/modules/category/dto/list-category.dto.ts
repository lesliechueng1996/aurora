import { ApiProperty } from '@nestjs/swagger';
import { PaginationReq } from '../../../pojo/pagination-req';

export class ListCategoryDto extends PaginationReq {
  @ApiProperty({
    description: '搜索分类名',
    example: 'Spring',
  })
  searchCategoryName: string;
}
