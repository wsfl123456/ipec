import * as React from "react";
import { Link } from "react-router-dom";
import EchartMap from "@components/echart_map";
import EchartBarSpecial2 from "@components/echart_bar_special2";
import EchartWordcloud from "@components/echart_wordcloud";
import ic_ip_type from "@assets/images/ip_detail/ic_ip_type.svg";
import ic_case from "@assets/images/ip_detail/ic_case.svg";
import ic_value from "@assets/images/ip_detail/ic_value.svg";
import ic_area from "@assets/images/ip_detail/ic_area.svg";
import ic_follower from "@assets/images/ip_detail/ic_follower.svg";
import ic_wordcloud from "@assets/images/ip_detail/ic_wordcloud.svg";
import "@assets/fonts2.0/iconfont.css";
import moment from "moment";
import { inject, observer } from "mobx-react";
import _isFunc from "lodash/isFunction";
import EchartsRadarBalance from "@components/echart_radar_balance";
import qr_code from "@assets/images/about/qr_code.png";
import _isArray from "lodash/isArray";
import _chunk from "lodash/chunk";
import _isEmpty from "lodash/isEmpty";
import topFun from "../components/detail-top-public";
import _ from "lodash";
import Scrollbars from "react-custom-scrollbars";
import ic_score from "@assets/images/ip_detail/ic_grade.svg";
import ic_box_office from "@assets/images/ip_detail/ic_box_office.svg";
import douban from "@assets/images/ip_detail/douban.png";
import iqiyi from "@assets/images/ip_detail/iqiyi_logo.png";
import leshi from "@assets/images/ip_detail/LeTV_logo.png";
import mangguo from "@assets/images/ip_detail/mangguo.png";
import tengxun from "@assets/images/ip_detail/tengxun.png";
import youku from "@assets/images/ip_detail/youku.png";
import { setContact, deletContact } from "@utils/util";
import Alert from "@components/alert";
import NoResult from "@pages/detail/components/no-result";
import PrivateLetter from "@pages/detail/components/private-letter";
import icon_load from "@assets/images/update/timg.gif";
import EchartBarDouble from "@components/echart_bar_double";
import icon_detail from "@assets/images/ip_detail/how.png";
import EchartTree from "@components/echart_tree";
import { BasicExample, BasicTab, IntroductionTab } from "@pages/detail/components/index";
import Ic_clear from "@assets/images/vip-card/ic_clear.svg";
import Reminder from "@assets/images/vip-card/reminder.png";
import Toast from "@components/toast";
import detail from "@pages/detail/store";
import diyShow from '@utils/util';

function fileKvNumber(number) {
  return !(
    Number(number) === 1 ||
    Number(number) === 2 ||
    Number(number) === 8
  );
}

interface IIpArtProps extends IComponentProps {
  id: number;
  history?: any;
  ipTypeNumber: number;
}

interface IIpArtState {
  currentIndex: number;
  tabs: any[];
  cityAreaNum: number;
  hotCurrent: number;
  blogCurrent: number;
  mediaCurrent: number;
  platformCurrent: number;
  fansDayNumber: number;
  fansCurrent: number;
  fansCurrent2: number;

  hotDayNumber: number;
  blogDayNumber: number;
  mediaDayNumber: number;
  platformDayNumber: number;
  boxOfficeDayNumber: number;
  flag: boolean;
  show: boolean;
  message: string;
  certification: boolean;
  compareFlag: boolean;
  loginMessage: string;
  loginShow: boolean;
  url: any;
  buttonValue: string;
  isPrivateLetterShow: boolean;
  privateData: any;

  basicCurrent: string | number;
  starFans: boolean; //  名人明星(粉丝趋势）新增动态平台显示
  showDeduction: boolean;
  showToast: boolean;
  toastMsg: string;
}

@inject("detail", "ip_list", "login")
@observer
export default class IpArt extends React.Component<IIpArtProps, IIpArtState> {
  constructor(props) {
    super(props);

    this.state = {
      loginMessage: "",
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
      buttonValue: "",
      isPrivateLetterShow: false,
      privateData: {},

      basicCurrent: 0,
      starFans: false,
      showDeduction: false,
      showToast: false,
      toastMsg: "",
    };
  }

