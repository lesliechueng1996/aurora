import {
  Controller,
  // Get, Query
} from '@nestjs/common';
import { ArticleService } from './article.service';
import {
  ApiBadRequestResponse,
  // ApiOkResponse,
  // ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller('article')
@ApiTags('文章')
@ApiBadRequestResponse({ description: '参数不合法' })
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // @Get('pagination')
  // @ApiOperation({ summary: '搜索文章列表' })
  // @ApiOkResponse({ description: '搜索文章列表成功' })
  // async articlePagination(@Query() query: ListArticleDto) {}
}
