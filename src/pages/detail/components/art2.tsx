import * as React from "react";
import { Link } from "react-router-dom";
import EchartBar from "@components/echart_bar";
import EchartLine from "@components/echart_line";
import EchartMap from "@components/echart_map";
import EchartBarSpecial2 from "@components/echart_bar_special2";
import EchartWordcloud from "@components/echart_wordcloud";
import EchartPieHollow from "@components/echart_pie_hollow";
import ic_ip_type from "@assets/images/ip_detail/ic_ip_type.svg";
import ic_case from "@assets/images/ip_detail/ic_case.svg";
import ic_value from "@assets/images/ip_detail/ic_value.svg";
import ic_sjzl from "@assets/images/ip_detail/ic_sjzl.svg";
import ic_media from "@assets/images/ip_detail/ic_media.svg";
import ic_cnxh from "@assets/images/ip_detail/ic_cnxh.svg";
import ic_area from "@assets/images/ip_detail/ic_area.svg";
import ic_follower from "@assets/images/ip_detail/ic_follower.svg";
import ic_wordcloud from "@assets/images/ip_detail/ic_wordcloud.svg";
import ic_content_validity from "@assets/images/ip_detail/ic_content_validity.svg";
import ic_cooperate from "@assets/images/ip_detail/ic_cooperate.svg";
import ic_Picture_details from "@assets/images/ip_detail/ic_Picture_details.svg";
import ic_show from "@assets/images/ip_detail/ic_show.svg";
import ic_search from "@assets/images/ip_detail/ic_search.svg";
import ic_hudong from "@assets/images/ip_detail/ic_hudong.svg";
import "@assets/fonts2.0/iconfont.css";
import moment from "moment";
import { inject, observer } from 'mobx-react';
import default_img from '@assets/images/default/ic_default_shu.png';
import _isFunc from 'lodash/isFunction';
import { toJS } from 'mobx';
import EchartsRadarBalance from '@components/echart_radar_balance';
import ic_product from "@assets/images/ip_detail/ic_representative_works.svg";
import ic_brand from "@assets/images/ip_detail/ic_co_branding.svg";
import ic_upcomingg from "@assets/images/ip_detail/ic_upcoming.svg";
import qr_code from '@assets/images/about/qr_code.png';
import Swipers from "@pages/detail/components/swiper";
import _isArray from 'lodash/isArray';
import _chunk from 'lodash/chunk';
import _isEmpty from "lodash/isEmpty";
import topFun from "../components/detail-top-public";
import _ from 'lodash';
import Scrollbars from "react-custom-scrollbars";
import icon_dou from "@assets/images/ip_icon_dou.png";
import Certification from '@pages/detail/components/certification';
import Vip from '@pages/detail/components/vip';
import Vip2 from '@pages/detail/components/vip2';
import ic_yxpf from "@assets/images/ip_detail/ic_yxpf.svg";
import ic_ptqs from "@assets/images/ip_detail/ic_ptqs.svg";
import ic_kbxx from "@assets/images/ip_detail/ic_kbxx.svg";
import ic_score from "@assets/images/ip_detail/ic_grade.svg";
import ic_box_office from "@assets/images/ip_detail/ic_box_office.svg";
import ic_opus from "@assets/images/ip_detail/ic_opus.svg";
import ic_praised from "@assets/images/ip_detail/ic_praised.svg";
import EchartDataZoom from '@components/echart_dataZoom';
import EchartDataZoomTwo from '@components/echart_dataZoom_two';
import douban from '@assets/images/ip_detail/douban.png';
import iqiyi from '@assets/images/ip_detail/iqiyi_logo.png';
import leshi from '@assets/images/ip_detail/LeTV_logo.png';
import mangguo from '@assets/images/ip_detail/mangguo.png';
import tengxun from '@assets/images/ip_detail/tengxun.png';
import youku from '@assets/images/ip_detail/youku.png';
import EchartDataZoomBoxOffice from '@components/echart_dataZoom_boxOffice';
import {
  setContact, deletContact, thousandSeparator
} from "@utils/util";
import Alert from '@components/alert';
import NoResult from '@pages/detail/components/no-result';
import NoLogin from '@pages/detail/components/no-login';
import PrivateLetter from '@pages/detail/components/private-letter';
import icon_load from '@assets/images/update/timg.gif';
import EchartBarDouble from '@components/echart_bar_double';
import icon_detail from '@assets/images/ip_detail/how.png';
import EchartTree from '@components/echart_tree';
import EchartsLineAndBar from '@pages/detail/components/echart_barRadius_new';
import { BasicExample } from '@pages/detail/components/index';

const icon_k_v = {
  up: "ic_rise iconic_rise up",
  blance: "ic_ unbiased iconic_unbiased blance",
  down: "ic_decline iconic_decline down",
};

const hot = [
  { name: "百度搜索指数", typeId: 5, type: "hot" },
  { name: "搜狗搜索指数", typeId: 6, type: "hot" },
];

const blog = [
  { name: "微博超话帖子数", typeId: 41, type: "blog" },
  { name: "微博超话阅读数", typeId: 40, type: "blog" },
  { name: "微博话题阅读数", typeId: 9, type: "blog" },
  { name: "微博话题帖子数", typeId: 10, type: "blog" },
];

const media = [
  { name: "百度资讯指数", typeId: 13, type: "media" },
  { name: "微信公众号文章数", typeId: 8, type: "media" },
  // { name: "微信热度指数", typeId: 15, type: "media" },
  { name: "头条热度指数", typeId: 84, type: "media" },
];
const fans = [
  { name: "微博粉丝数", typeId: 14, type: "fans" },
  { name: "贴吧粉丝数", typeId: 33, type: "fans" },
];
const fans2 = [
  { name: "微博超话粉丝数", typeId: 42, type: "fans2" },
  { name: "贴吧粉丝数", typeId: 33, type: "fans2" },
];
const platform = [
  { name: "平台播放量趋势", typeId: 1, type: "platform" },
  { name: "平台热度趋势", typeId: 2, type: "platform" },
];
const dayStatus = {
  hot: [
    { dayNumber: 10, name: "近10天", type: "hot" },
    { dayNumber: 30, name: "近30天", type: "hot" }
  ],
  blog: [
    { dayNumber: 10, name: "近10天", type: "blog" },
    { dayNumber: 30, name: "近30天", type: "blog" }
  ],
  media: [
    { dayNumber: 10, name: "近10天", type: "media" },
    { dayNumber: 30, name: "近30天", type: "media" }
  ],
  fans: [
    { dayNumber: 10, name: "近10天", type: "fans" },
    { dayNumber: 30, name: "近30天", type: "fans" }
  ],
  boxOffice: [
    { dayNumber: 10, name: "近10天", type: "boxOffice" },
    { dayNumber: 30, name: "近30天", type: "boxOffice" }
  ],
  platform: [
    { dayNumber: 10, name: "近10天", type: "platform" },
    { dayNumber: 30, name: "近30天", type: "platform" }
  ]
};
const numberKV = {
  1: '卡通',
  2: '文创艺术',
  3: '图书',
  4: '网文',
  5: '电视剧',
  6: '电影',
  7: '综艺',
  8: '明星艺人',
  9: '动画',
  10: '漫画',
  334: '生活方式',
  335: '企业品牌',
  336: '体育运动',
  337: '非盈利机构',
  338: '网络游戏',
  370: '网文图书',
};

function fileKvNumber(number) {
  return !(Number(number) === 1 || Number(number) === 2 || Number(number) === 8);
}

interface IIpArtProps extends IComponentProps {
  id: number,
  history?: any;
  ipTypeNumber: number;
}

interface IIpArtState {
  currentIndex: number,
  tabs: any[],
  cityAreaNum: number,
  hotCurrent: number,
  blogCurrent: number,
  mediaCurrent: number,
  platformCurrent: number,
  fansDayNumber: number,
  fansCurrent: number,
  fansCurrent2: number,

  hotDayNumber: number,
  blogDayNumber: number,
  mediaDayNumber: number,
  platformDayNumber: number,
  boxOfficeDayNumber: number,
  flag: boolean,
  show: boolean,
  message: string,
  certification: boolean,
  compareFlag: boolean,
  loginMessage: string,
  loginShow: boolean,
  url: any;
  buttonValue: string,
  isPrivateLetterShow: boolean,
  privateData: any,

  basicCurrent: string | number;
  starFans: boolean; //  名人明星(粉丝趋势）新增动态平台显示
}

@inject('detail', 'ip_list', 'login')
@observer
export default class IpArt extends React.Component<IIpArtProps, IIpArtState> {
  constructor(props) {
    super(props);

    this.state = {
      loginMessage: '',
      loginShow: false,
      currentIndex: 1,
      tabs: [
        { tabName: "IP相关介绍", id: 1 },
        { tabName: "基础数据", id: 2 },
        { tabName: "IP评估", id: 3 },
        { tabName: "IP评测", id: 4 },
      ],
      // 热度指数 (typeId)- 5/6/11/15;
      // 微博趋势 - 10/9/14/16/12
      // 媒体指数 - 13/8
      cityAreaNum: 1,
      hotCurrent: 5,
      blogCurrent: 41,
      mediaCurrent: 13,
      fansCurrent: 14,
      fansCurrent2: 42,
      platformCurrent: 1,
      hotDayNumber: 10,
      blogDayNumber: 10,
      mediaDayNumber: 10,
      fansDayNumber: 10,
      platformDayNumber: 10,
      boxOfficeDayNumber: 10,
      flag: false,
      show: false,
      message: "",
      certification: false,
      compareFlag: false,
      url: null,
      buttonValue: '',
      isPrivateLetterShow: false,
      privateData: {},

      basicCurrent: 0,
      starFans: false,
    };
  }

  componentDidUpdate(prevProps: Readonly<IIpArtProps>, prevState: Readonly<IIpArtState>, snapshot?: any) {
    if (prevProps.id !== this.props.id) {
      location.reload();
    }
  }

  async componentDidMount() {

    await this._clickTab({ id: 2 });
    await this._clickTab({ id: 3 });
  }

