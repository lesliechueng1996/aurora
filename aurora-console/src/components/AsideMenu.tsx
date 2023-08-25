import { Menu } from 'antd';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { searchKey, ServerMenuItem, MenuItem } from '../hooks/useMenu';

type Props = {
  collapsed: boolean;
  serverMenus?: ServerMenuItem[];
  menus: MenuItem[];
};

function AsideMenu({ collapsed, serverMenus, menus }: Props) {
  const location = useLocation();

  const [selectAndOpenKey, setSelectAndOpenKey] = useState<{
    selectKey: string[];
    openKey: string[];
  }>({
    selectKey: [],
    openKey: [],
  });

  useEffect(() => {
    if (serverMenus) {
      setSelectAndOpenKey(searchKey(serverMenus, location.pathname));
    }
  }, [serverMenus, location.pathname]);

  const handleOpenChange = (openKeys: string[]) => {
    setSelectAndOpenKey({
      ...selectAndOpenKey,
      openKey: openKeys,
    });
  };

  return (
    <Menu
      style={{ height: '100%', width: collapsed ? '3rem' : '15rem' }}
      selectedKeys={selectAndOpenKey.selectKey}
      openKeys={selectAndOpenKey.openKey}
      mode="inline"
      theme="dark"
      inlineCollapsed={collapsed}
      items={menus}
      onOpenChange={handleOpenChange}
    />
  );
}

export default AsideMenu;
