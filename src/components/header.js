import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import React from 'react';

const { Header } = Layout;

const CustomHeader = () => {
  return (
    <Header>
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" icon={<HomeOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default CustomHeader;
