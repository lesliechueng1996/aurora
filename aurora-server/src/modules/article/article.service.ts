import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entity/article.entity';
import { Repository } from 'typeorm';
import { ListArticleDto } from './dto/list-article.dto';
import { ArticleStatus, ArticleType } from 'src/pojo/article.enum';

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

  async articlePagination(query: ListArticleDto) {
    const { status, type, categoryId, tagId, searchArticleName } = query;

    const condition = new Map<string, any>();

    if (status === ArticleStatus.ALL) {
      // do nothing
    } else if (status === ArticleStatus.RECYCLE) {
      condition.set('isDelete', true);
    } else {
      condition.set('status', status);
    }

    if (type === ArticleType.ALL) {
      // do nothing
    } else {
      condition.set('type', type);
    }

    if (categoryId !== null) {
      condition.set('categoryId', categoryId);
    }

    if (tagId !== null) {
      condition.set('tagId', tagId);
    }

    if (searchArticleName) {
      condition.set('searchArticleName', searchArticleName);
    }

    const sql = `
      select
        a.id, a.article_title, a.article_cover, t.tag_name,
        c.category_name, 0 as view_count, a.status, a.create_time,
        a.is_top, a.is_featured
      from t_article a
      left join t_article_tag at on at.article_id = a.id
      left join t_tag t on t.id = at.tag_id
      left join t_category c on c.id = a.category_id
      ${condition.size > 0 ? 'where' : ''}
      ${Array.from(condition.keys())
        .map((key) => {
          if (key === 'searchArticleName') {
            return `a.article_title like '%${condition.get(key)}%'`;
          } else if (key === 'isDelete') {
            return `a.is_delete = ${condition.get(key)}`;
          } else if (key === 'status') {
            return `a.status = ${condition.get(key)}`;
          } else if (key === 'type') {
            return `a.type = ${condition.get(key)}`;
          } else if (key === 'categoryId') {
            return `a.category_id = ${condition.get(key)}`;
          } else if (key === 'tagId') {
            return `at.tag_id = ${condition.get(key)}`;
          }
        })
        .join(' and ')}
      order by a.is_top, a.is_featured, a.create_time desc
      limit ${query.limit}
      offset ${(query.page - 1) * query.limit}
    `;

    this.articleRepository.query(sql);
  }
}
