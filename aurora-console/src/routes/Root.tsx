import { useState } from 'react';
import styled from '@emotion/styled';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';
import AsideMenu from '../components/AsideMenu';

const AppRoot = styled.div`
  display: flex;
  height: 100vh;
`;

const MainWrap = styled.div`
  flex: 1;
`;

function Root() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <AppRoot>
      <AsideMenu collapsed={collapsed} />

      <MainWrap>
        <Header expand={collapsed} toggleExpand={toggleCollapsed} />
        <Outlet />
      </MainWrap>
    </AppRoot>
  );
}

export default Root;
