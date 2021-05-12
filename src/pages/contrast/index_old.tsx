import * as React from "react";
import "@assets/scss/contrast.scss";
import { inject, observer } from "mobx-react";
import { getContact, deletContact } from "@utils/util";
import { toJS } from "mobx";
import Alert from '@components/alert';
import Toast from "@components/toast";
import EchartBar from "@components/echart_bar_darren";
import EchartLine from "@components/echart_line_darren";
import EchartRadar from "@components/echart_radar";
import EchartwordCloud from "@components/echart_wordcloud_three";
import ScrollTop from "@components/scroll-top";
import ic_rise from "@assets/images/ip_detail/ic_rise.svg";
import ic_decline from "@assets/images/ip_detail/ic_decline.svg";
import ic_follower from "@assets/images/ip_detail/ic_follower.svg";
import ic_media from "@assets/images/ip_detail/ic_media.svg";
import ic_default from '@assets/images/about/qr_code.png';
import ic_search from "@assets/images/ip_detail/ic_search.svg";
import ic_sjzl from "@assets/images/ip_detail/ic_sjzl.svg";
import douban from "@assets/images/ip_detail/douban.png";
import iqiyi from "@assets/images/ip_detail/iqiyi_logo.png";
import LeTV_logo from "@assets/images/ip_detail/LeTV_logo.png";
import mangguo from "@assets/images/ip_detail/mangguo.png";
import tengxun from "@assets/images/ip_detail/tengxun.png";
import youku from "@assets/images/ip_detail/youku.png";
import default_img from "@assets/images/default/ic_default_shu.png";
import EchartBarRadiusNew from '@components/echart_barRadius_new';
import icon_detail from '@assets/images/ip_detail/how.png';
import _isEmpty from 'lodash/isEmpty';

import EchartLines from "./components/echart_lines";
import DiamondsExample from "@components/diamonds-example";

interface IOptions {
  show: any,
  message: string,
  alertMsg: string,
  ipTypeSuperiorNumber: string,
  navNub: number,
  _params: object,
  ismove: boolean,
  isTv: boolean,
  alertShow: boolean;
  contastList: any;
  all: {
    BasicData: {
      all: object,
      search: object,
      interate: object,
      media: object,
      fans: object,
      isTv: object,
      movie: object,
      isMovieTv: object,
    },
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
  }

}

@inject("contract", "login")
@observer
export default class User extends React.Component<IProps, IOptions> {
  constructor(props: any) {
    super(props);
    this.state = {
      ismove: false,
      show: false,
      alertShow: false,
      isTv: false,
      _params: null,
      contastList: JSON.parse(window.localStorage.getItem('contastList')),
      message: '',
      alertMsg: '',
      ipTypeSuperiorNumber: '',
      navNub: 1,
      all: {
        BasicData: {
          all: {},
          search: {},
          interate: {
            nav: 41
          },
          media: {},
          fans: {},
          isTv: {},
          movie: {},
          isMovieTv: {},
        },
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
      }
    };
  }

