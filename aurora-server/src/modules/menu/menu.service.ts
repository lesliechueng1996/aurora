import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './entity/menu.entity';
import { In, Like, Repository } from 'typeorm';
import { MenuCreateDto } from './dto/menu-create.dto';
import { MenuItem, modify } from './dto/menu-item.dto';

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
    const rootMenus: MenuItem[] = menus
      .filter((item) => item.parentId === null)
      .map((item) => modify(item));

    const findChildren = (parent: MenuItem) => {
      const children = menus
        .filter((item) => item.parentId === parent.id)
        .map((item) => modify(item));
      if (children.length > 0) {
        parent.children = children;
      }
    };
    rootMenus.forEach((root) => findChildren(root));
    return rootMenus;
  }

  async searchMenus(useInIndex: boolean, menuName?: string) {
    let menus: Menu[] = [];
    if (menuName) {
      const temp = await this.menuRepository.findBy({
        name: Like(`%${menuName}%`),
      });
      const parentMenu = temp.filter(
        (item) => item.parentId === null && item.path === null,
      );
      const childMenu = temp.filter((item) => item.parentId !== null);
      menus = menus.concat(temp);
      menus = menus.concat(
        await this.menuRepository.findBy({
          parentId: In(parentMenu.map((item) => item.id)),
        }),
      );
      menus = menus.concat(
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

    if (useInIndex) {
      return this.generateTree(menus.filter((item) => !item.isHidden));
    }
    return this.generateTree(menus);
  }

  async hideMenu(id: number) {
    await this.menuRepository.update(id, {
      isHidden: true,
    });
    await this.menuRepository.update(
      {
        parentId: id,
      },
      {
        isHidden: true,
      },
    );
  }

  showMenu(id: number) {
    return this.menuRepository.update(id, {
      isHidden: false,
    });
  }
}
