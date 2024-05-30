import {Button, Col, Form, Input, Row, Select, Table, Modal, message} from 'antd';
import React, {useState, useEffect} from 'react';
import {connect} from 'dva';
import $ from 'jquery';
import {baseUrl, error, success, confirm} from '../services/common';
import WkSelect from '../components/WkSelect';
import WkTreeSelect from '../components/WkTreeSelect';

const {Option} = Select;

const SearchForm = ({search, onFinish}) => {

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
      </Col>
    </Row>
  </Form>)
};

const AddModal = ({selectedRows, btnLabel, title, header, url, tree, callback}) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const record = selectedRows && selectedRows.length === 1 ? selectedRows[0] : null;
  const [form] = Form.useForm();

  const onFinish = (values) => {

    if (tree !== null && tree !== undefined) {
      values[tree.treefield] = tree.treevalue;
    }

    $.post(baseUrl + url, values, function (res) {

      if (!res.success) {
        error('请求发生异常，' + res.message);
      } else {
        success('执行成功');
        setIsModalOpen(false);
        callback('save')
      }
    }, 'JSON');
  };
  const handleOk = async () => {
    const values = await form.validateFields();

    onFinish(values);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };


  const [componentSize, setComponentSize] = useState('default');
  const onFormLayoutChange = ({size}) => {
    setComponentSize(size);
  };

  return <span>
    <Button type="primary" style={{margin: '0 8px'}} onClick={showModal}>{btnLabel}</Button>
    <Modal title={title} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} cancelText="取消" okText="确定">

      <Form form={form}
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 14,
            }}
            layout="horizontal"
            initialValues={record}
            onValuesChange={onFormLayoutChange}
            size={componentSize}
            style={{
              maxWidth: 600,
            }}
            onFinish={onFinish}
      >
        {tree ? <Form.Item label="父节点ID" name={tree.fieldvalue}>
          <Input type='text' value={tree.treevalue || 0}/>
        </Form.Item> : null}

        {(header || []).map(h => {

          const props = {
            label: h.label,
            name: h.name,
            rules: [{
              required: h.required || false,
              message: `请输入${h.label}！`,
            },]
          };
          if (h.type === 'key') {
            props.hidden = true;
          }

          if (h.options) {

            return <Form.Item {...props}>
              <Select>
                {h.options.map(op => {
                  return <Select.Option value={op.v}>{op.t}</Select.Option>
                })}
              </Select>
            </Form.Item>
          } else if (h.select) {
            return <Form.Item {...props}>
              <WkSelect {...h}/>
            </Form.Item>
          } else if (h.treeselect) {
            return <Form.Item {...props}>
              <WkTreeSelect {...h}/>
            </Form.Item>
          } else {
            return <Form.Item {...props}>
              <Input type={h.type || 'text'}/>
            </Form.Item>
          }
        })}

      </Form>
    </Modal>
  </span>
};

const ButtonPanel = ({addUrl, editUrl, delUrl, selectedRows, header, buttons, treefield, callback}) => {

  const hasSelected = selectedRows && selectedRows.length > 0;
  const record = selectedRows && selectedRows.length === 1 ? selectedRows[0] : null;
  const keyHeader = header.filter(h => h.type === 'key')[0];
  const keyField = keyHeader ? keyHeader.name : 'id';
  const tree = treefield ? (record ? {treefield, treevalue: record[keyField]} : {treefield, treevalue: 0}) : null;
  const cb = callback ? callback : () => {
  };

  const onDel = () => {
    confirm('确定要删除这' + selectedRows.length + '条记录吗？', () => {
      $.post(baseUrl + delUrl, {ids: selectedRows.map(s => s[keyField]).join(',')}, res => {

        if (!res.success) {
          message.error('失败！' + res.message);
        } else {

          message.success('删除成功！');
          cb('del');
        }

      }, 'JSON');
    })
  }
  return (<div
    style={{
      marginBottom: 16,
    }}
  >
    {addUrl ? <AddModal btnLabel="新增" title="新增" header={header} url={addUrl} tree={tree} callback={cb}/> : null}
    {editUrl && selectedRows && selectedRows.length === 1 ?
      <AddModal btnLabel="修改" title="修改" header={header} selectedRows={selectedRows} url={editUrl}
                callback={cb}/> : null}
    {delUrl && selectedRows && selectedRows.length > 0 ?
      <Button type="primary" style={{margin: '0 8px'}} onClick={onDel}>删除</Button> : null}

    {(buttons || []).map(btn => {

      return <Button type="primary" style={{margin: '0 8px'}} onClick={() => {
        if (btn.onClick) {
          btn.onClick(selectedRows || []);
        }
      }}>{btn.label}</Button>
    })}
    <span
      style={{
        marginLeft: 8,
      }}
    >
          {hasSelected ? `已选择 ${selectedRows.length} 条记录` : ''}
        </span>
  </div>)
};

const App = ({search, header, addUrl, editUrl, delUrl, queryUrl, buttons, treefield}) => {

  const [data, setData] = useState();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({});
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const [selectedRows, setSelectedRows] = useState(null);

  const key = header.find(h => h.name === 'id' || h.type === 'key').name;

  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    setSelectedRows(selectedRows);
  };
  const rowSelection = {
    selectedRowKeys: selectedRows ? selectedRows.map(s => s[key]) : [],
    onChange: onSelectChange,
  };

  const onFinish = (values) => {
    setFilter(values);
    fetchData(values);
  };

  const fetchData = (values) => {
    setLoading(true);

    $.get(baseUrl + queryUrl, {...tableParams.pagination, ...(values || filter || {})}, res => {

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
  }, [JSON.stringify({...tableParams})]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      // filters,
      ...sorter,
    });
  };

  const columns = header.map(h => {
    return {
      title: h.label || h.name,
      dataIndex: h.name,
      render: h.render || (function (val) {
        if (h.options) {
          const _op = h.options.find(_s => _s.v === val);
          if (_op) {
            return _op.t;
          }
        } else if (h.select) {
          return (val || []).map(v => v[h.select.descField || 'name']).join(',')
        } else if (h.treeselect) {
          return (val || []).map(v => v[h.treeselect.descField || 'name']).join(',')
        }
        return val;
      })
    }
  });

  const buttonPanel = <ButtonPanel addUrl={addUrl} editUrl={editUrl} delUrl={delUrl} selectedRows={selectedRows}
                                   header={header.filter(h => h.justShow !== true)} buttons={buttons}
                                   treefield={treefield} callback={() => {
    fetchData();
  }}/>;

  return <div>

    <SearchForm search={search} onFinish={onFinish}/>

    {buttonPanel}

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