  async componentDidMount() {
    document.title = "IP二厂-对比数据";
    const { contract, login } = this.props;
    contract.changeUserInfo(login.userInfo);
    let { ismove, contastList, isTv } = this.state;

    const { userGuid } = login.userInfo || { userGuid: '' };
    if (!userGuid) {
      return false;
    }

    const {
      errorCode, errorMsg
    } = await contract.getConsumptionToken({
      type: 3,
      ipids: contastList.map(i => i.ipids).join(',')
      // ipids: `${contastList[0].ipids},${contastList[1].ipids}`
    });
    // if (+statue === 1 || +statue === 2) {

    // } else {
    //   return false;
    // }
    if (errorCode !== 200) {
      this.setState({ show: true, message: errorMsg });
      return false;
    }
    // const contrastArr = [',3,', ',6,'];
    // const visibleContrastArr = !_isEmpty(login.userInfo) && contrastArr.some((e: string) => login.userInfo.userJurisdiction.indexOf(e) !== (-1));
    // if (!visibleContrastArr){
    //   return false;
    // }
    const _params = await getContact(); // 获取到 ipTypeSuperiorNumber isids 参数
    let params = JSON.parse(localStorage.getItem('contastList'));
    if (params.length < 2) {
      this.props.history.push('/ip-list');
    }

    this.setoption();
    _params['userGuid'] = userGuid;
    if (Number(_params.ipTypeSuperiorNumber) === 5 || Number(_params.ipTypeSuperiorNumber) === 7) {
      isTv = true;
      // 平台数据对比
      await contract.getBoxOffice({ ..._params, typeId: 49, dayNumber: 30 });
      await contract.getPraise(_params);
      await contract.getAcquire({ ..._params, typeId: 42, dayNumber: 30 });
    } else if (Number(_params.ipTypeSuperiorNumber) === 6) {
      ismove = true;
      // 院线票房对比
      await contract.getBoxOffice({ ..._params, typeId: 57, dayNumber: 30 });
      // 平台数据对比
      await contract.getBoxOffice({ ..._params, typeId: 49, dayNumber: 30 });
      await contract.getPraise(_params);
      await contract.getAcquire({ ..._params, typeId: 42, dayNumber: 30 });
    } else {
      await contract.getAcquire({ ..._params, typeId: 14, dayNumber: 30 });
    }
    this.setState({
      _params,
      ismove,
      isTv,
      ipTypeSuperiorNumber: _params.ipTypeSuperiorNumber
    });

    await contract.creactData(_params);
    await contract.getAcquire({ ..._params, typeId: 5, dayNumber: 30 });
    await contract.getAcquire({ ..._params, typeId: 41, dayNumber: 30 });
    await contract.getAcquire({ ..._params, typeId: 13, dayNumber: 30 });
    // 受众画像（1 年龄,2 性别）
    await contract.getPortrait({ ..._params, typeId: 1 });
    await contract.getPortrait({ ..._params, typeId: 2 });
    // 省份
    await contract.getArea({ ..._params, typeId: 3, ipid: contastList[0].ipids });
  }

  async componentWillUnmount() {
    this.props.contract.clearUpdate();
  }

  setoption() {
    let _all = this.state.all;
    this.getoption(_all.BasicData);
    this.getoption(_all.assessment);
    this.getoption(_all.predict);
    this.setState({
      all: _all
    });
  }