  componentDidUpdate(
    prevProps: Readonly<IIpArtProps>,
    prevState: Readonly<IIpArtState>,
    snapshot?: any
  ) {
    if (prevProps.id !== this.props.id) {
      location.reload();
    }
  }

  // 数据总览  ip相关 切换
  _showTab(item: any) {
    if (item.id === 2) {
      return <i className="iconfont ic_data iconic_data"/>;
    } else if (item.id === 1) {
      return <i className="iconfont ic_ip_introduce iconic_ip_introduce"/>;
    } else if (item.id === 3) {
      return <i className="iconfont iconestimate estimate"/>;
    } else {
      return <i className="iconfont iconcalculate calculate"/>;
    }
  }

  async getBaseData() {
    const { detail, id: ipid, ipTypeNumber, login } = this.props;
    const { userGuid } = login.userInfo || { userGuid: "" };
    let isFilmTv = ipTypeNumber === 5 || ipTypeNumber === 6 || ipTypeNumber === 7;
    // 基础数据
    // list
    await detail.getBasicData({
      userGuid,
      ipid,
      ipTypeSuperiorNumber: ipTypeNumber,
      moduleNumber: 8, // 数据总览
      platformNumber: ''
    });
    // tabs
    if (isFilmTv) {
      await detail.getBasicPlatformList({ userGuid, ipid, moduleNumber: 1 });
      // 在线平台趋势
      await detail.getBasicData({
        userGuid,
        ipid,
        ipTypeSuperiorNumber: ipTypeNumber,
        moduleNumber: 1,
        type: 1,
      });

      // 口碑
      await detail.getBasicData({
        userGuid,
        ipid,
        ipTypeSuperiorNumber: ipTypeNumber,
        moduleNumber: 9,
        platformNumber: ''
      });

    }
    await detail.getBasicPlatformList({ userGuid, ipid, moduleNumber: 2 });
    await detail.getBasicData({
      userGuid,
      ipid,
      ipTypeSuperiorNumber: ipTypeNumber,
      moduleNumber: 2, // 衍生品销售数据
    });

    await detail.getBasicPlatformList({ userGuid, ipid, moduleNumber: 3 });
    await detail.getBasicData({
      userGuid,
      ipid,
      ipTypeSuperiorNumber: ipTypeNumber,
      moduleNumber: 3, // 社交
    });

    await detail.getBasicPlatformList({ userGuid, ipid, moduleNumber: 4 });
    await detail.getBasicData({
      userGuid,
      ipid,
      ipTypeSuperiorNumber: ipTypeNumber,
      moduleNumber: 4, // 粉丝
    });

    await detail.getBasicPlatformList({ userGuid, ipid, moduleNumber: 5 });
    await detail.getBasicData({
      userGuid,
      ipid,
      ipTypeSuperiorNumber: ipTypeNumber,
      moduleNumber: 5, // 社交平台近期作品
    });

    await detail.getBasicPlatformList({ userGuid, ipid, moduleNumber: 6 });
    await detail.getBasicData({
      userGuid,
      ipid,
      ipTypeSuperiorNumber: ipTypeNumber,
      moduleNumber: 6, // 搜索
    });

    await detail.getBasicPlatformList({ userGuid, ipid, moduleNumber: 7 });
    await detail.getBasicData({
      userGuid,
      ipid,
      ipTypeSuperiorNumber: ipTypeNumber,
      moduleNumber: 7, // 媒体关注
    });

    if (ipTypeNumber === 6) {
      // 电影 票房
      await detail.getBasicPlatformList({ userGuid, ipid, moduleNumber: 8 }); // 时间下拉菜单
      await detail.getBasicData({
        userGuid,
        ipid,
        ipTypeSuperiorNumber: ipTypeNumber,
        moduleNumber: 10,
        platformNumber: ''
      });
    }

  }

