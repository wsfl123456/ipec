import * as React from 'react';
import ic_gzt_pr from "@assets/images/matchmaking/ic_gzt_pr.svg";
import ic_gzt from "@assets/images/matchmaking/ic_gzt.svg";
import ic_home from "@assets/images/matchmaking/ic_home.svg";
import ic_ythm from "@assets/images/matchmaking/ic_ythm.svg";
import icon_load from "@assets/images/update/timg.gif";
import close from "assets/images/ic_close.svg";
import default_img from "@assets/images/default/ic_default_shu.png";
import { inject, observer } from "mobx-react";
import '@assets/scss/authorized_exhibition.scss';
import { Select, message } from 'antd';
import Toast from "@components/toast";
import Alert from '@components/alert';
import _isEmpty from 'lodash/isEmpty';
import { Tooltip } from 'antd';

const { Option } = Select;
import {
  invitationSave,
  getFocusOn,
  reqIpTypeList, matchSearchList, invitePersonalTime
} from '@utils/api';
import SwipeBanner from '@pages/authorized-exhibition/components/special-swiper';
import NoResult from '@components/no_result';
import DateTimePicker from '@components/date-time-picker';
import { toJS } from "mobx";

let children1 = []; //
let children2 = []; //
let children3 = []; //

interface ITradeData extends IComponentProps {
  exhibitionGuid: string,
  history?: any,
}

interface ITradeDataState {
  data?: any,
  children: any[], // 参展人下拉框
  filterResult: {
    companyVOs: any[], // 参展的公司
    ipVOs: any[], // 参展的IP
    personnelVOs: any[], // 参展的人
  },
  searchValue: string, // 参展搜素的值
  selectType: string, // 邀请会展的类型
  dateArr: any[], // 存储写死的会议小时
  hoursArr: any[], // 存储小时
  reqIpTypeList: any[], // 参展主页的信息展示
  showMobox: boolean, // 显示错误提示
  // 关于邀请会面的参数 start
  showMeetingBox: boolean, // 显示邀请会议的弹出层
  mobxPerson: string, // 邀请的人是谁
  mobxPersonGuid: string, // 个人的GUID
  meetAddress: string, // 会议地址
  exhibitionCompanyGuid: string, // 当前会展公司的guid
  forbidden_index: number, // 当天的不能选择的位置
  forbidden_endIndex: number, // 最后一天的结束时间
  beginDate: number, // 开始时间
  endDate: number, // 结束时间
  selectMounth: string, // 选中的月份
  selectDay: string, // 选中哪个天数
  selectMouthDay: string, // 月份天数的拼接
  meetingWhy: string, // 参加会议的原因
  isCall: boolean, // 是否有电话数据
  callNumber: any, // 号码
  moboxChildren: any[], // 弹出层的数据

  // 关于邀请会面的参数 end
  tradeData: { // 当前页面的信息
    company: any[],
    personal: any[],
    ipid: any[],
  },
  message: string, // 带确认的消息提示
  alertMessage: string, // alert 消息提示
  show: boolean, // 显示带确认的消息提示
  alertShow: boolean, // 显示 alert 消息提示
  // notOver: number, // 会议是不是结束了

  invitationDate: string, // 组件拿到的时间日期
  invitationTime: string, // 组件拿到的时间时间

  currentPage: number;
  reservation: any[],
}

@inject("nav_store", "authorize", "update", "login")
@observer
export default class Trade extends React.Component<ITradeData, ITradeDataState> {
  state = {
    // notOver: 0,
    reqIpTypeList: [],
    forbidden_index: -1,
    forbidden_endIndex: -1,
    show: false,
    alertShow: false,
    message: "",
    alertMessage: "",
    selectMouthDay: "",
    isCall: false,
    callNumber: null,
    meetingWhy: '',
    selectMounth: '',
    selectDay: '',
    beginDate: null,
    endDate: null,
    mobxPerson: '',
    mobxPersonGuid: '',
    meetAddress: '',
    exhibitionCompanyGuid: '',
    showMobox: false,
    showMeetingBox: false,
    moboxChildren: [],
    hoursArr: ['9:00-9:30', '9:30-10:00', '10:00-10:30', '10:30-11:00', '11:00-11:30', '11:30-12:00', '12:00-12:30', '12:30-13:00',
      '13:00-13:30', '13:30-14:00', '14:00-14:30', '14:30-15:00', '15:00-15:30', '15:30-16:00', '16:00-16:30', '16:30-17:00'
    ],
    dateArr: [],
    searchValue: '',
    filterResult: {
      companyVOs: [],
      ipVOs: [],
      personnelVOs: [],
    },
    selectType: 'company',
    children: [],
    tradeData: {
      company: [],
      personal: [],
      ipid: [],
    },

    invitationDate: "", // 组件拿到的时间日期
    invitationTime: "", // 组件拿到的时间时间

    currentPage: 1,
    reservation: []
  };

