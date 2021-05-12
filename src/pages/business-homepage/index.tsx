import * as React from "react";
import { inject, observer } from "mobx-react";
import ScrollTop from "@components/scroll-top";
import { Link } from 'react-router-dom';
import { message, Modal, Input, Tabs, Icon, Radio } from 'antd';
import {
  sendPrivateLetter,
  staffJoinCompany,
  setPortalPostLike, invitationSave, invitePersonalTime,
} from '@utils/api';
import _isEmpty from 'lodash/isEmpty';

const { TabPane } = Tabs;
const { TextArea } = Input;
import auth from "../../assets/images/user/attestation.svg";
import ic_hjhy from '@assets/images/user/ic_hjhy.svg';
import ic_zshy from '@assets/images/user/ic_zshy.svg';
import ic_location0805 from "../../assets/images/ic_location0805.png";
import default_img_ip from "@assets/images/user.svg";
import ic_no_result from "@assets/images/contrast/ic_result_iveness.png";
import default_img from '@assets/images/default/ic_default_shu.png';
import silverNoCircle from '@assets/images/user/silver--no_circle.png';
import icon_load from "@assets/images/update/timg.gif";
import DateTimePicker from "@components/date-time-picker";
import "@assets/scss/business_homepage.scss";
import 'swiper/dist/css/swiper.min.css';
import { toJS } from "mobx";
import Swipe from '@pages/business-homepage/components/three-swipe';

interface IBusinessHomepageState {
  hadLogin: boolean,
  letterShow: boolean,
  messageContent: string,
  joinShow: boolean,
  joinName: string,
  joinDepartment: string,
  joinJob: string,
  userAttribute: number,
  myIpCurrentPage: number,
  myPortalPostCurrentPage: number,
  myStaffCurrentPage: number,
  activeKey: number,
  canGetData: boolean,
  isLoading: boolean,
  visibleShow: boolean,
  meetReason: string,
  teleRadio: number,
  invitationContactInformation: string,
  invitationDate: string,
  invitationTime: string,
  reservation: any[],
}

@inject('user', 'business', 'login')
@observer
export default class BusinessHomepage extends React.Component<IProps, IBusinessHomepageState> {
  state = {
    hadLogin: false, // 「去登录」弹窗
    letterShow: false, // 「私信」弹窗
    messageContent: "", // 私信内容
    joinShow: false, // 「职员加入」弹窗
    joinName: "", // 「职员加入」-职员名称
    joinDepartment: "", // 「职员加入」-加入部门
    joinJob: "", // 「职员加入」-加入岗位
    userAttribute: 0,
    myIpCurrentPage: 1, // IP列表-当前页
    myPortalPostCurrentPage: 1, // 案例列表-当前页
    myStaffCurrentPage: 1, // 职员列表-当前页
    activeKey: 1, // 「Tabs」当前激活页
    canGetData: true,
    isLoading: false,
    visibleShow: false,
    meetReason: '',
    teleRadio: 2,
    invitationContactInformation: '',
    invitationTime: '',
    invitationDate: '',
    reservation: [],
  };

  async componentDidMount() {
    document.title = "IP二厂-企业主页";
    const { business, login } = this.props;
    // const toVisitId = business.toVisitId;
    const { id: toVisitId }: any = this.props.match.params;
    const { userGuid, userAttribute } = login.userInfo || {
      userGuid: '',
      userAttribute: 0
    };
    await business.getBusinessInfo(userGuid, toVisitId);
    const { result }: any = await invitePersonalTime(business.userCompanyInfo.exhibitionGuid, business.userCompanyInfo.userGuid);
    if (result) {
      this.setState({
        reservation: result,
      });
    }
    this.setState({ userAttribute });
    addEventListener('scroll', this.scrollLoading);
  }

  async componentWillUnmount() {
    removeEventListener('scroll', this.scrollLoading);
  }

  scrollLoading = async () => {
    let yScroll: number;
    if (self.pageYOffset) {
      yScroll = self.pageYOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) {
      yScroll = document.documentElement.scrollTop;
    } else if (document.body) {
      yScroll = document.body.scrollTop;
    }
    if ((yScroll + document.body.clientHeight) >= document.body.scrollHeight) {
      if (!this.state.canGetData) {
        return;
      } else if (this.state.activeKey === 2) {
        this.activeKey2();
      } else if (this.state.activeKey === 3) {
        this.activeKey3();
      } else if (this.state.activeKey === 4) {
        this.activeKey4();
      }
    }
  };