  async getIp() {
    const { detail, id: ipid, ipTypeNumber, login } = this.props;
    const { userGuid } = login.userInfo || { userGuid: "" };
    let type = null;

    await detail.getAgeSexData({ userGuid, ipid, typeId: 1 });
    await detail.getAgeSexData({ userGuid, ipid, typeId: 2 });
    await detail.getFansAreaData({ userGuid, ipid, typeId: 3 });
    await detail.getFansAreaData({ userGuid, ipid, typeId: 4 });
    if (ipTypeNumber === 8) {
      type = "people";
    }
    // 预测评分 预测票房
    if (
      detail.ipDetailData.ipIsShow === 2 &&
      (ipTypeNumber === 5 || ipTypeNumber === 6)
    ) {
      await detail.getScoreAndBoxOffice({ ipid });
    }
    await detail.getBusinessData(
      { userGuid, ipid, ipTypeSuperiorNumber: ipTypeNumber },
      type
    );
    await detail.getWordData({ userGuid, ipid, wordType: 1 });
  }

  async sureDeduction() {
    const { detail, id: ipids } = this.props;
    this.setState({
      showDeduction: false,
      currentIndex: +localStorage.getItem("curIndex"),
    });
    localStorage.removeItem("curIndex");

    setTimeout(async () => {
      const { errorCode, errorMsg } = await detail.getConsumptionToken({
        type: this.state.currentIndex - 1,
        ipids
      });
      if (+errorCode === 200) {
        if (+this.state.currentIndex === 2) {
          this.getBaseData();
        } else {
          this.getIp();
        }
      } else {
        this.setState({
          showToast: true,
          toastMsg: errorMsg,
        });
      }
    });
  }

  // 切换基础和评估数据
  async _clickTab(item: any) {

    if (item.id === 1 || item.id === 4) {
      this.setState({
        currentIndex: item.id,
      });
    } else {
      localStorage.setItem("curIndex", item.id);
    }
    const { detail, login, id: ipids } = this.props;
    const { userGuid } = login.userInfo || { userGuid: '' };
    let flag = false;
    if (item.id === 2 || item.id === 3){
      flag = true;
    }
    if (!userGuid && flag){

      this.setState({
        currentIndex: +localStorage.getItem("curIndex"),
      });
      localStorage.removeItem("curIndex");
      return false;
    }
    if (item.id === 2) {
      const { data, errorCode, errorMsg } = await detail.getIsDeduction({
        type: 1,
        ipids
      });
      if (+errorCode === 200) {
        switch (+data) {
          case 0:
            this.setState({
              currentIndex: +localStorage.getItem("curIndex"),
            });
            localStorage.removeItem("curIndex");
            break;
          case 1:
            const { errorCode, errorMsg } = await detail.getConsumptionToken({
              type: 1,
              ipids
            });
            this.setState({
              currentIndex: +localStorage.getItem("curIndex"),
            });
            localStorage.removeItem("curIndex");
            if (+errorCode === 200) {
              this.getBaseData();
            } else {
              this.setState({
                showToast: true,
                toastMsg: errorMsg,
              });
            }
            ;
            break;
          case 2:
            this.setState({ showDeduction: true });
            break;
          default:
            break;
        }
      } else {
        this.setState({
          showToast: true,
          toastMsg: errorMsg,
        });
        this.setState({
          currentIndex: +localStorage.getItem("curIndex"),
        });
        localStorage.removeItem("curIndex");
      }
    } else if (item.id === 3) {
      const { data, errorCode, errorMsg } = await detail.getIsDeduction({
        type: 2,
        ipids
      });
      if (+errorCode === 200) {
        switch (+data) {
          case 0:
            console.log(888);

            this.setState({
              currentIndex: +localStorage.getItem("curIndex"),
            });
            localStorage.removeItem("curIndex");
            break;
          case 1:
            const { errorCode, errorMsg } = await detail.getConsumptionToken({
              type: 2,
              ipids
            });
            this.setState({
              currentIndex: +localStorage.getItem("curIndex"),
            });
            localStorage.removeItem("curIndex");
            if (+errorCode === 200) {
              this.getIp();
            } else {
              this.setState({
                showToast: true,
                toastMsg: errorMsg,
              });
            }
            ;
            break;
          case 2:
            this.setState({ showDeduction: true });
            break;
          default:
            break;
        }
      } else {
        this.setState({
          showToast: true,
          toastMsg: errorMsg,
        });
        this.setState({
          currentIndex: +localStorage.getItem("curIndex"),
        });
        localStorage.removeItem("curIndex");
      }
    }
  }

