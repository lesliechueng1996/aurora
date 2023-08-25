import { Form, Input, Radio, InputNumber } from 'antd';
import type { FormInstance } from 'antd';
import { memo } from 'react';

type CreateMenuData = {
  name: string;
  icon?: string;
  path?: string;
  orderNum: number;
  isHidden: boolean;
};

const initValue: CreateMenuData = {
  name: '',
  icon: '',
  path: '',
  orderNum: 1,
  isHidden: false,
};

type Props = {
  form: FormInstance;
};

const CreateMenu = memo(({ form }: Props) => {
  return (
    <Form
      layout="horizontal"
      form={form}
      size="large"
      initialValues={initValue}
      style={{ maxWidth: 600 }}
    >
      <Form.Item label="菜单名称" name="name">
        <Input />
      </Form.Item>
      <Form.Item label="菜单图标" name="icon">
        <Input readOnly />
      </Form.Item>
      <Form.Item label="访问路径" name="path">
        <Input />
      </Form.Item>
      <Form.Item label="显示排序" name="orderNum">
        <InputNumber min={1} />
      </Form.Item>
      <Form.Item label="显示状态" name="isHidden">
        <Radio.Group>
          <Radio value={false}>显示</Radio>
          <Radio value={true}>隐藏</Radio>
        </Radio.Group>
      </Form.Item>
    </Form>
  );
});

export default CreateMenu;
