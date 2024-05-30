import {connect} from 'dva';
import {Form, Input, Select, Button, message} from 'antd';
import {useState} from 'react';
import {baseUrl} from '../services/common';
import $ from 'jquery';

const App = ({index, dispatch}) => {

  const [componentDisabled, setComponentDisabled] = useState(true);

  const {user} = index;

  const onFinish = (values) => {

    $.post(baseUrl + '/self/modifySelf', values, res => {

      if (!res.success) {
        message.error('失败！' + res.message);
      } else {
        message.success('修改成功！');
        setComponentDisabled(true);
        dispatch({type: 'index/save', payload: {user: res.obj}})
      }
    }, 'JSON');

  };

  const items = [{
    name: 'username',
    label: '用户名',
    disabled: true
  }, {
    name: 'realname',
    label: '真实姓名',
    required: true
  }, {
    name: 'mobile',
    label: '手机号',
    required: true
  }, {
    name: 'userType',
    label: '用户类型',
    disabled: true,
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
    disabled: true,
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
  }].map(h => {

    const props = {
      label: h.label,
      name: h.name,
      rules: [{
        required: h.required || false,
        message: `请输入${h.label}！`,
      },]

    };

    const disabled = componentDisabled ? true : (!!h.disabled);

    if (h.options) {

      return <Form.Item {...props}>
        <Select disabled={disabled}>
          {h.options.map(op => {
            return <Select.Option value={op.v}>{op.t}</Select.Option>
          })}
        </Select>
      </Form.Item>
    } else {
      return <Form.Item {...props}>
        <Input type={h.type || 'text'} disabled={disabled}/>
      </Form.Item>
    }
  });

  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 16,
    },
  };

  const goModify = () => {
    setComponentDisabled(false);
  };
  const goBack = () => {
    setComponentDisabled(true);
  };


  return <div>
    <Form
      labelCol={{
        span: 4,
      }}
      wrapperCol={{
        span: 14,
      }}
      initialValues={user}
      layout="horizontal"
      disabled={componentDisabled}
      onFinish={onFinish}
    >

      {items}

      <Form.Item {...tailLayout}>
        {componentDisabled ? null : <Button type="primary" htmlType="submit">确定</Button>}
        {componentDisabled ? null : <Button htmlType="reset" onClick={goBack} style={{marginLeft: '20px'}}>返回</Button>}
      </Form.Item>
    </Form>

    <Form.Item {...tailLayout}>
      { componentDisabled ? <Button type="primary" htmlType="button" onClick={goModify}>修改</Button> : null}
    </Form.Item>

  </div>
};

export default connect(({index}) => {
  return {index}
})(App);
