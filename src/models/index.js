import {login, currentUser, formatResource} from '../services/user-service';
import $ from 'jquery';

export default {

  namespace: 'index',

  state: {
    user: null,
    resources: [{
      name: 'salesManage',
      desc: '销售管理',
      children: [{
        name: 'salesHouseManage',
        desc: '销售房产管理'
      }, {
        name: 'reportManage',
        desc: '报表管理'
      }]
    }, {
      name: 'baseInfoManage',
      desc: '基础信息维护',
      children: [{
        name: 'projectManage',
        desc: '项目维护'
      }, {
        name: 'payContentManage',
        desc: '交款内容维护'
      }, {
        name: 'gatherTypeManage',
        desc: '收款方式维护'
      }]
    }],
    firstMenuKey: '_userCenter',
    secondMenuKey: null,
  },

  subscriptions: {
    setup({dispatch, history}) {  // eslint-disable-line

      $.ajaxSetup({
        xhrFields: {
          withCredentials: true
        },
        complete(xhr, status){

          console.log('xhr:', xhr);
        }
      });

      dispatch({type: 'loadCurrentUser'})
    },
  },

  effects: {
    *fetch({payload}, {call, put}) {  // eslint-disable-line
      yield put({type: 'save'});
    },
    *loadCurrentUser({payload}, {call, put}){

      const user = yield currentUser();

      if (user) {
        yield put({type: 'save', payload: {user, resources: formatResource(user.resources)}})
      }
    },
    *login({values}, {call, put}){

      const {username, password} = values;

      const user = yield login(username, password);

      if (user) {
        yield put({type: 'save', payload: {user, resources: formatResource(user.resources)}})
      }

    }
  },

  reducers: {
    save(state, action) {
      return {...state, ...action.payload};
    },
    // login(state){
    //   return {...state, user: {username: 'WK', isSuperAdmin: true, company: 'Ant Design ©2018 Created by Ant UED'}};
    // },
    gotoPage(state, action){

      return {...state, ...action.payload};
    }
  },

};
