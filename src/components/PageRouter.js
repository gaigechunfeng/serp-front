import {connect} from 'dva';
import {Layout} from 'antd';
import React from 'react';
import {LaptopOutlined, NotificationOutlined, UserOutlined} from '@ant-design/icons';
import ContentPage from './Content';

import styles from '../routes/IndexPage.css';

const {Sider, Menu, Content} = Layout;

const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map((icon, index) => {
  const key = String(index + 1);
  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: `subnav ${key}`,
    children: new Array(4).fill(null).map((_, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: subKey,
        label: `option${subKey}`,
      };
    }),
  };
});

const App = ({index, dispatch}) => {

  const {user, firstMenu} = index;

  let page;

  if (firstMenu === '首页') {
    page = <div>欢迎，{user.username}</div>
  } else if (firstMenu === '系统管理') {
    page = <Content>

      <Sider className="site-layout-background" width={200}>
        <Menu
          mode="inline"
          // defaultSelectedKeys={['1']}
          // defaultOpenKeys={['sub1']}
          style={{
            height: '100%',
          }}
          items={[{
            key: '用户管理',
            label: '用户管理',
            icon: React.createElement(UserOutlined),
            children: [{
              key: '用户列表',
              label: '用户列表'
            }]
          }, {
            key: '角色管理',
            label: '角色管理',
            icon: React.createElement(UserOutlined),
            children: [{
              key: '角色列表',
              label: '角色列表'
            }]
          }]}
          onClick={(item) => {
            dispatch({type: 'index/gotoPage', payload: {secondMenu: item.key}})
          }}
        />
      </Sider>
      <Content className={styles['site-layout-background']}
               style={{
                 padding: '0 24px',
                 minHeight: 280,
               }}
      >
        <ContentPage/>
      </Content>
    </Content>
  } else if (firstMenu === '个人信息') {
    page = <div>
      <Sider className="site-layout-background" width={200}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{
            height: '100%',
          }}
          items={items2}
        />
      </Sider>
      <Content className={styles['site-layout-background']}
               style={{
                 padding: '0 24px',
                 minHeight: 280,
               }}
      >
        <ContentPage/>
      </Content>
    </div>
  }


  return <Layout
    className="site-layout-background"
    style={{
      padding: '24px 0',
    }}
  >
    {page}
  </Layout>
};

export default connect(({index}) => {
  return {index}
})(App);
