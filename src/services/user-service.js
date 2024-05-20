import {error, success, baseUrl} from './common';
import $ from 'jquery'


export function formatResource(resources) {

  if (!resources) {
    return [];
  }

  return resources.filter(r => r.level === 1).map(r => {

    return {
      name: r.name,
      desc: r.description,
      children: (resources.filter(cr => cr.parentId === r.id).map(cr => {
        return {
          name: cr.name,
          desc: cr.description
        }
      }))
    }
  })
}

export async function currentUser() {

  const res = await $.get(baseUrl + '/user/current', {}, (res) => {
    return res
  }, 'JSON');

  if (!res.success || !res.obj) {
    error('用户未登录，请先登录');
    return;
  }

  success(`用户${res.obj.username}已登录`);

  return res.obj;
}

export async function login(username, password) {

  if (!username || !password) {
    error('用户名和密码不能为空！');
    return
  }


  const res = await $.post(baseUrl + '/user/login', {username, password}, (res) => {
    return res
  }, 'JSON');

  if (!res.success) {
    error('登录失败！' + res.message);
    return;
  }

  success('登录成功');

  return res.obj;

}
