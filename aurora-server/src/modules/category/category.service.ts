import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createCatrgory(categoryName: string) {
    const count = await this.categoryRepository.countBy({ categoryName });
    if (count > 0) {
      this.logger.error(`分类已存在, categoryName: ${categoryName}`);
      throw new ConflictException('已存在该分类');
    }

    await this.categoryRepository.insert({ categoryName });
  }
}