  // 关注 判断
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

  // 省份/区域 tab切换
  setcityAreaNum(num) {
    this.setState({
      cityAreaNum: num,
    });
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
    let message,
      url,
      buttonValue,
      userData = login.userInfo;
    const { userGuid: companyGuid } = ipDetailData.companyDetailVO  || { userGuid: "" };
    const { userGuid } = userData || { userGuid: "" };

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
        {!_isEmpty(ipDetailData.companyDetailVO) && companyGuid !== userGuid && (
          <button
            onClick={() => {
              if (userData === null) {
                message = "您还未登陆,请先登陆后进行实名认证";
                url = "/login";
                buttonValue = "去登录";
                localStorage.setItem(
                  "historyUrl",
                  `detail/${ipTypeNumber}/${ipid}`
                );
                this._state(message, url, buttonValue);
              } else {
                this.setState({
                  isPrivateLetterShow: true,
                  privateData: {
                    ...this.state.privateData,
                    userGuid: userData["userGuid"],
                    companyDetailVO: ipDetailData.companyDetailVO,
                  },
                });
              }
            }}
            className="btn edit-btn-edit justify-content-center align-items-center"
          >
            <span>私信</span>
          </button>
        )}
        {!_isEmpty(ipDetailData.companyDetailVO) && (
          <button
            onClick={() => {
              this.props.history.push(
                `/business-homepage/${ipDetailData.companyDetailVO["userGuid"]}`
              );
            }}
            className="btn edit-btn-upload justify-content-center align-items-center with-margin-left-20 upload-work"
          >
            <span>查看企业主页</span>
          </button>
        )}
        <button
          onClick={() => {
            if (userData === null || Number(realStatus) !== 1) {
              if (userData === null) {
                message = "您还未登陆,请先登陆后进行实名认证";
                url = "/login";
                buttonValue = "去登录";
                localStorage.setItem(
                  "historyUrl",
                  `detail/${ipTypeNumber}/${ipid}`
                );
              } else {
                message = "您还未认证,请先进行认证";
                url = "/user/2";
                buttonValue = "去认证";
              }
              this._state(message, url, buttonValue);
            } else {
              this.callbackChildModel(true);
            }
          }}
          className={
            !_isEmpty(ipDetailData.companyDetailVO)
              ? "btn edit-btn-download justify-content-center align-items-center with-margin-left-20 upload_data"
              : "btn edit-btn-download justify-content-center align-items-center upload_data"
          }
        >
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

  _findipids = () => {
    const { contastList } = this.props;
    let istrue = false;
    if (!!contastList) {
      contastList.map((val) => {
        if (val.ipids === this.props.detail.ipDetailData.ipid) {
          istrue = true;
        }
      });
    }
    return istrue;
  };

  render() {
    const {
      tabs,
      currentIndex,
      cityAreaNum,
      show,
      message,
    } = this.state;
    const {
      detail,
      id,
      ipTypeNumber,
      callbackcontastList,
      contastList,
      login,
    } = this.props;
    const { userGuid } = login.userInfo || { userGuid: "" };
    const {
      ipDetailData,
      detailList: {
        ipArtLikeData,
        ipCaseData,
        ipWordCloudData,
        ipProvinceData,
        xProvince,
        yProvince,
        xArea,
        yArea,
        ipPeopleList,
        followStatus,
      },
      starList: { repProductionList, coBrands, upcomingProductionList },
      businessData,
      indicator,
      ageData,
      sexData,
      treeData,
      baseConsumptionToken,
      assessConsumptionToken,
    } = detail;
    console.log('哈哈+',ipDetailData);
    let isShow1 = currentIndex === 1 ? "block" : "none";
    let isShow2 = currentIndex === 2 ? "block" : "none";
    let isShow3 = currentIndex === 3 ? "block" : "none";
    let isShow4 = currentIndex === 4 ? "block" : "none";
    let options: object = {
      effect: "slide",
      pagination: ".swiper-pagination",
      loop: false,
      nextButton: ".swiper-button-next",
      prevButton: ".swiper-button-prev",
    };
    let arr: any[] = [];
    let arr2: any[] = [];

    if (_isArray(repProductionList) || _isArray(upcomingProductionList)) {
      arr = _chunk(repProductionList, 4);
      arr2 = _chunk(upcomingProductionList, 2);

      if (arr.length > 4 || arr2.length > 2) {
        options = {
          effect: "slide",
          loop: true,
          pagination: null,
          nextButton: ".swiper-button-next",
          prevButton: ".swiper-button-prev",
          autoplay: false,
        };
      } else if (arr.length < 4 || arr2.length < 2) {
        options = {
          effect: "slide",
          pagination: null,
          autoplay: false,
        };
      }
    }
    // 认证状态，会员等级：0=>普通会员，1=》认证会员,2=》黄金会员，3=》钻石会员
    // 老的权限规则
    let realStatus,
      memberLevel: number = 0,
      userData = login.userInfo;
    if (!_isEmpty(userData)) {
      realStatus = userData.realStatus || userData.companyRealStatus;
      memberLevel = userData.memberLevel;
    }

    // 认证状态，会员等级：1=》白银会员,2=》黄金会员，3=》钻石会员
    // 新的权限规则
    const baseDataArrr = [",1,", ",2,", ",3,", ",10,"];
    const visibleBaseData =
      !_isEmpty(userData) &&
      baseDataArrr.some(
        (e: string) => login.userInfo.userJurisdiction.indexOf(e) !== -1
      );

    const IPArr = [",2,", ",3,", ",9,"];
    const visibleIP =
      !_isEmpty(userData) &&
      IPArr.some(
        (e: string) => login.userInfo.userJurisdiction.indexOf(e) !== -1
      );

    const contrastArr = [",3,", ",6,"];
    const visibleContrastArr =
      !_isEmpty(userData) &&
      contrastArr.some(
        (e: string) => login.userInfo.userJurisdiction.indexOf(e) !== -1
      );

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
              <span className="tag">{diyShow.detailNumberKV[ipTypeNumber]}</span>
            </div>
            <div className="detail-base-text-area">
              <div className="first-line flex-row align-items-end justify-content-between ">
                  <span
                    className="ip-title word-ellipsis"
                    title={ipDetailData.ipName}
                  >
                    {ipDetailData.ipName}
                  </span>
                {this._findipids() ? (
                  <span
                    className="ip-care-status ip-compare-status active"
                    onClick={async () => {
                      deletContact(ipDetailData.ipid);
                      callbackcontastList(
                        JSON.parse(localStorage.getItem("contastList"))
                      );
                    }}
                  >
                      <i className="iconfont vs iconvs_pr"/>
                      已加入对比
                    </span>
                ) : (
                  <span
                    className="ip-care-status ip-compare-status "
                    onClick={async () => {
                      let _ipNumber = JSON.parse(
                        localStorage.getItem("ipTypeSuperiorNumber")
                      );
                      let _nowIpNumber = ipDetailData.ipTypeSuperiorNumber;
                      if (_ipNumber === _nowIpNumber || _ipNumber === null) {
                        if (contastList !== null && contastList.length >= 3) {
                          this.setState({
                            show: true,
                            message: "同时最多添加三种对比",
                          });
                        } else {
                          setContact(
                            {
                              name: ipDetailData.ipName,
                              ipids: Number(ipDetailData.ipid),
                            },
                            _nowIpNumber
                          );
                          callbackcontastList(
                            JSON.parse(localStorage.getItem("contastList"))
                          );
                        }
                      } else {
                        this.setState({
                          show: true,
                          message: "类别不一样，不能进行对比",
                        });
                      }
                    }}
                  >
                      <i className="iconfont vs iconvs_pr"/>
                      加入对比
                    </span>
                )}
                {followStatus && (
                  <span
                    className="ip-care-status active "
                    onClick={async () => {
                      if (localStorage.getItem("user") !== null) {
                        detail.changeDetailList({ followStatus: false });
                      }
                      await this._getStatus(detail, id, 0, guid);
                    }}
                  >
                      <i className="iconfont ic_follow iconic_praise"/>
                      已关注
                    </span>
                )}
                {!followStatus && (
                  <span
                    className="ip-care-status "
                    onClick={async () => {
                      if (localStorage.getItem("user") !== null) {
                        detail.changeDetailList({ followStatus: true });
                      }
                      await this._getStatus(detail, id, 1, guid);
                    }}
                  >
                      <i className="iconfont ic_follow iconic_praise"/>
                      加入关注
                    </span>
                )}
              </div>
              <Scrollbars style={{ height: 212 }}>
                {IpArt._public(ipDetailData, ipTypeNumber)}
              </Scrollbars>
              {this._userGuid(id, realStatus)}
            </div>
          </div>
          <div className="widget-tags">
            {!_isEmpty(ipDetailData.ipTypeNumberNames) && (
              <h5 className="area-title">
                <img src={ic_ip_type} alt=""/>
                IP类型
              </h5>
            )}
            {!_isEmpty(ipDetailData.ipTypeNumberNames) && (
              <ul className="ip-type flex-wrap flex-row">
                {ipDetailData.ipTypeNumberNames &&
                ipDetailData.ipTypeNumberNames.map((i, k) => {
                  return (
                    <li key={k}>
                      <Link
                        to="/ip-list"
                        onClick={async () => {
                          const { ip_list } = this.props;
                          let ipTypeNumbers = ipDetailData.ipTypeNumber.replace(
                            /(^,)/g,
                            ""
                          );
                          ipTypeNumbers = ipTypeNumbers.split(","); // 当前三级类型

                          await ip_list.ipTypeNav(
                            ipDetailData.mainTypeName,
                            {
                              ipTypeSuperiorNumber:
                              ipDetailData.ipTypeSuperiorNumber,
                              ipType:
                                diyShow.detailNumberKV[ipDetailData.ipTypeSuperiorNumber],
                            }
                          );

                          await ip_list.otherViewSetselected({
                            nav:
                              diyShow.detailNumberKV[ipDetailData.ipTypeSuperiorNumber],
                            show: fileKvNumber(
                              ipDetailData.ipTypeSuperiorNumber
                            ),
                          });
                          await ip_list.otherPageSubType(
                            {
                              selectedObj: {
                                地区: "",
                                形式: "",
                                性别: "",
                                时间: "",
                                状态: "",
                                类型: {
                                  "": false,
                                  [ipTypeNumbers[k]]: true,
                                },
                              },
                              theAllId: "",
                            },
                            {
                              currentPage: 1,
                              ipTypeNumber: "," + ipTypeNumbers[k],
                            }
                          );
                        }}
                      >
                        {i}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
            {!_isEmpty(ipCaseData) && (
              <h5 className="area-title">
                <img src={ic_case} alt=""/>
                案例
              </h5>
            )}
            {ipCaseData &&
            ipCaseData.map((i, index) => {
              return (
                <div
                  className="ip-type ip-case flex-wrap flex-row justify-content-between hoverPinter"
                  key={index}
                  onClick={() => {
                    this.props.history.push(
                      `/industry-detail/${i.portalPostGuid}`
                    );
                  }}
                >
                  <div className="type-img">
                    <img src={i.picUrl} alt=""/>
                  </div>
                  <div className="type-detail flex-column justify-content-between">
                    <p className="word-ellipsis" title={i.postTitle}>
                      {i.postTitle}
                    </p>
                    <p className="attention  flex-row justify-content-between">
                      {i.isGiveLike === 1 ? (
                        <span className="attention_num active iconfont ic_praise iconic_praise">
                              {i.portalPostLikeCount}
                            </span>
                      ) : (
                        <span className="attention_num iconfont ic_praise iconic_praise">
                              {i.portalPostLikeCount}
                            </span>
                      )}
                      {!!i.createDate && (
                        <span className="date ">
                              {!!i.createDate &&
                              moment(i.createDate).format("YYYY/MM/DD")}
                            </span>
                      )}
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
                          await this._clickTab({ id: item.id });
                        }}
                  >
                      {this._showTab(item)}
                    {item.tabName}
                    </span>
                );
              })}
            </div>
          </div>
          {/*IP相关介绍*/}
          {
            !_isEmpty(ipDetailData) &&
            <IntroductionTab isShow1={isShow1}
                             ipDetailData={ipDetailData} ipTypeNumber={ipTypeNumber}
                             coBrands={coBrands} ipPeopleList={ipPeopleList} ipArtLikeData={ipArtLikeData}
                             arr={arr} arr2={arr2} options={options} history={history}
            />
          }
          {/*基础数据-白银以上会员*/}
          {visibleBaseData || !!baseConsumptionToken ?
            <BasicTab ipTypeNumber={ipTypeNumber} isShow2={isShow2} id={id}/>
            :
            <div style={{ display: isShow2 }}>
              <BasicExample type={"basic"} userGuid={userGuid}/>
            </div>
          }

          {/*IP评估(黄金、钻石)*/}
          {visibleIP || !!assessConsumptionToken ? (
            <div className="tab-content" style={{ display: isShow3 }}>
              {
                !_isEmpty(sexData) && !_isEmpty(ageData) &&
                <div className="module-box">
                  <div className="area-title">
                    <img src={ic_follower} alt=""/>
                    受众画像
                    <img src={icon_detail} alt="" className="icon_detail"/>
                    <span className="hover-box">
                    含义：该数据表示此IP的用户在指定周期内年龄分布及性别对比；TGI为目标群体指数
                    算法说明：基于全网搜索数据，对此IP用户聚类分析，展示用户性别年龄分布，TGI是指定年龄（性别）中此IP用户所占比例/总体年龄（全部性别）中此IP用户所占比例
                  </span>
                  </div>
                  <div className="area-content fans-content ">
                    <EchartBarDouble
                      container="echart-bar-special2"
                      yName="年龄占比"
                      data={ageData}
                      subText="年龄分布"
                    />
                    <div className="middleLine"/>
                    <EchartBarDouble
                      container="echart-bar-special2"
                      yName="性别占比"
                      data={sexData}
                      subText="性别分布"
                    />
                  </div>
                </div>
              }
              <div className="module-box">
                <div className="area-title">
                  <img src={ic_area} alt=""/>
                  地区分布
                  <img src={icon_detail} alt="" className="icon_detail"/>
                  <span className="hover-box">
                      含义：该数据表示此IP的用户在指定周期内所处地域
                     算法说明：基于全网搜索数据，对此IP用户聚类分析，将用户地域省份分布排名
                  </span>
                </div>
                <div className="area-content city-content">
                  <ul>
                    <li
                      className={this.state.cityAreaNum === 1 ? "active" : ""}
                      onClick={async () => {
                        this.setcityAreaNum(1);
                        await detail.getFansAreaData({ userGuid, ipid: id, typeId: 3 });
                      }}
                    >
                      按省份
                    </li>
                    <li
                      className={this.state.cityAreaNum === 2 ? "active" : ""}
                      onClick={async () => {
                        this.setcityAreaNum(2);
                        await detail.getFansAreaData({ userGuid, ipid: id, typeId: 4 });
                      }}
                    >
                      按区域
                    </li>
                  </ul>
                  {!_isEmpty(ipProvinceData) && !_isEmpty(yProvince) ? (
                    <div>
                      <div
                        className="city-tab-content "
                        style={{
                          display: cityAreaNum === 1 ? "inline-block" : "none",
                        }}
                      >
                        <EchartMap data={ipProvinceData}/>
                        <div className="middleLine"/>
                        <EchartBarSpecial2
                          container="echart-bar-special"
                          subtext=""
                          xData={xProvince}
                          yPercent={yProvince}
                        />
                      </div>
                      <div
                        className="city-tab-content "
                        style={{
                          display: cityAreaNum === 2 ? "inline-block" : "none",
                        }}
                      >
                        <EchartMap data={ipProvinceData}/>
                        <div className="middleLine"/>
                        <EchartBarSpecial2
                          container="echart-bar-special1"
                          subtext=""
                          xData={xArea}
                          yPercent={yArea}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="city-tab-content  ">
                      <NoResult/>
                    </div>
                  )}
                </div>
              </div>
              {(ipTypeNumber < 3 || ipTypeNumber === 8) && (
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
                      潜力预估指数：此IP内在潜力预估，由代言指数与热度值相减
                    </span>
                  </div>
                  <div className="area-content city-content" style={{ paddingTop: '0.4rem' }}>
                    {!_isEmpty(businessData) ? (
                      <EchartsRadarBalance
                        data={businessData}
                        indicator={indicator}
                        container=""
                      />
                    ) : (
                      <NoResult/>
                    )}
                  </div>
                </div>
              )}

              {ipTypeNumber === 5 &&
              ipDetailData.ipIsShow === 2 &&
              !_isEmpty(treeData) && (
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
                    {detail.isLoading && (
                      <div className="blance-loading">
                        <img src={icon_load} alt=""/>
                      </div>
                    )}
                    {!_isEmpty(treeData) && !detail.isLoading && (
                      <EchartTree container="echart-tree" data={treeData}/>
                    )}
                  </div>
                </div>
              )}
              {ipTypeNumber === 6 &&
              ipDetailData.ipIsShow === 2 &&
              !_isEmpty(treeData) && (
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
                    {detail.isLoading && (
                      <div className="blance-loading">
                        <img src={icon_load} alt=""/>
                      </div>
                    )}
                    {!_isEmpty(treeData) && !detail.isLoading && (
                      <EchartTree container="echart-tree" data={treeData}/>
                    )}
                  </div>
                </div>
              )}
              {
                !_isEmpty(ipWordCloudData) &&
              <div className="module-box flex-row justify-content-between">
                <div className="area-title">
                  <img src={ic_wordcloud} alt=""/>
                  关键词云
                  <img src={icon_detail} alt="" className="icon_detail"/>
                  <span className="hover-box">
                    含义：对事件、人物、品牌、地域中提取呈现提及次数最多的关键词，被提及次数越多，字号越大
                  </span>
                </div>
                <div className="area-content cloud-world-content">
                  {detail.isLoading && (
                    <div className="blance-loading">
                      <img src={icon_load} alt=""/>
                    </div>
                  )}
                  {!_isEmpty(ipWordCloudData) && !detail.isLoading && (
                    <EchartWordcloud
                      container="echart-worldCloud"
                      ipWordCloudData={ipWordCloudData}
                    />
                  )}
                 {/* {_isEmpty(ipWordCloudData) && !detail.isLoading && (
                    <NoResult/>
                  )}*/}
                </div>
              </div>
              }
            </div>
          ) : (
            <div style={{ display: isShow3 }}>
              <BasicExample type={"appraise"} userGuid={userGuid}/>
            </div>
          )}

          <div className="tab-content" style={{ display: isShow4 }}>
            <div className="no-result">
              <img src={qr_code} alt="" style={{ width: "200px" }}/>
              <p>该模块属于内测模块 请联系客服</p>
            </div>
          </div>
        </div>
        {show && (
          <Alert
            message={message}
            buttonValue={this.state.buttonValue}
            onClose={() => {
              this.setState({ show: false });
            }}
            onSubmit={() => {
              this.props.history.push(this.state.url);
            }}
          />
        )}
        {this.state.isPrivateLetterShow && (
          <PrivateLetter
            onClose={() => {
              this.setState({ isPrivateLetterShow: false });
            }}
            data={this.state.privateData}
          />
        )}

        {this.state.showDeduction && (
          <div className="show-deduction">
            <div className="area">
              <div className="clear">
                <img
                  src={Ic_clear}
                  onClick={() => {
                    this.setState({ showDeduction: false });
                    localStorage.removeItem("curIndex");
                  }}
                  alt=""
                />
              </div>
              <div className="content">
                <img src={Reminder} alt=""/>
                <div className="msg">扣费提醒</div>
                <div className="tip">
                  该数据属于会员权限数据，本次查看将从您的vip储值卡中扣除
                  {+localStorage.getItem("curIndex") === 2 ? 5 : 50}元
                  是否继续查看？
                </div>
              </div>
              <div className="btn-group">
                <div
                  className="btn_default_fl"
                  onClick={() => {
                    this.setState({ showDeduction: false });
                    localStorage.removeItem("curIndex");
                  }}
                >
                  取消
                </div>
                <div
                  className="btn_primary_fl"
                  onClick={() => {
                    this.sureDeduction();
                  }}
                >
                  确认查看
                </div>
              </div>
            </div>
          </div>
        )}
        {this.state.showToast && (
          <Toast
            onClose={() => {
              this.setState({ showToast: false });
            }}
            duration={2}
            message={this.state.toastMsg}
          />
        )}
      </div>
    );
  }
}
