import { Menu } from 'antd';
import useMenu, { searchKey } from '../hooks/useMenu';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

type Props = {
  collapsed: boolean;
};

function AsideMenu({ collapsed }: Props) {
  const location = useLocation();
  const { menus, data: serverMenus } = useMenu();
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
