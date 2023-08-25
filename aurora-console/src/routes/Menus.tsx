import { Input, Table, Switch, Modal, Form } from 'antd';
import AddButon from '../components/AddButon';
import Layout from '../components/Layout';
import styled from '@emotion/styled';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import DynamicIcon from '../components/DynamicIcon';
import type { DataType } from '../hooks/useMenuTable';
import useMenuTable from '../hooks/useMenuTable';
import type { ServerMenuItem } from '../hooks/useMenu';
import CreateMenu from '../components/CreateMenu';

const { Search } = Input;

const ToolBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const DialogWrap = styled.div`
  padding-top: 1rem;
`;

const columns: ColumnsType<DataType> = [
  {
    title: '菜单名称',
    dataIndex: 'menuName',
    key: 'menuName',
  },
  {
    title: '图标',
    dataIndex: 'icon',
    key: 'icon',
  },
  {
    title: '排序',
    dataIndex: 'orderNumber',
    key: 'orderNumber',
  },
  {
    title: '访问路径',
    dataIndex: 'path',
    key: 'path',
  },
  {
    title: '隐藏',
    dataIndex: 'isHidden',
    key: 'isHidden',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
];

function Menus() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [searchText, setSearchText] = useState('');
  const { isLoading, menus, toggleHideMutation } = useMenuTable(searchText);

  const [form] = Form.useForm();

  function modifyData(
    menu: ServerMenuItem,
    topIndex: number | null,
    index: number | null
  ): DataType {
    return {
      key: `${menu.id}`,
      menuName: menu.name,
      icon: menu.icon ? <DynamicIcon name={menu.icon} /> : null,
      orderNumber: menu.orderNum,
      path: menu.path || '',
      isHidden: (
        <Switch
          checked={menu.isHidden}
          onChange={(value) => {
            toggleHideMutation.mutate({
              id: `${menu.id}`,
              isHide: value,
              topIndex,
              index,
            });
          }}
        />
      ),
      createTime: menu.createTime,
      children: menu.children?.map((item, index) =>
        modifyData(item, topIndex, index)
      ),
    };
  }

  const data = menus?.map((item, index) => modifyData(item, index, null));

  return (
    <Layout title="菜单管理">
      <ToolBar>
        <AddButon label="新增菜单" onClick={() => setOpenCreateDialog(true)} />
        <Search
          style={{ width: 300 }}
          prefix={<SearchOutlined />}
          placeholder="请输入菜单名"
          allowClear
          enterButton="搜索"
          size="large"
          onSearch={(value) => setSearchText(value)}
        />
      </ToolBar>

      <Table
        loading={isLoading}
        columns={columns}
        dataSource={data}
        pagination={false}
      />

      <Modal
        title="新增菜单"
        okText="确定"
        cancelText="取消"
        open={openCreateDialog}
        onOk={() => {
          console.log(form.getFieldsValue());
        }}
        confirmLoading={confirmLoading}
        onCancel={() => setOpenCreateDialog(false)}
      >
        <DialogWrap>
          <CreateMenu form={form} />
        </DialogWrap>
      </Modal>
    </Layout>
  );
}

export default Menus;
