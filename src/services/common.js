import {message} from 'antd';


export function error(msg) {

  message.error(msg)
}

export function success(msg) {
  message.success(msg)
}

export const baseUrl = 'http://localhost:8080';
