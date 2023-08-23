import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './entity/menu.entity';
import { In, Like, Repository } from 'typeorm';
import { MenuCreateDto } from './dto/menu-create.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  async saveMenu(dto: MenuCreateDto) {
    const menu = this.menuRepository.create({
      ...dto,
    });
    return await this.menuRepository.save(menu);
  }

  async saveSubMenu(parentId: number, dto: MenuCreateDto) {
    const menu = this.menuRepository.create({
      ...dto,
      parentId,
    });
    return await this.menuRepository.save(menu);
  }

  generateTree(menus: Menu[]) {
    const rootMenus = menus.filter((item) => item.parentId === null);
    const findChildren = (parent: Menu) => {
      const children = menus.filter((item) => item.parentId === parent.id);
      if (children.length > 0) {
        parent.children = children;
      }
    };
    rootMenus.forEach((root) => findChildren(root));
    return rootMenus;
  }

  async searchMenus(menuName?: string) {
    let menus: Menu[] = [];
    if (menuName) {
      const temp = await this.menuRepository.findBy({
        name: Like(`%${menuName}%`),
      });
      const parentMenu = temp.filter(
        (item) => item.parentId === null && item.path === null,
      );
      const childMenu = temp.filter((item) => item.parentId !== null);
      menus.concat(temp);
      menus.concat(
        await this.menuRepository.findBy({
          parentId: In(parentMenu.map((item) => item.id)),
        }),
      );
      menus.concat(
        await this.menuRepository.findBy({
          id: In(childMenu.map((item) => item.parentId)),
        }),
      );

      // menus 根据 id 去重
      menus = menus.filter(
        (item, index, self) =>
          self.findIndex((v) => v.id === item.id) === index,
      );

      // menus 根据 orderNum 升序排序
      menus.sort((a, b) => a.orderNum - b.orderNum);
    } else {
      menus = await this.menuRepository.find({
        order: {
          orderNum: 'ASC',
        },
      });
    }

    return this.generateTree(menus);
  }
}
