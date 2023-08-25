import { useQuery } from '@tanstack/react-query';
import type { MenuProps } from 'antd';
import DynamicIcon from '../components/DynamicIcon';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { invokeApi } from '../utils/http';

export type MenuItem = Required<MenuProps>['items'][number];

const fetchMenu = () => invokeApi('/menu');

export type ServerMenuItem = {
  id: number;
  name: string;
  path: string | null;
  icon: string | null;
  orderNum: number;
  parentId: number | null;
  isHidden: boolean;
  children?: ServerMenuItem[];
};

export type UrlNameMap = {
  [key: string]: {
    name: string;
    parentName?: string;
  };
};

function modifyMenu(item: ServerMenuItem): MenuItem {
  return {
    label: item.path ? <Link to={item.path}>{item.name}</Link> : item.name,
    key: `${item.id}`,
    icon: item.icon && <DynamicIcon name={item.icon} />,
    children: item.children?.map(modifyMenu),
  };
}

export function searchKey(serverMenus: ServerMenuItem[], pathname: string) {
  for (let i = 0; i < serverMenus.length; i++) {
    const menu = serverMenus[i];
    if (menu.path && pathname === menu.path) {
      return {
        selectKey: [menu.id.toString()],
        openKey: [menu.id.toString()],
      };
    }

    if (menu.children) {
      for (let j = 0; j < menu.children.length; j++) {
        const subMenu = menu.children[j];
        if (subMenu.path && pathname === subMenu.path) {
          return {
            selectKey: [subMenu.id.toString()],
            openKey: [menu.id.toString()],
          };
        }
      }
    }
  }
  return {
    selectKey: [],
    openKey: [],
  };
}

function useMenu() {
  const query = useQuery<ServerMenuItem[]>({
    queryKey: ['menu'],
    queryFn: fetchMenu,
  });

  const menus = useMemo(() => {
    if (query.isSuccess) {
      const serverMenus = query.data;
      return serverMenus?.map(modifyMenu) ?? [];
    }
    return [];
  }, [query.isSuccess, query.data]);

  const urlNameMap = useMemo(() => {
    const map: UrlNameMap = {};

    if (query.isSuccess) {
      const serverMenus = query.data;
      for (let i = 0; i < serverMenus.length; i++) {
        const topLevelMenu = serverMenus[i];
        if (topLevelMenu.path !== null) {
          map[topLevelMenu.path!] = {
            name: topLevelMenu.name,
          };
          continue;
        }

        if (topLevelMenu.children) {
          for (let j = 0; j < topLevelMenu.children.length; j++) {
            const subMenu = topLevelMenu.children[j];
            if (subMenu.path !== null) {
              map[subMenu.path!] = {
                name: subMenu.name,
                parentName: topLevelMenu.name,
              };
            }
          }
        }
      }

      return map;
    }
  }, [query.data, query.isSuccess]);

  return {
    isLoading: query.isLoading,
    error: query.error,
    menus,
    data: query.data,
    urlNameMap,
  };
}

export default useMenu;
