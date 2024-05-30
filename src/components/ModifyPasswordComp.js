import {Button, Form, Input, message} from 'antd';
import $ from 'jquery';
import {baseUrl, confirm} from '../services/common';

const App = () => {

  const onFinish = (values) => {

    if (values.newPassword !== values.confirmNewPassword) {
      message.error('确认密码不一致');
      return;
    }

    confirm('确定修改密码吗？', () => {
      $.post(baseUrl + '/self/modifyPassword', values, res => {

        if (!res.success) {
          message.error('失败！' + res.message);
        } else {
          message.success('修改成功！');
        }
      }, 'JSON');
    });

  };

  return <Form
    name="basic"
    labelCol={{
      span: 8,
    }}
    wrapperCol={{
      span: 16,
    }}
    onFinish={onFinish}
    // onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item
      label="原密码"
      name="oldPassword"
      rules={[
        {
          required: true,
          message: '请输入原密码',
        },
      ]}
    >
      <Input.Password />
    </Form.Item>

    <Form.Item
      label="新密码"
      name="newPassword"
      rules={[
        {
          required: true,
          message: '请输入新密码',
        },
      ]}
    >
      <Input.Password />
    </Form.Item>

    <Form.Item
      label="确认新密码"
      name="confirmNewPassword"
      rules={[
        {
          required: true,
          message: '请确认新密码',
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
        修改
      </Button>
    </Form.Item>
  </Form>;
};

export default App;
