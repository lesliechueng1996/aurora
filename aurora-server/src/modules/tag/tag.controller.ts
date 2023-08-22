import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TagService } from './tag.service';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTagDto } from './dto/create-tag.dto';
import { ListTagDto } from './dto/list-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller('tag')
@ApiTags('标签')
@ApiBadRequestResponse({ description: '参数不合法' })
export class TagController {
  private readonly logger = new Logger(TagController.name);

  constructor(private readonly tagService: TagService) {}

  @Post()
  @ApiOperation({ summary: '创建标签' })
  @ApiCreatedResponse({ description: '标签创建成功' })
  @ApiConflictResponse({ description: '标签已存在' })
  @ApiBadRequestResponse({ description: '标签名不合法' })
  async createTag(@Body() body: CreateTagDto) {
    const { tagName } = body;
    await this.tagService.createCatrgory(tagName);
  }

  @Get()
  @ApiOperation({ summary: '搜索标签列表' })
  @ApiOkResponse({ description: '搜索标签列表成功' })
  async findCategories(@Query() query: ListTagDto) {
    return await this.tagService.searchCategories(query);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除标签' })
  @ApiParam({ name: 'id', description: '标签ID', example: 1 })
  @ApiOkResponse({ description: '删除成功' })
  async deleteOneTag(@Param('id', ParseIntPipe) id: number) {
    await this.tagService.deleteById(id);
  }

  @Delete()
  @ApiOperation({ summary: '批量删除标签' })
  @ApiQuery({
    name: 'ids',
    description: '标签ID数组',
    example: [1, 2, 3],
    type: [Number],
  })
  @ApiOkResponse({ description: '批量删除成功' })
  async deleteBatchCategories(
    @Query(
      'ids',
      new ParseArrayPipe({
        items: Number,
        separator: ',',
      }),
    )
    ids: number[],
  ) {
    await this.tagService.deleteBatch(ids);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取标签详情' })
  @ApiParam({ name: 'id', description: '标签ID', example: 1 })
  @ApiOkResponse({ description: '获取标签详情成功' })
  @ApiNotFoundResponse({ description: '标签不存在' })
  async getTag(@Param('id', ParseIntPipe) id: number) {
    const tag = await this.tagService.findById(id);
    if (!tag) {
      this.logger.error(`标签不存在, id: ${id}`);
      throw new NotFoundException('标签不存在');
    }
    return tag;
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新标签' })
  @ApiParam({ name: 'id', description: '标签ID', example: 1 })
  @ApiOkResponse({ description: '更新标签成功' })
  @ApiNotFoundResponse({ description: '标签不存在' })
  @ApiConflictResponse({ description: '标签名已存在' })
  @ApiBadRequestResponse({ description: '标签名不合法' })
  async updateTag(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTagDto,
  ) {
    await this.tagService.updateById(id, body.tagName);
  }
}
