import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entity/tag.entity';
import { Like, Repository } from 'typeorm';
import { ListTagDto } from './dto/list-tag.dto';
import { formatDate } from '../../utils/date';

@Injectable()
export class TagService {
  private readonly logger = new Logger(TagService.name);

  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>, // private readonly articleService: ArticleService,
  ) {}

  private async assertTagNameNotExist(tagName: string) {
    const count = await this.tagRepository.countBy({ tagName });
    if (count > 0) {
      this.logger.error(`标签已存在, tagName: ${tagName}`);
      throw new ConflictException('已存在该标签');
    }
  }

  async createCatrgory(tagName: string) {
    await this.assertTagNameNotExist(tagName);
    await this.tagRepository.insert({ tagName });
  }

  async searchCategories({ searchTagName, page, limit }: ListTagDto) {
    const [list, total] = await this.tagRepository.findAndCount({
      where: {
        tagName: Like(`%${searchTagName}%`),
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    // const temp = await this.articleService.countByTagId(
    //   list.map((item) => item.id),
    // );

    const modifiedList = list.map((item) => {
      return {
        id: item.id,
        tagName: item.tagName,
        // articleCount: temp.find((i) => i.tag_id === item.id).count,
        articleCount: 0,
        createTime: formatDate(item.createTime),
      };
    });

    return { modifiedList, total };
  }

  deleteById(id: number) {
    return this.tagRepository.delete(id);
  }

  deleteBatch(ids: number[]) {
    return this.tagRepository.delete(ids);
  }

  findById(id: number) {
    return this.tagRepository.findOneBy({ id });
  }

  async updateById(id: number, tagName: string) {
    const tag = await this.findById(id);
    if (!tag) {
      this.logger.error(`标签不存在, id: ${id}`);
      throw new NotFoundException('标签不存在');
    }

    await this.assertTagNameNotExist(tagName);
    await this.tagRepository.update(id, { tagName });
  }

  findAllAsKeyPair() {
    return this.tagRepository.find().then((res: Tag[]) => {
      return res.map((item) => ({
        key: item.id,
        label: item.tagName,
      }));
    });
  }
}
