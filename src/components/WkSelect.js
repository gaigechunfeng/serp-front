import {Select} from 'antd';
import {baseUrl, error} from '../services/common';
import $ from 'jquery';
import {useState, useEffect} from 'react';
const Option = Select.Option;

const App = ({select, mode = 'multiple', onChange, value}) => {

  const {url, valueField, descField} = select;

  const [data, setData] = useState([]);

  const fetchData = () => {

    $.get(baseUrl + url, {}, res => {

      if (!res.success) {
        error('查询select列表发生异常！' + res.message);
      } else {

        setData(res.obj || []);
      }

    }, 'JSON');
  };

  useEffect(() => {
    fetchData();
    onChange((value || []).map(v => typeof v === 'object' ? v[valueField] : v));
  }, [url]);

  return <Select
    mode={mode}
    style={{
      width: '100%',
    }}
    optionLabelProp="label"
    onChange={(vs) => {

      if (onChange) {
        onChange(vs);
      }
    }}
    value={(value || []).map(v => typeof v === 'object' ? v[valueField] : v)}
  >
    {data.map(d => {
      return <Option value={d[valueField]} label={d[descField]}>
        {d[valueField]}-{d[descField]}
      </Option>
    })}

  </Select>
};

export default App;
