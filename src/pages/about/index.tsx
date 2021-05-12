import * as React from "react";
import { observer } from "mobx-react";
import "@assets/scss/about.scss";
import ScrollTop from "@components/scroll-top";
import { Link } from 'react-router-dom';
import topImage from "@assets/images/about/about.jpg";
import icon_email from '@assets/images/about/ic_mail.png';
import icon_phone from '@assets/images/about/ic_call.png';
import icon_banquanfang from '@assets/images/about/banquanfang.png';
import icon_user from '@assets/images/about/person.png';
import icon_position from '@assets/images/about/position.png';
import ui from 'assets/images/about/ui.png';
import java from 'assets/images/about/java.png';

interface IAboutState {
  current: number,
}

@observer
export default class About extends React.Component<IProps, IAboutState> {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
    };
  }

  async componentDidMount() {
    document.title = "IP二厂-关于IP二厂";
    let type: number;
    if (this.props.location.pathname === '/about/2') {
      type = 2;
    } else if (this.props.location.pathname === '/about/3') {
      type = 3;
    } else {
      type = 1;
    }
    this.setState({
      current: type
    });
  }

  render() {
    const { current } = this.state;
    return (
      <div className="body">
        <div className="about-container">
          <div className="top-img">
            <img src={topImage} alt=""/>
          </div>
          <div className="type-of">
            <div className="type-tab">
              <span className={current === 1 ? 'active' : ''}>
                <Link to="/about" onClick={() => {
                  this.setState({ current: 1 });
                }}>IP二厂介绍</Link>
              </span>
              <span className={current === 2 ? 'active' : ''}>
                <Link to="/about/2" onClick={() => {
                  this.setState({ current: 2 });
                }}>联系IP二厂</Link>
              </span>
              {/*<span className={current === 3 ? 'active' : ''}>
                <Link to="/about/3" onClick={() => {
                  this.setState({ current: 3 });
                }}>加入IP二厂</Link>
              </span>*/}
            </div>
          </div>
          <div className="about-content" style={{ display: current === 1 ? 'block' : 'none' }}>
            {/* <p className="title">关于“IP二厂”IP备案查询平台</p>
            <p>“IP二厂”作为国内最具公信力的由政府指导和由非盈利机构运营的第三方IP备案查询平台，IP二厂旨在集合各行业广泛的授权商及被授权商资源，打通信息壁垒，解决品牌授权领域普遍存在的信息不对称现象，有力推动各类授权IP与被授权企业之间的商业对接，并为合法备案的IP在遭遇法律纠纷时提供司法佐证依据。
              为保证备案的公正性，所有备案企业均需按要求提交相应资质文件，并在审核通过后方可对外公布，具体流程如下：<br/>
              <span className="text-center"> 用户注册</span>
              <span className="text-center"> ▼</span>
              <span className="text-center"> 完善企业信息并上传营业执照</span>
              <span className="text-center"> ▼</span>
              <span className="text-center"> 备案IP或产品信息（上传IP或产品图片、文字介绍及权利归属相关资质文件）</span>
              <span className="text-center"> ▼</span>
              <span className="text-center"> 后台审核</span>
              <span className="text-center"> ▼</span>
              <span className="text-center"> 前台发布</span>
            </p>*/}

            <p className="title">关于酷拓COOLTOUR</p>
            <p className='p-last'>
              酷拓文化交流（上海）有限公司（以下简称酷拓COOLTOUR）成立于2016年，以“科技+数据+IP”为核心的DNA，致力于推进中国IP产业和内容产业的发展。
              酷拓文化交流（上海）有限公司推出【IP二厂】作为面向IP授权行业的服务型平台，
              将为行业打通上下游信息、提供各类IP数据、打造IP生态圈，实现行业社交、科学理性授权等提供服务与决策依据，
              并提供后续的营销支持，打造数据、内容、营销一体化服务。
            </p>
            <p>
              酷拓COOLTOUR作为【IP二厂】的运营方，将为大家提供良好的平台支持与服务，任何问题可以通过网站平台客服联系到我们。诚挚欢迎大家向我们提出宝贵的意见。<br/>
            </p>

          </div>
          <div className="contact-content flex justify-content-between"
               style={{ display: current === 2 ? 'flex' : 'none' }}>
            <div className="content-left">
              <div className='about-con'>
                <h3><img src={icon_banquanfang} alt=""/>网站业务合作</h3>
                <p><img src={icon_user} alt=""/>Jason Shen</p>
                <p><img src={icon_position} alt=""/>IP事业部总经理</p>
                <p><img src={icon_phone} alt=""/>15900510786</p>
                <p><img src={icon_email} alt=""/><a href="mailto: jason.shen@cooltour.fun">jason.shen@indexip.cn</a>
                </p>
              </div>
              <div className='about-con'>
                <h3><img src={icon_banquanfang} alt=""/>网站运营</h3>
                <p><img src={icon_user} alt=""/>Kelly Yao</p>
                <p><img src={icon_position} alt=""/>IP二厂网站运营中心</p>
                <p><img src={icon_phone} alt=""/>021-5280 9587</p>
                <p><img src={icon_email} alt=""/><a href="mailto:  	operation@cooltour.fun">operation@indexip.cn</a>
                </p>
              </div>
            </div>
            {/*<div className="content-right">*/}
            {/*<img src={qr_code} alt=""/>*/}
            {/*<p>扫一扫上面的二维码，加客服微信</p>*/}
            {/*</div>*/}
          </div>
          <div className="join-content" style={{ display: 'none' }}>
            <p className="title"><span>简历投递邮箱</span></p>
            <p className="contact-email"><a href="mailto: hr@indexip.cn">hr@indexip.cn</a></p>
            <div className="job-list">
              <div className="single-div flex justify-content-between align-items-top">
                <div className="job flex-column align-items-center">
                  <img src={ui} alt=""/>
                  视觉设计师
                </div>
                <div className="post-request">
                  <p>岗位要求：</p>
                  <p>1、三年及以上平面设计工作经验，大专以上学历，广告设计类艺术专业；</p>
                  <p>2、具备视觉设计能力和美术功底，丰富的想像力，灵活的创意，有能力进行构思、策划和平面与立体形象设计；</p>
                  <p>3、能独立完成平面图、画册、包装等相关方面的创意及设计制作工作；</p>
                  <p>4、能绘制手工画，熟练使用Adobe CC、Sketch、Affinity等设计软件；</p>
                  <p>5、高度的敬业精神及工作激情，积极乐观，热爱设计。</p>
                </div>
                <div className="job-content">
                  <p>工作内容：</p>
                  <p>1、负责品牌项目的视觉创意平面设计，包括产品海报设计、包装设计、品牌LOGO、VI、宣传物料、活动广告等；</p>
                  <p>2、能独立完成UI设计以及相关精美网页、APP等界面；</p>
                  <p>3、负责日常宣传、内部刊物、策划设计制作、图文设计；</p>
                  <p>4、负责新媒体平台（微信、微博、空间等）宣传设计；</p>
                  <p>5、负责各市场活动宣传品的平面配合工作，按时完成业务模块所提的设计需求；</p>
                  <p>6、收集市场最新的设计，不断改进设计水平。</p>
                </div>
              </div>
              <div className="single-div flex justify-content-between align-items-top">
                <div className="job flex-column align-items-center">
                  <img src={java} alt=""/>
                  JAVA开发工程师
                </div>
                <div className="post-request">
                  <p>岗位要求：</p>
                  <p>1、计算机科学、软件工程、数学等相关理工类专业本科学历优先；</p>
                  <p>2、熟悉java或C语言，乐意从事java后台开发工作；</p>
                  <p>3、熟悉oracle、Mysql等数据库及SQL开发；</p>
                  <p>4、了解spring，structs，hibernate等主流开发框架；</p>
                  <p>5、具有良好的沟通交流能力、合作精神及主动学习精神。</p>
                </div>
                <div className="job-content">
                  <p>工作内容：</p>
                  <p>1、承担Java相关的设计开发；</p>
                  <p>2、根据输入的项目任务书、需求规格说明书，进行系统设计，并编写概要设计说明书；</p>
                  <p>3、根据设计，进行代码开发；</p>
                  <p>4、进行单元测试，并配合测试人员完成测试阶段的工作；</p>
                  <p>5、编写软件的用户指南和安装指南；</p>
                  <p>6、发布软件，并给软件实施人员以必要的支持；</p>
                  <p>7、对于部分系统复杂或需求复杂项目，需要出差到现场进行必要的现场调试和技术支持。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ScrollTop/>
      </div>
    );
  }
}
