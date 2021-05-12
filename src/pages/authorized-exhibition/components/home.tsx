import * as React from 'react';
import ReactSwiper from "@components/react_swiper";
import ic_smpd from "@assets/images/matchmaking/ic_smpd.svg";
import ic_ydmp from "@assets/images/matchmaking/ic_ydmp.svg";
import h2img from "@assets/images/matchmaking/h2img.png";
import default_img from "@assets/images/default/ic_default_shu.png";
import { inject, observer } from "mobx-react";
import Alert from '@components/alert';
import '@assets/scss/authorized_exhibition.scss';
import { toJS } from 'mobx';
import SwiperT from '@pages/authorized-exhibition/components/swiper';
import _isEmpty from 'lodash/isEmpty';

interface IAuthorizeData extends IComponentProps {
  setTradeGuid: Function,
  userGuid?: string,
  history?: any,
}

interface IAuthorizedState {
  data?: any,
  slides: object[], // 轮播数据
  sizeSlides: object[], // 轮播数据
  homeMessage: string, // 提示消息
  expireMessage: string, // 展会过期消息
  lowerMes: string, // 展会下架消息
  homeAlert: boolean, // 显示消息提示
  userAlert: boolean,
  expireAlert: boolean,
  lowerAlert: boolean,
  show: boolean,
  userMess: string,
  msg: string,
  type: string,
}

@inject("authorize", "update", "user", 'login')
@observer
export default class Home extends React.Component<IAuthorizeData, IAuthorizedState> {
  constructor(props) {
    super(props);
    this.state = {
      type: '',
      homeMessage: '',
      expireMessage: '',
      lowerMes: '',
      userMess: '',
      homeAlert: false,
      userAlert: false,
      expireAlert: false,
      lowerAlert: false,
      show: false,
      msg: '',
      slides: [],
      sizeSlides: [],
    };
  }

  async componentDidMount() {
    document.title = "IP二厂-授权展";
    const { user, login } = this.props;
    let userGuid;
    if (!_isEmpty(login.userInfo)) {
      userGuid = login.userInfo.userGuid;
      await user.getUserInfo(userGuid);
    }
    const { authorize } = this.props;
    let result = await authorize.getNewsData();

    let slides = [], sizeSlides = [], arr = [];
    let _slides = [...arr, result[0].bannerList[0]];
    let _sizeSlides = result[0].exhibitionPictureList;

    _slides.map((v, index) => {
      slides.push({
        image: v,
        id: index,
      });
    });
    _sizeSlides.map((v, index) => {
      sizeSlides.push({
        image: v,
        id: index,
      });
    });
    this.setState({
      slides,
      sizeSlides,
    });
  }

  // 跳企业主页
  jumpCompany(value) {
    this.props.history.push(`/business-homepage/${value}`);
  }

