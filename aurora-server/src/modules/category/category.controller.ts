import {
  Body,
  Controller,
  Get,
  Logger,
  Query,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  ParseArrayPipe,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
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
import { ListCategoryDto } from './dto/list-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('分类')
@Controller('category')
@ApiBadRequestResponse({ description: '参数不合法' })
export class CategoryController {
  private readonly logger = new Logger(CategoryController.name);

  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: '创建分类' })
  @ApiCreatedResponse({ description: '分类创建成功' })
  @ApiConflictResponse({ description: '分类已存在' })
  @ApiBadRequestResponse({ description: '分类名不合法' })
  async createCategory(@Body() body: CreateCategoryDto) {
    const { categoryName } = body;
    await this.categoryService.createCatrgory(categoryName);
  }

  @Get('pagination')
  @ApiOperation({ summary: '搜索分类列表' })
  @ApiOkResponse({ description: '搜索分类列表成功' })
  async findCategories(@Query() query: ListCategoryDto) {
    return await this.categoryService.searchCategories(query);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除分类' })
  @ApiParam({ name: 'id', description: '分类ID', example: 1 })
  @ApiOkResponse({ description: '删除成功' })
  async deleteOneCategory(@Param('id', ParseIntPipe) id: number) {
    await this.categoryService.deleteById(id);
  }

  @Delete()
  @ApiOperation({ summary: '批量删除分类' })
  @ApiQuery({
    name: 'ids',
    description: '分类ID数组',
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
    await this.categoryService.deleteBatch(ids);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取分类详情' })
  @ApiParam({ name: 'id', description: '分类ID', example: 1 })
  @ApiOkResponse({ description: '获取分类详情成功' })
  @ApiNotFoundResponse({ description: '分类不存在' })
  async getCategory(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoryService.findById(id);
    if (!category) {
      this.logger.error(`分类不存在, id: ${id}`);
      throw new NotFoundException('分类不存在');
    }
    return category;
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新分类' })
  @ApiParam({ name: 'id', description: '分类ID', example: 1 })
  @ApiOkResponse({ description: '更新分类成功' })
  @ApiNotFoundResponse({ description: '分类不存在' })
  @ApiConflictResponse({ description: '分类名已存在' })
  @ApiBadRequestResponse({ description: '分类名不合法' })
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCategoryDto,
  ) {
    await this.categoryService.updateById(id, body.categoryName);
  }

  @Get('options')
  @ApiOperation({ summary: '获取分类选项' })
  @ApiOkResponse({ description: '获取分类选项成功' })
  async categoryOptions() {
    return await this.categoryService.findAllAsKeyPair();
  }
}
