import React from 'react';
import {connect} from 'dva';
// import styles from './IndexPage.css';
import LoginPage from './LoginPage';
import MainPage from './MainPage';

function IndexPage({index}) {

  const {user} = index;
  if (user) {
    return <MainPage/>
  }

  return <LoginPage/>;
}

IndexPage.propTypes = {};

export default connect(({index}) => {
  return {index}
})(IndexPage);
