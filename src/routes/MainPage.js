import {
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {Breadcrumb, Layout, Menu} from 'antd';
import React, {useState} from 'react';
import {connect} from 'dva';
import WkGrid from  '../components/WkGrid';
import styles from './IndexPage.css';


const {Header, Content, Footer, Sider} = Layout;

const choosePage = (firstMenuKey, secondMenuKey) => {

  if (secondMenuKey === '_userManage') {
    return <WkGrid
      search={[{
        name: 'username',
        label: '用户名',
      }, {
        name: 'realname',
        label: '真实姓名',
      }]}
      header={[{
        name: 'id',
        label: 'ID'
      }, {
        name: 'username',
        label: '用户名'
      }, {
        name: 'realname',
        label: '真实姓名'
      }, {
        name: 'mobile',
        label: '手机号'
      }, {
        name: 'userType',
        label: '用户类型',
        render(name){
          return name === 'ADMIN' ? '管理员' : '普通用户'
        }
      }, {
        name: 'status',
        label: '状态',
        render(name){
          return name === 'IN_USE' ? "有效" : (name === 'LOCK' ? '已锁定' : '已删除')
        }
      }, {
        name: 'company',
        label: '公司'
      }]}
      addUrl="/user/add"
      editUrl="/user/edit"
      queryUrl="/user/query"

    />
  }

  return null;
}

const App = ({index, dispatch}) => {

  const {user, resources, firstMenuKey, secondMenuKey} = index;

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
    items.push({
      key: '_systemManage',
      label: '系统管理',
      icon: <TeamOutlined />,
      children: [{
        key: '_userManage',
        label: '用户管理',
        icon: <UserOutlined />
      }, {
        key: '_resourceManage',
        label: '资源管理',
        icon: <FileOutlined />
      }, {
        key: '_roleManage',
        label: '角色管理',
        icon: <TeamOutlined />
      }]
    })
  }

  items.push({
    key: '_userCenter',
    label: '个人中心',
    icon: <UserOutlined />
  });

  const firstMenu = firstMenuKey ? items.find(it => it.key === firstMenuKey) : null,
    secondMenu = firstMenu && firstMenu.children && firstMenu.children.length > 0 ? firstMenu.children.find(it => it.key === secondMenuKey) : null;


  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className={styles.logo}>欢迎您，{user.username}</div>
        <Menu theme="dark" defaultSelectedKeys={[firstMenu.key]} mode="inline" items={items}
              onSelect={({key, keyPath}) => {
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
