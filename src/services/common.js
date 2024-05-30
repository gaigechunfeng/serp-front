import {message, Modal} from 'antd';
import {
  ExclamationCircleOutlined
} from '@ant-design/icons';

export function error(msg) {

  message.error(msg)
}

export function success(msg) {
  message.success(msg)
}

export function confirm(msg, onOk, onCancel) {

  Modal.confirm({
    title: '确认',
    icon: <ExclamationCircleOutlined />,
    content: msg,
    okText: '确认',
    cancelText: '取消',
    onOk,
    onCancel
  });
}

export const baseUrl = 'http://localhost/server';
