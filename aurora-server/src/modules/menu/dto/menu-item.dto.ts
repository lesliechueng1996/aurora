import { Menu } from '../entity/menu.entity';
import { formatDate } from '../../../utils/date';

export type MenuItem = {
  id: number;
  name: string;
  path: string | null;
  icon: string | null;
  orderNum: number;
  isHidden: boolean;
  createTime: string;
  children?: MenuItem[];
};

export function modify(menu: Menu): MenuItem {
  return {
    id: menu.id,
    name: menu.name,
    path: menu.path,
    icon: menu.icon,
    orderNum: menu.orderNum,
    isHidden: menu.isHidden,
    createTime: formatDate(menu.createTime),
  };
}
