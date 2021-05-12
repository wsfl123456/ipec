/**
 * IP筛选器-添加页面
 * author:Blance.xue
 */
import * as React from "react";
import { inject, observer } from "mobx-react";
import "@assets/scss/add_forecast.scss";
import { Input, Select, message, DatePicker, Checkbox, Radio } from "antd";
import Alert from "@components/alert";
import moment from 'moment';
import _isEmpty from "lodash/isEmpty";
import ScrollTop from "@components/scroll-top";

const { Option } = Select;
const cny = [
  { key: 1, value: "元" },
  { key: 10000, value: "万元" },
  { key: 100000000, value: "亿元" },
  // { key: 1, value: "千亿元" },

];

interface IAddForecaseState {
  message: string;
  isShow: boolean;
  alertMessage: string;

  checkedList: any,
  indeterminate: boolean,
  checkAll: boolean,
  areaIndeterminate: boolean,
  areaCheckAll: boolean,
  ageIndeterminate: boolean,
  ageCheckAll: boolean,
  cny_unit: number,
}

const areaOptions = [
  '华东',
  '华南',
  '华中',
  '华北',
  '西南',
  '东北',
  '西北',
];
const ageOptions = [
  { label: '≤19', value: '<=19' },
  { label: '20-29', value: '20-29' },
  { label: '30-39', value: '30-39' },
  { label: '40-49', value: '40-49' },
  { label: '≥50', value: '>=50' },
];
const sexOptions = [
  { label: '不限', value: '' },
  { label: '男', value: '男' },
  { label: '女', value: '女' },
];
let needPurpose = {
  1: '品牌上市',
  2: '新品上市',
  3: '旧品促销'
};
let disabled = false;
@inject('login', 'add_forecast', 'filter_forecast')
@observer
export default class AddForecast extends React.Component <IProps, IAddForecaseState> {

  constructor(props: any) {
    super(props);
    this.state = {
      message: '',
      isShow: false,
      alertMessage: '',

      checkedList: [],
      indeterminate: false,
      checkAll: true,

      areaIndeterminate: false,
      areaCheckAll: true,

      ageIndeterminate: false,
      ageCheckAll: true,

      cny_unit: 10000, // 货币单位
    }
    ;
  }

  async componentDidMount() {
    document.title = "IP二厂- IP筛选器";
    const { add_forecast, match: { params } } = this.props;
    await add_forecast.getCityData();
    // 查看添加的数据展示，不可编辑
    if (params['id']) {

      await add_forecast.getFilter(params['id']);
      const { addForecastData } = add_forecast;
      const {
        ages, areas, cities, sexStr,
      } = addForecastData;
      let age, area, city;
      if (addForecastData) {
        age = !ages;
        area = !areas;
        city = !cities;
      }
      this.setState({
        checkAll: city,
        areaCheckAll: area,
        ageCheckAll: age,
      });

      add_forecast.changeParams({
        ageList: ages.split(','),
        areaList: areas.split(','),
        cityList: cities.split(','),
        sexStr,
      });

    } else {
      await this.clear();
    }
  }

  /**
   * 添加新案例
   */
  async submitForecast() {
    const { add_forecast } = this.props;
    const { addForecastData } = add_forecast;

    if (!addForecastData.clientName) {
      this.setState({ isShow: true, message: '请输入客户名称' });
      return false;
    }
    if (!addForecastData.projectName) {
      this.setState({ isShow: true, message: '请输入项目名称' });
      return false;
    }
    if (!addForecastData.demandPurpose) {
      this.setState({ isShow: true, message: '请选择需求目的' });
      return false;
    }
    if (_isEmpty(addForecastData.ageList) && this.state.ageCheckAll === false) {
      this.setState({ isShow: true, message: '请选择年龄' });
      return false;
    }
    if (_isEmpty(addForecastData.cityList) && this.state.checkAll === false) {
      this.setState({ isShow: true, message: '请选择省份' });
      return false;
    }
    if (_isEmpty(addForecastData.areaList) && this.state.areaCheckAll === false) {
      this.setState({ isShow: true, message: '请选择地域' });
      return false;

    }
      // if (!addForecastData.sexStr) {
      //   this.setState({ isShow: true, message: '请选择性别' });
      //   return false;
      //
    // }
    else {
      addForecastData.onlineTime = _isEmpty(addForecastData.onlineTime) ? "" : moment(addForecastData.onlineTime).format("YYYY-MM-DD");
      addForecastData.projectBudget = addForecastData.projectBudget * (this.state.cny_unit);
      const isSuccess = await add_forecast.getForecastData(addForecastData);
      disabled = true;
      this.setState({ isShow: true, message: '提交成功' });
      this.clear();
      setTimeout(() => {
        history.go(-1);
      }, 1000);
    }
  }

