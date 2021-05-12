import * as React from "react";
import "@assets/scss/contrast.scss";
import { inject, observer } from "mobx-react";
import { getContact, deletContact } from "@utils/util";
import { observable, toJS } from "mobx";
import _isEmpty from 'lodash/isEmpty';
import {
  Alert, Toast, EchartBar, EchartRadar, EchartLine, EchartwordCloud, ScrollTop,
  EchartBarRadiusNew, EchartLines, DiamondsExample,
} from './components/index';

import ic_rise from "@assets/images/ip_detail/ic_rise.svg";
import ic_decline from "@assets/images/ip_detail/ic_decline.svg";

import ic_value from "@assets/images/ip_detail/ic_value.svg";
import ic_yxpf from '@assets/images/ip_detail/ic_yxpf.svg';
import ic_area from "@assets/images/ip_detail/ic_area.svg";
import ic_follower from "@assets/images/ip_detail/ic_follower.svg";
import ic_wordcloud from "@assets/images/ip_detail/ic_wordcloud.svg";
import ic_media from "@assets/images/ip_detail/ic_media.svg";
import ic_default from '@assets/images/about/qr_code.png';
import ic_search from "@assets/images/ip_detail/ic_search.svg";
import ic_sjzl from "@assets/images/ip_detail/ic_sjzl.svg";
import default_img from "@assets/images/default/ic_default_shu.png";
import icon_detail from '@assets/images/ip_detail/how.png';
import ic_xssj from '@assets/images/ip_detail/ic_xsze.png';
import ic_sjptzl from '@assets/images/ip_detail/ic_sjptzl.png';
import { Select } from 'antd';

interface IOptions {
  show: any,
  message: string,
  alertMsg: string,
  ipTypeSuperiorNumber: string,
  navNub: number,
  _params: object,
  alertShow: boolean;
  contrastList: any;
  all: {
    assessment: {
      hot: object,
      media: object,
      portrayal: object,
      land: object,
      cloud: object,
      movie: object,
    },
    predict: {
      potential: object,
      business: object,
    }
  };
  fansType: number;

}

let isMove = false;
let isTv = false;
const selectOnline = [
  { name: "总量", type: 1 },
  { name: "分量", type: 2 },
];

const { Option } = Select;

@inject("contract", "login")
@observer
export default class User extends React.Component<IProps, IOptions> {
  constructor(props: any) {
    super(props);
    this.state = {
      show: false,
      alertShow: false,
      _params: null,
      contrastList: JSON.parse(window.localStorage.getItem('contastList')),
      message: '',
      alertMsg: '',
      ipTypeSuperiorNumber: '',
      navNub: 1,
      all: {
        assessment: {
          hot: {},
          media: {},
          portrayal: {},
          land: {},
          cloud: {},
          movie: {},
        },
        predict: {
          potential: {},
          business: {},
        }
      },
      fansType: 1,
    };
  }