  private icon(name: string): string {
    let iconObj = {
      "豆瓣评分": douban,
      "爱奇艺评分": iqiyi,
      "乐视评分": leshi,
      "芒果评分": mangguo,
      "腾讯评分": tengxun,
      "优酷评分": youku
    };
    return iconObj[name];
  }

  // 数据总览  ip相关 切换
  _showTab(item: any) {

    if (item.id === 2) {
      return (
        <i className="iconfont ic_data iconic_data"/>
      );
    } else if (item.id === 1) {
      return (
        <i className="iconfont ic_ip_introduce iconic_ip_introduce"/>
      );
    } else if (item.id === 3) {
      return (
        <i className="iconfont iconestimate estimate"/>
      );
    } else {
      return (
        <i className="iconfont iconcalculate calculate"/>
      );
    }
  }

  // 切换基础和评估数据
  async _clickTab(item: any) {
    const { detail, id: ipid, ipTypeNumber, login } = this.props;
    const { starPlatform, platformType } = detail;
    const { userGuid } = login.userInfo || { userGuid: '' };
    let dataParam = {}, dataParam2 = {}, dataParam3 = {}, dataParam4 = {}, type = null;

    const baseDataArrr = [',1,', ',2,', ',3,'];
    const visibleBaseData = !_isEmpty(login.userInfo) && baseDataArrr.some((e: string) => login.userInfo.userJurisdiction.indexOf(e) !== (-1));

    const IPArr = [',2,', ',3,'];
    const visibleIP = !_isEmpty(login.userInfo) && IPArr.some((e: string) => login.userInfo.userJurisdiction.indexOf(e) !== (-1));
    if (item.id === 2 && visibleBaseData) {
      detail.starFansType = 1;
      detail.starLikedType = 1;
      // 基础数据
      await detail.getDetailTotal({ ipTypeSuperiorNumber: ipTypeNumber, ipid });
      await detail.getStarPlatform(ipid);

      if (!_isEmpty(starPlatform)) {
        await detail.changeFansLikedParams({
          userGuid,
          ipid,
          platformType,
          dataType: 2,
          type: 1,
        });
        detail.starLikedTab = platformType;
        detail.starRecentTab = platformType;
      }

      dataParam = { dayNumber: 10, ipid, typeId: 5, type: "hot" };
      dataParam2 = { dayNumber: 10, ipid, typeId: 41, type: "blog" };
      dataParam3 = { dayNumber: 10, ipid, typeId: 13, type: "media" };
      if (ipTypeNumber === 5 || ipTypeNumber === 6 || ipTypeNumber === 7) {
        dataParam4 = { dayNumber: 10, ipid, typeId: 42, type: "fans" };
      } else {
        dataParam4 = { dayNumber: 10, ipid, typeId: 14, type: "fans" };
      }
      await detail.echartChangeStatus(dataParam);
      await detail.echartChangeStatus(dataParam2);
      await detail.echartChangeStatus(dataParam3);
      await detail.echartChangeStatus(dataParam4);

      if (!_isEmpty(starPlatform)) {

        await detail.getStarRecentWorks({ userGuid, platformType, ipid });
      }
      if (ipTypeNumber === 5) {
        // 电视剧
        await detail.getBroadcastTrend({ type: 1, dayNumber: 10, ipid });

        await detail.getBroadcastPlatform({ ipid });
        await detail.getPublicPraise({ ipid });
      } else if (ipTypeNumber === 6) {
        // 电影
        await detail.getBoxOffice({ dayNumber: 10, ipid });
        await detail.getPublicPraise({ ipid });
        await detail.getBroadcastTrend({ type: 1, dayNumber: 10, ipid });
      } else if (ipTypeNumber === 7) {
        // 综艺
        await detail.getBroadcastPlatform({ ipid });
        await detail.getPublicPraise({ ipid });
        await detail.getBroadcastTrend({ type: 1, dayNumber: 10, ipid });
      }

    } else if (item.id === 3 && !_isEmpty(login.userInfo)) {
      // IP评估
      const { userGuid, memberLevel } = login.userInfo;
      if (userGuid !== null && visibleIP) {

        await detail.getAgeSexData({ userGuid, ipid, typeId: 1 });
        await detail.getAgeSexData({ userGuid, ipid, typeId: 2 });
        await detail.getFansAreaData({ userGuid, ipid, typeId: 3 });
        await detail.getFansAreaData({ userGuid, ipid, typeId: 4 });
        if (ipTypeNumber === 8) {
          type = 'people';
        }
        // 预测评分 预测票房
        if (detail.ipDetailData.ipIsShow === 2 && (ipTypeNumber === 5 || ipTypeNumber === 6)) {
          await detail.getScoreAndBoxOffice({ ipid });
        }
        await detail.getBusinessData({ userGuid, ipid, ipTypeSuperiorNumber: ipTypeNumber }, type);
        await detail.getWordData({ userGuid, ipid, wordType: 1 });
      }

    }
  }

  async _getStatus(detail, id, flag, guid) {
    const { ipTypeNumber, login } = this.props;
    if (!_isEmpty(login.userInfo)) {
      const { userGuid } = login.userInfo;
      await detail.getFollowStatus({ userGuid, isFollow: flag, type: 3, guid });
      const params = {
        userGuid,
        ipTypeSuperiorNumber: ipTypeNumber,
        ipid: id,
      };
      await detail.ipDetail(params);
    } else {
      let message = "您还未登陆！";
      this._state(message);
    }
  }

  _totalDataClass(item) {
    if (item === 1) {
      return (
        <i className={`iconfont ${icon_k_v.up}`}/>
      );
    } else if (item === 2) {
      return (
        <i className={`iconfont `}/>
      );
    } else if (item === 3) {
      return (
        <i className={`iconfont  ${icon_k_v.down}`}/>
      );
    } else {
      return;
    }
  }

  // 省份/区域 tab切换
  setcityAreaNum(num) {
    this.setState({
      cityAreaNum: num,
    });
  }

// 切换图表tab
  async _selectLi(item) {
    const { detail, login } = this.props;
    let dataParam = {};
    const { hotDayNumber, blogDayNumber, mediaDayNumber, fansDayNumber, } = this.state;
    let userGuid, userData = login.userInfo;
    if (!_isEmpty(userData)) {
      userGuid = userData.userGuid;
    } else {
      userGuid = null;
    }
    if (item.type === "basic") {
      dataParam = { userGuid, typeId: item.typeId, type: 'basic' };
    } else if (item.type === "hot") {
      this.setState({
        hotCurrent: item.typeId
      });
      dataParam = { userGuid, typeId: item.typeId, dayNumber: hotDayNumber, type: 'hot' };
    } else if (item.type === "blog") {
      this.setState({
        blogCurrent: item.typeId
      });
      dataParam = { userGuid, typeId: item.typeId, dayNumber: blogDayNumber, type: 'blog' };
    } else if (item.type === "media") {
      this.setState({
        mediaCurrent: item.typeId
      });
      dataParam = { userGuid, typeId: item.typeId, dayNumber: mediaDayNumber, type: 'media' };

    } else if (item.type === "fans") {
      this.setState({
        fansCurrent: item.typeId
      });
      dataParam = { userGuid, typeId: item.typeId, dayNumber: fansDayNumber, type: 'fans' };
    } else if (item.type === "fans2") {
      this.setState({
        fansCurrent2: item.typeId
      });
      dataParam = { userGuid, typeId: item.typeId, dayNumber: fansDayNumber, type: 'fans2' };
    }
    await detail.echartChangeStatus(dataParam);

  }

  async _selectDay(item) {
    const { detail, login } = this.props;
    const { hotCurrent, blogCurrent, mediaCurrent, fansCurrent, } = this.state;
    let dataParam = {}, userData = login.userInfo;
    let userGuid;
    if (!_isEmpty(userData)) {
      userGuid = userData.userGuid;
    } else {
      userGuid = null;
    }
    if (item.type === "hot") {
      this.setState({
        hotDayNumber: item.dayNumber
      });
      dataParam = { userGuid, dayNumber: item.dayNumber, typeId: hotCurrent, type: 'hot' };
    } else if (item.type === "blog") {
      this.setState({
        blogDayNumber: item.dayNumber
      });
      dataParam = { userGuid, dayNumber: item.dayNumber, typeId: blogCurrent, type: 'blog' };

    } else if (item.type === "media") {
      this.setState({
        mediaDayNumber: item.dayNumber
      });
      dataParam = { userGuid, dayNumber: item.dayNumber, typeId: mediaCurrent, type: 'media' };
    } else if (item.type === "fans") {
      this.setState({
        fansDayNumber: item.dayNumber
      });
      dataParam = { userGuid, dayNumber: item.dayNumber, typeId: fansCurrent, type: 'fans' };
    }
    await detail.echartChangeStatus(dataParam);
  }

  async _boxOfficeDay(item: any) {
    const { detail, id: ipid } = this.props;
    this.setState({
      boxOfficeDayNumber: item.dayNumber
    });
    let dataParam = { dayNumber: item.dayNumber, ipid };
    await detail.getBoxOffice(dataParam);
  }

  async _platformLi(item: any) {
    const { detail, id: ipid } = this.props;
    const { platformDayNumber } = this.state;
    this.setState({
      platformCurrent: item.typeId
    });
    let dataParam = { type: item.typeId, dayNumber: platformDayNumber, ipid };
    await detail.getBroadcastTrend(dataParam);
  }

  async _platformDay(item: any) {
    const { detail, id: ipid } = this.props;
    const { platformCurrent } = this.state;
    this.setState({
      platformDayNumber: item.dayNumber
    });
    let dataParam = { type: platformCurrent, dayNumber: item.dayNumber, ipid };
    await detail.getBroadcastTrend(dataParam);
  }

  _state(message, url?: string, buttonValue?: string) {
    this.setState({
      show: true,
      message, // "您还未登陆或者实名认证!",
      url,
      buttonValue,
    });
  }

