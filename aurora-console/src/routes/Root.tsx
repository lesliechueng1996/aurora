import { useState } from 'react';
import styled from '@emotion/styled';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';
import AsideMenu from '../components/AsideMenu';
import useMenu from '../hooks/useMenu';

const AppRoot = styled.div`
  display: flex;
  height: 100vh;
`;

const MainWrap = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

function Root() {
  const [collapsed, setCollapsed] = useState(false);
  const { menus, data: serverMenus, urlNameMap } = useMenu();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <AppRoot>
      <AsideMenu
        collapsed={collapsed}
        menus={menus}
        serverMenus={serverMenus}
      />

      <MainWrap>
        <Header
          expand={collapsed}
          toggleExpand={toggleCollapsed}
          urlNameMap={urlNameMap}
        />
        <div
          style={{
            padding: '1rem 1rem 0 1rem',
            backgroundColor: '#f5f6f9',
            flex: '1',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              height: '100%',
              borderRadius: '0.5rem',
            }}
          >
            <Outlet />
          </div>
        </div>
      </MainWrap>
    </AppRoot>
  );
}

export default Root;