  async componentDidMount() {
    const { authorize, exhibitionGuid, login } = this.props;
    let loginUserGuid = login.userInfo ? login.userInfo['userGuid'] : 0;
    const { errorCode, result: { companyList, companyIpList, companyPersonnelList } }: any = await matchSearchList({ exhibitionGuid });
    await authorize.getMatchListFirst({ loginUserGuid, exhibitionGuid, currentPage: 1, pageSize: 9 });
    let { result }: any = await reqIpTypeList();
    if (errorCode === '200') {
      this.setState({
        tradeData: {
          ipid: companyIpList,
          company: companyList,
          personal: companyPersonnelList,
        }
      });
    }
    this.setState({
      reqIpTypeList: result,
    });

    // 默认展示参展企业的数据
    children1 = (companyList || [])
      .map(v => <Option
        key={v.id + '_c'}
        value={v.companyName}>{v.companyName}</Option>);
    children2 = (companyPersonnelList || [])
      .map(v => <Option
        key={v.id + '_p'}
        value={v.userRealName}>{v.userRealName}</Option>);
    children3 = (companyIpList || [])
      .map(v => <Option
        key={v.id + '_i'}
        value={v.ipName}>{v.ipName}</Option>);
    if (this.state.selectType === 'company') {
      window.addEventListener('scroll', this.handleScroll);
    }
  }

  async componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  _throttle(fun, interval) {
    let timeout, startTime: any = new Date();
    return () => {
      clearTimeout(timeout);
      let curTime: any = new Date();
      if (curTime - startTime <= interval) {
        timeout = setTimeout(() => {
          fun();
        }, curTime - startTime);
      } else {
        startTime = curTime;
      }
    };
  }

  /**
   * 滚动分页
   */
  handleScroll = () => {
    const { authorize, exhibitionGuid, login } = this.props;
    const { isLoading } = authorize;
    let loginUserGuid = login.userInfo ? login.userInfo['userGuid'] : 0;
    let yScroll;
    if (self.pageYOffset) {
      yScroll = self.pageYOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
      yScroll = document.documentElement.scrollTop;
    } else if (document.body) {
      yScroll = document.body.scrollTop;
    }
    let currentPage = this.state.currentPage + 1;
    if ((yScroll + document.body.clientHeight) >= document.body.scrollHeight) {
      if (!isLoading && this.state.searchValue === "") {
        this.setState({
          currentPage,
        });

        this.props.authorize.setLoadingStatus(true);
        this._throttle(authorize.getMatchListFirst({
          loginUserGuid,
          exhibitionGuid,
          currentPage,
          pageSize: 9,
        }), 3000);

      }
    }
  };

  /**
   * 发起邀约弹窗展示
   */
  async showMobx(data, type) {
    const { isOver } = this.props.authorize;
    const { login } = this.props;
    let { moboxChildren } = this.state;
    if (!login.userInfo) {
      localStorage.setItem('historyUrl', `matchmaking/${this.props.exhibitionGuid}`);
      this.setState({
        alertShow: true,
        alertMessage: '您未登陆，是否前往登陆？',
      });
      return false;
    }

    if (login.userInfo.userGuid === data.userGuid) {
      this.setState({
        show: true,
        message: '请不要邀约自己',
      });
      return;
    }
    if (!isOver) {
      this.setState({
        show: true,
        message: '展会已经结束，不能邀会面。',
      });
      return;
    }

    moboxChildren = [];
    if (type === 'personnel') {
      this.setState({
        mobxPerson: data.userRealName + "-" + data.occupation,
        mobxPersonGuid: data.userGuid,
      });
    }
    if (type === 'ipid' || type === 'company') {
      moboxChildren.push(<Option key={data.exhibitionGuid} value={data.userGuid}>{data.companyName}</Option>);
      data.companyPersonnelVOs.map(v => {
        moboxChildren.push(<Option key={v.id} value={v.userGuid}>{v.userRealName + "-" + v.occupation}</Option>);
      });
      this.setState({
        meetAddress: data.booth,
        exhibitionCompanyGuid: data.exhibitionCompanyGuid,
        moboxChildren,
        showMobox: true,
      });
    }
    const { result }: any = await invitePersonalTime(data.exhibitionGuid, data.userGuid);
    if (result) {
      this.setState({
        reservation: result,
      });
    }
  }

