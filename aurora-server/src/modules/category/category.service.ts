import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { Like, Repository } from 'typeorm';
import { ListCategoryDto } from './dto/list-category.dto';
// import { ArticleService } from '../article/article.service';
import { formatDate } from '../../utils/date';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>, // private readonly articleService: ArticleService,
  ) {}

  private async assertCategoryNameNotExist(categoryName: string) {
    const count = await this.categoryRepository.countBy({ categoryName });
    if (count > 0) {
      this.logger.error(`分类已存在, categoryName: ${categoryName}`);
      throw new ConflictException('已存在该分类');
    }
  }

  async createCatrgory(categoryName: string) {
    await this.assertCategoryNameNotExist(categoryName);
    await this.categoryRepository.insert({ categoryName });
  }

  async searchCategories({ searchCategoryName, page, limit }: ListCategoryDto) {
    const [list, total] = await this.categoryRepository.findAndCount({
      where: {
        categoryName: Like(`%${searchCategoryName}%`),
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    // const temp = await this.articleService.countByCategoryId(
    //   list.map((item) => item.id),
    // );

    const modifiedList = list.map((item) => {
      return {
        id: item.id,
        categoryName: item.categoryName,
        // articleCount: temp.find((i) => i.category_id === item.id).count,
        articleCount: 0,
        createTime: formatDate(item.createTime),
      };
    });

    return { modifiedList, total };
  }

  deleteById(id: number) {
    return this.categoryRepository.delete(id);
  }

  deleteBatch(ids: number[]) {
    return this.categoryRepository.delete(ids);
  }

  findById(id: number) {
    return this.categoryRepository.findOneBy({ id });
  }

  async updateById(id: number, categoryName: string) {
    const category = await this.findById(id);
    if (!category) {
      this.logger.error(`分类不存在, id: ${id}`);
      throw new NotFoundException('分类不存在');
    }

    await this.assertCategoryNameNotExist(categoryName);
    await this.categoryRepository.update(id, { categoryName });
  }

  findAllAsKeyPair() {
    return this.categoryRepository.find().then((res: Category[]) => {
      return res.map((item) => ({
        key: item.id,
        label: item.categoryName,
      }));
    });
  }
}
