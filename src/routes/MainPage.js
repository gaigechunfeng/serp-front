import {PieChartOutlined} from '@ant-design/icons';
import {Breadcrumb, Layout, Menu, Avatar, Badge} from 'antd';
import React, {useState} from 'react';
import {connect} from 'dva';
import {
  UserPageComp,
  OperateLogComp,
  ResourceComp,
  RoleManageComp,
  SYS_MANAGE,
  SELF_MANAGE
} from  '../services/page-comps';
import styles from './IndexPage.css';
import {confirm} from '../services/common';
import ModifyPasswordComp from '../components/ModifyPasswordComp';
import SelfInfoComp from '../components/SelfInfoComp';
import WkDrawer from '../components/WkDrawer';


const {Header, Content, Footer, Sider} = Layout;

const choosePage = (firstMenuKey, secondMenuKey) => {

  if (secondMenuKey === '_userManage') {
    return <UserPageComp />;
  } else if (secondMenuKey === '_modifyPassword') {
    return <ModifyPasswordComp/>
  } else if (secondMenuKey === '_userInfo') {
    return <SelfInfoComp/>
  } else if (secondMenuKey === '_operateLog') {
    return <OperateLogComp />;
  } else if (secondMenuKey === '_resourceManage') {
    return <ResourceComp />
  } else if (secondMenuKey === '_roleManage') {
    return <RoleManageComp />
  }

  return null;
};

const App = ({index, dispatch}) => {

  const {user, resources, firstMenuKey = '_userCenter', secondMenuKey = '_userInfo'} = index;

  const items = [...(resources || []).map(r => {
    return {
      key: r.name,
      icon: <PieChartOutlined />,
      label: r.desc,
      children: (r.children || []).map(rc => {
        return {key: rc.name, label: rc.desc, icon: <PieChartOutlined />}
      })
    }
  })];

  if (user.userType === 'ADMIN') {
    items.push(SYS_MANAGE)
  }
  items.push(SELF_MANAGE);

  const firstMenu = firstMenuKey ? items.find(it => it.key === firstMenuKey) : null,
    secondMenu = firstMenu && firstMenu.children && firstMenu.children.length > 0 ? firstMenu.children.find(it => it.key === secondMenuKey) : null;


  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className={styles.logo}>
          <Badge count={user.unReadMessageCount || 0}>
            <Avatar
              style={{
                backgroundColor: '#f56a00',
                verticalAlign: 'middle',
                cursor: 'pointer'
              }}
              size="large"
              gap={4}
              onClick={() => {
                setDrawerOpen(true);
              }}
            >
              {user && user.realname ? user.realname.substring(user.realname.length - 1) : null}
            </Avatar>
          </Badge>


          <WkDrawer open={drawerOpen} onClose={() => {
            setDrawerOpen(false);
          }}/>
        </div>
        <Menu theme="dark" defaultSelectedKeys={[secondMenu ? secondMenu.key : firstMenu.key]} mode="inline"
              items={items}
              onClick={({keyPath}) => {
                if (keyPath.length === 2 && keyPath[0] === '_logout') {

                  confirm('确定注销吗？', () => {
                    dispatch({type: 'index/logout'});
                  });
                }
              }}
              onSelect={({key, keyPath}) => {

                if (keyPath.length === 2 && keyPath[0] === '_logout') {
                  return false;
                }
                dispatch({
                  type: 'index/gotoPage', payload: {
                    firstMenuKey: keyPath.length === 2 ? keyPath[1] : keyPath[0],
                    secondMenuKey: keyPath.length === 2 ? keyPath[0] : null
                  }
                })
              }}/>
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
          }}
        />
        <Content
          style={{
            margin: '0 16px',
          }}
        >
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item>{firstMenu.label}</Breadcrumb.Item>
            {secondMenu ? <Breadcrumb.Item>{secondMenu.label}</Breadcrumb.Item> : null}
          </Breadcrumb>
          <div
            className={styles['site-layout-background']}
            style={{
              padding: 24,
              minHeight: 360,
            }}
          >
            {choosePage(firstMenuKey, secondMenuKey)}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          {user.company}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default connect(({index}) => {
  return {index}
})(App);
