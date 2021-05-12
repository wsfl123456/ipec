/**
 * 预测数据-添加页面
 * author:Blance.xue
 */
import * as React from "react";
import { inject, observer } from "mobx-react";
import "@assets/scss/add_calculate.scss";
import { Select, DatePicker, } from "antd";
import Alert from "@components/alert";
import moment from 'moment';
import _isEmpty from "lodash/isEmpty";
import ScrollTop from "@components/scroll-top";
import icon_doubt from "@assets/images/ip_detail/how.png" ;
const { Option } = Select;

interface IAddCalculateState {
  message: string;
  isShow: boolean;
  alertMessage: string;
}

let typeName = {
  "5": "电视剧",
  "6": "电影",
  "7": "综艺",
};

let disabled = false;

@inject('login', 'add_calculate')
@observer
export default class AddCalculate extends React.Component <IProps, IAddCalculateState> {

  constructor(props: any) {
    super(props);
    this.state = {
      message: '',
      isShow: false,
      alertMessage: '',
    };
  }

  async componentDidMount() {
    document.title = "IP二厂- 添加预测数据";
    const { add_calculate, match: { params } } = this.props;
    await add_calculate.changePeopleType({ type: 1 });
    await add_calculate.changePeopleType({ type: 2 });
    await add_calculate.changePeopleType({ type: 3 });
    await add_calculate.companyParams({ companyName: '', companyType: 1 });
    await add_calculate.companyParams({ companyName: '', companyType: 6 });

    if (params['id']) {
      add_calculate.changeParams({
        ipName: localStorage.getItem("ipName"),
        ipTypeSuperiorNumber: params['id'],
      });

      await add_calculate.ipTypeList({ ipTypeSuperiorNumber: Number(params['id']) });
    } else {
      this.clear();
      add_calculate.changeParams({ ipName: '', ipTypeSuperiorNumber: '' });
    }
  }

  /**
   * 添加预测数据
   */
  async submitCalculate() {
    const { add_calculate, login } = this.props;
    const { addCalculateData } = add_calculate;

    if (!addCalculateData.ipName) {
      this.setState({ isShow: true, message: '请输入IP名称' });
      return false;
    }
    if (!addCalculateData.ipTypeSuperiorNumber) {
      this.setState({ isShow: true, message: '请选择预测品类' });
      return false;
    }
    if (_isEmpty(addCalculateData.director)) {
      this.setState({ isShow: true, message: '请选择导演' });
      return false;
    }
    if (_isEmpty(addCalculateData.scriptwriter)) {
      this.setState({ isShow: true, message: '请选择编剧' });
      return false;
    }
    if (_isEmpty(addCalculateData.protagonist)) {
      this.setState({ isShow: true, message: '请选择主演' });
      return false;

    }
    if (_isEmpty(addCalculateData.type)) {
      this.setState({ isShow: true, message: '请选择IP类型' });
      return false;

    }
    if (_isEmpty(addCalculateData.companyCp)) {
      this.setState({ isShow: true, message: '请选择出品公司' });
      return false;

    } else {
      addCalculateData.sendingTime = _isEmpty(addCalculateData.sendingTime) ? null : moment(addCalculateData.sendingTime).format("YYYY-MM-DD");
      addCalculateData.type = addCalculateData.type.join(',');
      addCalculateData.director = addCalculateData.director.join(',');
      addCalculateData.scriptwriter = addCalculateData.scriptwriter.join(',');
      addCalculateData.protagonist = addCalculateData.protagonist.join(',');
      addCalculateData.companyCp = addCalculateData.companyCp.join(',');
      addCalculateData.companyXf = addCalculateData.companyXf && addCalculateData.companyXf.join(',');
      const isSuccess = await add_calculate.getCalculateData(addCalculateData);
      disabled = true;
      if (isSuccess.show) {
        this.setState({ isShow: true, message: '提交成功' });
      } else {
        this.setState({ isShow: true, message: '服务器繁忙' });
      }
      this.clear();
      add_calculate.changeParams({ ipName: '', ipTypeSuperiorNumber: '' });
      setTimeout(() => {
        history.go(-1);
      }, 1000);
    }
  }

