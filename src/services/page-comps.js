import WkGrid from '../components/WkGrid';
import {
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {message, Modal, Form, Input, Select, Button} from 'antd';
import {baseUrl, confirm, error, success} from './common';
import $ from 'jquery';

export const SELF_MANAGE = {
  key: '_userCenter',
  label: '个人中心',
  icon: <UserOutlined />,
  children: [{
    key: '_userInfo',
    label: '个人信息',
    icon: <UserOutlined />
  }, {
    key: '_modifyPassword',
    label: '修改密码',
    icon: <FileOutlined />
  }, {
    key: '_logout',
    label: '退出登录',
    icon: <TeamOutlined />
  }]
};

export const SYS_MANAGE = {
  key: '_systemManage',
  label: '系统管理',
  icon: <TeamOutlined />,
  children: [{
    key: '_userManage',
    label: '用户管理',
    icon: <UserOutlined />
  }, {
    key: '_operateLog',
    label: '操作日志',
    icon: <FileOutlined />
  }, {
    key: '_resourceManage',
    label: '资源管理',
    icon: <FileOutlined />
  }, {
    key: '_roleManage',
    label: '角色管理',
    icon: <TeamOutlined />
  }]
};

export const RoleManageComp = () => {

  return <WkGrid
    search={[{
      name: 'name',
      label: '角色名称',
    }]}

    header={[{
      name: 'id',
      label: 'ID',
      type: 'key'
    }, {
      name: 'name',
      label: '角色名称',
      required: true
    }, {
      name: 'res',
      label: '资源',
      treeselect: {
        url: '/resource/query?status=Y&pageSize=500',
        valueField: 'id',
        descField: 'description'
      }
    }, {
      name: 'createTime',
      label: '创建时间',
      justShow: true,
      render(v){
        return v ? new Date(v).toLocaleString() : null;
      }
    }, {
      name: 'createUser',
      label: '创建人',
      justShow: true
    }]}
    addUrl="/role/add"
    editUrl="/role/edit"
    queryUrl="/role/query"
    delUrl="/role/del"

  />;
};

export const ResourceComp = () => {

  return <WkGrid
    treefield="pid"
    search={[{
      name: 'name',
      label: '资源名称',
    }, {
      name: 'description',
      label: '资源描述',
    }, {
      name: 'url',
      label: '资源URL',
    }, {
      name: 'status',
      label: '资源状态',
      options: [{
        t: '有效',
        v: 'Y'
      }, {
        t: '无效',
        v: 'N'
      }]
    }]}

    header={[{
      name: 'id',
      label: 'ID',
      type: 'key'
    }, {
      name: 'name',
      label: '资源名称',
      required: true
    }, {
      name: 'description',
      label: '资源描述',
      required: true
    }, {
      name: 'url',
      label: '资源URL',
    }, {
      name: 'status',
      label: '状态',
      required: true,
      options: [{
        t: '有效',
        v: 'Y'
      }, {
        t: '无效',
        v: 'N'
      }]
    }, {
      name: 'createTime',
      label: '创建时间',
      justShow: true,
      render(v){
        return v ? new Date(v).toLocaleString() : null;
      }
    }, {
      name: 'createUser',
      label: '创建人',
      justShow: true
    }]}
    addUrl="/resource/add"
    editUrl="/resource/edit"
    queryUrl="/resource/query"
    delUrl="/resource/del"

  />;

}

const MessageBox = ({receivers}) => {

  return <Form
    labelCol={{
      span: 8,
    }}
    wrapperCol={{
      span: 14,
    }}
    layout="horizontal"
    onValuesChange={() => {
    }}
    disabled={false}
    onFinish={(values) => {

      $.post(baseUrl + '/user/sendMessage', {...values, receivers: receivers.map(r => r.username).join(',')}, res => {

        if (!res.success) {
          error('失败！' + res.message);
        } else {
          success('发送消息成功！');
        }
      }, 'JSON');

    }}
  >
    <Form.Item label="消息类型" name="type" rules={[
      {
        required: true,
        message: '请选择消息类型',
      },
    ]}>
      <Select>
        <Select.Option value="IMPORTANT">重要</Select.Option>
        <Select.Option value="NORMAL">普通</Select.Option>
      </Select>
    </Form.Item>

    <Form.Item label="消息内容" name="content" rules={[
      {
        required: true,
        message: '请输入消息内容',
      },
    ]}>
      <Input.TextArea rows={4}/>
    </Form.Item>

    <Form.Item label="">
      <Button type="primary" htmlType="submit" style={{textAlign: 'center', marginLeft: '300px'}}>提交</Button>
    </Form.Item>
  </Form>
}


export const UserPageComp = () => {

  return <WkGrid
    search={[{
      name: 'username',
      label: '用户名',
    }, {
      name: 'realname',
      label: '真实姓名',
    }]}
    buttons={[{
      label: '重置密码',
      onClick(rs){
        if (rs.length === 0) {
          message.error('请选择至少一条记录！');
          return;
        }

        confirm(`你确认要重置这${rs.length}个用户的密码吗？`, () => {

          $.post(baseUrl + '/user/resetPassword', {usernames: rs.map(r => r.username).join(',')}, res => {

            if (!res.success) {
              message.error('重置密码失败！' + res.message);
            } else {
              message.success(res.message);
            }
          }, 'JSON');
        })
      }
    }, {
      label: '发送消息',
      onClick(rs){
        if (rs.length === 0) {
          message.error('请选择至少一条记录！');
          return;
        }


        // confirm(<MessageBox onOk={onOk}/>, onOk);

        Modal.info({
          title: '发送消息',
          // icon: <ExclamationCircleOutlined />,
          content: <MessageBox receivers={rs}/>,
          okText: '关闭',
          width: 800,
          okButtonProps: {type: 'default'},
          // cancelText: '取消',
          onOk(){
          },
          onCancel(){

          }
        });
      }
    }]}

    header={[{
      name: 'id',
      label: 'ID',
      type: 'key'
    }, {
      name: 'username',
      label: '用户名',
      required: true
    }, {
      name: 'realname',
      label: '真实姓名',
      required: true
    }, {
      name: 'roles',
      label: '角色',
      select: {
        url: '/role/query?status=Y&pageSize=500',
        valueField: 'id',
        descField: 'name'
      }
    }, {
      name: 'mobile',
      label: '手机号',
      required: true
    }, {
      name: 'userType',
      label: '用户类型',
      required: true,
      options: [{
        t: '管理员',
        v: 'ADMIN'
      }, {
        t: '普通用户',
        v: 'NORMAL'
      }]
    }, {
      name: 'status',
      label: '状态',
      required: true,
      options: [{
        t: '使用中',
        v: 'IN_USE'
      }, {
        t: '已锁定',
        v: 'LOCK'
      }, {
        t: '已删除',
        v: 'DEL'
      }]
    }, {
      name: 'company',
      label: '公司',
      required: true
    }, {
      name: 'createTime',
      label: '创建时间',
      justShow: true,
      render(v){
        return v ? new Date(v).toLocaleString() : null;
      }
    }, {
      name: 'createUser',
      label: '创建人',
      justShow: true,
    }]}
    addUrl="/user/add"
    editUrl="/user/edit"
    queryUrl="/user/query"
    delUrl="/user/del"

  />;
}


export const OperateLogComp = () => {

  return <WkGrid
    search={[{
      name: 'username',
      label: '操作用户',
    }, {
      name: 'requestUri',
      label: '请求地址',
    }]}

    header={[{
      name: 'id',
      label: 'ID',
      type: 'key'
    }, {
      name: 'username',
      label: '操作用户',
    }, {
      name: 'requestUri',
      label: '请求地址',
      required: true
    }, {
      name: 'params',
      label: '请求参数',
    }, {
      name: 'createTime',
      label: '请求时间',
      required: true,
      render(v){
        return v ? new Date(v).toLocaleString() : null;
      }
    }]}
    queryUrl="/log/query"
    delUrl="/log/del"

  />;
}