  render() {
    const { authorize, login } = this.props;
    let { autherizedData } = authorize;
    let code: number;
    if (!_isEmpty(login.userInfo)) {
      code = login.userInfo.userAttribute;
    }
    const per = this.props.user.personInfo;
    const sn = per.sn;
    const mobile = per.mobile;
    const email = per.email;
    const userRealName = per.userRealName;
    const address = per.address;
    const country = per.country;
    const province = per.province;
    autherizedData = toJS(autherizedData);
    return (
      <div>
        {this.state.homeAlert &&
        <Alert message={this.state.homeMessage}
               onClose={() => {
                 this.setState({ homeAlert: false });
               }}
               onSubmit={() => {
                 this.props.history.push('/user/0');
               }}
        />}
        {this.state.userAlert &&
          <Alert message={this.state.userMess}
                 onClose={() => {
                   this.setState({ userAlert: false });
                 }}
                 onSubmit={() => {
                   this.setState({ userAlert: false });
                 }}
          />}
        {this.state.expireAlert &&
          <Alert message={this.state.expireMessage}
                 onClose={() => {
                   this.setState({ expireAlert: false });
                 }}
                 onSubmit={() => {
                   this.setState({ expireAlert: false });
                 }}
          />}
        {this.state.lowerAlert &&
          <Alert message={this.state.lowerMes}
                 onClose={() => {
                   this.setState({ lowerAlert: false });
                 }}
                 onSubmit={() => {
                   this.setState({ lowerAlert: false });
                 }}
          />}
        {this.state.show &&
        <Alert message={this.state.msg} buttonValue="去登陆"
               onClose={() => {
                 this.setState({ show: false });
               }}
               onSubmit={() => {
                 this.props.history.push('/login');
               }}
        />}
        <div className="header-area">
          {
            this.state.slides.length > 2
              ? <ReactSwiper slide={this.state.slides} history={this.props.history}/>
              : <ReactSwiper slide={this.state.slides} options={{ pagination: null }} history={this.props.history}/>
          }
        </div>
        <div className="navView">
          <div onClick={() => {
            if (!_isEmpty(login.userInfo)) {
              if (login.userInfo.exhibitionGuid) {
                this.props.history.push("/matchmaking/" + autherizedData[0].exhibitionGuid)
              } else {
                this.setState({lowerMes: '当前展会已下架 敬请期待下一次展会!', lowerAlert: true })
              }
            } else {
              localStorage.setItem('historyUrl', `authorized-exhibition`);
              this.setState({
                show: true,
                msg: '您还未登陆请先登陆后进行操作'
              });
            }

          }}>
            <img src={ic_smpd} alt=""/>
            商贸配对
          </div>
          <div
            onClick={() => {
              // exhibitionGuid没有值的时候已经下架
              // isExpireExhibition为true展会过期
              if (!_isEmpty(login.userInfo)) {
                if (login.userInfo.exhibitionGuid === '') {
                    this.setState({expireMessage: '您来晚了展会已过期', expireAlert: true })
                } else {
                  if (login.userInfo.isExpireExhibition && login.userInfo.isAdmissionTicket !== 1 && login.userInfo.userAttribute === 1) {
                    this.setState({expireMessage: '您来晚了展会已过期', expireAlert: true })
                  } else {
                    if (code === 1) {
                      if (!sn) {
                        if (!email || !mobile || !userRealName || !address || !province || !country) {
                          this.setState({ homeMessage: '请先完善个人信息', homeAlert: true });
                        } else {
                          this.props.history.push('/authorized-exhibition/ticket');
                        }
                      } else if (sn) {
                        this.props.history.push(`/authorized-exhibition/confirm?sn=${sn}`);
                      }
                    } else {
                      this.setState({ userMess: '企业账号不可预订门票', userAlert: true });
                    }
                  }
                }
              } else {
                this.setState({ show: true, msg: '您还未登陆请先登陆后进行操作' });
              }
            }}>
            <img src={ic_ydmp} alt=""/>
            预登记观展
          </div>
        </div>
        {
          autherizedData &&
          <div className="content">
            <h2><img src={h2img} alt=""/> CLE中国授权展概况及规模</h2>
            <div className="size">
              <div className="sizeText">
                <p>{autherizedData[0].exhibitionOverview}</p>
                <div className="textNew">
                  <div>
                    <p>{autherizedData[0].squareMeter}+ </p>
                    <p className="smail">平米</p>
                  </div>
                  <div>
                    <p>{autherizedData[0].exhibitionCompanyCount}+ </p>
                    <p className="smail">展商</p>
                  </div>
                  <div>
                    <p>{autherizedData[0].popularIpCount}+ </p>
                    <p className="smail">热门IP</p>
                  </div>
                  <div>
                    <p>{autherizedData[0].authorizedAudienceCount}+ </p>
                    <p className="smail">被授权观众</p>
                  </div>
                </div>
              </div>
            </div>
            <h2><img src={h2img} alt=""/> CLE中国授权展参观理由</h2>
            <div className="why">
              {autherizedData[0].reasonList.map(item => {
                return (
                  <div key={item.id} className="whyLi">
                    <img src={item.icon} className="icon" alt=""/>
                    <p className="title">{item.advantage}</p>
                    <p className="dec">{item.advantageExplain}</p>
                  </div>
                );
              })}
            </div>
            <h2><img src={h2img} alt=""/> CLE中国授权展往届活动现场图片</h2>
            <div className="sizeImg clearfix">
              <SwiperT slide={this.state.sizeSlides}/>
              {/*<SpecialSwiper slide={this.state.sizeSlides} />*/}
            </div>
            <h2><img src={h2img} alt=""/> CLE中国授权展部分参展企业</h2>
            <div className="joinIn">
              {
                autherizedData[0].companyList.map(item => {
                  return (
                    <div key={item.userGuid} onClick={() => {
                      this.jumpCompany(item.userGuid);
                    }}>
                      <img src={item.picUrl || default_img} alt=""/>
                    </div>
                  );
                })
              }
            </div>
          </div>
        }
      </div>
    );
  }
}
