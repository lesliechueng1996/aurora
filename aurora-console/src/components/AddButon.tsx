import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { memo } from 'react';

type Props = {
  label: string;
  onClick: () => void;
};

const AddButton = memo(({ label, onClick }: Props) => {
  return (
    <Button
      type="primary"
      size="large"
      icon={<PlusOutlined />}
      onClick={onClick}
    >
      {label}
    </Button>
  );
});

export default AddButton;