  /**
   * blance.xue
   * 私信： 登陆、所属企业不能为空
   * 查看企业主页
   * 下载资料 登陆、实名或这企业认证
   */
  _userGuid(id, realStatus) {
    const { ipTypeNumber, detail, id: ipid, login } = this.props;
    const { ipDetailData } = detail;
    let message, url, buttonValue, userData = login.userInfo;
    const { userGuid: companyGuid } = ipDetailData.companyDetailVO;
    const { userGuid } = userData || { userGuid: '' };

    /* if (userGuid === null || Number(realStatus) !== 1) {
       if (userGuid === null) {
         message = "您还未登陆,请先登陆后进行实名认证";
         url = '/login';
         buttonValue = "去登录";
       } else {
         message = "您还未认证,请先进行认证";
         url = '/user/2';
         buttonValue = "去认证";
       }
       return (
         <div className="base-line flex-row button-box ">
           <span onClick={() => {
             this._state(message, url, buttonValue);
           }} className="btn edit-btn-edit justify-content-center align-items-center">

           </span>
           <span onClick={() => {
             this._state(message, url, buttonValue);
           }}
                 className="btn edit-btn-upload  justify-content-center
                   align-items-center with-margin-left-20 upload-work">
             上传商务资料
           </span>
           <span onClick={() => {
             this._state(message, url, buttonValue);
           }}
                 className="btn edit-btn-download justify-content-center
                       align-items-center with-margin-left-20 upload_data">
             下载资料
           </span>
         </div>
       );
     } else {*/
    return (
      <div className="base-line flex-row button-box ">
        {
          !_isEmpty(ipDetailData.companyDetailVO) && companyGuid !== userGuid &&
          <button onClick={() => {
            if (userData === null) {
              message = "您还未登陆,请先登陆后进行实名认证";
              url = '/login';
              buttonValue = "去登录";
              localStorage.setItem('historyUrl', `detail/${ipTypeNumber}/${ipid}`);
              this._state(message, url, buttonValue);
            } else {
              this.setState({
                isPrivateLetterShow: true,
                privateData: {
                  ...this.state.privateData,
                  userGuid: userData['userGuid'],
                  companyDetailVO: ipDetailData.companyDetailVO,
                }
              });
            }
          }}
                  className="btn edit-btn-edit justify-content-center align-items-center">
            <span>私信</span>
          </button>
        }
        {
          !_isEmpty(ipDetailData.companyDetailVO) &&
          <button
            onClick={() => {
              this.props.history.push(`/business-homepage/${ipDetailData.companyDetailVO['userGuid']}`);
            }}
            className="btn edit-btn-upload justify-content-center align-items-center with-margin-left-20 upload-work"
          >
            <span>查看企业主页</span>
          </button>
        }
        <button onClick={() => {
          if (userData === null || Number(realStatus) !== 1) {
            if (userData === null) {
              message = "您还未登陆,请先登陆后进行实名认证";
              url = '/login';
              buttonValue = "去登录";
              localStorage.setItem('historyUrl', `detail/${ipTypeNumber}/${ipid}`);
            } else {
              message = "您还未认证,请先进行认证";
              url = '/user/2';
              buttonValue = "去认证";
            }
            this._state(message, url, buttonValue);
          } else {
            this.callbackChildModel(true);
          }
        }}
                className={!_isEmpty(ipDetailData.companyDetailVO) ?
                  "btn edit-btn-download justify-content-center align-items-center with-margin-left-20 upload_data"
                  : "btn edit-btn-download justify-content-center align-items-center upload_data"}>
          <span>下载资料</span>
        </button>
      </div>
    );
  }

  private callbackChildModel = (o: any) => {
    _isFunc(this.props.callback) && this.props.callback(o);
  };

  static _public(item: any, ipTypeNumber: number) {
    const doRender = topFun[ipTypeNumber];
    return _.isFunction(doRender) && doRender(item);
  }

  // 数据总览-切换平台类型
  async _changeTotalPlatform(li) {
    const { detail, id: ipid } = this.props;
    await detail.getStarPlatformData({ platform_type: li.platformType, ipid });
  }

  // 数据总览
  _totalData(item: any) {
    if (item === 5 || item === 7) {
      return (
        <tr>
          <td>上线天数</td>
          <td>累计播放量</td>
          <td>昨日播放量</td>
          <td>今日播放量</td>
        </tr>
      );
    } else if (item === 6) {
      return (
        <tr>
          <td>上映天数</td>
          <td>票房累计</td>
          <td>首映日票房</td>
          <td>首周票房</td>
        </tr>
      );
    } else if (item === 8) {
      return (
        <tr>
          <td>全网热度值</td>
          <td>媒体指数</td>
          <td>合作品牌数</td>
          <td>微博粉丝数</td>
        </tr>
      );
    } else {
      return (
        <tr>
          <td>全网热度值</td>
          <td>媒体指数</td>
          <td>全网搜索量</td>
          <td>官网粉丝数</td>
        </tr>
      );
    }
  }

  _findipids = () => {
    const { contastList } = this.props;
    let istrue = false;
    if (!!contastList) {
      contastList.map(val => {
        if (val.ipids === this.props.detail.ipDetailData.ipid) {
          istrue = true;
        }
      });
    }
    return istrue;
  };
  /**
   * 基础数据-图表共同部分提取(未登录，未认证,无结果），认证会员以上查看
   */
  _basicCommon = (userData, realStatus, memberLevel) => {
    const { id, ipTypeNumber } = this.props;
    if (_isEmpty(userData)) {

      return (
        <div className="area-content hot-content">
          <NoLogin id={id} ipTypeNumber={ipTypeNumber} history={history}/>
        </div>
      );
    } else if (!_isEmpty(userData) && realStatus !== 1 && memberLevel < 1) {

      return (
        <div className="area-content hot-content">
          <Certification/>
        </div>
      );
    }

  };

  _noResultFun = (data) => {
    if (_isEmpty(data)) {
      // if (!_isEmpty(userData) && _isEmpty(data) && (realStatus === 1 || memberLevel > 0)) {
      return <NoResult/>;
    }
  };

