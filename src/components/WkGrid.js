import {DownOutlined, UpOutlined} from '@ant-design/icons';
import {Button, Col, Form, Input, Row, Select, Table} from 'antd';
import React, {useState, useEffect} from 'react';
import {connect} from 'dva';
import $ from 'jquery';
import {baseUrl, error} from '../services/common';

const {Option} = Select;

const SearchForm = ({search, onFinish}) => {

  const [expand, setExpand] = useState(false);

  const [form] = Form.useForm();
  const getFields = () => {
    const count = search ? search.length : 0;
    const children = [];
    for (let i = 0; i < count; i++) {

      const ss = search[i];
      children.push(
        <Col span={8} key={i}>
          <Form.Item
            name={ss.name || `field-${i}`}
            label={ss.label || `Field ${i}`}
            rules={[
              {
                required: ss.required || false,
                message: ss.message || '请输入' + ss.label,
              },
            ]}
          >
            {!!ss.options ? (
              <Select defaultValue={ss.options.filter(_ss => _ss.default === true).map(_ss => _ss.v)[0]}>
                {ss.options.map(_ss => <Option value={_ss.v}>{_ss.t}</Option>)}
              </Select>
            ) : (
              <Input placeholder={ss.placeholder}/>
            )}
          </Form.Item>
        </Col>,
      );
    }
    return children;
  };

  return (<Form
    form={form}
    name="advanced_search"
    className="ant-advanced-search-form"
    onFinish={onFinish}
  >
    <Row gutter={24}>{getFields()}</Row>
    <Row>
      <Col
        span={24}
        style={{
          textAlign: 'right',
        }}
      >
        <Button type="primary" htmlType="submit">
          查询
        </Button>
        <Button
          style={{
            margin: '0 8px',
          }}
          onClick={() => {
            form.resetFields();
          }}
        >
          重置
        </Button>
        <a
          style={{
            fontSize: 12,
          }}
          onClick={() => {
            setExpand(!expand);
          }}
        >
          {expand ? <UpOutlined /> : <DownOutlined />} 展开/收起
        </a>
      </Col>
    </Row>
  </Form>)
};

const ButtonPanel = ({addUrl, editUrl, selectedRowKeys}) => {

  const hasSelected = selectedRowKeys.length > 0;

  return (<div
    style={{
      marginBottom: 16,
    }}
  >
    {addUrl ? <Button type="primary" style={{margin: '0 8px'}}>新增</Button> : null}
    {editUrl ? <Button type="primary" style={{margin: '0 8px'}}>修改</Button> : null}
    <span
      style={{
        marginLeft: 8,
      }}
    >
          {hasSelected ? `已选择 ${selectedRowKeys.length} 条记录` : ''}
        </span>
  </div>)
};

const App = ({search, header, addUrl, editUrl, queryUrl}) => {

  const [data, setData] = useState();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onFinish = (values) => {
    setTableParams({
      ...tableParams,
      filters: values
    })
  };

  const fetchData = () => {
    setLoading(true);

    $.get(baseUrl + queryUrl, {...tableParams.pagination, ...(tableParams.filters || {})}, res => {

      setLoading(false);
      if (!res.success) {
        error('查询发生异常，' + res.message);
        return;
      }
      setData(res.obj);

      setTotal(res.pageInfo.totalRecords);

    }, 'JSON');
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams)]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const columns = header.map(h => {
    return {
      title: h.label || h.name,
      dataIndex: h.name,
      render: h.render
    }
  });

  return <div>

    <SearchForm search={search} onFinish={onFinish}/>

    <ButtonPanel addUrl={addUrl} editUrl={editUrl} selectedRowKeys={selectedRowKeys}/>

    <div className="search-result-list" style={{marginTop: '20px'}}>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data}
        pagination={{...tableParams.pagination, total}}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  </div>
};


export default connect(({index}) => {
  return {index}
})(App);
