import {Drawer, List, Avatar, Button} from 'antd';
import {useState, useEffect} from 'react';
import $ from 'jquery';
import {baseUrl, success, error} from '../services/common';


const App = ({open, onClose}) => {

  const [initLoading, setInitLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [current, setCurrent] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const onLoadMore = () => {
    setCurrent(current + 1);
  };

  const fetchData = () => {

    setLoading(true);
    $.get(baseUrl + '/self/messages', {current, pageSize: 10}, res => {

      setLoading(false);
      if (!res.success) {
        error('加载消息发生异常！' + res.message);
      } else {

        if (res.obj && res.obj.length === 0) {
          success('没有更多消息了！');
          setHasMore(false);
        } else {
          // success('加载消息成功！');
          const newList = (res.obj || []).filter(r => !list.find(ll => ll.id === r.id));
          setList(list.concat(newList));
        }

      }
    }, 'JSON');

  };

  const readMessage = (mid) => {

    const theOne = list.find(l => l.id === mid);
    if (theOne) {
      theOne.messageRead = true;
      setList([theOne, ...list.filter(l => l.id !== mid)]);
    }
    $.post(baseUrl + '/self/readMessage', {mid}, res => {
      if (!res.success) {
        error('失败！' + res.message);
      } else {
        // fetchData();
      }
    });
  };

  useEffect(() => {
    setInitLoading(false);
    fetchData();
  }, [current]);

  const loadMore =
    !initLoading && !loading && hasMore ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button onClick={onLoadMore}>加载更多</Button>
      </div>
    ) : null;

  return <Drawer title="消息列表" placement="right" onClose={() => {
    onClose(false);
  }} open={open}>

    <List
      className="demo-loadmore-list"
      loading={initLoading}
      itemLayout="horizontal"
      loadMore={loadMore}
      dataSource={list}
      renderItem={(item) => (
        <List.Item
        >
          <List.Item.Meta
            avatar={<Avatar style={{
              backgroundColor: '#f56a00',
              verticalAlign: 'middle',
              cursor: 'pointer'
            }}
                            size="large"
                            gap={4}>{item.sender}</Avatar>}
          />
          <div style={item.messageRead ? {fontSize: '15px', fontWeight: 'normal'} : {
            fontSize: '20px',
            fontWeight: 'bold'
          } } onClick={() => {
            readMessage(item.id);
          }}>{item.content}</div>
        </List.Item>
      )}
    />

  </Drawer>;

};

export default App;