  // 选择邀约选中的人
  mobxChange = (val) => {
    this.setState({
      mobxPersonGuid: val
    });
  };

  // 商贸配对-检索-下拉公司
  authorizedTypeChange = async (value: string) => {
    const { authorize, login } = this.props;
    if (value === 'company') {
      authorize.flag = true;
      // 从其他两个Option切换回参展企业的时候 重新请求接口拿到所有企业并展示
      let params = {
        exhibitionGuid: this.props.exhibitionGuid,
        loginUserGuid: login.userInfo ? login.userInfo['userGuid'] : 0,
        currentPage: 1,
        pageSize: 9,
      };
      await authorize.getMatchListFirst(params);
    }
    this.setState({
      searchValue: '',
      selectType: value,
      currentPage: 1,
    });
  };

  /**
   * 参展检索输入框
   */
  handleChange = (value) => {
    this.setState({
      searchValue: value,
      currentPage: 1,
    });
    let { selectType, tradeData: { ipid, company, personal } } = this.state;
    let contrastId = '';
    if (selectType === 'company') {
      company.map(v => {
        if (v.companyName === value) {
          contrastId = v.exhibitionCompanyGuid;
        }
      });
    }
    if (selectType === 'ipid') {
      ipid.map(v => {
        if (v.ipName === value) {
          contrastId = v.ipid;
        }
      });
    }
    if (selectType === 'personal') {
      personal.map(v => {
        if (v.userRealName === value) {
          contrastId = v.userGuid;
        }
      });
    }
    this.lookForDetail(contrastId, selectType);
  };

  /**
   * 商贸配对列表-检索
   * @param guid
   * @param selectType  检索类型
   */
  lookForDetail = async (guid = '', selectType = '') => {
    const { authorize, exhibitionGuid, login } = this.props;
    let params: any = {
      exhibitionGuid,
      loginUserGuid: login.userInfo ? login.userInfo['userGuid'] : 0,
    };
    const tmp = {
      personal: v => params.userGuid = v,
      company: v => params.exhibitionCompanyGuid = v,
      ipid: v => params.ipid = v,
    };
    tmp[selectType] && tmp[selectType](guid);
    await authorize.getMatchList(params);
  };

  // 展会IP很多时第三行省略号显示
  fileIPListArr(arr) {
    let str = '';
    arr.forEach((m, index) => str += index === 0 ? m.ipName : ',' + m.ipName);
    str = str.length >= 70 ? str && str.substring(0, 70) + '...' : str;
    return str;
  }

  // 展会IP展示所有
  fileIPListAll(arr) {
    let str = '';
    arr.forEach((m, index) => str += index === 0 ? m.ipName : ',' + m.ipName);
    return str;
  }

  // 展会负责人所有
  filterPersonAll(arr) {
    let str = '';
    arr.forEach((v, index) => str += index === 0 ? v.userRealName : ',' + v.userRealName);
    return str;
  }

  /**
   * 取消会面邀请弹窗，清空input 值
   */
  closeMobox() {
    this.setState({
      selectMouthDay: '',
      selectDay: '',
      selectMounth: '',
      showMobox: false,
    });
  }

