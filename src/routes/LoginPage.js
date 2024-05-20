import React from 'react';
import {connect} from 'dva';
import {Button, Form, Input} from 'antd';


const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};
function LoginPage({dispatch}) {

  return <div style={{marginTop: 20}}>
    <h2 style={{textAlign: 'center'}}>登 录</h2>
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 600,
        margin: 'auto'
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={(values) => {
        dispatch({
          type: 'index/login',
          values
        });
      }}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="用户名"
        name="username"
        rules={[
          {
            required: true,
            message: '请输入用户名！',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
        rules={[
          {
            required: true,
            message: '请输入密码！',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>


      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          登录
        </Button>
      </Form.Item>
    </Form>
  </div>
}

export default connect(({user}) => ({user}))(LoginPage);