  async componentDidMount() {
    document.title = "IP二厂-对比数据";
    const { contract, login } = this.props;
    contract.changeUserInfo(login.userInfo);
    let { contrastList } = this.state;
    const { userGuid } = login.userInfo || { userGuid: '' };
    if (!userGuid) {
      return false;
    }
    let ipids = contrastList.map(i => i.ipids).join(',');

    const { errorCode, errorMsg } = await contract.getConsumptionToken({
      type: 3,
      ipids
    });
    if (errorCode !== 200) {
      this.setState({ show: true, message: errorMsg });
      return false;
    }
    const _params = await getContact(); // 获取到 ipTypeSuperiorNumber ipids 参数
    if (contrastList.length < 2) {
      this.props.history.push('/ip-list');
    }
    let ipTypeSuperiorNumber = Number(_params.ipTypeSuperiorNumber);
    if (ipTypeSuperiorNumber === 5 || ipTypeSuperiorNumber === 7) {
      isTv = true;
    } else if (ipTypeSuperiorNumber === 6) {
      isMove = true;
    }
    // this.setOption();
    _params['userGuid'] = userGuid;
    this.setState({
      _params,
      ipTypeSuperiorNumber: _params.ipTypeSuperiorNumber
    });

    await contract.getListIp(_params);
    // 数据总览
    await contract.getContrastData({ userGuid, ipids, ipTypeSuperiorNumber, moduleNumber: 1, platformType: 0 });
    // 院线票房
    await contract.getContrastData({ userGuid, ipids, ipTypeSuperiorNumber, moduleNumber: 2, platformType: 0 });
    // 衍生品
    await contract.getContrastPlatformList({ userGuid, ipids, moduleNumber: 3 });
    await contract.getContrastData({ userGuid, ipids, ipTypeSuperiorNumber, moduleNumber: 3, });
    // 社交平台总览
    await contract.getContrastPlatformList({ userGuid, ipids, moduleNumber: 4 });
    await contract.getContrastData({ userGuid, ipids, ipTypeSuperiorNumber, moduleNumber: 4 });
    // 粉丝趋势
    await contract.getContrastPlatformList({ userGuid, ipids, moduleNumber: 5 });
    await contract.getContrastData({ userGuid, ipids, ipTypeSuperiorNumber, moduleNumber: 5 });
    // 搜索基础数据
    await contract.getContrastPlatformList({ userGuid, ipids, moduleNumber: 6 });
    await contract.getContrastData({ userGuid, ipids, ipTypeSuperiorNumber, moduleNumber: 6 });
    // 媒体关注基础数据
    await contract.getContrastPlatformList({ userGuid, ipids, moduleNumber: 7 });
    await contract.getContrastData({ userGuid, ipids, ipTypeSuperiorNumber, moduleNumber: 7 });

    // 受众画像（1 年龄,2 性别）
    await contract.getPortrait({ ..._params, typeId: 1 });
    await contract.getPortrait({ ..._params, typeId: 2 });
    // 省份
    await contract.getArea({ ..._params, typeId: 3, ipid: contrastList[0].ipids });

    await contract.getbusiness(_params);
    await contract.getWbWord(_params);  // 获取词云
  }

  async componentWillUnmount() {
    this.props.contract.clearUpdate();
  }

  setOption() {
    let _all = this.state.all;
    this.getOption(_all.assessment);
    this.getOption(_all.predict);
    this.setState({
      all: _all
    });
  }

