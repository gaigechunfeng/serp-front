import {useState, useEffect} from 'react';
import {TreeSelect} from 'antd';
import $ from 'jquery';
import {baseUrl, error} from '../services/common';

const {SHOW_PARENT} = TreeSelect;

const App = ({treeselect, value, onChange}) => {

  const {url, valueField, descField} = treeselect;
  const [treeData, setTreeData] = useState([]);

  const fetchData = () => {

    $.get(baseUrl + url, {}, res => {

      if (!res.success) {
        error('加载TreeSelect数据失败！' + res.message);
      } else {
        setTreeData((res.obj || []).map(r => {

          return {
            title: r[descField],
            value: r[valueField],
            key: r[valueField],
            children: (r.children || []).map(c => {
              return {
                title: c[descField],
                value: c[valueField],
                key: c[valueField],
              }
            })
          }
        }))
      }
    }, 'JSON');
  };

  useEffect(() => {
    fetchData();
    onChange((value || []).map(v => typeof v === 'object' ? v[valueField] : v));
  }, [url]);

  const tProps = {
    treeData,
    value: (value || []).map(v => typeof v === 'object' ? v[valueField] : v),
    onChange: (v) => {
      if (onChange) {
        onChange(v);
      }
    },
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: 'Please select',
    style: {
      width: '100%',
    },
  };
  return <TreeSelect {...tProps} />;
}

export default App;