  /**
   * 重置
   */
  clear() {
    disabled = false;
    let params = {
      ageList: [],
      ages: "",
      areaList: [],
      areas: "",
      cityList: [],
      cities: "",
      clientName: "",
      demandPurpose: "",
      onlineTime: null,
      projectBackground: "",
      projectBudget: "",
      projectName: "",
      sexStr: "",
      sex: "",
    };
    this.props.add_forecast.changeParams(params);

    this.setState({
      checkAll: true,
      areaCheckAll: true,
      ageCheckAll: true,
    });
  }

  render() {
    const { add_forecast, login, filter_forecast, match: { params } } = this.props;
    const { cityData, addForecastData, } = add_forecast;
    const { ageList, areaList, cityList, sexStr = '' }: any = addForecastData;
    const { isShow, message, } = this.state;
    const { userGuid } = login.userInfo;
    const {
      clientName,
      demandPurpose,
      onlineTime,
      projectBackground,
      projectBudget,
      projectName,
    } = addForecastData;
    let show = Boolean(params['id']);
    let time = '';
    if (onlineTime) {
      time = onlineTime && moment(onlineTime).format("YYYY-MM-DD");
    }

    return (
      <div className="gray-container">
        <div className='add-forecast'>
          <div className="g-main">
            <div className="m-title">IP筛选器</div>
            <div className="m-form">
              <div className="m-form-div">
                <label className="input-label"> 客户名称
                  <span className="label-dot">*</span>
                </label>
                <input type="text" className="m-form-input" placeholder="请输入客户名称"
                       maxLength={255}
                       value={clientName}
                       disabled={show}
                       onChange={(e) => {
                         add_forecast.changeParams({ clientName: e.target.value, userGuid });
                       }}
                />
              </div>
              <div className="m-form-div">
                <label className="input-label"> 项目名称
                  <span className="label-dot">*</span>
                </label>
                <input type="text" className="m-form-input"
                       maxLength={255}
                       value={projectName}
                       disabled={show}
                       onChange={(e) => {
                         add_forecast.changeParams({ projectName: e.target.value });
                       }}
                       placeholder="请输入客户项目名称"/>
              </div>
              <div className="m-form-div">
                <label className="input-label">需求目的
                  <span className="label-dot">*</span>
                </label>

                {
                  show ?
                    <input type="text" className="m-form-input"
                           maxLength={255}
                           value={demandPurpose && needPurpose[demandPurpose]}
                           disabled={show}
                    />
                    :
                    <Select
                      className="m-form-select"
                      style={{ width: 600, height: 48 }}
                      placeholder="请选择需求目的"
                      value={demandPurpose}
                      onChange={(value) => {
                        add_forecast.changeParams({ demandPurpose: value });
                      }}
                    >
                      <Option value="1">品牌上市</Option>
                      <Option value="2">新品上市</Option>
                      <Option value="3">旧品促销</Option>
                    </Select>
                }
              </div>
              <div className="m-form-div">
                <label className="input-label">上线时间</label>
                {
                  show ?
                    <input type="text" className="m-form-input"
                           maxLength={255}
                           value={onlineTime && moment(onlineTime).format("YYYY-MM-DD")}
                           disabled={show}
                    />
                    :
                    <DatePicker
                      style={{ width: 600, height: 48 }}
                      // value={onlineTime}
                      format={"YYYY-MM-DD"}
                      onChange={(value) => {
                        add_forecast.changeParams({ onlineTime: value });
                      }}
                      placeholder="请选择上线时间"/>
                }
              </div>
              <div className="m-form-div">
                <label className="input-label">项目预算 </label>
                <input type="text" className="m-form-input"
                       style={{ width: 520 }}
                       maxLength={255}
                       pattern='^[0-9]/g'
                       value={projectBudget}
                       disabled={show}
                       onChange={(e) => {
                         add_forecast.changeParams({ projectBudget: e.target.value.replace(/[^\d]/g, '') });
                       }}
                       placeholder="请输入项目预算"/>
                <Select placeholder="请选择货币单位"
                        style={{ width: 80 }}
                        defaultValue="万元"
                        onChange={(value, option) => {
                          this.setState({
                            cny_unit: option.key
                          });
                        }}>
                  {
                    cny && cny.map((item, k) => {
                      return (
                        <Option value={item.value} key={item.key}>{item.value}</Option>
                      );
                    })
                  }
                </Select>
              </div>
              <div className="m-form-div m-form-div-textarea">
                <label className="input-label">项目背景</label>
                <textarea className="m-form-input m-form-textarea"
                          maxLength={255}
                          disabled={show}
                          value={projectBackground}
                          onChange={(e) => {
                            add_forecast.changeParams({ projectBackground: e.target.value });
                          }}
                          placeholder="请输入项目项目背景（500字内）"/>
              </div>
              <div className="m-form-div ">
                <label className="input-label">受众群体
                  <span className="label-dot">*</span>
                </label>
                <div className="special-checkboxes">
                  <div className="checkbox-div">
                    <label htmlFor="年龄" className="label">年龄</label>
                    <Checkbox
                      onChange={(e) => {
                        e.target.checked ?
                          add_forecast.changeParams({ ageList: [] })
                          :
                          add_forecast.changeParams({ ageList: [] });
                        this.setState({
                          ageCheckAll: e.target.checked,
                        });
                      }}
                      disabled={show}
                      checked={this.state.ageCheckAll}
                    >
                      不限
                    </Checkbox>
                    <Checkbox.Group options={ageOptions}
                                    value={ageList}
                                    disabled={show}
                                    onChange={(value) => {
                                      add_forecast.changeParams({ ageList: value });
                                      this.setState({
                                        ageCheckAll: false,
                                        // value.length === ageList.length,
                                      });
                                    }}
                    />
                  </div>
                  <div className="checkbox-div">
                    <label htmlFor="省份" className="label">省份</label>
                    <div className="province-div">
                      <Checkbox
                        onChange={(e) => {
                          add_forecast.changeParams({ cityList: [] });
                          this.setState({
                            checkAll: e.target.checked,
                          });
                        }}
                        disabled={show}
                        checked={this.state.checkAll}
                      >
                        全国
                      </Checkbox>
                      <Checkbox.Group
                        value={cityList}
                        options={cityData}
                        disabled={show}
                        onChange={(value) => {
                          add_forecast.changeParams({ cityList: value });
                          this.setState({
                            checkAll: false,
                            // value.length === cityData.length,
                          });
                        }}>
                      </Checkbox.Group>
                    </div>
                  </div>
                  <div className="checkbox-div">
                    <label htmlFor="地域" className="label">地域</label>
                    <Checkbox
                      disabled={show}
                      checked={this.state.areaCheckAll}
                      onChange={(e) => {
                        e.target.checked ?
                          add_forecast.changeParams({ areaList: [] })
                          :
                          add_forecast.changeParams({ areaList: [] });

                        this.setState({
                          areaCheckAll: e.target.checked,
                        });
                      }}
                    >全国</Checkbox>
                    <Checkbox.Group
                      value={areaList}
                      disabled={show}
                      options={areaOptions}
                      onChange={(value) => {
                        add_forecast.changeParams({ areaList: value });
                        this.setState({
                          areaCheckAll: false,
                          // value.length === areaList.length,
                        });
                      }}>
                    </Checkbox.Group>
                  </div>
                  <div className="checkbox-div">
                    <label htmlFor="性别" className="label">性别</label>
                    <Radio.Group options={sexOptions}
                                 value={show ? addForecastData.sex : sexStr}
                                 disabled={show}
                                 onChange={(e) => {
                                   add_forecast.changeParams({ sexStr: e.target.value });
                                 }}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {
            show ?
              <div className="g-btn">
                <button className="u-confirm-btn"
                        onClick={async () => {
                          let clientDemandGuid = add_forecast.addForecastData.clientDemandGuid;
                          filter_forecast.selected = "卡通动漫";
                          filter_forecast.clearIpData();
                          filter_forecast.changeSelectedChild({
                            nav: '',
                          });
                          this.props.history.push(`/filter-forecast/${clientDemandGuid}`);
                        }}
                >查看
                </button>
              </div>
              :
              <div className="g-btn">
                <button className="u-confirm-btn"
                        onClick={async () => {
                          await this.submitForecast();
                        }}
                >确定
                </button>
                <button className="u-clear-btn"
                        onClick={() => this.clear()}>重置
                </button>
              </div>
          }
          {
            isShow && <Alert
              message={message}
              onClose={() => {
                this.setState({ isShow: false });
              }}
              onSubmit={() => {
              }}
            />
          }
        </div>
        <ScrollTop/>
      </div>
    );
  }
}