  getOption(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        obj[key] = {
          day: 30,
          data: null,
          nav: 1,
        };
        if (key === 'interate') obj[key]['nav'] = 41;
        if (key === 'land') obj[key]['nav'] = 3;
        if (key === 'land') {
          obj[key]['nav'] = 3;
          obj[key]['day'] = this.state.contrastList[0].ipids;
        }
      }
    }
  }

  // 点击选中30 天 一个月 重新获取接口
  lineIsNull = (data) => {
    let haveData = true;
    if (data === null || data.series.length === 0) {
      haveData = false;
      data = {
        xAxis: [],
        name: [],
        series: [[]],
      };
    }
    if (data.series && data.series.length > 0) {
      data.series.forEach((el) => {
        el.length !== 0 ? haveData = true : '';
      });
    } else {
      haveData = false;
    }
    return haveData;
  };

  async getsourceDay(obj) {
    // 匹配到对应参数 并设置对应天数
    const { contract } = this.props;
    let { _params } = this.state;
    let _all = this.state.all;
    switch (obj.source) {
      case 'cloud':
        _all.assessment.cloud['day'] = obj.day;
        obj.data ? _all.assessment.cloud['data'] = obj.data : '';
        break;
      case 'land':
        _all.assessment.land['day'] = obj.day;
        obj.data ? _all.assessment.land['data'] = obj.data : '';
        break;
      case 'hot':
        _all.assessment.hot['day'] = obj.day;
        obj.data ? _all.assessment.hot['data'] = obj.data : '';
        break;
      default:
    }
    this.setState({
      all: _all
    });
  }

  // 切换顶部模块
  tagNavNumber(number) {
    this.setState({
      navNub: number
    });
  }

  // 切换模块内数据
  async tagNavItem(obj) {
    const { contract } = this.props;
    let { _params } = this.state;
    let _all = this.state.all;
    switch (obj.el) {
      case 'land':
        _all.assessment.land['nav'] = obj.nav;
        obj.data ? _all.assessment.land['data'] = obj.data : '';
        await contract.getArea({ ..._params, typeId: obj.nav, ipids: _params['ipids'] });
        break;
      default:
    }
    this.setState({
      all: _all
    });
  }

  _totalData(item: number) {
    if (item === 5 || item === 7) {
      return (
        <tr>
          <th>IP名称</th>
          <th>上线天数</th>
          <th>累计播放量</th>
          <th>累计热度值</th>
        </tr>
      );
    } else if (item === 6) {
      return (
        <tr>
          <th>IP名称</th>
          <th>上映天数</th>
          <th>票房累计</th>
          <th>首映日票房</th>
          <th>首周票房</th>
        </tr>
      );
    } else {
      return (
        <tr>
          <th>IP名称</th>
          <th>全网热度值</th>
          <th>媒体指数</th>
          <th>全网搜索量</th>
        </tr>
      );
    }
  }

  _totalDataTag(ipTypeNumber) {
    if (ipTypeNumber === 6) {
      return '票房';
    } else if (ipTypeNumber === 5 || ipTypeNumber === 7) {
      return '播放';
    } else {
      return '';
    }
  }

  render() {
    const { contract, login, history } = this.props;
    const {
      consumptionToken,
      derivativesSalesTabs, socialPlatformTabs, fansTrendTabs, searchBasicTabs, mediaFocusTabs,
      derivativesSalesCurrent, socialPlatformCurrent, fansTrendCurrent, searchBasicCurrent, mediaFocusCurrent,
      fansTrendCurrentName, searchBasicCurrentName, mediaFocusCurrentName,
      dataViewData, boxOfficeData, derivativesSalesData, socialPlatformData, fansTrendData, searchBasicData, mediaFocusData,
    } = contract;
    let {
      listIp, Portrait, business,
      ipProvinceData, ipAreaData, wbWordData
    } = contract.updateList;
    let { alertMsg, alertShow, } = this.state;
    let assessment = this.state.all.assessment;
    listIp = toJS(listIp);
    let ipTypeNumber = Number(JSON.parse(localStorage.getItem('ipTypeSuperiorNumber')));
    // 钻石会员 IP对比
    // const contrastArr = [',3,', ',6,'];
    // const visibleContrastArr = !_isEmpty(login.userInfo) && contrastArr.some((e: string) => login.userInfo.userJurisdiction.indexOf(e) !== (-1));
    const { userGuid } = login.userInfo || { userGuid: '' };
    let { contrastList } = this.state;
    let ipids = contrastList && contrastList.map(i => i.ipids).join(',');
    return (
      <div className="userhtml">
        {
          consumptionToken ?
            <div className="contrast">
              <div className="contrast_product">
                {listIp && listIp.map((element) => {
                  return (
                    <div key={element.ipid}>
                      <div className="img">
                        <img src={element.picUrl || default_img} alt=""/>
                      </div>
                      <div className="product_tool">
                        <span className="text" title={element.ipName}>{element.ipName}</span>
                        {/* <span className="icon iconfont icon_delete"
                              onClick={() => {
                                deletContact(element.ipid);
                                if (listIp.length <= 2) {
                                  this.setState({
                                    show: true,
                                    message: '至少有两个IP 参与对比将要跳转至IP列表'
                                  });
                                  this.props.history.push('/ip-list');
                                } else {
                                  window.location.reload();
                                }
                              }}
                        /> */}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="class_fication">
                <div className={this.state.navNub === 1 ? "item active" : "item"}
                     onClick={() => {
                       this.tagNavNumber(1);
                     }}>
                  <span className="icon iconfont icon_model1"/>
                  <span className="text">基础数据</span>
                </div>
                <div className={this.state.navNub === 2 ? "item active" : "item"}
                     onClick={() => {
                       this.tagNavNumber(2);
                       this.tagNavItem({ nav: 3, el: 'land' });
                     }}>
                  <span className="icon iconfont icon_model2"/>
                  <span className="text">IP评估</span>
                </div>
                <div className={this.state.navNub === 3 ? "item active" : "item"}
                     onClick={() => {
                       this.tagNavNumber(3);
                     }}>
                  <span className="icon iconfont icon_model3"/>
                  <span className="text">IP预测</span>
                </div>
              </div>
              {/* 第三块 */}
              <div className={this.state.navNub === 3 ? "Survey_data show" : "Survey_data"}>
                <div className="default">
                  <img src={ic_default} alt="" style={{ "width": "200px" }}/>
                  <div className="tips">该模块属于内测模块 请联系客服</div>
                </div>
              </div>
              {/* 第二块 */}
              <div className={this.state.navNub === 2 ? "Survey_data show" : "Survey_data"}>
                <div className="head-title">
                  <span className="icon"><img src={ic_follower} alt=""/> </span>
                  受众画像
                  <img src={icon_detail} alt="" className="icon_detail"/>
                  <span className="hover-box">含义：该数据表示此IP的用户在指定周期内年龄分布及性别对比；TGI为目标群体指数
                  算法说明：基于全网搜索数据，对此IP用户聚类分析，展示用户性别年龄分布，TGI是指定年龄（性别）中此IP用户所占比例/总体年龄（全部性别）中此IP用户所占比例</span>
                </div>
                <EchartBarRadiusNew container={"echart-barRadius"} data={Portrait}/>
                <div className="head-title">
                  <span className="icon"><img src={ic_area} alt=""/> </span>
                  地区分布
                  <img src={icon_detail} alt="" className="icon_detail"/>
                  <span className="hover-box"> 
                  含义：该数据表示此IP的用户在指定周期内所处地域
                   算法说明：基于全网搜索数据，对此IP用户聚类分析，将用户地域省份分布排名</span>
                </div>
                <div className="search_line">
                  <div className="ul">
                    <ul>
                      <li className={Number(assessment.land['nav']) === 3 ? 'active' : ''}
                          onClick={async () => {
                            this.tagNavItem({ nav: 3, el: 'land' });
                          }}>按省份分布
                      </li>
                      <li className={Number(assessment.land['nav']) === 4 ? 'active' : ''}
                          onClick={async () => {
                            this.tagNavItem({ nav: 4, el: 'land' });
                          }}>按区域
                      </li>
                    </ul>
                  </div>
                  {/* search_land */}
                  <div className="search heightUnset">
                    {
                      Number(assessment.land['nav']) === 3 && !_isEmpty(ipProvinceData) &&
                      <EchartLines container={"echart_bar_Category"} special={"area"} data={ipProvinceData}
                                   title={" 省份分布"}/>
                    }
                    {
                      Number(assessment.land['nav']) === 4 && !_isEmpty(ipAreaData) &&
                      <EchartLines container={"echart_bar_Category"} special={"area"} data={ipAreaData}
                                   title={" 区域分布"}/>
                    }
                  </div>
                </div>
                {
                  !isMove && <div>
                    <div className="head-title">
                      <span className="icon"><img src={ic_value} alt=""/> </span>
                      商业价值分析模型
                      <img src={icon_detail} alt="" className="icon_detail"/>
                      <span className="hover-box"> 
                 含义：大众热议指数：此IP热度指数，对全网社交平台，用户的讨论数、讨论热度，经过大数据计算，百分制表示
                 代言指数：以IP代言数量为基础数据，百分制表示
                 专业指数：IP知名度为基础数据，百分制表示
                 口碑指数：根据用户对IP的各项关键指标评价，加权计算，百分制表示
                 媒体关注度：在线媒体的关注，通过过去30天全网新闻中与此IP相关的新闻的数量来计算获得，百分制表示
                  潜力预估指数：此IP内在潜力预估，由代言指数与热度值相减</span>
                    </div>
                    <EchartRadar container="echart-radar" data={business}/>
                  </div>
                }

                <div className="head-title">
                  <span className="icon"><img src={ic_wordcloud} alt=""/> </span>
                  关键词云
                  <img src={icon_detail} alt="" className="icon_detail"/>
                  <span className="hover-box"> 
                      含义：对事件、人物、品牌、地域中提取呈现提及次数最多的关键词，被提及次数越多，字号越大。</span>
                </div>
                <EchartwordCloud container="echart_wordcloud_three" data={wbWordData}/>
              </div>
              {/* 第一块 */}
              <div className={this.state.navNub === 1 ? "Survey_data show" : "Survey_data"}>
                {
                  !_isEmpty(dataViewData) &&
                  <div>
                    <p>
                      <span className="icon">
                      <img src={ic_sjzl} alt=""/>
                      </span> {this._totalDataTag(ipTypeNumber)}数据总览
                    </p>
                    <table className="data-view">
                      {this._totalData(ipTypeNumber)}
                      <tbody>
                      {
                        dataViewData && dataViewData.map((item, index) => {
                          if (ipTypeNumber === 6) {
                            return (
                              <tr key={index}>
                                <td>{item.ip_name}</td>
                                <td>{item.values.releaseDays}</td>
                                <td>{item.values.totalBoxOffice}</td>
                                <td>{item.values.firstDayBoxOffice}</td>
                                <td>{item.values.firstWeekBoxOffice}</td>
                              </tr>
                            );
                          } else if (ipTypeNumber === 5 || ipTypeNumber === 7) {
                            return (
                              <tr key={index}>
                                <td>{item.ip_name}</td>
                                <td>{item.values.daysOnline}</td>
                                <td>{item.values.accumulatedPlayVolume}</td>
                                <td>{item.values.cumulativeHeatValue}</td>
                              </tr>
                            );
                          } else {
                            return (
                              <tr key={index}>
                                <td>{item.ip_name}</td>
                                <td>{item.values.arithmatic_hotspot_price}</td>
                                <td>{item.values.media_analysis}</td>
                                <td>{item.values.total_web_searches}</td>
                              </tr>
                            );
                          }

                        })
                      }
                      </tbody>
                    </table>
                  </div>
                }
                {
                  isMove && !_isEmpty(boxOfficeData.series) &&
                  <div>
                    <p>
                      <span className="icon">
                       <img src={ic_yxpf} alt=""/>
                       </span>院线票房趋势
                    </p>
                    <div className="search heightUnset">
                      <EchartLines container="echart_bar_Category" data={boxOfficeData} title={"院线票房数（万）"}/>
                    </div>
                  </div>
                }
                {
                  !_isEmpty(derivativesSalesTabs) &&
                  <div className="new-chart-content">
                    <p>
                    <span className="icon">
                     <img src={ic_xssj} alt=""/>
                    </span>衍生品销售数据
                    </p>
                    <div className="search_line">
                      <div className="ul">
                        <ul>
                          {
                            derivativesSalesTabs && derivativesSalesTabs.map((item, index) => {
                              return <li className={derivativesSalesCurrent === item.platformNumber ? 'active' : ''}
                                         key={index}
                                         onClick={async () => {
                                           contract.derivativesSalesCurrent = item.platformNumber;
                                           await contract.getContrastData({
                                             moduleNumber: 3,
                                             platformNumber: item.platformNumber
                                           });
                                         }}
                              >{item.name}</li>;
                            })
                          }
                        </ul>
                      </div>
                      <div className="child-table">
                        {
                          !_isEmpty(derivativesSalesData) ?
                            <table>
                              <tr>
                                <td>IP名称</td>
                                <td>IP月销售总额</td>
                                <td>月成交总单数</td>
                                <td>商品均价</td>
                                <td>电商渠道</td>
                              </tr>
                              {
                                derivativesSalesData.map((item, index) => {
                                  return (
                                    <tr key={index}>
                                      <td>{item.ip_name}</td>
                                      <td>{item.values.salesTotalAmount}</td>
                                      <td>{item.values.monthlyTransactionTotal}</td>
                                      <td>{item.values.goodsAveragePrice}</td>
                                      <td>{item.values.sellerNumber}</td>
                                    </tr>
                                  );
                                })
                              }
                              {
                                _isEmpty(derivativesSalesData) &&
                                <tr>
                                  <td colSpan={5}> 暂无数据</td>
                                </tr>
                              }

                            </table>
                            :
                            <div className="bar_category">暂无数据</div>
                        }
                      </div>
                    </div>
                  </div>
                }
                {
                  !_isEmpty(socialPlatformTabs) &&
                  <div className="new-chart-content">
                    <p>
                    <span className="icon">
                     <img src={ic_sjptzl} alt=""/>
                    </span>社交平台数据总览
                    </p>
                    <div className="search_line">
                      <div className="ul">
                        <ul>
                          {
                            socialPlatformTabs && socialPlatformTabs.map((item, index) => {
                              return <li className={socialPlatformCurrent === item.platformNumber ? 'active' : ''}
                                         key={index}
                                         onClick={async () => {
                                           contract.socialPlatformCurrent = item.platformNumber;
                                           await contract.getContrastData({
                                             userGuid,
                                             ipTypeSuperiorNumber: ipTypeNumber,
                                             ipids,
                                             moduleNumber: 4,
                                             platformNumber: item.platformNumber
                                           });
                                         }}
                              >{item.name}</li>;
                            })
                          }
                        </ul>
                      </div>
                      <div className="child-table">
                        {
                          !_isEmpty(socialPlatformData) ?
                            <table>
                              <tr>
                                <td>IP名称</td>
                                {
                                  socialPlatformData[0].values.data && socialPlatformData[0].values.data.map((item, index) => {
                                    return <td key={index}>{item.name}</td>;
                                  })
                                }
                              </tr>
                              {
                                !_isEmpty(socialPlatformData) && socialPlatformData.map((item, index) => {
                                  return (
                                    <tr key={index}>
                                      <td>{item.values && item.values.data && item.ip_name}</td>
                                      {
                                        item.values.data && item.values.data.map((i, k) => {
                                          return <td>{i.value}</td>;
                                        })
                                      }
                                    </tr>
                                  );
                                })
                              }
                            </table>
                            :
                            <div className="bar_category">暂无数据</div>
                        }
                      </div>
                    </div>
                  </div>
                }
                {
                  !_isEmpty(fansTrendTabs) &&
                  <div>
                    <p>
                      <span className="icon">
                      <img src={ic_follower} alt=""/>
                      </span>粉丝趋势
                    </p>
                    <div className="search_line">
                      <div className="ul">
                        <ul>
                          {
                            fansTrendTabs && fansTrendTabs.map((item, index) => {
                              return <li className={fansTrendCurrent === item.platformNumber ? 'active' : ''}
                                         key={index}
                                         onClick={async () => {
                                           contract.fansTrendCurrent = item.platformNumber;
                                           contract.fansTrendCurrentName = item.name;
                                           await contract.getContrastData({
                                             moduleNumber: 5,
                                             platformNumber: item.platformNumber
                                           });
                                         }}
                              >{item.name}粉丝数</li>;
                            })
                          }
                          <li className="li-select">
                            <Select defaultValue="总量" style={{ width: 100 }} onChange={
                              async (value) => {
                                this.setState({
                                  fansType: value
                                });
                                await contract.getContrastData({
                                  moduleNumber: 5,
                                  platformNumber: fansTrendCurrent,
                                  type: value
                                });
                              }}
                            >
                              {
                                selectOnline && selectOnline.map((item, index) => {
                                  return <Option value={item.type} key={index}>{item.name}</Option>;
                                })
                              }
                            </Select>
                          </li>
                        </ul>
                      </div>

                      <div className="search heightUnset">
                        <EchartLines container="echart_line_darren" data={fansTrendData}
                                     title={`${fansTrendCurrentName}粉丝数`}/>
                      </div>
                    </div>
                  </div>
                }

                {
                  !_isEmpty(searchBasicTabs) &&
                  <div>
                    <p>
                     <span className="icon">
                     <img src={ic_search} alt=""/>
                     </span>搜索基础数据指数
                    </p>
                    <div className="search_line">
                      <div className="ul">
                        <ul>
                          {
                            searchBasicTabs && searchBasicTabs.map((item, index) => {
                              return <li className={item.platformNumber === searchBasicCurrent ? 'active' : ''}
                                         key={index}
                                         onClick={async () => {
                                           contract.searchBasicCurrent = item.platformNumber;
                                           contract.searchBasicCurrentName = item.name;
                                           await contract.getContrastData({
                                             moduleNumber: 6,
                                             platformNumber: item.platformNumber
                                           });
                                         }}
                              >{item.name}</li>;
                            })
                          }
                        </ul>
                      </div>
                      <div className="search heightUnset ">
                        <EchartBar container="echart_bar_darren" data={searchBasicData} title={searchBasicCurrentName}/>
                      </div>
                    </div>
                  </div>
                }
                {!_isEmpty(mediaFocusTabs) &&
                <div>
                  <p>
                     <span className="icon">
                     <img src={ic_media} alt=""/>
                     </span>媒体关注基础数据
                  </p>
                  <div className="search_line">
                    <div className="ul">
                      <ul>
                        {
                          mediaFocusTabs && mediaFocusTabs.map((item, index) => {
                            return <li className={mediaFocusCurrent === item.platformNumber ? 'active' : ''}
                                       key={index}
                                       onClick={async () => {
                                         contract.mediaFocusCurrent = item.platformNumber;
                                         contract.mediaFocusCurrentName = item.name;
                                         await contract.getContrastData({
                                           moduleNumber: 7,
                                           platformNumber: item.platformNumber
                                         });
                                       }}
                            >{item.name}</li>;
                          })
                        }
                      </ul>
                    </div>
                    <div className="search heightUnset">
                      <EchartLines container="echart_line_darren" data={mediaFocusData} title={mediaFocusCurrentName}/>
                    </div>
                  </div>
                </div>
                }

              </div>
            </div>
            :
            <div>
              <DiamondsExample userGuid={userGuid} history={history} type={'compare'}/>
            </div>
        }
        <ScrollTop contrast={false}/>
        {
          this.state.show &&
          <Toast
            onClose={() => {
              this.setState({ show: false });
            }}
            duration={2}
            message={this.state.message}
          />}
        {
          alertShow &&
          <Alert
            message={alertMsg}
            onClose={() => {
              this.setState({ show: false });
            }}
            onSubmit={() => {
              this.setState({ show: false });
            }}/>
        }
      </div>
    );
  }
}