  getoption(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        obj[key] = {
          day: 10,
          data: null,
          nav: 1,
        };
        if (key === 'search') obj[key]['nav'] = 5;
        if (key === 'interate') obj[key]['nav'] = 41;
        if (key === 'media') obj[key]['nav'] = 13;
        if (key === 'fans') {
          if (this.state.ismove || this.state.isTv) {
            obj[key]['nav'] = 42;
          } else {
            obj[key]['nav'] = 14;
          }
        }
        if (key === 'land') obj[key]['nav'] = 3;
        if (key === 'land') {
          obj[key]['nav'] = 3;
          obj[key]['day'] = this.state.contastList[0].ipids;
        }
        if (key === 'movie') {
          obj[key]['day'] = 10;
        }

        if (key === 'isMovieTv') {
          obj[key]['nav'] = 49;
          obj[key]['day'] = 10;

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
      case 'search':
        _all.BasicData.search['day'] = obj.day;
        obj.data ? _all.BasicData.search['data'] = obj.data : '';
        await contract.getAcquire({ ..._params, typeId: _all.BasicData.search['nav'], dayNumber: obj.day });
        break;
      case 'interate':
        _all.BasicData.interate['day'] = obj.day;
        obj.data ? _all.BasicData.interate['data'] = obj.data : '';
        await contract.getAcquire({ ..._params, typeId: _all.BasicData.interate['nav'], dayNumber: obj.day });
        break;
      case 'media':
        _all.BasicData.media['day'] = obj.day;
        obj.data ? _all.BasicData.media['data'] = obj.data : '';
        await contract.getAcquire({ ..._params, typeId: _all.BasicData.media['nav'], dayNumber: obj.day });
        break;
      case 'fans':
        _all.BasicData.fans['day'] = obj.day;
        obj.data ? _all.BasicData.fans['data'] = obj.data : '';
        await contract.getAcquire({ ..._params, typeId: _all.BasicData.fans['nav'], dayNumber: obj.day });
        break;
      case 'cloud':
        _all.assessment.cloud['day'] = obj.day;
        obj.data ? _all.assessment.cloud['data'] = obj.data : '';
        break;
      case 'land':
        _all.assessment.land['day'] = obj.day;
        obj.data ? _all.assessment.land['data'] = obj.data : '';
        break;
      case 'media2':
        _all.assessment.media['day'] = obj.day;
        obj.data ? _all.assessment.media['data'] = obj.data : '';
        break;
      case 'hot':
        _all.assessment.hot['day'] = obj.day;
        obj.data ? _all.assessment.hot['data'] = obj.data : '';
        break;
      case 'movie':
        _all.BasicData.movie['day'] = obj.day;
        obj.data ? _all.BasicData.movie['data'] = obj.data : '';
        await contract.getBoxOffice({ ..._params, typeId: 57, dayNumber: obj.day });
        break;
      case 'isMovieTv':
        _all.BasicData.isMovieTv['day'] = obj.day;
        await contract.getBoxOffice({ ..._params, typeId: _all.BasicData.isMovieTv['nav'], dayNumber: obj.day });
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
      case 'interate':
        _all.BasicData.interate['nav'] = obj.nav;
        obj.data ? _all.BasicData.interate['data'] = obj.data : '';
        await contract.getAcquire({ ..._params, typeId: obj.nav, dayNumber: _all.BasicData.interate['day'] });
        break;
      case 'media':
        _all.BasicData.media['nav'] = obj.nav;
        obj.data ? _all.BasicData.media['data'] = obj.data : '';
        await contract.getAcquire({ ..._params, typeId: obj.nav, dayNumber: _all.BasicData.media['day'] });
        break;
      case 'fans':
        _all.BasicData.fans['nav'] = obj.nav;
        obj.data ? _all.BasicData.fans['data'] = obj.data : '';
        await contract.getAcquire({ ..._params, typeId: obj.nav, dayNumber: _all.BasicData.fans['day'] });
        break;
      case 'land':
        _all.assessment.land['nav'] = obj.nav;
        obj.data ? _all.assessment.land['data'] = obj.data : '';
        await contract.getArea({ ..._params, typeId: obj.nav, ipids: _params['ipids'] });
        break;
      case 'isMovieTv':
        _all.BasicData.isMovieTv['nav'] = obj.nav;
        await contract.getBoxOffice({ ..._params, typeId: obj.nav, dayNumber: _all.BasicData.isMovieTv['day'] });
        break;
      case 'search':
        _all.BasicData.search['nav'] = obj.nav;
        await contract.getAcquire({ ..._params, typeId: obj.nav, dayNumber: _all.BasicData.search['day'] });
        break;
      default:
    }
    this.setState({
      all: _all
    });
  }

  fileter_logo = ipids => {
    switch (ipids) {
      case 44:
        return douban;
      case 47:
        return tengxun;
      case 50:
        return iqiyi;
      case 52:
        return LeTV_logo;
      case 62:
        return youku;
      case 48:
        return mangguo;
      default:
        return '';
    }

  };