  /**
   * 重置
   */
  clear() {
    const { add_calculate, match: { params: param } } = this.props;
    let params;
    disabled = false;
    if (param['id']) {
      params = {
        director: [],
        scriptwriter: [],
        protagonist: [],
        type: [],
        companyXf: [],
        companyCp: [],
        original: '',
        country: '',
        language: '',
        sendingTime: null,
        episodes: '',
        singleFilmLength: '',
      };
    } else {
      params = {
        ipName: '',
        ipTypeSuperiorNumber: '',
        director: [],
        scriptwriter: [],
        protagonist: [],
        type: [],
        companyXf: [],
        companyCp: [],
        original: '',
        country: '',
        language: '',
        sendingTime: null,
        episodes: '',
        singleFilmLength: '',
      };
    }

    add_calculate.changeParams(params);
  }

  render() {
    const { login, match: { params }, add_calculate } = this.props;
    const { isShow, message } = this.state;
    const { userGuid } = login.userInfo;
    const {
      addCalculateData,
      director, screenWriter, actor,
      companyCp, companyXf,
      typeList,
    } = add_calculate;
    let show = Boolean(params['id']);
    return (
      <div className="gray-container">
        <div className='add-calculate'>
          <div className="g-main">
            <div className="m-title">
              预测数据
              <img src={icon_doubt} alt="" className="icon_detail"/>
                <div className="hover-box">
                  <p>含义：根据ip构成因子以往市场表现来预测ip未来市场表现。</p>
                </div>
            </div>
            <div className="m-form">
              <div className="m-form-div">
                <label className="input-label">IP名称
                  <span className="label-dot">*</span>
                </label>
                {
                  show ?
                    <input type="text" className="m-form-input" placeholder="请输入IP名称"
                           maxLength={255}
                           value={addCalculateData.ipName}
                           disabled={show}/>
                    :
                    <input type="text" className="m-form-input" placeholder="请输入IP名称"
                           maxLength={255}
                           value={addCalculateData.ipName}
                           onChange={(e) => {
                             add_calculate.changeParams({ ipName: e.target.value });
                           }}
                    />
                }

              </div>
              <div className="m-form-div">
                <label className="input-label">预测品类
                  <span className="label-dot">*</span>
                </label>

                {
                  show ?
                    <Select
                      className="m-form-select"
                      style={{ width: 1060, height: 48 }}
                      placeholder="请选择预测品类"
                      disabled
                      value={params['id'] && typeName[params['id']]}
                    />
                    :
                    <Select
                      className="m-form-select"
                      style={{ width: 1060, height: 48 }}
                      placeholder="请选择预测品类"
                      value={typeName[addCalculateData.ipTypeSuperiorNumber]}
                      onChange={async (value) => {
                        add_calculate.changeParams({ ipTypeSuperiorNumber: value });
                        await add_calculate.ipTypeList({ ipTypeSuperiorNumber: value });
                      }}
                    >
                      <Option value="5">电视剧</Option>
                      <Option value="6">电影</Option>
                      <Option value="7">综艺</Option>
                    </Select>
                }
              </div>
              <div className="m-form-div">
                <label className="input-label">导演
                  <span className="label-dot">*</span>
                </label>
                <Select
                  className="m-form-select"
                  mode="tags"
                  maxTagCount={10}
                  value={addCalculateData.director}
                  style={{ width: 1060, minHeight: 48 }}
                  placeholder='请选择导演名称，如有多个以","分割'
                  onChange={(value: any) => {
                    if (value.length > 10) {
                      value = value.slice(0, 10);
                    }
                    add_calculate.changeParams({ director: value, createUserGuid: userGuid });
                  }}
                  onSearch={async (value) => {
                    await add_calculate.changePeopleType({ type: 1, ipName: value });
                  }}
                >
                  {
                    director && director.map((i, k) => {
                      return (
                        <Option key={k} value={i.ipName}>{i.ipName}</Option>
                      );
                    })
                  }
                </Select>
              </div>
              <div className="m-form-div">
                <label className="input-label">编剧
                  <span className="label-dot">*</span>
                </label>
                <Select
                  className="m-form-select"
                  style={{ width: 1060, minHeight: 48 }}
                  mode="tags"
                  value={addCalculateData.scriptwriter}
                  maxTagCount={10}
                  placeholder='请选择编剧名称，如有多个以","分割'
                  onChange={(value: any) => {
                    if (value.length > 10) {
                      value = value.slice(0, 10);
                    }
                    add_calculate.changeParams({ scriptwriter: value });
                  }}
                  onSearch={async (value) => {
                    await add_calculate.changePeopleType({ type: 2, ipName: value });
                  }}
                >
                  {
                    screenWriter && screenWriter.map((i, k) => {
                      return (
                        <Option key={k} value={i.ipName}>{i.ipName}</Option>
                      );
                    })
                  }
                </Select>
              </div>
              <div className="m-form-div">
                <label className="input-label">主演
                  <span className="label-dot">*</span>
                </label>
                <Select
                  className="m-form-select"
                  mode="tags"
                  value={addCalculateData.protagonist}
                  maxTagCount={20}
                  showSearch
                  style={{ width: 1060, minHeight: 48 }}
                  placeholder='请选择主演名称，如有多个以","分割'
                  onChange={(value: any) => {
                    if (value.length > 20) {
                      value = value.slice(0, 20);
                    }
                    add_calculate.changeParams({ protagonist: value });
                  }}
                  onSearch={async (value) => {
                    await add_calculate.changePeopleType({ type: 2, ipName: value });
                  }}
                >
                  {
                    actor && actor.map((i, k) => {
                      return (
                        <Option key={k} value={i.ipName}>{i.ipName}</Option>
                      );
                    })
                  }
                </Select>
              </div>
              <div className="m-form-div">
                <label className="input-label">IP类型
                  <span className="label-dot">*</span>
                </label>
                <Select
                  className="m-form-select"
                  style={{ width: 1060, minHeight: 48 }}
                  mode="tags"
                  value={addCalculateData.type}
                  maxTagCount={10}
                  placeholder='请输入IP类型，如有多个以","分割'
                  onDropdownVisibleChange={() => {
                    if (_isEmpty(typeList) && !addCalculateData.ipTypeSuperiorNumber) {
                      this.setState({ isShow: true, message: '请先选择预测品类后再进行此操作' });
                    }
                  }}
                  onChange={(value: any) => {
                    if (value.length > 10) {
                      value = value.slice(0, 10);
                    }
                    add_calculate.changeParams({ type: value });
                  }}
                >
                  {
                    typeList && typeList.map((i, k) => {
                      return (
                        <Option key={k} value={i}>{i}</Option>
                      );
                    })
                  }
                </Select>
              </div>
              <div className="m-form-div">
                <label className="input-label">出品公司
                  <span className="label-dot">*</span>
                </label>
                <Select
                  className="m-form-select"
                  mode="tags"
                  value={addCalculateData.companyCp}
                  maxTagCount={10}
                  style={{ width: 1060, minHeight: 48 }}
                  placeholder='请选择出品公司，如有多个以","分割'
                  onChange={(value: any) => {
                    if (value.length > 10) {
                      value = value.slice(0, 10);
                    }
                    add_calculate.changeParams({ companyCp: value });
                  }}
                  onSearch={(value) => {
                    add_calculate.companyParams({ companyName: value, companyType: 1, currentPage: 1 });
                  }}
                  /* onPopupScroll={(e) => {
                     // 下拉列表滚动加载
                     e.persist();
                     if (e.target['scrollTop'] + e.target['offsetHeight'] === e.target['scrollHeight']) {
                       add_calculate.company.currentPage = add_calculate.company.currentPage + 1;
                       if (add_calculate.loadingCp) {
                         add_calculate.companyParams({ companyType: 1, currentPage: add_calculate.company.currentPage });
                       }
                     }
                   }}*/
                >
                  {
                    companyCp && companyCp.map((i, k) => {
                      return <Option key={k} value={i.companyName}>{i.companyName}</Option>;
                    })
                  }
                </Select>
              </div>
              <div className="m-form-div">
                <label className="input-label">宣发公司
                </label>
                <Select
                  className="m-form-select"
                  mode="tags"
                  value={addCalculateData.companyXf}
                  maxTagCount={10}
                  style={{ width: 1060, minHeight: 48 }}
                  placeholder='请选择宣发公司，如有多个以","分割'
                  onChange={(value: any) => {
                    if (value.length > 10) {
                      value = value.slice(0, 10);
                    }
                    add_calculate.changeParams({ companyXf: value });
                  }}
                  onSearch={(value: any) => {
                    add_calculate.companyParams({ companyName: value, companyType: 6, currentPage: 1 });
                  }}
                  /* onPopupScroll={(e) => {
                     // 下拉列表滚动加载
                     e.persist();
                     if (e.target['scrollTop'] + e.target['offsetHeight'] === e.target['scrollHeight']) {
                       add_calculate.company.currentPage = add_calculate.company.currentPage + 1;
                       if (add_calculate.loadingXf) {
                         add_calculate.companyParams({ companyType: 6, currentPage: add_calculate.company.currentPage });
                       }
                     }
                   }}*/
                >{
                  companyXf && companyXf.map((i, k) => {
                    return <Option key={k} value={i.companyName}>{i.companyName}</Option>;
                  })
                }
                </Select>
              </div>
              <div className="m-form-div">
                <label className="input-label">原著</label>
                <input type="text" className="m-form-input"
                       placeholder="请输入原著"
                       maxLength={255}
                       value={addCalculateData.original}
                       onChange={(e) => {
                         add_calculate.changeParams({ original: e.target.value });
                       }}
                />
              </div>
              <div className="m-form-div">
                <label className="input-label">国家地区</label>
                <input type="text" className="m-form-input" placeholder="请输入国家地区"
                       maxLength={20}
                       value={addCalculateData.country}
                       onChange={(e) => {
                         add_calculate.changeParams({ country: e.target.value });
                       }}
                />
              </div>
              <div className="m-form-div">
                <label className="input-label">语言</label>
                <input type="text" className="m-form-input" placeholder="请输入IP使用语言"
                       maxLength={10}
                       value={addCalculateData.language}
                       onChange={(e) => {
                         add_calculate.changeParams({ language: e.target.value, });
                       }}
                />
              </div>
              <div className="m-form-div">
                <label className="input-label">发片时间</label>
                <DatePicker
                  style={{ width: 1060, height: 48 }}
                  format={"YYYY-MM-DD"}
                  value={addCalculateData.sendingTime && moment(addCalculateData.sendingTime, 'YYYY-MM-DD')}
                  onChange={(value) => {
                    add_calculate.changeParams({ sendingTime: value });
                  }}
                  placeholder="请选择发片时间"/>
              </div>
              {
                Number(addCalculateData.ipTypeSuperiorNumber) !== 6 &&
                <div className="m-form-div">
                  <label className="input-label">集数
                    <span className="remarks">（注：电视剧及综艺选项)</span>
                  </label>
                  <input type="text" className="m-form-input"
                         maxLength={10}
                         value={addCalculateData.episodes}
                         onChange={(e) => {
                           add_calculate.changeParams({ episodes: e.target.value });
                         }}
                         placeholder="请输入集数，例XX集"/>
                </div>
              }
              {
                Number(addCalculateData.ipTypeSuperiorNumber) !== 6 &&
                <div className="m-form-div">
                  <label className="input-label">单集片长
                    <span className="remarks">（注：电视剧及综艺选项)</span>
                  </label>
                  <input type="text" className="m-form-input"
                         maxLength={10}
                         value={addCalculateData.singleFilmLength}
                         onChange={(e) => {
                           add_calculate.changeParams({ singleFilmLength: e.target.value });
                         }}
                         placeholder="请输入单集片长，例XX分钟"/>
                </div>
              }
            </div>
          </div>
          <div className="g-btn">
            <button className="u-confirm-btn"
                    disabled={disabled}
                    onClick={async () => {
                      await this.submitCalculate();
                    }}
            >预测
            </button>
            <button className="u-clear-btn" onClick={() => this.clear()}>重置</button>
          </div>
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
