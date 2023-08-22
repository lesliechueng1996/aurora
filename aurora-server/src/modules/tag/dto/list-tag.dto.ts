import { ApiProperty } from '@nestjs/swagger';
import { PaginationReq } from '../../../pojo/pagination-req';

export class ListTagDto extends PaginationReq {
  @ApiProperty({
    description: '搜索标签名',
    example: 'Spring',
  })
  searchTagName: string;
}
