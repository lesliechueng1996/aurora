import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('分类')
@Controller('category')
export class CategoryController {
  private readonly logger = new Logger(CategoryController.name);

  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiCreatedResponse({ description: '分类创建成功' })
  @ApiConflictResponse({ description: '分类已存在' })
  @ApiBadRequestResponse({ description: '分类名不合法' })
  async createCategory(@Body() body: CreateCategoryDto) {
    const { categoryName } = body;
    this.logger.log(`Create category, categoryName: ${categoryName}`);
    await this.categoryService.createCatrgory(categoryName);
  }
}
