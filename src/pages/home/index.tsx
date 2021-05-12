import * as React from "react";
import { inject, observer } from "mobx-react";
import ReactSwiper from "@components/react_swiper";
import ScrollTop from "@components/scroll-top";
import "@assets/scss/home.scss";
import { toJS } from "mobx";
import {
  CoreProduct,
  CooperateIp,
  IndustryCase,
  IpTenType,
  PublicIp,
} from "@pages/home/components";
import homeBottom from "@assets/images/double-eleven/home-bottom.png";
import icon_close from "@assets/images/double-eleven/icon_close.png";
import ic_clear from "@assets/images/ic_clear.png";
import success_icon from "@assets/images/success-icon.png";
import error_icon from "@assets/images/error-icon.png";

interface IHomeState {
  isShow: boolean;
  promptPerfectModal: any;
  showTips: boolean
}

@inject("home", "ip_list")
@observer
export default class Home extends React.Component<IProps, IHomeState> {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      promptPerfectModal: localStorage.getItem("promptPerfectInformation"),
      showTips: false
    };
  }

  async componentDidMount() {
    document.title = "IP二厂-首页";
    const { home } = this.props;
    await home.slideList();
    await home.moduleList({ moduleId: 1, moduleType: 1 });
    await home.moduleList({ moduleId: 2, moduleType: 1 });
    await home.moduleList({ moduleId: 4, moduleType: 1 });
    await home.mediaType();
    await home.getPublicIP({ currentPage: 1, pageSize: 20 });
  }

  clearPrompt = () => {
    localStorage.removeItem("promptPerfectInformation")
    this.setState({
      promptPerfectModal: "",
      showTips: false
    })
  }

  render() {
    let { home, ip_list } = this.props;
    let { slides, modules, publicData, typeData } = home;
    modules = toJS(modules);
    const { isShow, promptPerfectModal, showTips } = this.state;
    return (
      <div className="main-container">
        <div className="header-area">
          <ReactSwiper
            slide={toJS(slides)}
            options={{ nextButton: null, prevButton: null }}
            history={this.props.history}
          />
        </div>
        <IpTenType data={typeData} ip_list={ip_list} />
        <CooperateIp data={modules["cooperateIp"]} />
        <PublicIp data={toJS(publicData)} />
        <IndustryCase data={modules["industryCase"]} />
        <CoreProduct
          data={modules["coreProduct"]}
          history={this.props.history}
          message={""}
        />
        {isShow && (
          <div className="double-eleven">
            {/*<img src={homeBottom} alt=""/>*/}
            <div
              onClick={() => this.props.history.push("/double-eleven")}
            ></div>
            <p
              onClick={() => {
                this.setState({
                  isShow: false,
                });
              }}
            >
              <img className="icon-close" src={icon_close} alt="" />
            </p>
          </div>
        )}
        {(!!promptPerfectModal && !showTips) && (
          <div className="promptPerfectModal">
            <div className="area">
              <img
                className="clear"
                src={ic_clear}
                onClick={this.clearPrompt}
                alt=""
              />
              <div className="head">
                <img src={success_icon} alt="" />
                <p className="title">欢迎您登录IP二厂！</p>
              </div>
              <div className="body">
                <div>
                  <p>你还未填写用户信息，完善信息即可获得：</p>
                </div>
                <div>
                  <p>1、2000元储值卡</p>
                  <p>感受“人民币”玩家的畅爽体验，10w+IP数据任您查看。</p>
                </div>
                <div>
                  <p>2、升级为2星用户</p>
                  <p>完善用户信息，成为更高等级优质用户，让合作对象更安心。</p>
                </div>
                <div>
                  <p>3、定向推荐</p>
                  <p>根据所填需求，帮你定向推荐喜好IP或意向潜在合作伙伴。</p>
                </div>
              </div>
              <div className="foot">
                <div onClick={() => { this.setState({showTips: true}) }}>暂不完善</div>
                <div onClick={() => { this.clearPrompt();this.props.history.push(`/user/21`) }}>立即完善</div>
              </div>
            </div>
          </div>
        )}
        {(!!promptPerfectModal && showTips) && (
          <div className="promptPerfectModal">
            <div className="area">
              <img
                className="clear"
                src={ic_clear}
                onClick={() => { this.setState({showTips: false}) }}
                alt=""
              />
              <div className="head">
                <img src={error_icon} alt="" />
                <p className="title">温馨提示</p>
              </div>
              <div className="body-error">
              <p>确定不完善用户信息么？</p>
                <p>1、如一个月内未完善用户信息你将失去平台送出的2000元数据储值卡领取资格；</p>
                <p>2、由于信息不完善，用户等级较低，很难获得平台对优质客户的宣传推广机会 ，获得更多合作机会。</p>
              </div>
              <div className="foot">
                <div onClick={this.clearPrompt}>确定</div>
                <div onClick={() => { this.setState({showTips: false}) }}>取消</div>
              </div>
            </div>
          </div>
        )}
        <ScrollTop />
      </div>
    );
  }
}
