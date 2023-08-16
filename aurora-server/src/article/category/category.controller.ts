import { Body, Controller, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategory(@Body() body: CreateCategoryDto) {
    const { categoryName } = body;
    await this.categoryService.createCatrgory(categoryName);
  }
}