  /**
   * 发送会面邀请
   */
  async putMeetingDate() {
    let mPatternEmail = /^([a-z0-9A-Z]+[_|.]?)+[a-z0-9A-Z]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    let mPattern = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
    let {
      mobxPersonGuid, meetingWhy,
      isCall, callNumber, exhibitionCompanyGuid,
      meetAddress, invitationDate, invitationTime
    } = this.state;
    let { login } = this.props;

    if (!mobxPersonGuid) {
      this.setState({ show: true, message: '请选择会面人员' });
      return;
    }
    if (!invitationDate || !invitationTime) {
      this.setState({ show: true, message: '请选择会面时间段' });
      return;
    }
    if (!meetingWhy) {
      this.setState({ show: true, message: '请输入会面原因' });
      return;
    }
    if (isCall && !mPatternEmail.test(callNumber) && !mPattern.test(callNumber)) {
      this.setState({ show: true, message: '请正确输入联系方式' });
      return;
    }
    let param = {
      exhibitionCompanyGuid,
      exhibitionGuid: this.props.exhibitionGuid,
      invitationPersonnel: login.userInfo['userGuid'],
      invitationNotifyContact: isCall ? 1 : 2,
      invitationDate,
      invitationTime,
      meetAddress,
      meetPersonnel: mobxPersonGuid,
      meetReason: meetingWhy,
    };
    if (isCall) {
      param['invitationContactInformation'] = callNumber;
    }
    let { errorCode, result }: any = await invitationSave(param);
    if (errorCode === '200' && result.errorCode === 200) {
      this.closeMobox();
      message.success(result.errorMsg);
    } else {
      this.closeMobox();
      message.error(result.errorMsg);
    }
  }

  /**
   * 关注
   * @param guid
   * @param isFollow
   * @param type
   * @param index
   */
  async getFocusOn({ guid, isFollow, type, index }: { guid: string, isFollow: number, type: number, index }) {
    let { authorize, login } = this.props;
    const { filterResult } = authorize;
    if (!login.userInfo) {
      this.setState({
        alertShow: true,
        alertMessage: '您未登陆，是否前往登陆？',
      });
      return false;
    }
    let _item: string = '';
    if (type === 1) _item = 'companyVOs';
    if (type === 2) _item = 'personnelVOs';
    if (type === 3) _item = 'ipVOs';
    let userGuid = login.userInfo['userGuid'];
    let { errorCode, result, errorMessage }: any = await getFocusOn({ guid, isFollow, type, userGuid });
    if (errorCode === '200') {
      if (result['errorCode'] === 200) {
        // 更改数据源数据
        filterResult[_item][index].focusId = isFollow === 1 ? 1 : null;

      }
      this.setState({ show: true, message: result.errorMsg });
    } else {
      this.setState({ show: true, message: errorMessage });
    }
  }

  // 参展IP主页
  goToIpList(name, ipid) {
    let { reqIpTypeList } = this.state;
    let ipTypeNumber = '';
    reqIpTypeList.map(v => {
      if (v.ipType === name) {
        ipTypeNumber = v.ipTypeNumber;
      }
    });
    this.props.history.push(`/detail/${ipTypeNumber}/${ipid}`);
  }

  // 跳企业主页
  jumpCompany(value) {
    this.props.history.push(`/business-homepage/${value}`);
  }

  // 跳个人主页
  jumpPersonal(value) {
    this.props.history.push(`/personal-homepage/${value}`);
  }

  // 时间组件拿到的时间
  getDateAndTimeData(invitationDate: string, invitationTime: string) {
    this.setState({
      invitationDate,
      invitationTime,
    });
  }

