import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entity/article.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  countByCategoryId(categoryIds: number[]) {
    const result = this.articleRepository.query(`
      select 
        count(*) as count, 
        category_id 
      from t_article
      group by category_id
      having category_id in (${categoryIds.join(',')})
    `);

    console.log(result);

    return result;
  }
}
