import * as React from "react";
import "@assets/scss/rule.scss";
import { Link } from "react-router-dom";
import ScrollTop from "@components/scroll-top";

interface IOptions {
  type: number
}

export default class HelpCenter extends React.Component<IProps, IOptions> {

  constructor(props) {
    super(props);
    this.state = {
      type: 0
    };
  }

  async componentDidMount() {
    let { type }: any = this.props.match.params;
    type = Number(type);
    switch (Number(type)) {
      case 1:
        document.title = "登录/注册问题";
        break;
      case 2:
        document.title = "充值/退款问题";
        break;
      default:
        break;
    }
    this.setState({
      type,
    });
  }

  render() {
    let { type }: any = this.props.match.params;
    type = Number(type);
    return (
      <div className="body helpcenter-container">
        <div className="main clearfix">
          <div className="static-menu">
            <ul>
              <li><Link to="/helpCenter/1" className={type === 1 ? 'curr' : ''}>登录/注册问题</Link></li>
              <li><Link to="/helpCenter/2" className={type === 2 ? 'curr' : ''}>充值/退款问题</Link></li>
              {/* <li><a>网页bug常见问题</a></li>
                            <li><a >账号异常问题</a></li> */}
            </ul>
          </div>
          {type === 1 ? <div className="static-container">
            <h1>登录/注册问题</h1>
            <div className="container-inner">
              <h2>账号登录不上怎么办？</h2>
              <p>您好，如您帐号出现异常，可能是以下情况：因浏览器或网络异常导致的登录异常。您可以清理下浏览器缓存，或是换一个QQ浏览器尝试；</p>
              <h2>手机验证码无法收到/发送失败怎么办？</h2>
              <p>由于运营商发送延迟导致收不到验证码，麻烦过5分钟重新发送一下即可。如还是未不到，可联系客服处理。</p>
              <h2>怎么样取消/修改手机号绑定？</h2>
              <p>您好，如您需要修改绑定的手机号，您可在<Link to="/user/3">「个人中心-个人设置-手机号」</Link>里修改绑定手机，如您需要解绑手机号，您可联系<a
                href="tel:021-876787709 ">「在线客服」</a>为您处理。</p>
              <h2>如何注销IP二厂账号？</h2>
              <p>您好，很抱歉，IP二厂帐号暂不支持用户手动注销，如您因特殊需求需要注销帐号，您可联系「在线客服」，提供相关证明后为您处理。</p>
              <h2>如何修改/解绑社交账号？</h2>
              <p>请把鼠标放在网站右上角的头像上，在账号设置，找到社交账号绑定，解绑当前账号，再绑定其他社交账号即可。</p>
              <h2>如何退出？</h2>
              <p>请把鼠标放在网站右上角的头像上，会出现浮窗，点击退出按钮即可退出。</p>
            </div>
          </div> : <div className="static-container">
            <h1>充值/发票/退款问题</h1>
            <div className="container-inner">
              <h2>我充值VIP的话是立刻生效吗？</h2>
              <p>您好，在线扫码支付充值成功后即时到帐，刷新之前打开的下载页面即可。</p>
              <h2>充值了会员，还是不能查看更多填数据及对比数据？</h2>
              <p>您好，充值了会员还不能下载的情况，可能是：
                <br/>
                A. 充值存在缓存的现象，请充值之后，重新登录一下帐号尝试；
                <br/>
                B. 帐号登录错误导致。您可点击右上角头像进入帐号后台查询会员情况，如无会员，可提供在IP二厂购买VIP的【充值凭证】联系客服为您查询。
                <br/>
                C. 网站充值错误导致。可根据您在充值的支付记录里（微信或是支付宝），查看充值信息里的支付对象是否是「IP二厂」。
                <br/>
                D. 点击已经下载，可能是浏览器兼容不稳定的情况，建议更换QQ浏览器。
              </p>
              <h2>充值会员可以开发票吗？</h2>
              <p>您好，充值成功后可以为您开增值税普通发票，开票金额就是充值金额，提交申请以后会尽快给您发出，您只需付快递费即可（默认顺丰到付）；</p>
              <h2>充值会员能否把快递费和发票金额开一起？</h2>
              <p>不能，开票金额是您的付款金额，快递费是顺丰收取，可以联系顺丰开具收取发票。</p>
              <h2>以前充值的会员，可不可以开具发票？</h2>
              <p>可以的，充值后可随时联系<a href="tel:021-876787709 ">在线客服</a>申请发票，时间较长者请提供充值凭证（支付端的支付详情）</p>
              <h2>国企没有税号可以开发票吗？</h2>
              <p>国企的没有税号的可开无税号，需先咨询您公司财务人员核实好后可开具。</p>
              <h2>IP二厂发票可开内容有哪些？</h2>
              <p>开票内容类别如下：技术服务费、设计服务费、服务费、资料费、学习资料费</p>
              <h2>充值错误是否可以退款？</h2>
              <p>很抱歉，因网站提供查看评估数据及对比数据的特殊性，所以一旦购买，一律不接受退款申请。</p>
              <h2>如何查找支付凭证？</h2>
              <p>微信支付：打开微信-我的-钱包-右上角支付中心-账单-查找您的支付凭证
                <br/>
                支付宝支付：支付宝-我的-账单-查找您的支付凭证
              </p>
            </div>
          </div>
          }
        </div>
        <ScrollTop/>
      </div>
    );
  }
}
