import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entity/article.entity';
import { Repository } from 'typeorm';
import { ListArticleDto } from './dto/list-article.dto';
import { ArticleStatus, ArticleType } from 'src/pojo/article.enum';
import { ArticleSaveDto } from './dto/article-save.dto';

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

  async getArticleById(id: number) {
    return this.articleRepository.findOneBy({ id });
  }

  async isDraftExist(id: number | null | undefined) {
    if (!id) {
      return false;
    }
    const article = await this.getArticleById(id);
    return article && article.status === ArticleStatus.DRAFT;
  }

  async saveDraft(title: string, content: string) {
    const article = this.articleRepository.create({
      // TODO - update
      userId: 1,
      articleTitle: title,
      articleContent: content,
      status: ArticleStatus.DRAFT,
    });
    return await this.articleRepository.save(article);
  }

  async updateDraft(id: number, title: string, content: string) {
    await this.articleRepository.update(id, {
      articleTitle: title,
      articleContent: content,
    });
  }

  createArticle(dto: ArticleSaveDto) {
    const isPrivate = !!dto.password;
    const article = this.articleRepository.create({
      // TODO - update
      userId: 1,
      categoryId: dto.categoryId || null,
      articleCover: dto.image || null,
      articleTitle: dto.title,
      articleContent: dto.content,
      isTop: dto.isTop,
      isFeatured: dto.isFeatured,
      isDelete: false,
      status: isPrivate ? ArticleStatus.PRIVATE : ArticleStatus.PUBLIC,
      type: dto.type,
      password: dto.password || null,
      originalUrl: dto.originalUrl || null,
    });
    return article;
  }

  async saveArticle(dto: ArticleSaveDto) {
    return await this.articleRepository.save(this.createArticle(dto));
  }

  async draftToArticle(dto: ArticleSaveDto) {
    return await this.articleRepository.update(dto.id, this.createArticle(dto));
  }
}