  render() {
    let { showMobox, moboxChildren, selectType } = this.state;
    const { authorize, login } = this.props;
    const { filterResult, endDateStr, beginDateStr } = authorize;
    return (
      <div className="autherized_trade" onClick={() => {
        this.setState({
          showMeetingBox: false
        });
      }}>
        {this.state.alertShow &&
        <Alert message={this.state.alertMessage}
               onClose={() => {
                 this.setState({ alertShow: false });
               }}
               onSubmit={() => {
                 this.props.history.push(`/login`);
               }}
        />
        }
        {this.state.show &&
        <Toast
          onClose={() => {
            this.setState({ show: false });
          }}
          duration={3}
          message={this.state.message}
        />}
        {showMobox && <div className="mobox">
          <div className="mobox_content">
            <div className="title">
              邀TA会面
              <img src={close} onClick={() => this.closeMobox()} alt=""/>
            </div>
            <div className="center">
              <div className="form-group flex-column">
                <label
                  className="input-label">{moboxChildren.length > 0 ? "选择会面人员" : "会面人员"}
                  <span className="label-dot">*</span>
                </label>
                {
                  moboxChildren.length > 0 ?
                    <Select
                      getPopupContainer={trigger => trigger.parentElement}
                      style={{ width: '100%' }}
                      placeholder="请选择该企业里你想要会面的人员"
                      optionFilterProp="children"
                      onChange={this.mobxChange}
                      filterOption={(input, option) =>
                        typeof option.props.children === "string"
                          ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          : false
                      }
                    >
                      {moboxChildren}
                    </Select> :
                    <input
                      type="text"
                      className="form-control"
                      placeholder="请选择该企业里你想要会面的人员"
                      value={this.state.mobxPerson}
                      readOnly
                    />
                }

              </div>
              <div className="form-group selectMeeting flex-column" onClick={e => {
                e.stopPropagation();
              }}>
                <label className="input-label">选择会面时间段<span className="label-dot">*</span></label>
                <DateTimePicker
                  begin={beginDateStr}
                  end={endDateStr}
                  dateTime={this.getDateAndTimeData.bind(this)}
                  reservation={this.state.reservation}
                />
              </div>
              <div className="form-group flex-column">
                <label className="input-label">会面原因<span className="label-dot">*</span></label>
                <textarea placeholder="请在此输入您想要和他会面的原因（400字内）" onChange={e => {
                  if (e.target.value.length > 400) {
                    this.setState({
                      show: true,
                      message: '原因不能超出400字'
                    });
                    return;
                  }
                  this.setState({
                    meetingWhy: e.target.value
                  });
                }} cols={30} rows={10}/>
              </div>
              <div className="form-group flex-column">
                <label className="input-label">是否愿意将联系方式告知TA<span className="label-dot">*</span></label>
                <div className="radio-group  flex-row flex-wrap">
                  <div
                    className={`ip-radio flex-row align-items-center ${this.state.isCall && "radio-selected"}`}
                    onClick={() => {
                      this.setState({
                        isCall: true,
                      });
                    }}>
                    <div className="limit-custom-radio"/>
                    <span className="radio-text">是</span>
                  </div>
                  <div
                    className={`ip-radio flex-row align-items-center ${!this.state.isCall && 'radio-selected'}`}
                    onClick={() => {
                      this.setState({
                        isCall: false,
                      });
                    }}>
                    <div className="limit-custom-radio"/>
                    <span className="radio-text">否</span>
                  </div>
                </div>
                {
                  this.state.isCall && <input
                    type="text"
                    className="form-control margin-top5"
                    placeholder="请输入联系方式"
                    onChange={async e => {
                      this.setState({
                        callNumber: e.target.value
                      });
                    }}
                  />
                }
              </div>
            </div>
            <div className="footer">
              <button
                onClick={async () => {
                  await this.putMeetingDate();
                }}
              >
                发送会面邀请
              </button>
              <button
                className="resolve"
                onClick={() => {
                  this.closeMobox();
                }}
              >
                取消
              </button>
            </div>
          </div>
        </div>
        }
        <div className="headerImg">
          <SwipeBanner/>
        </div>

        <div className="searchBox">
          <div>
            <div className="select">
              <Select
                defaultValue="company"
                style={{ width: 120 }}
                onChange={this.authorizedTypeChange}
              >
                <Option value="company">参展企业</Option>
                <Option value="personal">展会人员</Option>
                <Option value="ipid">参展IP</Option>
              </Select>
            </div>
            <span className="spassBar"/>
            <div className="search"><i className="icon iconfont icon-search"/>
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="请输入关键字搜索"
                optionFilterProp="children"
                onChange={this.handleChange}
                value={this.state.searchValue}
                filterOption={(input, option) =>
                  typeof option.props.children === "string" ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false
                }
              >
                {selectType === 'company' && children1}
                {selectType === 'personal' && children2}
                {selectType === 'ipid' && children3}
              </Select>
            </div>
          </div>
        </div>

        {
          filterResult.companyVOs.length > 0 && <h2>参展企业</h2>
        }
        {
          filterResult.companyVOs &&
          <div className="tradeContent">
            {filterResult.companyVOs.length > 0 && filterResult.companyVOs.map((v, index) => {
              // let companyIpVOs = this.fileIpList(v.companyIpVOs);
              return (
                <div key={index}>
                  <div className="top">
                    <div className="firstLi">
                      <div
                        className="picUrl"
                        onClick={() => {
                          if (!login.userInfo) {
                            localStorage.setItem('historyUrl', `matchmaking/${this.props.exhibitionGuid}`);
                            this.setState({
                              alertShow: true,
                              alertMessage: '您未登陆，是否前往登陆？',
                            });
                            return false;
                          }
                          this.jumpCompany(v.userGuid);
                        }}
                      >
                        <img src={v.picUrl || default_img} alt=""/>
                      </div>
                      <div className="flow1">
                        <p className="title"
                           onClick={() => {
                             if (!login.userInfo) {
                               localStorage.setItem('historyUrl', `matchmaking/${this.props.exhibitionGuid}`);
                               this.setState({
                                 alertShow: true,
                                 alertMessage: '您未登陆，是否前往登陆？',
                               });
                               return false;
                             }
                             this.jumpCompany(v.userGuid);
                           }}
                        >{v.companyName}</p>
                        <p className='com-type'>{v.companyCategoryName}</p>
                      </div>
                    </div>
                    <div>
                      <span className='station'>展位: </span>
                      <p className="flow1">{v.booth}</p>
                    </div>
                    <div>
                      <span className='stationPer'>展会负责人: </span>
                      <p className="flow2">{this.filterPersonAll(v.companyPersonnelVOs)}</p>
                    </div>
                    <div>
                      <span className='stationIp'>参展IP:  </span>
                      <Tooltip title={this.fileIPListAll(v.companyIpVOs)}>
                        <p className={'flow1'}>{this.fileIPListArr(v.companyIpVOs)}</p>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="bottom">
                    <div onClick={() => {
                      if (!login.userInfo) {
                        localStorage.setItem('historyUrl', `matchmaking/${this.props.exhibitionGuid}`);
                        this.setState({
                          alertShow: true,
                          alertMessage: '您未登陆，是否前往登陆？',
                        });
                        return false;
                      }
                      this.jumpCompany(v.userGuid);
                    }}>
                      <img src={ic_home} alt=""/>
                      <p>查看详情</p>
                    </div>
                    <div onClick={async () => {
                      this.showMobx(v, 'company');
                    }}>
                      <img src={ic_ythm} alt=""/>
                      <p>邀TA会面</p>
                    </div>
                    {
                      v.focusId ? <div onClick={() => {
                          this.getFocusOn({ guid: v.userGuid, isFollow: 2, type: 1, index });
                        }}>
                          <img src={v.focusId ? ic_gzt_pr : ic_gzt} alt=""/>
                          <p className="focused">已关注</p>
                        </div> :
                        <div onClick={() => {
                          this.getFocusOn({ guid: v.userGuid, isFollow: 1, type: 1, index });
                        }}>
                          <img src={v.focusId ? ic_gzt_pr : ic_gzt} alt=""/>
                          <p>关注TA</p>
                        </div>
                    }
                  </div>
                </div>
              );
            })}
          </div>
        }

        {
          !_isEmpty(filterResult.personnelVOs) && <h2>展商负责人</h2>
        }
        {
          filterResult.personnelVOs &&
          <div className="tradeContent">
            {!_isEmpty(filterResult.personnelVOs) && filterResult.personnelVOs.map((v, index) => {
              return (
                <div key={index}>
                  <div className="top">
                    <div className="firstLi">
                      <div className="picUrl"
                           onClick={() => {
                             if (!login.userInfo) {
                               localStorage.setItem('historyUrl', `matchmaking/${this.props.exhibitionGuid}`);
                               this.setState({
                                 alertShow: true,
                                 alertMessage: '您未登陆，是否前往登陆？',
                               });
                               return false;
                             }
                             this.jumpPersonal(v.userGuid);
                           }}
                      >
                        <img src={v.picUrl || default_img} alt=""/>
                      </div>
                      <div className="flow1">
                        <p className="title"
                           onClick={() => {
                             if (!login.userInfo) {
                               localStorage.setItem('historyUrl', `matchmaking/${this.props.exhibitionGuid}`);
                               this.setState({
                                 alertShow: true,
                                 alertMessage: '您未登陆，是否前往登陆？',
                               });
                               return false;
                             }
                             this.jumpPersonal(v.userGuid);
                           }}
                        >{v.userRealName}</p>
                        <p>{v.occupation}</p>
                      </div>
                    </div>
                    <div>
                      <span className='stationIp'>所属企业: </span>
                      <p className="flow1">{v.companyName}</p>
                    </div>
                    <div>
                      <span className='station'>展位: </span>
                      <p className="flow1">{v.booth}</p>
                    </div>
                    <div>
                      <span className='stationIp'>参展IP:  </span>
                      <p className="flow1">{this.fileIPListArr(v.companyIpVOs)}</p>
                    </div>
                  </div>
                  <div className="bottom">
                    <div onClick={() => {
                      if (!login.userInfo) {
                        localStorage.setItem('historyUrl', `matchmaking/${this.props.exhibitionGuid}`);
                        this.setState({
                          alertShow: true,
                          alertMessage: '您未登陆，是否前往登陆？',
                        });
                        return false;
                      }
                      this.jumpPersonal(v.userGuid);
                    }}>
                      <img src={ic_home} alt=""/>
                      <p>查看详情</p>
                    </div>
                    <div onClick={async () => {
                      this.showMobx(v, 'personnel');
                    }}>
                      <img src={ic_ythm} alt=""/>
                      <p>邀TA会面</p>
                    </div>
                    {
                      v.focusId ? <div onClick={() => {
                          this.getFocusOn({ guid: v.userGuid, isFollow: 2, type: 2, index });
                        }}>
                          <img src={v.focusId ? ic_gzt_pr : ic_gzt} alt=""/>
                          <p className="focused">已关注</p>
                        </div> :
                        <div onClick={() => {
                          this.getFocusOn({ guid: v.userGuid, isFollow: 1, type: 2, index });
                        }}>
                          <img src={v.focusId ? ic_gzt_pr : ic_gzt} alt=""/>
                          <p>关注TA</p>
                        </div>
                    }
                  </div>
                </div>
              );
            })}
          </div>
        }
        {
          !_isEmpty(filterResult.ipVOs) && <h2>参展IP</h2>
        }
        {
          filterResult.ipVOs && <div className="tradeContent">
            {!_isEmpty(filterResult.ipVOs) && filterResult.ipVOs.map((v, index) => {
              return (
                <div key={index}>
                  <div className="top">
                    <div className="firstLi">
                      <div className="picUrl">
                        <img src={v.picUrl || default_img} alt=""/>
                      </div>
                      <div className="flow1">
                        <p className="title">{v.ipName}</p>
                        <p>{v.ipType}</p>
                      </div>
                    </div>
                    <div>
                      <span className='station'>展位: </span>
                      <p className="flow1">{v.booth}</p>
                    </div>
                    <div>
                      <span className='stationIp'>所属企业: </span>
                      <p className="flow1">{v.companyName}</p>
                    </div>
                    <div>
                      <span className='stationPer'>展会负责人:  </span>
                      <p className="flow2">{this.filterPersonAll(v.companyPersonnelVOs)}</p>
                    </div>
                  </div>
                  <div className="bottom">
                    <div onClick={() => {
                      this.goToIpList(v.ipType, v.ipid);
                    }}>
                      <img src={ic_home} alt=""/>
                      <p>查看详情</p>
                    </div>
                    <div onClick={() => {
                      this.showMobx(v, 'ipid');
                    }}>
                      <img src={ic_ythm} alt=""/>
                      <p>邀TA会面</p>
                    </div>
                    {
                      v.focusId ? <div onClick={() => {
                          this.getFocusOn({ guid: v.ipGuid, isFollow: 2, type: 3, index });
                        }}>
                          <img src={v.focusId ? ic_gzt_pr : ic_gzt} alt=""/>
                          <p className="focused">已关注</p>
                        </div> :
                        <div onClick={() => {
                          this.getFocusOn({ guid: v.ipGuid, isFollow: 1, type: 3, index });
                        }}>
                          <img src={v.focusId ? ic_gzt_pr : ic_gzt} alt=""/>
                          <p>关注TA</p>
                        </div>
                    }
                  </div>
                </div>
              );
            })}
          </div>
        }

        {
          (this.props.authorize.flag && this.props.authorize.isLoading) &&
          <div className="loading"><img src={icon_load} alt=""/></div>
        }
        {
          !this.props.authorize.flag &&
          <p className="ofTheBottom"><span>没有更多内容</span></p>
        }
        {
          selectType === 'company' && !this.props.authorize.isLoading && _isEmpty(filterResult.companyVOs) &&
          <NoResult/>
        }
        {
          selectType === 'ipid' && !this.props.authorize.isLoading && _isEmpty(filterResult.ipVOs) &&
          <NoResult/>
        }
        {
          selectType === 'personal' && !this.props.authorize.isLoading && _isEmpty(filterResult.personnelVOs) &&
          <NoResult/>
        }
      </div>
    );
  }
}