  // 点击关注
  async focus(value) {
    if (!localStorage.getItem("user")) {
      this.setState({ hadLogin: true });
      return;
    }
    const { login, match } = this.props;
    const { id: guid }: any = match.params;

    const { userGuid } = login.userInfo || { userGuid: '' };
    const entity: any = {
      guid: [guid],
      isFollow: value,
      type: 1,
      userGuid,
    };
    await this.props.business.doFocus(entity);
    await this.toReload();
  }

  focusCancel = () => {
    this.setState({ hadLogin: false });
  };

  // 发送私信
  sendLetter() {
    let state: any = !this.props.login.userInfo ? { hadLogin: true } : { letterShow: true };
    this.setState(state);
  }

  letterCancel() {
    this.setState({ letterShow: false });
  }

  async sendLetters() {
    const { messageContent } = this.state;
    const { match, login } = this.props;
    const { id }: any = match.params;
    const sendUserGuid = login.userInfo.userGuid;
    const entity = {
      newContent: messageContent,
      receiverGuid: id,
      senderGuid: sendUserGuid
    };
    if (!messageContent) {
      message.warning("请输入您想要对TA说的话");
      return;
    }
    const { result }: any = await sendPrivateLetter(entity);
    if (result.errorCode === 200) {
      this.setState({ messageContent: "", letterShow: false });
      message.success(result.errorMsg);
    } else {
      message.error(result.errorMsg);
    }
  }

  // 职员加入
  sendJoin() {
    const { login } = this.props;
    if (!login.userInfo) {
      this.setState({ hadLogin: true });
    } else {
      this.setState({ joinName: login.userInfo.userRealName });
      setTimeout(() => {
        this.setState({ joinShow: true });
      }, 100);
    }
  }

  joinCancel() {
    this.setState({ joinShow: false });
  }