  render() {
    const {
      tabs, currentIndex, cityAreaNum, hotCurrent, blogCurrent, mediaCurrent, fansCurrent, fansCurrent2,
      hotDayNumber, blogDayNumber, mediaDayNumber, fansDayNumber, show, message,
      platformCurrent, platformDayNumber, boxOfficeDayNumber,
      basicCurrent, starFans,
    } = this.state;
    const { detail, id, ipTypeNumber, callbackcontastList, contastList, login, } = this.props;
    const { userGuid } = login.userInfo || { userGuid: "" };
    const {
      ipDetailData,
      detailList: {
        ipArtLikeData,
        ipCaseData,
        ipWordCloudData,
        // ipSexData, ageData, agePercent,
        ipProvinceData, xProvince, yProvince, xArea, yArea,
        xBlog, yBlog, xMedia, yMedia,
        xHot, yHot, xfan, yfan,
        ipPeopleList, followStatus,
      },
      starList: {
        repProductionList,
        coBrands,
        upcomingProductionList,
      },
      businessData, indicator, boxOfficeData, boxOfficeDate, broadcastNO,
      ipTotalData, starPlatform, starPlatformData, starLikedType,
      starFansLikedParams, starFansData, starFansType, starLikedData, starRecentWorksData,
      starLikedTab, starRecentTab, starLikedDayNumber,
      broadcastTrendData, broadcastTrendDate, publicPraiseData, broadcastPlatformData, broadcastPlatformData2,
      ageData, sexData, treeData,
    } = detail;
    let isShow1 = currentIndex === 1 ? "block" : "none";
    let isShow2 = currentIndex === 2 ? "block" : "none";
    let isShow3 = currentIndex === 3 ? "block" : "none";
    let isShow4 = currentIndex === 4 ? "block" : "none";
    let options: object = {
      effect: "slide", pagination: ".swiper-pagination", loop: false,
      nextButton: ".swiper-button-next",
      prevButton: ".swiper-button-prev",
    };
    let arr: any[] = [];
    let arr2: any[] = [];

    if (_isArray(repProductionList) && _isArray(upcomingProductionList)) {
      arr = _chunk(repProductionList, 4);
      arr2 = _chunk(upcomingProductionList, 2);

      if (arr.length > 1 || arr2.length > 1) {
        options = {
          effect: "slide", loop: true, pagination: null,
          nextButton: ".swiper-button-next",
          prevButton: ".swiper-button-prev",
          autoplay: false,
        };
      }
    }
    // 认证状态，会员等级：0=>普通会员，1=》认证会员,2=》黄金会员，3=》钻石会员
    // 老的权限规则
    let realStatus, memberLevel: number = 0, userData = login.userInfo;
    if (!_isEmpty(userData)) {
      realStatus = userData.realStatus || userData.companyRealStatus;
      memberLevel = userData.memberLevel;
    }

    // 认证状态，会员等级：1=》白银会员,2=》黄金会员，3=》钻石会员
    // 新的权限规则
    const baseDataArrr = [',1,', ',2,', ',3,'];
    const visibleBaseData = !_isEmpty(userData) && baseDataArrr.some((e: string) => login.userInfo.userJurisdiction.indexOf(e) !== (-1));

    const IPArr = [',2,', ',3,'];
    const visibleIP = !_isEmpty(userData) && IPArr.some((e: string) => login.userInfo.userJurisdiction.indexOf(e) !== (-1));

    const contrastArr = [',3,', ',6,'];
    const visibleContrastArr = !_isEmpty(userData) && contrastArr.some((e: string) => login.userInfo.userJurisdiction.indexOf(e) !== (-1));

    let guid: string;
    if (!_isEmpty(ipDetailData)) {
      guid = ipDetailData.ipGuid;
    }

    return (
      <div className="art-container special-container">
        {/*顶部主体内容*/}
        {!_isEmpty(ipDetailData) &&
        <div className="detail-top-container">
          <div className="detail-base-area">
            <div className="ip-img">
              <img src={ipDetailData.ipPicUrl} alt=""/>
              <span className="tag">{numberKV[ipTypeNumber]}</span>
            </div>
            <div className="detail-base-text-area flex-column justify-content-between">
              <div>
                <div className="first-line flex-row align-items-end justify-content-between ">
                  <span className="ip-title word-ellipsis" title={ipDetailData.ipName}>{ipDetailData.ipName}</span>
                  {this._findipids() ? <span className="ip-care-status ip-compare-status active"
                                             onClick={async () => {
                                               deletContact(ipDetailData.ipid);
                                               callbackcontastList(JSON.parse(localStorage.getItem('contastList')));
                                             }}>
                            <i className="iconfont vs iconvs_pr"/>已加入对比
                      </span> :
                    <span className="ip-care-status ip-compare-status "
                          onClick={async () => {
                            let message = '',
                              url = '/login',
                              buttonValue = '去登陆';
                            // 判断是否登陆
                            // if (JSON.parse(localStorage.getItem("user")) === null) {
                            //   localStorage.setItem('historyUrl', `detail/${ipTypeNumber}/${id}`);
                            //   message = '请登陆后再添加对比';
                            //   this._state(message, url, buttonValue);
                            //   return false;
                            // }
                            let _ipNumber = JSON.parse(localStorage.getItem('ipTypeSuperiorNumber'));
                            let _nowIpNumber = ipDetailData.ipTypeSuperiorNumber;
                            // if (!visibleContrastArr) {
                            //   this.setState({
                            //     show: true,
                            //     buttonValue: '去升级',
                            //     url: '/user/12',
                            //     message: '该数据仅为钻石VIP会员用户可见，如需查看请先升级',
                            //   });
                            //   return false;
                            // }
                            if (_ipNumber === _nowIpNumber || _ipNumber === null) {
                              if (contastList !== null && contastList.length >= 3) {
                                this.setState({
                                  show: true,
                                  message: '同时最多添加三种对比',
                                });
                              } else {
                                setContact({
                                  name: ipDetailData.ipName,
                                  ipids: Number(ipDetailData.ipid),
                                }, _nowIpNumber);
                                callbackcontastList(JSON.parse(localStorage.getItem('contastList')));
                              }

                            } else {
                              this.setState({
                                show: true,
                                message: '类别不一样，不能进行对比',
                              });
                            }

                          }}>
                          <i className="iconfont vs iconvs_pr"/>
                          加入对比
                        </span>}
                  {followStatus === true &&
                  <span className="ip-care-status active "
                        onClick={async () => {
                          if (localStorage.getItem("user") !== null) {
                            detail.changeDetailList({ followStatus: false });
                          }
                          await this._getStatus(detail, id, 0, guid);
                        }}>
                              <i className="iconfont ic_follow iconic_praise"/>已关注
                            </span>
                  }
                  {followStatus === false &&
                  <span className="ip-care-status "
                        onClick={async () => {
                          if (localStorage.getItem("user") !== null) {
                            detail.changeDetailList({ followStatus: true });
                          }
                          await this._getStatus(detail, id, 1, guid);
                        }}>
                            <i className="iconfont ic_follow iconic_praise"/>加入关注
                          </span>
                  }
                </div>
                <Scrollbars style={{ height: 202 }}>
                  {IpArt._public(ipDetailData, ipTypeNumber)}
                </Scrollbars>
              </div>
              {this._userGuid(id, realStatus)}
            </div>
          </div>
          <div className="widget-tags">
            {!_isEmpty(ipDetailData.ipTypeNumberNames) &&
            <h5 className="area-title"><img src={ic_ip_type} alt=""/>IP类型</h5>}
            {
              !_isEmpty(ipDetailData.ipTypeNumberNames) && <ul className="ip-type flex-wrap flex-row">
                {ipDetailData.ipTypeNumberNames && ipDetailData.ipTypeNumberNames.map((i, k) => {
                  return (
                    <li key={k}>
                      <Link to="/ip-list" onClick={async () => {
                        const { ip_list } = this.props;
                        let ipTypeNumbers = ipDetailData.ipTypeNumber.replace(/(^,)/g, "");
                        ipTypeNumbers = ipTypeNumbers.split(','); // 当前三级类型

                        await ip_list.ipTypeNav(ipDetailData.mainTypeName, {
                          ipTypeSuperiorNumber: ipDetailData.ipTypeSuperiorNumber,
                          ipType: numberKV[ipDetailData.ipTypeSuperiorNumber]
                        });

                        await ip_list.otherViewSetselected({
                          nav: numberKV[ipDetailData.ipTypeSuperiorNumber],
                          show: fileKvNumber(ipDetailData.ipTypeSuperiorNumber)
                        });
                        await ip_list.otherPageSubType({
                            selectedObj: {
                              "地区": "",
                              "形式": "",
                              "性别": "",
                              "时间": "",
                              "状态": "",
                              "类型": {
                                "": false,
                                [ipTypeNumbers[k]]: true,
                              }
                            },
                            theAllId: ''
                          },
                          {
                            currentPage: 1,
                            ipTypeNumber: "," + ipTypeNumbers[k]
                          });
                      }}>{i}</Link></li>
                  );
                })}
              </ul>
            }
            {!_isEmpty(ipCaseData) && <h5 className="area-title"><img src={ic_case} alt=""/>案例</h5>}
            {ipCaseData && ipCaseData.map((i, index) => {
              return (
                <div className="ip-type ip-case flex-wrap flex-row justify-content-between hoverPinter" key={index}
                     onClick={() => {
                       this.props.history.push(`/industry-detail/${i.portalPostGuid}`);
                     }}>
                  <div className="type-img">
                    <img src={i.picUrl} alt=""/>
                  </div>
                  <div className="type-detail flex-column justify-content-between">
                    <p className="word-ellipsis" title={i.postTitle}>{i.postTitle}</p>
                    <p className="attention  flex-row justify-content-between">
                      {
                        i.isGiveLike === 1 ?
                          <span className="attention_num active iconfont ic_praise iconic_praise">
                              {i.portalPostLikeCount}
                            </span>
                          : <span className="attention_num iconfont ic_praise iconic_praise">
                              {i.portalPostLikeCount}
                            </span>
                      }
                      {
                        !!i.createDate && <span className="date ">
                            {!!i.createDate && moment(i.createDate).format('YYYY/MM/DD')}
                          </span>
                      }
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        }
        <div className="tab-container">
          <div className="tab-title justify-content-around">
            <div className="tab-title-content">
              {tabs && tabs.map((item, index) => {
                return (
                  <span key={index} className={`${currentIndex === item.id ? "active" : ""}`}
                        onClick={async () => {
                          this.setState({
                            currentIndex: item.id
                          });
                          await this._clickTab({ id: item.id });
                        }}>
                    {this._showTab(item)}
                    {item.tabName}
                    </span>
                );
              })}
            </div>
          </div>
          {/*IP相关介绍*/}
          {!_isEmpty(ipDetailData) &&
          <div className="tab-content " style={{ "display": isShow1 }}>
            {ipDetailData.ipDesc && <div className="module-box ">
              <p className="area-title"><img src={ic_content_validity} alt=""/>IP简介</p>
              <div className="area-content">
                <div className="area-words" dangerouslySetInnerHTML={{ __html: ipDetailData.ipDesc }}/>
              </div>
            </div>
            }
            {
              ipTypeNumber !== 8 && !ipDetailData.nullProdect && JSON.parse(ipDetailData.prodect).length > 0 &&
              <div className="module-box">
                <p className="area-title"><img src={ic_show} alt=""/>IP素材图库</p>
                <div className="area-content ">
                  <div className="area-box flex-row justify-content-around">
                    {JSON.parse(ipDetailData.prodect).map((v, k) => {
                      if (v.pic) {
                        let flag;
                        (v.pic).indexOf('http') === 0 ? flag = true : flag = false;
                        return (
                          <div className="box" key={k}>
                            <div className='box-con'>
                              {
                                flag === true ?
                                  <img src={`${v.pic}`} alt="" className="imgMid"/>
                                  :
                                  <img src={`${ipDetailData.picPrefix}${v.pic}`} alt="" className="imgMid"/>

                              }
                            </div>
                            <p className="word-ellipsis">{v.title} </p>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              </div>
            }
            {
              ipTypeNumber !== 8 && !ipDetailData.nullCooperationCase && JSON.parse(ipDetailData.cooperationCase).length > 0 &&
              <div className="module-box">
                <p className="area-title"><img src={ic_cooperate} alt=""/>案例</p>
                <div className="area-content">
                  <div className="area-box flex-row justify-content-around">
                    {JSON.parse(ipDetailData.cooperationCase).map((v, k) => {
                      if (v.pic) {
                        let flag;
                        (v.pic).indexOf('http') === 0 ? flag = true : flag = false;
                        // console.log((v.pic).indexOf('http'), flag);
                        return (
                          <div className="box" key={k}>
                            {
                              flag === true ?
                                <img src={`${v.pic}`} alt="" className="imgMid"/>
                                :
                                <img src={`${ipDetailData.picPrefix}${v.pic}`} alt="" className="imgMid"/>
                            }
                            <p className="word-ellipsis">{v.title} </p>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              </div>
            }
            {
              ipTypeNumber === 8 &&
              <div className="people-content">
                {
                  !_isEmpty(coBrands) &&
                  <div className="right-brand module-box">
                    <p className="area-title"><img src={ic_brand} alt=""/>合作品牌</p>
                    <div className="area-content">
                      {
                        coBrands && coBrands.split(",").map((i, k) => {
                          return (
                            <span className="word-ellipsis" key={k}>-{i}</span>
                          );
                        })
                      }
                    </div>
                  </div>
                }
                <div className="star-top-more flex-column">
                  <div className="star-div flex-row ">
                    {
                      !_isEmpty(arr) &&
                      <div className="child-star-div left-star-div  ">
                        <p className="area-title"><img src={ic_product} alt=""/>代表作品</p>
                        <div className="area-content swiper-star">
                          <Swipers options={{ ...options }}>
                            {
                              arr && arr.map((item: any, index: number) => (
                                <div key={index} className="swiper-slide  swipe-slide-area">
                                  {item && item.map((i: any, idx: number) => (
                                    <div key={idx} className="swipe-slide-custom " onClick={() => {
                                      this.props.history.push(`/detail/${i.ipTypeSuperiorNumber}/${i.ipid}`);
                                    }}>
                                      <img src={i.picUrl || default_img} alt=""/>
                                      <div className="cooperate-ip-last-line">
                                        {i.ipName}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ))
                            }
                          </Swipers>
                        </div>
                      </div>
                    }
                    {!_isEmpty(arr2) &&
                    <div className="child-star-div">
                      <p className="area-title"><img src={ic_upcomingg} alt=""/>即将上映</p>
                      <div className="area-content swiper-star right-swiper">
                        <Swipers options={{ ...options }}>
                          {
                            arr2 && arr2.map((item: any, index: number) => (
                              <div key={index} className="swiper-slide  swipe-slide-area">
                                {item && item.map((i: any, idx: number) => (
                                  <div key={idx} className="swipe-slide-custom ">
                                    <img src={i.picUrl || default_img} alt=""/>
                                    <div className="cooperate-ip-last-line">{i.ipName}</div>
                                  </div>
                                ))}
                              </div>
                            ))
                          }
                        </Swipers>
                      </div>
                    </div>
                    }
                  </div>
                </div>

              </div>
            }
            {/*   {
              !_isEmpty(ipDetailData.companyDetailVO) &&
              <div className="module-box">
                <p className='area-title'>
                  <img src={ic_Picture_details} alt=""/>
                  {ipTypeNumber === 8 ? "经纪公司介绍" : "IP所属公司介绍"}
                </p>
                <div className="area-content book-area-content flex justify-content-between">
                  {ipTypeNumber !== 8 &&
                  <img src={ipDetailData.companyDetailVO.picUrl || default_img} alt="" className="img"/>
                  }
                  <div className="img-detail">
                    <div className="title flex justify-content-between">
                      <h4>{ipDetailData.companyDetailVO.companyName}</h4>
                      <div className="button-group flex justify-content-between">
                        <button>联系他</button>
                        <button><Link to={`/company/${ipDetailData.companyDetailVO.companyGuid}`}><i
                          className="iconfont iconai44"/>查看公司主页</Link></button>
                      </div>
                    </div>
                    <p dangerouslySetInnerHTML={{ __html: ipDetailData.companyDetailVO.companyDesc }}/>
                    <div className="contact-detail flex-row justify-content-around">
                      <span><i>电话</i>：{ipDetailData.companyDetailVO.companyTelephone}</span>
                      <span><i>邮箱</i>：{ipDetailData.companyDetailVO.companyMailbox}</span>
                      <span>网址：<a></a></span>
                      <span><i>地址</i>：{ipDetailData.companyDetailVO.companyAddress}</span>
                    </div>
                  </div>
                </div>
              </div>
            }*/}
            {
              ipDetailData.detail &&
              <div className="module-box">
                <p className="area-title"><img src={ic_Picture_details} alt=""/>图文详情</p>
                <div className="area-content book-area-content">
                  <div className="area-words" dangerouslySetInnerHTML={{ __html: ipDetailData.detail }}/>
                </div>
              </div>
            }
            {Number(ipTypeNumber) > 4 && Number(ipTypeNumber) < 8 && !_isEmpty(ipPeopleList) &&
            <div className="module-box">
              <p className="area-title"><img src={ic_cnxh} alt=""/>影人相关播放量</p>
              <div className="area-content like-content">
                <div className="area-box flex-row justify-content-around">
                  {
                    ipPeopleList && ipPeopleList.map((item, index) => {
                      return (
                        <div className="box" key={index}>
                          <div className="child-box">
                            <img src={item.picUrl} alt="" className="imgMid"/>
                            <div className="hover-bg">
                              {/*<span>近三年播放量: {item.playbackVolume}</span>*/}
                              <span>微博粉丝数量: {item.postBarAttentionsNum}</span>
                              <span>贴吧关注数量: {item.weiboFansNum}</span>
                            </div>
                          </div>
                          <p>{item.ipName}</p>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            </div>
            }
            {
              !_isEmpty(ipArtLikeData) && <div className="module-box">
                <p className="area-title"><img src={ic_cnxh} alt=""/>猜你喜欢</p>
                <div className="area-content like-content">
                  <div className="area-box flex-row justify-content-around">
                    {
                      ipArtLikeData && ipArtLikeData.map((item, index) => {
                        return (
                          <div className="box" key={index}>
                            <Link to={`/detail/${item.ipTypeSuperiorNumber}/${item.ipid}`}>
                              <div className="likeDemoImgOut"><img src={item.picUrl} alt=""/></div>
                              < div className="box-name justify-content-between">
                                <p className="name word-ellipsis">{item.ipName}</p>
                                {
                                  Number(ipTypeNumber) > 4 && Number(ipTypeNumber) < 8 && !_isEmpty(item.beanScore) &&
                                  <div className="item-dou  justify-content-between align-items-center">
                                    <img src={icon_dou} alt=""/>
                                    <span className="score">{item.beanScore}</span>
                                  </div>
                                }
                              </div>
                            </Link>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              </div>
            }
          </div>
          }
          {/*基础数据-白银以上会员*/}
          {
            visibleBaseData ?
              <div className="tab-content" style={{ "display": isShow2 }}>
                <div className="module-box">
                  <p className="area-title">
                    <img src={ic_sjzl} alt=""/>
                    数据总览
                  </p>
                  {
                    !_isEmpty(userData) && visibleBaseData &&
                    <div className="area-content basic-content">
                      {
                        ipTypeNumber === 8 ?
                          <div className="basic-table">
                            <ul>
                              <li className={basicCurrent === 0 ? "active" : ""}
                                  onClick={() => {
                                    this.setState({
                                      basicCurrent: 0,
                                    });
                                  }}
                              >全网数据总览
                              </li>
                              {
                                starPlatform && starPlatform.map((li, k) => {
                                  return (
                                    <li key={k} className={basicCurrent === li.platformType ? "active" : ""}
                                        onClick={async () => {
                                          this.setState({
                                            basicCurrent: li.platformType
                                          });
                                          await this._changeTotalPlatform(li);
                                        }}
                                    >{li.platformName}数据</li>
                                  );
                                })
                              }
                            </ul>
                            {
                              basicCurrent === 0 ?
                                <div className="basic-div">
                                  <div className="basic-single">
                                    <span className="single-title">全网热度值</span>
                                    <span className="single-value">
                                  {
                                    (Number(ipTotalData.dataScreening1ValueStr) === 0 || _isEmpty(ipTotalData.dataScreening1ValueStr)) ?
                                      <span className="single-value">--</span>
                                      :
                                      <span
                                        className="single-value">{ipTotalData.dataScreening1ValueStr} {this._totalDataClass(ipTotalData.dataScreening1Status)}</span>
                                  }
                                </span>
                                  </div>
                                  <div className="basic-single">
                                    <span className="single-title">媒体指数</span>
                                    {
                                      (Number(ipTotalData.dataScreening2ValueStr) === 0 || _isEmpty(ipTotalData.dataScreening2ValueStr)) ?
                                        <span className="single-value">--</span>
                                        :
                                        <span
                                          className="single-value">{ipTotalData.dataScreening2ValueStr} {this._totalDataClass(ipTotalData.dataScreening2Status)}</span>
                                    }
                                  </div>
                                  <div className="basic-single">
                                    <span className="single-title">合作品牌数</span>
                                    {
                                      (Number(ipTotalData.dataScreening3ValueStr) === 0 || _isEmpty(ipTotalData.dataScreening3ValueStr)) ?
                                        <span className="single-value">--</span>
                                        :
                                        <span
                                          className="single-value">{ipTotalData.dataScreening3ValueStr} {this._totalDataClass(ipTotalData.dataScreening3Status)}</span>
                                    }
                                  </div>
                                  <div className="basic-single">
                                    <span className="single-title">微博粉丝数</span>
                                    {
                                      (Number(ipTotalData.dataScreening4ValueStr) === 0 || _isEmpty(ipTotalData.dataScreening4ValueStr)) ?
                                        <span className="single-value">--</span>
                                        :
                                        <span
                                          className="single-value">{ipTotalData.dataScreening4ValueStr} {this._totalDataClass(ipTotalData.dataScreening4Status)}</span>
                                    }
                                  </div>
                                </div>
                                :
                                <div className="basic-div">
                                  {
                                    starPlatformData && starPlatformData.map((i, k) => {
                                      return (
                                        <div className="basic-single" key={k}>
                                          <span className="single-title">{i.title}</span>
                                          <span className="single-value">{thousandSeparator(i.value)}</span>
                                        </div>
                                      );
                                    })
                                  }

                                  {this._noResultFun(starPlatformData)}
                                </div>
                            }
                          </div>
                          :
                          <table className="table  text-center">
                            <tbody>
                            {this._totalData(ipTypeNumber)}
                            <tr>
                              {
                                Number(ipTotalData.dataScreening1ValueStr) === 0 || _isEmpty(ipTotalData.dataScreening1ValueStr) ?
                                  <td>--</td>
                                  :
                                  <td>{ipTotalData.dataScreening1ValueStr}{this._totalDataClass(ipTotalData.dataScreening1Status)}</td>
                              }
                              {
                                Number(ipTotalData.dataScreening2ValueStr) === 0 || _isEmpty(ipTotalData.dataScreening2ValueStr) ?
                                  <td>--</td>
                                  :
                                  <td>{ipTotalData.dataScreening2ValueStr}{this._totalDataClass(ipTotalData.dataScreening2Status)}</td>
                              }
                              {
                                Number(ipTotalData.dataScreening3ValueStr) === 0 || _isEmpty(ipTotalData.dataScreening3ValueStr) ?
                                  <td>--</td>
                                  :
                                  <td>{ipTotalData.dataScreening3ValueStr}{this._totalDataClass(ipTotalData.dataScreening3Status)}</td>
                              }
                              {
                                Number(ipTotalData.dataScreening4ValueStr) === 0 || _isEmpty(ipTotalData.dataScreening3ValueStr) ?
                                  <td>--</td>
                                  :
                                  <td>{ipTotalData.dataScreening4ValueStr}{this._totalDataClass(ipTotalData.dataScreening4Status)}</td>
                              }
                            </tr>
                            </tbody>
                          </table>
                      }
                    </div>
                  }
                  {
                    !_isEmpty(userData) && !visibleBaseData &&
                    <div className='area-content hot-content' style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                      <Vip2/></div>
                  }
                  {_isEmpty(userData) &&
                  <div className="area-content fans-content "><NoLogin id={id} ipTypeNumber={ipTypeNumber}
                                                                       history={history}/></div>}
                </div>

                {
                  ipTypeNumber === 6 &&
                  <div className="module-box">
                    <p className="area-title">
                      <img src={ic_yxpf} alt=""/>
                      院线票房趋势
                    </p>
                    {
                      !_isEmpty(userData) && visibleBaseData &&
                      <div className="area-content hot-content" style={{ padding: '0.3rem 0.2rem' }}>
                        <div className="date-select">
                          {
                            // !_isEmpty(boxOfficeData) &&
                            dayStatus.boxOffice && dayStatus.boxOffice.map((item, k) => {
                              return (
                                <span className={boxOfficeDayNumber === item.dayNumber ? "checked" : ""} key={k}
                                      onClick={async () => {
                                        await this._boxOfficeDay(item);
                                      }}
                                >{item.name}</span>
                              );
                            })
                          }
                        </div>
                        <div className="clearFix"/>
                        {!_isEmpty(boxOfficeData) &&
                        <EchartDataZoomBoxOffice container="" data={boxOfficeData} date={boxOfficeDate} subtext=""/>
                        }
                        {this._noResultFun(boxOfficeData)}
                      </div>
                    }
                    {_isEmpty(userData) &&
                    <div className="area-content hot-content"><NoLogin id={id} ipTypeNumber={ipTypeNumber}
                                                                       history={history}/></div>}
                    {!_isEmpty(userData) && !visibleBaseData &&
                    <div className="area-content hot-content">
                      <Vip2/>
                    </div>}
                  </div>
                }
                {
                  (ipTypeNumber === 6 || ipTypeNumber === 5 || ipTypeNumber === 7) &&
                  <div className="module-box">
                    <p className="area-title">
                      <img src={ic_ptqs} alt=""/>
                      {ipTypeNumber === 6 ? '在线平台趋势' : '播放趋势'}
                    </p>
                    {

                      !_isEmpty(userData) && visibleBaseData &&
                      <div className="area-content hot-content">
                        <ul>
                          {
                            platform && platform.map((item, k) => {
                              return (
                                <li className={platformCurrent === item.typeId ? "active" : ""} key={k}
                                    onClick={async () => {
                                      await this._platformLi(item);
                                    }}
                                >{item.name}</li>
                              );
                            })
                          }
                        </ul>
                        <div className="date-select">
                          {
                            !broadcastNO &&
                            dayStatus.platform && dayStatus.platform.map((item, k) => {
                              return (
                                <span className={platformDayNumber === item.dayNumber ? "checked" : ""} key={k}
                                      onClick={async () => {
                                        await this._platformDay(item);
                                      }}
                                >{item.name}</span>
                              );
                            })
                          }
                        </div>
                        <div className="clearFix"/>
                        <div style={{ "display": platformCurrent === 1 ? "block" : "none" }}>
                          {!_isEmpty(userData) && broadcastNO && <NoResult/>}
                          {
                            !broadcastNO && !_isEmpty(broadcastTrendData) &&
                            <EchartDataZoomTwo container="echart-bar" data={broadcastTrendData}
                                               date={broadcastTrendDate}
                                               subtext=""/>
                          }
                        </div>
                        <div style={{ "display": platformCurrent === 2 ? "block" : "none" }}>
                          {!_isEmpty(userData) && broadcastNO && <NoResult/>}
                          {
                            !broadcastNO && !_isEmpty(broadcastTrendData) &&
                            <EchartDataZoom container="echart-bar" data={broadcastTrendData}
                                            date={broadcastTrendDate}
                                            subtext=""/>
                          }
                        </div>
                      </div>
                    }
                    {_isEmpty(userData) &&
                    <div className="area-content hot-content"><NoLogin id={id} ipTypeNumber={ipTypeNumber}
                                                                       history={history}/></div>}
                    {!_isEmpty(userData) && !visibleBaseData &&
                    <div className="area-content hot-content">
                      <Vip2/>
                    </div>}
                  </div>
                }
                {
                  (ipTypeNumber === 5 || ipTypeNumber === 7) &&
                  <div className="module-box">
                    <p className="area-title">
                      <img src={ic_ptqs} alt=""/>
                      播放平台分布
                    </p>
                    {
                      !_isEmpty(userData) && visibleBaseData &&
                      !_isEmpty(toJS(broadcastPlatformData)) && !_isEmpty(toJS(broadcastPlatformData2)) &&
                      <div className="area-content hot-content">
                        <EchartPieHollow data={toJS(broadcastPlatformData)}/>
                        <div className="right-broadcast">
                          {
                            toJS(broadcastPlatformData2) && toJS(broadcastPlatformData2).map((item, index) => {
                              return (
                                <div className="single" key={index}>
                                  <span>{item.typeName}</span>
                                  <span>累计播放量：<i>{detail.formatNum(item.dataNumber / 10000)}万</i></span>
                                  <span>占播放量的<i>{item.ratio}</i></span>
                                </div>
                              );
                            })
                          }
                        </div>
                      </div>
                    }
                    {!_isEmpty(userData) && visibleBaseData
                    && _isEmpty(toJS(broadcastPlatformData)) && _isEmpty(toJS(broadcastPlatformData2)) &&
                    <div className="area-content hot-content"><NoResult/></div>
                    }
                    {_isEmpty(userData) &&
                    <div className="area-content hot-content"><NoLogin id={id} ipTypeNumber={ipTypeNumber}
                                                                       history={history}/></div>}
                    {!_isEmpty(userData) && !visibleBaseData &&
                    <div className="area-content hot-content">
                      <Vip2/>
                    </div>}
                  </div>
                }
                {
                  (ipTypeNumber === 5 || ipTypeNumber === 6 || ipTypeNumber === 7) &&
                  <div className="module-box">
                    <p className="area-title">
                      <img src={ic_kbxx} alt=""/>
                      口碑信息
                    </p>
                    <div className="area-content movie-content hot-content">
                      {_isEmpty(userData) && <NoLogin id={id} ipTypeNumber={ipTypeNumber} history={history}/>}
                      {!_isEmpty(userData) && visibleBaseData && _isEmpty(publicPraiseData) && <NoResult/>}
                      {!_isEmpty(userData) && !visibleBaseData && <Vip2/>}
                      {!_isEmpty(userData) && !_isEmpty(userData.userGuid) && visibleBaseData &&
                      !_isEmpty(publicPraiseData) && publicPraiseData.map((item, index) => {
                        let icon = this.icon(item.typeName);
                        return (
                          <div className="cups flex justify-content-between" key={index}>
                            <img src={icon} alt=""/>
                            <div className=" score flex justify-content-between flex-column">
                              <span>{item.typeName}</span>
                              <span>{item.dataNumber}</span>
                            </div>
                          </div>
                        );
                      })
                      }
                    </div>
                  </div>
                }
                <div className="module-box">
                  <p className="area-title">
                    <img src={ic_search} alt=""/>
                    搜索基础数据
                  </p>
                  {
                    !_isEmpty(userData) && visibleBaseData &&
                    <div className="area-content hot-content">
                      <ul>
                        {
                          hot && hot.map((li, k) => {
                            return (
                              <li key={k} className={hotCurrent === li.typeId ? "active" : ""}
                                  onClick={async () => {
                                    await this._selectLi(li);
                                  }}
                              >{li.name}</li>
                            );
                          })
                        }
                      </ul>
                      <div className="date-select">
                        {
                          dayStatus.hot && dayStatus.hot.map((item, k) => {
                            return (
                              <span className={hotDayNumber === item.dayNumber ? "checked" : ""} key={k}
                                    onClick={async () => {
                                      await this._selectDay(item);
                                    }}
                              >{item.name}</span>
                            );
                          })
                        }
                      </div>
                      <div className="clearFix"/>
                      {!_isEmpty(userData.userGuid) && !_isEmpty(yHot) &&
                      <EchartBar container="echart-bar" xHot={xHot} yHot={yHot} subtext=""/>
                      }
                      {_isEmpty(yHot) && <NoResult/>}
                    </div>
                  }
                  {_isEmpty(userData) &&
                  <div className="area-content hot-content"><NoLogin id={id} ipTypeNumber={ipTypeNumber}
                                                                     history={history}/>
                  </div>}
                  {!_isEmpty(userData) && !visibleBaseData &&
                  <div className="area-content hot-content"><Vip2/></div>}
                </div>
                <div className="module-box">
                  <p className="area-title">
                    <img src={ic_hudong} alt=""/>
                    互动基础数据
                  </p>
                  {
                    !_isEmpty(userData) && visibleBaseData &&
                    <div className="area-content blog-content">
                      <ul>
                        {
                          blog && blog.map((item, k) => {
                            return (
                              <li className={blogCurrent === item.typeId ? "active" : ""} key={k}
                                  onClick={async () => {
                                    await this._selectLi(item);
                                  }}
                              >{item.name}</li>
                            );
                          })
                        }
                      </ul>
                      <div className="date-select">
                        {
                          dayStatus.blog && dayStatus.blog.map((item, k) => {
                            return (
                              <span className={blogDayNumber === item.dayNumber ? "checked" : ""} key={k}
                                    onClick={async () => {
                                      await this._selectDay(item);
                                    }}
                              >{item.name}</span>
                            );
                          })
                        }
                      </div>
                      <div className="clearFix"/>
                      {!_isEmpty(userData.userGuid) && !_isEmpty(yBlog) &&
                      <EchartLine container="echart-line2" xHot={xBlog} yHot={yBlog} subtext=""/>}
                      {_isEmpty(yBlog) && <NoResult/>}
                    </div>
                  }
                  {_isEmpty(userData) &&
                  <div className="area-content hot-content"><NoLogin id={id} ipTypeNumber={ipTypeNumber}
                                                                     history={history}/>
                  </div>}
                  {!_isEmpty(userData) && !visibleBaseData &&
                  <div className="area-content hot-content"><Vip2/></div>}
                </div>
                <div className="module-box">
                  <p className="area-title">
                    <img src={ic_media} alt=""/>
                    媒体关注基础数据
                  </p>
                  {
                    !_isEmpty(userData) && visibleBaseData &&
                    <div className="area-content media-content">
                      <ul>
                        {
                          media && media.map((item, k) => {
                            return (
                              <li className={mediaCurrent === item.typeId ? "active" : ""} key={k}
                                  onClick={async () => {
                                    await this._selectLi(item);
                                  }}
                              >{item.name}</li>
                            );
                          })
                        }
                      </ul>
                      <div className="date-select">
                        {
                          dayStatus.media && dayStatus.media.map((item, k) => {
                            return (
                              <span className={mediaDayNumber === item.dayNumber ? "checked" : ""} key={k}
                                    onClick={async () => {
                                      await this._selectDay(item);
                                    }}
                              >{item.name}</span>
                            );
                          })
                        }
                      </div>
                      <div className="clearFix"/>
                      {_isEmpty(yMedia) && <NoResult/>}
                      {!_isEmpty(userData.userGuid) && !_isEmpty(yMedia) &&
                      <EchartLine container="echart-line" xHot={xMedia} yHot={yMedia} subtext=""/>
                      }
                    </div>
                  }
                  {!_isEmpty(userData) && !visibleBaseData &&
                  <div className="area-content hot-content"><Vip2/></div>}
                  {_isEmpty(userData) &&
                  <div className="area-content hot-content"><NoLogin id={id} ipTypeNumber={ipTypeNumber}
                                                                     history={history}/></div>}
                </div>
                <div className="module-box">
                  <p className="area-title">
                    <img src={ic_follower} alt=""/>
                    粉丝趋势
                  </p>
                  {
                    !_isEmpty(userData) && visibleBaseData &&
                    <div className="area-content media-content">
                      {
                        (ipTypeNumber === 5 || ipTypeNumber === 6 || ipTypeNumber === 7) ?
                          <ul>
                            {
                              fans2 && fans2.map((item, k) => {
                                return (
                                  <li className={fansCurrent2 === item.typeId ? "active" : ""} key={k}
                                      onClick={async () => {
                                        await this._selectLi(item);
                                      }}
                                  >{item.name}</li>
                                );
                              })
                            }
                          </ul>
                          :
                          <ul>
                            {
                              fans && fans.map((item, k) => {
                                return (
                                  <li className={fansCurrent === item.typeId ? "active" : ""} key={k}
                                      onClick={async () => {
                                        this.setState({
                                          starFans: false,
                                        });
                                        await this._selectLi(item);
                                      }}
                                  >{item.name}</li>
                                );
                              })
                            }

                            {
                              !_isEmpty(starPlatform) && starPlatform.map((i, k) => {
                                return (
                                  <li key={k} className={fansCurrent === i.platformType ? "active" : ""}
                                      onClick={async () => {
                                        this.setState({
                                          fansCurrent: i.platformType,
                                          starFans: true,
                                        });
                                        await detail.changeFansLikedParams({
                                          userGuid,
                                          dataType: 1,
                                          platformType: i.platformType,
                                          type: starFansLikedParams.type,
                                          ipid: id,
                                          dayNumber: fansDayNumber,
                                        });
                                      }}
                                  >{i.platformName}粉丝数</li>
                                );
                              })
                            }
                          </ul>
                      }
                      <div className="clearFix"/>
                      <div className="date-select">
                        {
                          dayStatus.fans && dayStatus.fans.map((item, k) => {
                            return (
                              <span className={fansDayNumber === item.dayNumber ? "checked" : ""} key={k}
                                    onClick={async () => {
                                      if (!starFans) {
                                        await this._selectDay(item);
                                      } else {
                                        this.setState({
                                          fansDayNumber: item.dayNumber
                                        });
                                        await detail.changeFansLikedParams({
                                          userGuid,
                                          dataType: 1,
                                          type: starFansLikedParams.type,
                                          dayNumber: item.dayNumber,
                                        });
                                      }
                                    }}
                              >{item.name}</span>
                            );
                          })
                        }
                      </div>
                      {
                        starFans ?
                          <div className="echarts-margin">
                            <div className="u-add-tab">
                          <span
                            className={`u-add ${starFansType === 1 ? "u-add-active" : ""}`}
                            onClick={async () => {
                              detail.starFansType = 1;
                              await detail.changeFansLikedParams({
                                userGuid,
                                dataType: 1,
                                type: 1,
                              });
                            }}
                          >增量</span>
                              <span
                                className={`u-add ${starFansType === 2 ? "u-add-active" : ""}`}
                                onClick={async () => {
                                  detail.starFansType = 2;
                                  await detail.changeFansLikedParams({
                                    userGuid,
                                    dataType: 1,
                                    type: 2,
                                  });
                                }}
                              >总量</span>
                            </div>
                            {
                              !_isEmpty(userData.userGuid) && !_isEmpty(starFansData.datas) &&
                              <EchartLine container="echart-line" xHot={starFansData.xAxis} yHot={starFansData.datas}
                                          subtext=""/>
                            }
                            {this._noResultFun(starFansData.datas)}
                          </div>
                          :
                          <div className="echarts-margin">
                            {
                              !_isEmpty(userData.userGuid) && !_isEmpty(yfan) &&
                              <EchartLine container="echart-line" xHot={xfan} yHot={yfan} subtext=""/>
                            }
                            {this._noResultFun(yfan)}
                          </div>
                      }

                    </div>
                  }
                  {_isEmpty(userData) &&
                  <div className="area-content hot-content"><NoLogin id={id} ipTypeNumber={ipTypeNumber}
                                                                     history={history}/>
                  </div>}
                  {!_isEmpty(userData) && !visibleBaseData &&
                  <div className="area-content hot-content"><Vip2/></div>}
                </div>
                {
                  !_isEmpty(starPlatform) &&
                  <div className="module-box">
                    <p className="area-title">
                      <img src={ic_praised} alt=""/>
                      获赞趋势
                    </p>
                    {
                      !_isEmpty(userData) && visibleBaseData &&
                      <div className="area-content media-content">
                        <ul>
                          {
                            starPlatform.map((i, k) => {
                              return (
                                <li key={k} className={Number(starLikedTab) === i.platformType ? "active" : ""}
                                    onClick={async () => {
                                      detail.starLikedTab = i.platformType;
                                      await detail.changeFansLikedParams({
                                        userGuid,
                                        dataType: 2,
                                        platformType: i.platformType,
                                        type: starLikedType,
                                        ipid: id,
                                        dayNumber: starLikedDayNumber,
                                      });
                                    }}
                                >{i.platformName}获赞数</li>
                              );
                            })
                          }
                        </ul>
                        <div className="date-select">
                          {
                            dayStatus.fans && dayStatus.fans.map((item, k) => {
                              return (
                                <span className={starLikedDayNumber === item.dayNumber ? "checked" : ""} key={k}
                                      onClick={async () => {
                                        detail.starLikedDayNumber = item.dayNumber;
                                        await detail.changeFansLikedParams({
                                          userGuid,
                                          dataType: 2,
                                          type: starLikedType,
                                          dayNumber: item.dayNumber,
                                        });
                                      }}
                                >{item.name}</span>
                              );
                            })
                          }
                        </div>
                        <div className="u-add-tab">
                      <span
                        className={`u-add ${starLikedType === 1 ? "u-add-active" : ""}  ${starLikedTab === 7 ? "u-add-radius" : ""}`}
                        onClick={async () => {
                          detail.starLikedType = 1;
                          await detail.changeFansLikedParams({
                            userGuid,
                            dataType: 2,
                            type: 1,
                          });
                        }}
                      >增量</span>
                          <span
                            className={`u-add ${starLikedType === 2 ? "u-add-active" : ""}  ${starLikedTab === 7 ? "u-hide" : ""}`}
                            onClick={async () => {
                              detail.starLikedType = 2;
                              await detail.changeFansLikedParams({
                                userGuid,
                                dataType: 2,
                                type: 2,
                              });
                            }}
                          >总量</span>
                        </div>
                        <div className="clearFix"/>
                        {
                          !_isEmpty(starLikedData.datas) &&
                          <EchartLine container="echart-line" xHot={starLikedData.xAxis} yHot={starLikedData.datas}
                                      subtext=""/>
                        }
                        {this._noResultFun(starLikedData.datas)}
                      </div>
                    }
                    {_isEmpty(userData) &&
                    <div className="area-content hot-content"><NoLogin id={id} ipTypeNumber={ipTypeNumber}
                                                                       history={history}/>
                    </div>}
                    {!_isEmpty(userData) && !visibleBaseData &&
                    <div className="area-content hot-content"><Vip2/></div>}
                  </div>
                }
                {
                  !_isEmpty(starPlatform) &&
                  <div className="module-box">
                    <p className="area-title">
                      <img src={ic_opus} alt=""/>
                      近期作品表现
                    </p>
                    {
                      !_isEmpty(userData) && visibleBaseData &&
                      <div className="area-content media-content">
                        <ul>
                          {
                            starPlatform && starPlatform.map((item, k) => {
                              return (
                                <li className={starRecentTab === item.platformType ? "active" : ""} key={k}
                                    onClick={async () => {
                                      detail.starRecentTab = item.platformType;
                                      await detail.getStarRecentWorks({
                                        userGuid,
                                        platformType: item.platformType,
                                        ipid: id
                                      });
                                    }}
                                >{item.platformName}作品</li>
                              );
                            })
                          }
                        </ul>
                        <div className="clearFix"/>
                        {!_isEmpty(userData.userGuid) && !_isEmpty(starRecentWorksData.praisedDatas) &&
                        <EchartsLineAndBar data={starRecentWorksData}/>
                        }
                        {this._noResultFun(starRecentWorksData.praisedDatas)}
                      </div>
                    }
                    {_isEmpty(userData) &&
                    <div className="area-content hot-content"><NoLogin id={id} ipTypeNumber={ipTypeNumber}
                                                                       history={history}/>
                    </div>}
                    {!_isEmpty(userData) && !visibleBaseData &&
                    <div className="area-content hot-content"><Vip2/></div>}
                  </div>
                }
              </div>
              :
              <div  style={{ "display": isShow2 }}>
                <BasicExample type={'basic'} userGuid={userGuid} />
              </div>
          }

          {/*IP评估(黄金、钻石)*/}
          {
            visibleIP ?
              <div className="tab-content" style={{ "display": isShow3 }}>
                <div className="module-box">
                  <div className="area-title">
                    <img src={ic_follower} alt=""/>受众画像
                    <img src={icon_detail} alt="" className="icon_detail"/>
                    <span className="hover-box">含义：该数据表示此IP的用户在指定周期内年龄分布及性别对比；TGI为目标群体指数
                  算法说明：基于全网搜索数据，对此IP用户聚类分析，展示用户性别年龄分布，TGI是指定年龄（性别）中此IP用户所占比例/总体年龄（全部性别）中此IP用户所占比例</span>
                  </div>
                  {_isEmpty(userData) &&
                  <div className="area-content fans-content "><NoLogin id={id} ipTypeNumber={ipTypeNumber}
                                                                       history={history}/></div>}
                  {!_isEmpty(userData) && _isEmpty(sexData) && _isEmpty(ageData) && visibleIP &&
                  <div className="area-content fans-content "><NoResult/></div>}
                  {!_isEmpty(userData) && !visibleIP &&
                  <div className="area-content fans-content "><Vip/></div>}
                  {!_isEmpty(userData) && !_isEmpty(userData.userGuid) && visibleIP &&
                  !_isEmpty(sexData) && !_isEmpty(ageData) &&
                  <div className="area-content fans-content ">
                    {/*<EchartPie data={toJS(ipSexData)}/>*/}
                    <EchartBarDouble container="echart-bar-special2" yName='年龄占比' data={ageData} subText="年龄分布"/>
                    <div className="middleLine"/>
                    <EchartBarDouble container="echart-bar-special2" yName="性别占比" data={sexData} subText="性别分布"/>
                    {/*<EchartBarSpecial container="echart-bar-special2" subtext="年龄比例" xData={ageData}*/}
                    {/*yPercent={agePercent}/>*/}
                  </div>
                  }
                </div>
                <div className="module-box">
                  <div className="area-title">
                    <img src={ic_area} alt=""/>
                    地区分布
                    <img src={icon_detail} alt="" className="icon_detail"/>
                    <span className="hover-box"> 
                含义：该数据表示此IP的用户在指定周期内所处地域
                 算法说明：基于全网搜索数据，对此IP用户聚类分析，将用户地域省份分布排名</span>
                  </div>
                  <div className="area-content city-content">
                    <ul>
                      <li className={this.state.cityAreaNum === 1 ? "active" : ""}
                          onClick={() => {
                            this.setcityAreaNum(1);
                          }}>按省份
                      </li>
                      <li className={this.state.cityAreaNum === 2 ? "active" : ""}
                          onClick={() => {
                            this.setcityAreaNum(2);
                          }}>按区域
                      </li>
                    </ul>
                    {_isEmpty(userData) &&
                    <div className="city-tab-content "><NoLogin id={id} ipTypeNumber={ipTypeNumber} history={history}/>
                    </div>}
                    {!_isEmpty(userData) && _isEmpty(ipProvinceData) && _isEmpty(yProvince) && visibleIP &&
                    <div className="city-tab-content  "><NoResult/></div>}
                    {!_isEmpty(userData) && !visibleIP &&
                    <div className="city-tab-content "><Vip/></div>}
                    {!_isEmpty(userData) && !_isEmpty(userData.userGuid) && visibleIP
                    && !_isEmpty(ipProvinceData) && !_isEmpty(yProvince) &&
                    <div>
                      <div className="city-tab-content "
                           style={{ "display": cityAreaNum === 1 ? "inline-block" : "none" }}>
                        <EchartMap data={ipProvinceData}/>
                        <div className="middleLine"/>
                        <EchartBarSpecial2 container="echart-bar-special" subtext="" xData={xProvince}
                                           yPercent={yProvince}/>
                      </div>
                      <div className="city-tab-content "
                           style={{ "display": cityAreaNum === 2 ? "inline-block" : "none" }}>
                        <EchartMap data={ipProvinceData}/>
                        <div className="middleLine"/>
                        <EchartBarSpecial2 container="echart-bar-special1" subtext="" xData={xArea}
                                           yPercent={yArea}/>
                      </div>
                    </div>
                    }
                  </div>
                </div>
                {
                  (ipTypeNumber < 3 || ipTypeNumber === 8) &&
                  <div className="module-box">
                    <div className="area-title">
                      <img src={ic_value} alt=""/>
                      商业价值评估模型
                      <img src={icon_detail} alt="" className="icon_detail"/>
                      <span className="hover-box"> 
                 含义：大众热议指数：此IP热度指数，对全网社交平台，用户的讨论数、讨论热度，经过大数据计算，百分制表示
                 代言指数：以IP代言数量为基础数据，百分制表示
                 专业指数：IP知名度为基础数据，百分制表示
                 口碑指数：根据用户对IP的各项关键指标评价，加权计算，百分制表示
                 媒体关注度：在线媒体的关注，通过过去30天全网新闻中与此IP相关的新闻的数量来计算获得，百分制表示
                  潜力预估指数：此IP内在潜力预估，由代言指数与热度值相减</span>
                    </div>
                    <div className="area-content city-content">
                      {_isEmpty(userData) && <NoLogin id={id} ipTypeNumber={ipTypeNumber} history={history}/>}
                      {!_isEmpty(userData) && _isEmpty(businessData) && visibleIP && <NoResult/>}
                      {!_isEmpty(userData) && !visibleIP && <Vip/>}
                      {!_isEmpty(userData) && !_isEmpty(userData.userGuid) && visibleIP
                      && !_isEmpty(businessData) &&
                      <EchartsRadarBalance data={businessData} indicator={indicator} container=""/>
                      }
                    </div>
                  </div>
                }

                {
                  ipTypeNumber === 5 && ipDetailData.ipIsShow === 2 && !_isEmpty(treeData) &&
                  <div className="module-box flex-row">
                    <div className="area-title">
                      <img src={ic_score} alt=""/>
                      电视剧评分
                      <img src={icon_detail} alt="" className="icon_detail"/>
                      <span className="hover-box"> 
                含义：根据IP各构成因子（导演、主演、编剧、类型、出品公司）市场表现排名，
                    加权计算预测IP的市场表现，10分为最高评分。其中IP构成因子的市场表现
                    排名为该因子所参与的历史作品市场表现排序，百分制表示。
                </span>
                    </div>
                    <div className="area-content tv-movie-content">
                      {
                        detail.isLoading && visibleIP &&
                        <div className="blance-loading">
                          <img src={icon_load} alt=""/>
                        </div>
                      }
                      {_isEmpty(userData) && <NoLogin id={id} ipTypeNumber={ipTypeNumber} history={history}/>}
                      {!_isEmpty(userData) && !visibleIP && <Vip/>}
                      {
                        !_isEmpty(userData) && visibleIP && !_isEmpty(treeData) && !detail.isLoading &&
                        <EchartTree container="echart-tree" data={treeData}/>
                      }
                    </div>
                  </div>
                }
                {
                  ipTypeNumber === 6 && ipDetailData.ipIsShow === 2 && !_isEmpty(treeData) &&
                  <div className="module-box flex-row">
                    <div className="area-title">
                      <img src={ic_box_office} alt=""/>
                      预测票房
                      <img src={icon_detail} alt="" className="icon_detail"/>
                      <span className="hover-box"> 
                含义：根据IP各构成因子（导演、主演、编剧、类型、出品公司）市场表现排名，加权计算预测IP的票房。
                    其中IP构成因子的市场表现排名为该因子所参与的历史作品市场表现排序，百分制表示。
                </span>
                    </div>
                    <div className="area-content tv-movie-content">
                      {
                        detail.isLoading &&
                        visibleIP &&
                        <div className="blance-loading">
                          <img src={icon_load} alt=""/>
                        </div>
                      }
                      {_isEmpty(userData) && <NoLogin id={id} ipTypeNumber={ipTypeNumber} history={history}/>}
                      {!_isEmpty(userData) && !visibleIP && <Vip/>}
                      {!_isEmpty(userData) && visibleIP && !_isEmpty(treeData) && !detail.isLoading &&
                      <EchartTree container="echart-tree" data={treeData}/>
                      }
                    </div>
                  </div>
                }
                <div className="module-box flex-row justify-content-between">
                  <div className="area-title">
                    <img src={ic_wordcloud} alt=""/>
                    关键词云
                    <img src={icon_detail} alt="" className="icon_detail"/>
                    <span className="hover-box"> 
                含义：对事件、人物、品牌、地域中提取呈现提及次数最多的关键词，被提及次数越多，字号越大</span>
                  </div>
                  <div className="area-content cloud-world-content">
                    {
                      detail.isLoading &&
                      visibleIP &&
                      <div className="blance-loading">
                        <img src={icon_load} alt=""/>
                      </div>
                    }
                    {_isEmpty(userData) && <NoLogin id={id} ipTypeNumber={ipTypeNumber} history={history}/>}
                    {!_isEmpty(userData) && !visibleIP && <Vip/>}
                    {!_isEmpty(userData) && visibleIP && !_isEmpty(ipWordCloudData) && !detail.isLoading &&
                    <EchartWordcloud container="echart-worldCloud" ipWordCloudData={ipWordCloudData}/>
                    }
                    {!_isEmpty(userData) && visibleIP && _isEmpty(ipWordCloudData) && !detail.isLoading &&
                    <NoResult/>}
                  </div>
                </div>
              </div>
            :
            <div  style={{ "display": isShow3 }}>
              <BasicExample type={'appraise'} userGuid={userGuid} />
            </div>
          }

          <div className="tab-content" style={{ "display": isShow4 }}>
            <div className="no-result">
              <img src={qr_code} alt="" style={{ "width": "200px" }}/>
              <p>该模块属于内测模块 请联系客服</p>
            </div>
          </div>
        </div>
        {show &&
        <Alert message={message}
               buttonValue={this.state.buttonValue}
               onClose={() => {
                 this.setState({ show: false });
               }}
               onSubmit={() => {
                 this.props.history.push(this.state.url);
               }}
        />
        }
        {
          this.state.isPrivateLetterShow &&
          <PrivateLetter
            onClose={() => {
              this.setState({ isPrivateLetterShow: false });
            }}
            data={this.state.privateData}
          />
        }

      </div>
    );
  }
}
