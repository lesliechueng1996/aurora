import styled from '@emotion/styled';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CaretDownOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown, Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 1rem;
  padding-right: 2rem;
  height: 3rem;
  border-bottom: 1px solid #e8e8e8;
`;

const LeftPanel = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AvatarWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

type Props = {
  expand: boolean;
  toggleExpand: () => void;
};

const items: MenuProps['items'] = [
  {
    key: '1',
    label: '个人中心',
  },
  {
    key: '2',
    label: '退出登录',
  },
];

function Header({ expand, toggleExpand }: Props) {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter((i) => i);

  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return {
      key: url,
      title: <Link to={url}>test</Link>,
    };
  });

  const breadcrumbItems = [
    {
      title: <Link to="/">首页</Link>,
      key: 'home',
    },
  ].concat(extraBreadcrumbItems);

  return (
    <Container>
      <LeftPanel>
        <div style={{ cursor: 'pointer' }} onClick={toggleExpand}>
          {expand ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
        <Breadcrumb items={breadcrumbItems} />
      </LeftPanel>
      <Dropdown menu={{ items }} placement="bottom">
        <AvatarWrap>
          <Avatar
            style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }}
            shape="square"
          >
            User
          </Avatar>
          <CaretDownOutlined />
        </AvatarWrap>
      </Dropdown>
    </Container>
  );
}

export default Header;