  _totalData(item: any) {
    if (item === 5 || item === 7) {
      return (
        <tr>
          <th>IP名称</th>
          <th>上线天数</th>
          <th>累计播放量</th>
          <th>昨日播放量</th>
          <th>今日播放量</th>
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
    } else if (item === 8) {
      return (
        <tr>
          <th>IP名称</th>
          <th>全网热度值</th>
          <th>媒体指数</th>
          <th>合作品牌数</th>
          <th>微博粉丝数</th>
        </tr>
      );
    } else {
      return (
        <tr>
          <th>IP名称</th>
          <th>全网热度值</th>
          <th>媒体指数</th>
          <th>全网搜索量</th>
          <th>官网粉丝数</th>
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
    const { consumptionToken } = contract;
    let {
      listIp, dataScreening, Acquire, interate, media, fans, Portrait, business,
      ipProvinceData, ipAreaData, isMoveData, isTvData, dataPraise, wbWordData
    } = contract.updateList;
    let { ismove, alertMsg, alertShow, contastList, _params, isTv } = this.state;
    let BasicData = this.state.all.BasicData;
    let assessment = this.state.all.assessment;
    listIp = toJS(listIp);
    dataScreening = toJS(dataScreening);
    let ipTypeNumber = localStorage.getItem('ipTypeSuperiorNumber');

    // 钻石会员 IP对比
    // const contrastArr = [',3,', ',6,'];
    // const visibleContrastArr = !_isEmpty(login.userInfo) && contrastArr.some((e: string) => login.userInfo.userJurisdiction.indexOf(e) !== (-1));
    const { userGuid } = login.userInfo || { userGuid: '' };
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
              {/*todo*/}
              <div className={this.state.navNub === 2 ? "Survey_data show" : "Survey_data"}>
                <div className="head-title">
                  <span className="icon"><img src={ic_search} alt=""/> </span>
                  受众画像
                  <img src={icon_detail} alt="" className="icon_detail"/>
                  <span className="hover-box">含义：该数据表示此IP的用户在指定周期内年龄分布及性别对比；TGI为目标群体指数
                  算法说明：基于全网搜索数据，对此IP用户聚类分析，展示用户性别年龄分布，TGI是指定年龄（性别）中此IP用户所占比例/总体年龄（全部性别）中此IP用户所占比例</span>
                </div>
                {
                  !_isEmpty(Portrait.gender) && !_isEmpty(Portrait.age) &&
                  <EchartBarRadiusNew container={"echart-barRadius"} data={Portrait}/>
                }
                {/*<EchartBarRadius container="echart-barRadius" data={Portrait}/>*/}
                <div className="head-title">
                  <span className="icon"><img src={ic_search} alt=""/> </span>
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
                  !ismove && <div>
                    <div className="head-title">
                      <span className="icon"><img src={ic_search} alt=""/> </span>
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
                < div className="head-title">
                  <span className="icon"><img src={ic_search} alt=""/> </span>
                  关键词云
                  <img src={icon_detail} alt="" className="icon_detail"/>
                  <span className="hover-box"> 
                含义：对事件、人物、品牌、地域中提取呈现提及次数最多的关键词，被提及次数越多，字号越大。</span>
                </div>
                <EchartwordCloud container="echart_wordcloud_three" data={wbWordData}/>
              </div>
              {/* 第一块 */}
              <div className={this.state.navNub === 1 ? "Survey_data show" : "Survey_data"}>
                <p>
                  <span className="icon">
                    <img src={ic_sjzl} alt=""/>
                  </span> {this._totalDataTag(ipTypeNumber)}数据总览
                </p>
                <table>
                  {this._totalData(ipTypeNumber)}
                  <tbody>
                  {dataScreening && dataScreening.map((element) => {
                    let dataScreening1: any = "",
                      dataScreening2: any = "",
                      dataScreening3: any = "",
                      dataScreening4: any = "";
                    if (element === null) {
                      return;
                    } else {
                      dataScreening1 = Number(element.dataScreening1Status) === 1 ? ic_rise : Number(element.dataScreening1Status) === 2 ? '--' : ic_decline;
                      dataScreening2 = Number(element.dataScreening2Status) === 1 ? ic_rise : Number(element.dataScreening1Status) === 2 ? '--' : ic_decline;
                      dataScreening3 = Number(element.dataScreening3Status) === 1 ? ic_rise : Number(element.dataScreening1Status) === 2 ? '--' : ic_decline;
                      dataScreening4 = Number(element.dataScreening4Status) === 1 ? ic_rise : Number(element.dataScreening1Status) === 2 ? '--' : ic_decline;
                    }
                    return (
                      <tr key={element.ipid}>
                        <td>{element.ipName}</td>
                        <td>{Number(element.dataScreening1Value) === 0 ? "" : element.dataScreening1ValueStr}
                          {(dataScreening1 !== '--' && Number(element.dataScreening1Value) !== 0) ?
                            <img src={dataScreening1} alt=""/> : ' --'}
                        </td>
                        <td>{Number(element.dataScreening2Value) === 0 ? "" : element.dataScreening2ValueStr}
                          {(dataScreening2 !== '--' && Number(element.dataScreening2Value) !== 0) ?
                            <img src={dataScreening2} alt=""/> : ' --'}
                        </td>
                        <td>
                          {Number(element.dataScreening3Value) === 0 ? "" : element.dataScreening3ValueStr}
                          {(dataScreening3 !== '--' && Number(element.dataScreening3Value) !== 0 && element.dataScreening3Value !== undefined) ?
                            <img src={dataScreening3} alt=""/> : ' --'}
                        </td>
                        <td>
                          {Number(element.dataScreening4Value) === 0 ? "" : element.dataScreening4ValueStr}
                          {(dataScreening4 !== '--' && Number(element.dataScreening4Value) !== 0 && Number(element.dataScreening4Value) !== undefined) ?
                            <img src={dataScreening4} alt=""/> : ' --'}
                        </td>
                      </tr>
                    );
                  })}
                  </tbody>
                </table>

                {
                  ismove && <div>
                    <p><span className="icon">
                  <img src={ic_search} alt=""/>
                </span> 院线票房对比</p>
                    <div className="search heightUnset">
                      <div className="date-select">
                     <span className={BasicData.movie['day'] === 10 ? "checked" : ""}
                           onClick={() => {
                             this.getsourceDay({ source: 'movie', day: 10 });
                           }}
                     >近10天</span>
                        <span className={BasicData.movie['day'] === 30 ? "checked" : ""}
                              onClick={() => {
                                this.getsourceDay({ source: 'movie', day: 30 });
                              }}
                        >近30天</span>
                      </div>
                      <EchartLines container="echart_bar_Category" data={isMoveData} title={"院线票房数（万）"}/>
                    </div>
                  </div>
                }
                {
                  (isTv || ismove) && <div>
                    <p><span className="icon">
                  <img src={ic_search} alt=""/>
                </span> 平台数据对比</p>
                    <div className="search_line">
                      <div className="ul">
                        <ul>
                          <li className={Number(BasicData.isMovieTv['nav']) !== 51 ? 'active' : ''}
                              onClick={() => {
                                this.tagNavItem({ nav: 49, el: 'isMovieTv' });
                              }}>平台播放量趋势
                          </li>
                          <li className={Number(BasicData.isMovieTv['nav']) === 51 ? 'active' : ''}
                              onClick={() => {
                                this.tagNavItem({ nav: 51, el: 'isMovieTv' });
                              }}>平台热度趋势
                          </li>
                        </ul>
                      </div>
                      <div className="search heightUnset">
                        <div className="date-select">
                     <span className={BasicData.isMovieTv['day'] === 10 ? "checked" : ""}
                           onClick={() => {
                             this.getsourceDay({ source: 'isMovieTv', day: 10 });
                           }}
                     >近10天</span>
                          <span className={BasicData.isMovieTv['day'] === 30 ? "checked" : ""}
                                onClick={() => {
                                  this.getsourceDay({ source: 'isMovieTv', day: 30 });
                                }}
                          >近30天</span>
                        </div>
                        <div className="text-center">
                          {

                            Number(BasicData.isMovieTv['nav']) === 51 ?
                              <span className="selectType">爱奇艺</span>
                              :
                              <div className="selectTypeBox">
                            <span className={BasicData.isMovieTv['nav'] === 49 ? 'active' : ''}
                                  onClick={() => {
                                    this.tagNavItem({ nav: 49, el: 'isMovieTv' });
                                  }}
                            >芒果TV</span>
                                <span className={BasicData.isMovieTv['nav'] === 46 ? 'active' : ''}
                                      onClick={() => {
                                        this.tagNavItem({ nav: 46, el: 'isMovieTv' });
                                      }}
                                >腾讯视频</span>
                                <span className={BasicData.isMovieTv['nav'] === 65 ? 'active' : ''}
                                      onClick={() => {
                                        this.tagNavItem({ nav: 65, el: 'isMovieTv' });
                                      }}
                                >搜狐视频</span>
                                <span className={BasicData.isMovieTv['nav'] === 53 ? 'active' : ''}
                                      onClick={() => {
                                        this.tagNavItem({ nav: 53, el: 'isMovieTv' });
                                      }}
                                >乐视</span>
                              </div>
                          }
                        </div>
                        {
                          Number(BasicData.isMovieTv['nav']) === 51 ?
                            <EchartLines
                              container="echart_bar_Category" data={isTvData} title={"平台热度趋势"}/>
                            :
                            <EchartLines
                              container="echart_bar_Category" data={isTvData} title={"平台播放趋势"}/>
                        }
                      </div>
                    </div>
                  </div>
                }
                {
                  (isTv || ismove) && <div>
                    <p><span className="icon">
                  <img src={ic_sjzl} alt=""/>
                </span> 口碑信息</p>
                    <div className="koubei table">
                      <div className="tbody">
                        {dataPraise && dataPraise.map((element) => {
                          return (
                            <div className="tr clearfix" key={element.ipid}>
                              <div className="td">{element.ipName}</div>
                              {
                                element.list.map((ele) => {
                                  return (
                                    <div className="td" key={ele.typeId}>
                                      <div className="img">
                                        <img src={this.fileter_logo(ele.typeId)} alt=""/>
                                      </div>
                                      <div className="detail">
                                        <span className="first">{ele.typeName}</span>
                                        <span className="last">{ele.dataNumber}</span>
                                      </div>
                                    </div>
                                  );
                                })
                              }
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                }

                <p>
              <span className="icon">
              <img src={ic_search} alt=""/>
              </span>
                  搜索基础数据指数
                </p>
                <div className="search_line">
                  <div className="ul">
                    <ul>
                      <li className={BasicData.search['nav'] === 5 ? 'active' : ''}
                          onClick={() => {
                            this.tagNavItem({ nav: 5, el: 'search' });
                          }}>百度搜索指数
                      </li>
                      <li className={BasicData.search['nav'] === 6 ? 'active' : ''}
                          onClick={() => {
                            this.tagNavItem({ nav: 6, el: 'search' });
                          }}>搜狗搜索指数
                      </li>
                    </ul>
                  </div>

                  <div className="search heightUnset ">
                    {
                      BasicData.search['nav'] === 5 ?
                        <EchartBar container="echart_bar_darren" data={Acquire} title={"百度搜索指数"}/>
                        :
                        <EchartBar container="echart_bar_darren" data={Acquire} title={"搜狗搜索指数"}/>
                    }
                  </div>
                </div>
                <p>
                 <span className="icon">
                  <img src={ic_media} alt=""/>
                  </span> 媒体关注基础数据
                </p>
                <div className="search_line">
                  <div className="ul">
                    <ul>
                      <li className={BasicData.media['nav'] === 13 ? 'active' : ''} onClick={() => {
                        this.tagNavItem({ nav: 13, el: 'media' });
                      }}>百度资讯指数
                      </li>
                      <li className={BasicData.media['nav'] === 8 ? 'active' : ''} onClick={() => {
                        this.tagNavItem({ nav: 8, el: 'media' });
                      }}>微信公众号文章数
                      </li>
                      <li className={BasicData.media['nav'] === 84 ? 'active' : ''} onClick={() => {
                        this.tagNavItem({ nav: 84, el: 'media' });
                      }}>头条热度指数
                      </li>
                    </ul>
                  </div>
                  <div className="search heightUnset">
                    <EchartLine container="echart_line_darren" data={media}/>
                  </div>
                </div>
                <p>
                  <span className="icon">
                   <img src={ic_follower} alt=""/>
                  </span> 粉丝趋势
                </p>
                <div className="search_line">
                  <div className="ul">
                    <ul>
                      {
                        ismove || isTv ?
                          <li className={BasicData.fans['nav'] === 42 ? 'active' : ''} onClick={() => {
                            if (BasicData.fans['nav'] !== 42) this.tagNavItem({ nav: 42, el: 'fans' });
                          }}>微博超话粉丝数</li>
                          :
                          <li className={BasicData.fans['nav'] === 14 ? 'active' : ''} onClick={() => {
                            if (BasicData.fans['nav'] !== 14) this.tagNavItem({ nav: 14, el: 'fans' });
                          }}>微博粉丝数</li>
                      }
                      <li className={BasicData.fans['nav'] === 33 ? 'active' : ''} onClick={() => {
                        if (BasicData.fans['nav'] !== 33) this.tagNavItem({ nav: 33, el: 'fans' });
                      }}>贴吧粉丝数
                      </li>
                    </ul>
                  </div>

                  <div className="search heightUnset">
                    <EchartLine container="echart_line_darren" data={fans}/>
                  </div>
                </div>
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
