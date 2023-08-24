import { Controller, Post, Get, Query, Body } from '@nestjs/common';
import { ArticleService } from './article.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ListArticleDto } from './dto/list-article.dto';
import { ArticleDraftDto } from './dto/article-draft.dto';
import { ArticleSaveDto } from './dto/article-save.dto';

@Controller('article')
@ApiTags('文章')
@ApiBadRequestResponse({ description: '参数不合法' })
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('pagination')
  @ApiOperation({ summary: '搜索文章列表' })
  @ApiOkResponse({ description: '搜索文章列表成功' })
  async articlePagination(@Query() query: ListArticleDto) {
    console.log(query);
  }

  @Post('draft')
  @ApiOperation({ summary: '保存草稿' })
  @ApiCreatedResponse({ description: '保存草稿成功, 文章ID' })
  async saveAsDraft(@Body() body: ArticleDraftDto) {
    const { id, title, content } = body;
    const isDraftExist = await this.articleService.isDraftExist(id);
    if (isDraftExist) {
      await this.articleService.updateDraft(id, title, content);
      return id;
    } else {
      const article = await this.articleService.saveDraft(title, content);
      return article.id;
    }
  }

  @Post()
  @ApiOperation({ summary: '保存文章' })
  @ApiCreatedResponse({ description: '保存文章成功' })
  async saveArticle(@Body() body: ArticleSaveDto) {
    const { id } = body;
    const isDraftExist = await this.articleService.isDraftExist(id);
    if (isDraftExist) {
      await this.articleService.draftToArticle(body);
    } else {
      await this.articleService.saveArticle(body);
    }
  }
}
