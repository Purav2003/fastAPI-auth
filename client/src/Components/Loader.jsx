import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
const Loader = () => {
  return (
    <div className='w-full h-full flex items-center justify-center min-h-[50vh]'>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
    </div>
  );
}

export default Loader;