  async sendJoins() {
    const { id: companyGuid }: any = this.props.match.params;
    const entity = {
      addType: 1,
      companyDepartment: this.state.joinDepartment,
      companyGuid,
      companyPosition: this.state.joinJob,
      userGuid: this.props.login.userInfo.userGuid,
      userRealName: this.state.joinName
    };
    if (!entity.companyDepartment) {
      message.error('请输入任职部门');
    } else if (!entity.companyPosition) {
      message.error('请输入担当职位');
    } else {
      const { result }: any = await staffJoinCompany(entity);
      if (result.errorCode === 200) {
        this.setState({ joinShow: false });
        message.success(result.errorMsg);
      } else {
        message.error(result.errorMsg);
      }
    }
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

  // IP、案例、职员 的滚动加载
  async activeKey2() {
    const { id: toVisitId }: any = this.props.match.params;
    const { business } = this.props;
    const { myIpList } = business;
    let myIpCurrentPage = this.state.myIpCurrentPage + 1;
    if (!business.isLoading && myIpList.length >= 12 && business.flag) {
      this.setState({
        myIpCurrentPage,
      });
      this.props.business.setLoading(true);
      this._throttle(business.getMyIpData(toVisitId, this.state.myIpCurrentPage), 3000);
    }
  }

  async activeKey3() {
    const { id: toVisitId }: any = this.props.match.params;
    const { business } = this.props;
    const { myPortalPostData } = business;
    const id = JSON.parse(localStorage.getItem('user')).userGuid || { userGuid: '' };
    if (!business.isLoading2 && myPortalPostData.length >= 9 && business.flag2) {
      this.setState({
        myPortalPostCurrentPage: this.state.myPortalPostCurrentPage + 1
      });
      this.props.business.setLoading2(true);
      await this.props.business.getMyPortalPostData(id, toVisitId, this.state.myPortalPostCurrentPage);
    }
  }

  async activeKey4() {
    const { id: toVisitId }: any = this.props.match.params;
    const { business } = this.props;
    const { myStaffData } = business;
    if (!business.isLoading3 && myStaffData.length >= 12 && business.flag3) {
      this.setState({
        myStaffCurrentPage: this.state.myStaffCurrentPage + 1
      });
      this.props.business.setLoading3(true);
      await this.props.business.getMyStaffData(toVisitId, this.state.myStaffCurrentPage);
    }
  }

  // 「案例」-点赞喜欢
  async setLike(portalPostGuid, index) {
    const { business, login } = this.props;
    let userGuid: string;
    if (login.userInfo) {
      userGuid = login.userInfo.userGuid;
      const { id: toVisitId }: any = this.props.match.params;
      const result: any = await setPortalPostLike({ portalPostGuid, userGuid });
      if (result.errorCode !== '200') {
        message.error(result.errorMessage);
      } else {
        if (result.result.errorCode !== 200) {
          message.error(result.result.errorMsg);
        } else {
          message.success(result.result.errorMsg);
          business.myPortalPostData.map((item, k) => {
            if (k === index) {
              item.isGiveLike = 1;
              item.portalPostLikeCount += 1;
            }
          });
          // await business.getMyPortalPostData(userGuid, toVisitId, 1);
        }
      }

    } else {
      message.warning("您还未登陆，请先登陆后进行操作 ");
    }
  }

  async toReload() {
    const { match, login, business } = this.props;
    const { id: toVisitId }: any = match.params;
    const { userGuid } = login.userInfo || { userGuid: '' };
    await business.getBusinessInfo(userGuid, toVisitId);
  }

  private getDateAndTimeData(...args: string[]) {
    this.setState({
      invitationDate: args[0],
      invitationTime: args[1],
    });
  }

  private async sendInvite() {
    const { id }: any = this.props.match.params;
    const { business: { userCompanyInfo }, login } = this.props;
    const entity = {
      exhibitionCompanyGuid: userCompanyInfo.exhibitionCompanyGuid,
      exhibitionGuid: userCompanyInfo.exhibitionGuid,
      invitationDate: this.state.invitationDate,
      invitationNotifyContact: this.state.teleRadio,
      invitationContactInformation: this.state.invitationContactInformation,
      invitationPersonnel: login.userInfo.userGuid,
      invitationTime: this.state.invitationTime,
      meetAddress: userCompanyInfo.address,
      meetPersonnel: id,
      meetReason: this.state.meetReason
    };
    let { errorCode, result, errorMessage }: any = await invitationSave(entity);
    if (errorCode === '200' && result.errorCode === 200) {
      this.setState({
        visibleShow: !this.state.visibleShow
      });
      setTimeout(() => message.success(result.errorMsg), 1000);
    } else {
      result.errorMsg && message.error(result.errorMsg);
      errorMessage && message.error(errorMessage);
    }
  }

  render() {
    const { business, login } = this.props;
    let { joinName, } = this.state;
    const { userCompanyInfo, visitorList, myIpList, myPortalPostData, myStaffData, slides } = business;
    let memberLevel: number;
    let realStatus: number;
    if (!_isEmpty(userCompanyInfo)) {
      memberLevel = userCompanyInfo.memberLevel;
      realStatus = userCompanyInfo.realStatus;
    }
    console.log(memberLevel)
    // const { userGuid } = login.userInfo;
    return (
      <div className="body">
        <div className="business-homepage-container">
          {/* 封面及企业信息 */}
          <div className="cover">
            {/* 封面 头像 */}
            <div className="coverTop">
              <div className="Avatar">
                {<img src={userCompanyInfo.picUrl || default_img} alt=''/>}
              </div>
            </div>
            {/* 企业名 简讯 */}
            <div className="coverLeft">
              <div className="name">
                <div className='name-width'>
                  {userCompanyInfo.companyAbbreviation || userCompanyInfo.companyName}
                </div>
                <div>
                  {realStatus === 1 && <img src={auth} style={{width: '0.2rem', height: '0.2rem'}} alt=''/>}
                  {memberLevel === 1 && <img src={silverNoCircle} alt=''/>}
                  {memberLevel === 2 && <img src={ic_hjhy} alt=''/>}
                  {memberLevel === 3 && <img src={ic_zshy} alt=''/>}
                </div>
              </div>
              {userCompanyInfo.companyAbbreviation &&
              <div className="companyAbbreviation">{userCompanyInfo.companyName}</div>}
              {userCompanyInfo.exhibitionName &&
              <div className="newsletter">{userCompanyInfo.exhibitionName}<span>参展企业</span></div>}
              {userCompanyInfo.companyCountries &&
              <div className="address"><img src={ic_location0805} alt=''/>{userCompanyInfo.companyCountries}</div>}
            </div>
            {/* 关注 私信 职员加入 -- 默认点开页面先隐藏掉三个btn 拿到数据再展示*/}

            {userCompanyInfo.isSelf === 0 &&
            <div className="coverRight">
              {
                userCompanyInfo.isExhibitor === 1 &&
                <div
                  onClick={() => {
                    if (!localStorage.getItem("user")) {
                      localStorage.setItem('historyUrl', `business-homepage`);
                      this.setState({ hadLogin: true });
                    } else {
                      this.setState({ visibleShow: true });
                    }
                  }}
                >邀TA会面</div>
              }
              {userCompanyInfo.isFocus !== 1 ?
                <div onClick={() => this.focus(1)}>关注</div> : <div onClick={() => this.focus(2)}>已关注</div>
              }
              <div onClick={() => this.sendLetter()}>私信</div>
              {this.state.userAttribute !== 2 && <div onClick={() => this.sendJoin()}>申请加入</div>}
            </div>
            }
          </div>
          {/* 资料 IP 案例 职员 四大Tabs */}
          <div className="fourContainer">
            <Tabs defaultActiveKey="1" onChange={(activeKey) => {
              this.setState({ activeKey: Number(activeKey) });
            }}>
              <TabPane tab="资料" key="1">
                {/* 资料 */}
                <div className="material flex-row">
                  <div className="material-left">
                    {
                      !userCompanyInfo.companyExhibitionList && !userCompanyInfo.companyDesc &&
                      !userCompanyInfo.companyAbbreviation && !userCompanyInfo.companyDate &&
                      !userCompanyInfo.companyNature && !userCompanyInfo.companyIndustry &&
                      !userCompanyInfo.companyCountries && !userCompanyInfo.companyCategory &&
                      !userCompanyInfo.companyProduct && !userCompanyInfo.interestCategory &&
                      !userCompanyInfo.email && !userCompanyInfo.companyAddress && !userCompanyInfo.faxNumber ?
                        <div className="ic_no_resultDiv"><img src={ic_no_result} className="ic_no_result" alt=''/>暂无数据！
                        </div> :
                        <div className="title">企业介绍</div>
                    }
                    {userCompanyInfo.companyExhibitionList &&
                    <div className="carousel">
                      <Swipe
                        slide={toJS(slides)}
                        options={{
                          effect: "slide",
                          watchSlidesProgress: true,
                          slidesPerView: 'auto',
                          centeredSlides: true,
                          loop: true,
                          loopedSlides: 5,
                          autoplay: 3000,
                          pagination: null,
                          onSetTransition: (swipe, t) => {
                            for (let i = 0; i < swipe.slides.length; i++) {
                              let slide = swipe.slides.eq(i);
                              slide.transition(t);
                            }
                          },
                          onProgress: (swipe) => {
                            for (let i = 0; i < swipe.slides.length; i++) {
                              const slide = swipe.slides.eq(i);
                              let slideProgress = swipe.slides[i].progress;
                              let modify = 1;
                              if (Math.abs(slideProgress) > 1) {
                                modify = (Math.abs(slideProgress) - 1) * 0.3 + 1;
                              }
                              let translate = slideProgress * modify * 270 + 'px';
                              let scale = 1 - Math.abs(slideProgress) / 5;
                              let zIndex = 999 - Math.abs(Math.round(10 * slideProgress));
                              slide.transform('translateX(' + translate + ') scale(' + scale + ')');
                              slide.css('zIndex', zIndex);
                              slide.css('opacity', 1);
                              if (Math.abs(slideProgress) > 3) {
                                slide.css('opacity', 0);
                              }
                            }
                          }
                        }}/>
                    </div>
                    }
                    {userCompanyInfo.companyDesc &&
                    <div className="newsletter">{userCompanyInfo.companyDesc}<br/></div>}
                    <div className="introduce">
                      {userCompanyInfo.companyAbbreviation && <div>企业简称：{userCompanyInfo.companyAbbreviation}</div>}
                      {userCompanyInfo.companyDateStr && <div>成立时间：{userCompanyInfo.companyDateStr}</div>}
                      {userCompanyInfo.companyNature && <div>企业性质：{userCompanyInfo.companyNature}</div>}
                      {userCompanyInfo.companyIndustry && <div>所属行业：{userCompanyInfo.companyIndustry}</div>}
                      {userCompanyInfo.companyCountries && <div>企业国别：{userCompanyInfo.companyCountries}</div>}
                      {userCompanyInfo.companyCategory && <div>企业类别：{userCompanyInfo.companyCategory}</div>}
                      {userCompanyInfo.companyProduct && <div>企业经营业务/产品：{userCompanyInfo.companyProduct}</div>}
                      {userCompanyInfo.interestCategory && <div>感兴趣的IP品类：{userCompanyInfo.interestCategory}</div>}
                      {userCompanyInfo.email && <div>企业邮箱：{userCompanyInfo.email}</div>}
                      {userCompanyInfo.companyAddress && <div>企业地址：{userCompanyInfo.companyAddress}</div>}
                      {userCompanyInfo.companySizeName && <div>企业规模：{userCompanyInfo.companySizeName}</div>}
                      {userCompanyInfo.companyWebsite && <div>企业网址：{userCompanyInfo.companyWebsite}</div>}
                      {userCompanyInfo.companyTelephone && <div>座机号码：{userCompanyInfo.companyTelephone}</div>}
                      {userCompanyInfo.faxNumber && <div>传真号码：{userCompanyInfo.faxNumber}</div>}
                    </div>
                  </div>
                  {/* 最近访客 */}
                  <div className="material-right flex-column">
                    <div className="title">最近访客</div>
                    {(visitorList || []).map((item, index) => {
                      return (
                        <div className="visitors-list flex-column" key={index}
                          // onClick={this.toReload.bind(this)}
                        >
                          {
                            <a className='link-container flex-row align-items-center' onClick={() => {
                              if (item.userAttribute === 1) {
                                this.props.history.push(`/personal-homepage/${item.userGuid}`);
                              } else {
                                // business.setToVisitId(item.userGuid, userGuid);
                                this.props.history.push('/ecosphere');
                                const guid = item.userGuid;
                                setTimeout(() => {
                                  this.props.history.push(`/business-homepage/${guid}`);
                                }, 10);
                                // window.history.pushState(null, null, '#/ecosphere');
                              }
                            }}>
                              {/*<Link
                              to={`/${item.userAttribute === 1 ? 'personal-homepage' : 'business-homepage'}/${item.userGuid}`}
                              className='link-container flex-row align-items-center'>*/}
                              <img className="visitors-avatar"
                                   src={item.userAttribute === 1 ? item.picUrl || default_img_ip : item.picUrl || default_img}
                                   alt=''/>
                              <div className='text-area flex-column'>
                                <div className="name align-items-center">
                                  <span className='com-real-name'>
                                    {item.companyAbbreviation || item.realName}
                                  </span>
                                  {item.realStatus === 1 && <img src={auth} style={{width: '0.13rem', height: '0.13rem'}} alt=''/>}
                                  {item.memberLevel === 1 && <img src={silverNoCircle} alt=''/>}
                                  {item.memberLevel === 2 && <img src={ic_hjhy} alt=''/>}
                                  {item.memberLevel === 3 && <img src={ic_zshy} alt=''/>}
                                  <span className="lastTime">{item.visitDate}</span>
                                </div>
                                {item.userAttribute === 2 && item.companyName ?
                                  <div className="company word-ellipsis">
                                    {item.companyName}
                                  </div> :
                                  <div className="company word-ellipsis">
                                    {item.occupation && item.companyDepartment &&
                                    <div>{item.occupation}@{item.companyDepartment}</div>}
                                  </div>
                                }
                              </div>
                            </a>
                          }
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabPane>
              <TabPane tab="IP" key="2">
                {/* IP */}
                <div className="ip">
                  {/* <div className="title">上传的IP</div> */}
                  {
                    !_isEmpty(myIpList) &&
                    <div className="ipContainer">
                      {myIpList.map((item, index) => {
                        return (
                          <div className="ipSendList" key={index}>
                            <Link to={`/detail/${item.ipTypeSuperiorNumber}/${item.ipid}`} target="_blank">
                              <div className="ipSendImageOut">
                                <img className="image" src={item.picUrl || default_img} alt=''/>
                              </div>
                              <div className="name">{item.ipName}</div>
                            </Link>
                              {/* <div className="ipSendImageOut" onClick={() => {window.location.href=`/detail/${item.ipTypeSuperiorNumber}/${item.ipid}`}}>
                                <img className="image" src={item.picUrl || default_img} alt=''/>
                              </div>
                              <div className="name">{item.ipName}</div> */}
                          </div>
                        );
                      })}
                    </div>}
                  {
                    _isEmpty(myIpList) && !this.props.business.isLoading &&
                    <div className="ic_no_resultDiv">
                      <img src={ic_no_result} className="ic_no_result" alt=''/>暂无数据！
                    </div>
                  }
                  {
                    this.props.business.isLoading && this.props.business.flag &&
                    <div className="loading"><img src={icon_load} alt=""/></div>
                  }
                  {
                    !this.props.business.flag && !_isEmpty(myIpList) &&
                    <p className="ofTheBottom"><span>没有更多内容</span></p>
                  }
                </div>
              </TabPane>
              <TabPane tab="案例" key="3">
                <div className="case">
                  {!_isEmpty(myPortalPostData) &&
                  <div className="caseContainer">
                    {myPortalPostData.map((item, index) => {
                      return (
                        <div className="caseSendList" key={index}>
                          <Link to={`/industry-detail/${item.portalPostGuid}`}>
                            <img className="caseSendImage" src={item.picUrl || default_img_ip} alt=''/>
                          </Link>
                          <img className="caseSendImg" src={item.ipidPicUrl || default_img_ip} alt=''/>
                          <div className="name">{item.postTitle}</div>
                          <div className="likeNumber" onClick={() => this.setLike(item.portalPostGuid, index)}>
                            {item.isGiveLike === 1 ? <Icon type="heart" theme="filled" className="red"/> :
                              <Icon type="heart" theme="filled"/>}
                            {item.portalPostLikeCount || 0}
                          </div>
                          <div className="autherAndTime"><span>{item.createDateStr}</span></div>
                        </div>
                      );
                    })}
                  </div>
                  }
                  {
                    _isEmpty(myPortalPostData) && !this.props.business.isLoading2 &&
                    <div className="ic_no_resultDiv">
                      <img src={ic_no_result} className="ic_no_result" alt=''/>暂无数据！
                    </div>
                  }
                  {
                    this.props.business.isLoading2 && this.props.business.flag2 &&
                    <div className="loading"><img src={icon_load} alt=""/></div>
                  }
                  {
                    !this.props.business.flag2 && !_isEmpty(myPortalPostData) &&
                    <p className="ofTheBottom"><span>没有更多内容</span></p>
                  }
                </div>
              </TabPane>
              <TabPane tab="职员" key="4">
                {/* 邀TA会面 */}
                <div className="staff">
                  {!_isEmpty(myStaffData) &&
                  <div className="staffContainer">
                    {myStaffData.map((item: any, index: number) => {
                      return (
                        <div className="visitorsList" key={index}>
                          <Link to={`/personal-homepage/${item.userGuid}`}>
                            <img className="visitorsAvatar" src={item.picUrl || default_img_ip} alt=''/>
                            <div className="name">
                              <div className='com-word'>{item.userRealName}</div>
                              <div>{item.realStatus === 1 && <img src={auth} alt=''/>}</div>
                              <span className="lastTime">{item.visitDate}</span>
                            </div>
                            <div
                              className="company">{item.companyPosition}{item.companyPosition && item.companyDepartment ? "@" : ""}{item.companyDepartment}</div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                  }{
                  _isEmpty(myStaffData) && !this.props.business.isLoading3 &&
                  <div className="ic_no_resultDiv">
                    <img src={ic_no_result} className="ic_no_result" alt=''/>暂无数据！
                  </div>
                }
                  {
                    this.props.business.isLoading3 && this.props.business.flag3 &&
                    <div className="loading"><img src={icon_load} alt=""/></div>
                  }
                  {
                    !this.props.business.flag3 && !_isEmpty(myStaffData) &&
                    <p className="ofTheBottom"><span>没有更多内容</span></p>
                  }
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>
        <ScrollTop/>
        {/* 登录提示 */}
        <Modal title="登录提示" visible={this.state.hadLogin} onCancel={this.focusCancel} footer={null} closable={false}>
          <p>您还未登陆,请先登陆</p>
          <Link to={'/login'}
                onClick={() => {
                  const { id }: any = this.props.match.params;
                  localStorage.setItem('historyUrl', `business-homepage/${id}`);
                }}>
            <div className="toLogin">去登录</div>
          </Link>
        </Modal>
        {/* 私信 */}
        <Modal title="私信TA" width={520} visible={this.state.letterShow} onCancel={() => this.letterCancel()}
               footer={null} closable={false}
               className="letterDiv">
          <div className="modal-main">
            <div className="userRealName">{userCompanyInfo.companyName}</div>
            <TextArea
              rows={4} placeholder="请在此输入您想要对TA说的话（120字内）"
              maxLength={120}
              value={this.state.messageContent}
              onChange={(e) => {
                this.setState({ messageContent: e.currentTarget.value.replace(/ /g, '') });
              }}/>
          </div>
          <div className="twoBtn">
            <div className="submitBtn" onClick={() => this.sendLetters()}>确认</div>
            <div className="cancelBtn" onClick={() => this.letterCancel()}>取消</div>
          </div>
        </Modal>
        {/* 职员加入 */}
        <Modal title="申请加入" width={600} visible={this.state.joinShow} onCancel={() => this.joinCancel()} footer={null}
               closable={false}
               className="joinDiv">
          <div className="modal-main">
            <div className="userRealName">{userCompanyInfo.companyName}</div>
            <div className="label">真实姓名<span>*</span></div>
            <Input size="large" placeholder="请输入真实姓名" value={joinName} onChange={(e) => {
              this.setState({ joinName: e.currentTarget.value });
            }}/>
            <div className="label">任职部门<span>*</span></div>
            <Input size="large" placeholder="请输入任职部门" onChange={(e) => {
              this.setState({ joinDepartment: e.currentTarget.value });
            }}/>
            <div className="label">任职岗位<span>*</span></div>
            <Input size="large" placeholder="请输入担当职位" onChange={(e) => {
              this.setState({ joinJob: e.currentTarget.value });
            }}/>
          </div>
          <div className="twoBtn">
            <div className="submitBtn" onClick={() => this.sendJoins()}>确认</div>
            <div className="cancelBtn" onClick={() => this.joinCancel()}>取消</div>
          </div>
        </Modal>

        <Modal
          className="inviteDiv" width={600} title="邀TA会面" visible={this.state.visibleShow}
          onCancel={() => {
            this.setState({ visibleShow: false });
          }}
          destroyOnClose
          afterClose={() => {
            this.setState({
              meetReason: '',
              teleRadio: 2,
              invitationDate: '',
              invitationTime: '',
            });
          }}
          footer={null}
        >
          <div className="modal-main">
            <div className="label">会面企业<span>*</span></div>
            <Input size="large" disabled value={userCompanyInfo.companyName}/>
            <div className="label">选择会面时间段<span>*</span></div>
            {userCompanyInfo.beginDateStr
            && <DateTimePicker
              begin={userCompanyInfo.beginDateStr}
              end={userCompanyInfo.endDateStr}
              dateTime={this.getDateAndTimeData.bind(this)}
              reservation={this.state.reservation}
            />}

            <div className="label">会面原因<span>*</span></div>
            <TextArea
              placeholder="请在此输入您想要和他会面的原因（400字内）"
              value={this.state.meetReason}
              onChange={(e) => {
                this.setState({ meetReason: e.currentTarget.value });
              }}
            />
            <div className="label">是否愿意将联系方式告知TA<span>*</span></div>
            <Radio.Group
              onChange={e => this.setState({ teleRadio: e.target.value })}
              value={this.state.teleRadio}>
              <Radio value={1}>是</Radio>
              <Radio value={2}>否</Radio>
            </Radio.Group>
            {this.state.teleRadio === 1 &&
            <Input size="large" className="teleInput" value={this.state.invitationContactInformation} onChange={(e) => {
              this.setState({ invitationContactInformation: e.currentTarget.value });
            }}/>
            }
          </div>
          <div className="twoBtn">
            <div className="submitBtn" onClick={this.sendInvite.bind(this)}>发送会面邀请</div>
            <div className="cancelBtn" onClick={() => {
              this.setState({ visibleShow: false });
            }}>取消
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
