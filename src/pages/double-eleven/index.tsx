/**
 * 双十一会员折扣
 * Balance.xue
 */
import * as React from 'react';
import '@assets/scss/double-eleven.scss';
import arrow_right from '@assets/images/double-eleven/arrow-right.png';
import { Modal } from 'antd';
import {
  IDoubleElevenStore,
  MemberLevel,
  modalIcon,
  modalTitle,
  couponTitle,
  couponNum,
  PayMethod
} from './components/vip';
import icon_load from '@assets/images/update/timg.gif';
import icon_peg from '@assets/images/user/vip/peg.png';
import icon_recommend from '@assets/images/user/vip/recommend.png';
import icon_selected from '@assets/images/user/vip/selected.png';
import pay_we_chat from '@assets/images/user/vip/wechat-qr-code-border.jpg';
import icon_renovate from '@assets/images/user/vip/ic_renovate.svg';
import icon_we_chat from '@assets/images/user/vip/ic_wechat.svg';
import icon_tip from '@assets/images/user/vip/ic_tip.svg';
import icon_select from '@assets/images/user/vip/ic_select.svg';
import { inject, observer } from 'mobx-react';
import Alert from '@components/alert';

interface IDoubleElevenState {
  active: number;
  isLogin: boolean;
  message: string;
}

interface IDoubleElevenPage extends IComponentProps {
  vip?: IDoubleElevenStore;
}

@inject('double_eleven', 'login', 'user')
@observer
export default class DoubleEleven extends React.Component<IDoubleElevenPage, IDoubleElevenState> {
  timer: NodeJS.Timeout;
  polling: NodeJS.Timeout;
  numTimer: NodeJS.Timeout;

  constructor(props) {
    super(props);
    this.state = {
      active: 1,
      isLogin: false,
      message: '',
    };
  }

  async componentDidMount() {
    // let sUserAgent = navigator.userAgent;
    // let mobileAgents = ['Android', 'iPhone', 'Symbian', 'WindowsPhone', 'iPod', 'BlackBerry', 'Windows CE'];
    // let goUrl = 0;
    // for (let i = 0; i < mobileAgents.length; i++) {
    //   if (sUserAgent.indexOf(mobileAgents[i]) > -1) {
    //     goUrl = 1;
    //     break;
    //   }
    // }
    // if (goUrl === 1) {
    //   window.location.href = 'http://mobile.indexip.cn/#/pages/eleven-active/eleven-active';
    // }
    const { double_eleven } = this.props;
    await double_eleven.getScrollNum();
    this.numTimer = await setInterval(() => double_eleven.getScrollNum(), 10000);

  }

  changeTab(num: number) {
    this.setState({
      active: num,
    });
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  private clearTimer = () => {
    this.timer && clearInterval(this.timer);
    this.polling && clearInterval(this.polling);
    this.numTimer && clearInterval(this.numTimer);
  };

  private setTimer = () => {
    this.timer = setInterval(() => this.props.double_eleven.setMask(true), 3600000);
  };

  private updateData = async () => {
    // const { callback, login } = this.props;
    // if (login.userInfo.userAttribute === 1) {
    //   callback && callback.length > 0 && await callback[0]();
    // } else {
    //   callback && callback.length > 0 && await callback[1]();
    // }
  };

  private setPolling = () => {
    this.polling = setInterval(async () => {
      await this.props.double_eleven.payStatus();
    }, 5000);
  };

  render() {
    const { active, isLogin, message } = this.state;
    const { double_eleven, login, user: storeUser } = this.props;
    const { personInfo, companyInfo } = storeUser;
    const { doubleNum } = double_eleven;
    const { userGuid } = login.userInfo || { userGuid: '' };

    return (
      <div className="double-eleven-content">
        <div className="limit-num">
          <div className="limit-num-left">仅限前1111名</div>
          <div className="limit-num-right">
            <span>剩余名额</span>
            {
              doubleNum && doubleNum.map((item, index) => {
                return <span className="limit-num-right__num" key={index}>{item}</span>;
              })
            }
          </div>
        </div>
        <div className="three-vip-tabs">
          <span className={active === 1 ? 'active' : ''} onClick={() => this.changeTab(1)}>钻石VIP会员年卡</span>
          <span className={active === 2 ? 'active' : ''} onClick={() => this.changeTab(2)}>黄金VIP会员年卡</span>
          <span className={active === 3 ? 'active' : ''} onClick={() => this.changeTab(3)}>白银VIP会员年卡</span>
        </div>
        <div className="vip-tab-contents">
          {
            active === 1 &&
            <div className="tab-content diamonds-content">
              <div className="content-title"/>
              <div className="content-buy-card">
                <p>限时限量<span className="word-red">5折</span>优惠，机会不是天天有，该出手时就出手</p>
                <div className="card-money">
                  <div className="old-money">
                    <p className="first-line">原价</p>
                    <p className="second-line"><span className="word-middleline">32088</span>/年</p>
                  </div>
                  <img className="middle-icon" src={arrow_right} alt=""/>
                  <div className="new-money">
                    <p className="first-line"><span className="word-red">折后</span>仅需</p>
                    <p className="second-line"><span className="word-red">16044</span>/年</p>
                  </div>
                </div>
                <p className="go-buy-button"
                   onClick={async () => {
                     if (userGuid) {
                       double_eleven.setLoading(true);
                       await double_eleven.setVisible(true, MemberLevel.Diamond);
                       this.setTimer();
                       this.setPolling();
                     } else {
                       localStorage.setItem('historyUrl', `double-eleven`);
                       this.setState({
                         isLogin: true,
                         message: '您还未登录,请先登录后进行操作',
                       });
                     }
                   }}
                >立即购买</p>
              </div>
              <p className="auth-title">钻石会员权限</p>
              <div className="four-auth">
                <div className="auth-item">
                  <p className="item-img"/>
                  <p className="item-title">IP筛选器</p>
                  <p className="item-desc">
                    根据项目设置的受众群体、微博粉丝量及关键词，查看推荐多个IP的匹配度、风险评估、热度&知名度、商业价值、推荐指数等
                  </p>
                </div>
                <div className="auth-item">
                  <p className="item-img"/>
                  <p className="item-title">IP对比数据</p>
                  <p className="item-desc">
                    多个同类型IP的基础数据和评估数据的对比
                  </p>
                </div>
                <div className="auth-item">
                  <p className="item-img"/>
                  <p className="item-title">IP评估数据</p>
                  <p className="item-desc">
                    受众画像（粉丝年龄比例、性别比例）/地区分布/商业价值/关键词云
                  </p>
                </div>
                <div className="auth-item">
                  <p className="item-img"/>
                  <p className="item-title">IP基础数据</p>
                  <p className="item-desc">
                    数据总览/播放趋势/口碑信息
                    互动指数/粉丝趋势/院线票房
                    发布平台/搜索指数/媒体关注度
                  </p>
                </div>
              </div>
              <p className="auth-title">钻石会员权限作用</p>
              <div className="auth-content auth-content-filter">
                <div className="auth-content__img"/>
                <div className="auth-content__desc">
                  <p className="desc-title">IP筛选器作用:</p>
                  <div className="desc-words">
                    <span className="img"/>
                    <p>根据你的需求进行快速IP过滤，帮你在海量IP库内大浪淘金，让你的IP投资又快又准。</p>
                  </div>
                  <div className="desc-words">
                    <span className="img"/>
                    <p>根据你的需求进行快速IP过滤，帮你在海量IP库内大浪淘金，让你的IP投资又快又准。</p>
                  </div>
                </div>
              </div>

              <div className="auth-content auth-content-compare">
                <div className="auth-content__desc">
                  <p className="desc-title">IP对比数据作用:</p>
                  <div className="desc-words">
                    <span className="img"/>
                    <p>多重数据，综合对比，全方位反应市场行业动向，帮你快速看清相似IP关键信息概况；</p>
                  </div>
                  <div className="desc-words">
                    <span className="img"/>
                    <p>明确IP优势指数，多维度比较多款竞品IP重点指数表现，让你直观看清多款同类型竞品IP谁市场表现更突出。</p>
                  </div>
                </div>
                <div className="auth-content__img"/>
              </div>

              <div className="auth-content auth-content-appraise">
                <div className="auth-content__img"/>
                <div className="auth-content__desc">
                  <p className="desc-title">IP评估数据作用:</p>
                  <div className="desc-words">
                    <span className="img"/>
                    <p>大数据呈现IP用户画像，可视化读懂IP消费者，让你的IP推广更具针对性、更具效果；</p>
                  </div>
                  <div className="desc-words">
                    <span className="img"/>
                    <p>智能分析IP在市场内分布情况，让你提前解锁IP卖点，帮你的IP营销更优化更具精准性，更大限度实现IP变现；</p>
                  </div>
                  <div className="desc-words">
                    <span className="img"/>
                    <p>提供IP关键词云研究，帮你把脉IP受众需求，让你全面掌握市场卖点。</p>
                  </div>
                </div>

              </div>

              <div className="auth-content auth-content-basic">
                <div className="auth-content__desc">
                  <p className="desc-title">IP基础数据作用:</p>
                  <div className="desc-words">
                    <span className="img"/>
                    <p>聚合全网数据，让你一站式掌握IP关键指数，节约你的时间成本；</p>
                  </div>
                  <div className="desc-words">
                    <span className="img"/>
                    <p>主流平台数据对比，让你对IP市场行情一目了然，帮你快速判断IP产品化可行性；</p>
                  </div>
                  <div className="desc-words">
                    <span className="img"/>
                    <p>IP粉丝趋势展现，帮你看透每一个IP需求，让你轻松把控IP市场定位。</p>
                  </div>
                </div>
                <div className="auth-content__img"/>
              </div>

            </div>
          }
          {
            active === 2 &&
            <div className="tab-content gold-content">
              <div className="content-title"/>
              <div className="content-buy-card">
                <p>限时限量<span className="word-red">5折</span>优惠，机会不是天天有，该出手时就出手</p>
                <div className="card-money">
                  <div className="old-money">
                    <p className="first-line">原价</p>
                    <p className="second-line"><span className="word-middleline">5898</span>/年</p>
                  </div>
                  <img className="middle-icon" src={arrow_right} alt=""/>
                  <div className="new-money">
                    <p className="first-line"><span className="word-red">折后</span>仅需</p>
                    <p className="second-line"><span className="word-red">2949</span>/年</p>
                  </div>
                </div>
                <p className="go-buy-button"
                   onClick={async () => {
                     if (userGuid) {
                       double_eleven.setLoading(true);
                       await double_eleven.setVisible(true, MemberLevel.Gold);
                       this.setTimer();
                       this.setPolling();
                     } else {

                       localStorage.setItem('historyUrl', `double-eleven`);
                       this.setState({
                         isLogin: true,
                         message: '您还未登录,请先登录后进行操作',
                       });
                     }
                   }}
                >立即购买</p>
              </div>
              <p className="auth-title">黄金会员权限</p>
              <div className="four-auth">
                <div className="auth-item">
                  <p className="item-img"/>
                  <p className="item-title">IP基础数据</p>
                  <p className="item-desc">
                    数据总览/播放趋势/口碑信息
                    互动指数/粉丝趋势/院线票房
                    发布平台/搜索指数/媒体关注度
                  </p>
                </div>
                <div className="auth-item">
                  <p className="item-img"/>
                  <p className="item-title">IP评估数据</p>
                  <p className="item-desc">
                    受众画像（粉丝年龄比例、性别比例）/地区分布/商业价值/关键词云
                  </p>
                </div>
                <div className="auth-item">
                  <p className="item-img"/>
                  <p className="item-title">IP对比数据</p>
                  <p className="item-desc">
                    多个同类型IP的基础数据和评估数据的对比
                  </p>
                </div>
                <div className="auth-item">
                  <p className="item-img"/>
                  <p className="item-title">IP筛选器</p>
                  <p className="item-desc">
                    根据项目设置的受众群体、微博粉丝量及关键词，查看推荐多个IP的匹配度、风险评估、热度&知名度、商业价值、推荐指数等
                  </p>
                </div>
              </div>
              <p className="auth-title">黄金会员权限作用</p>
              <div className="auth-content auth-content-appraise">
                <div className="auth-content__img"/>
                <div className="auth-content__desc">
                  <p className="desc-title">IP评估数据作用:</p>
                  <div className="desc-words">
                    <span className="img"/>
                    <p>大数据呈现IP用户画像，可视化读懂IP消费者，让你的IP推广更具针对性、更具效果；</p>
                  </div>
                  <div className="desc-words">
                    <span className="img"/>
                    <p>智能分析IP在市场内分布情况，让你提前解锁IP卖点，帮你的IP营销更优化更具精准性，更大限度实现IP变现；</p>
                  </div>
                  <div className="desc-words">
                    <span className="img"/>
                    <p>提供IP关键词云研究，帮你把脉IP受众需求，让你全面掌握市场卖点。</p>
                  </div>
                </div>

              </div>

              <div className="auth-content auth-content-basic">
                <div className="auth-content__desc">
                  <p className="desc-title">IP基础数据作用:</p>
                  <div className="desc-words">
                    <span className="img"/>
                    <p>聚合全网数据，让你一站式掌握IP关键指数，节约你的时间成本；</p>
                  </div>
                  <div className="desc-words">
                    <span className="img"/>
                    <p>主流平台数据对比，让你对IP市场行情一目了然，帮你快速判断IP产品化可行性；</p>
                  </div>
                  <div className="desc-words">
                    <span className="img"/>
                    <p>IP粉丝趋势展现，帮你看透每一个IP需求，让你轻松把控IP市场定位。</p>
                  </div>
                </div>
                <div className="auth-content__img"/>
              </div>

            </div>
          }
          {
            active === 3 &&
            <div className="tab-content silver-content">
              <div className="content-title"/>
              <div className="content-buy-card">
                <p>限时限量<span className="word-red">5折</span>优惠，机会不是天天有，该出手时就出手</p>
                <div className="card-money">
                  <div className="old-money">
                    <p className="first-line">原价</p>
                    <p className="second-line"><span className="word-middleline">998</span>/年</p>
                  </div>
                  <img className="middle-icon" src={arrow_right} alt=""/>
                  <div className="new-money">
                    <p className="first-line"><span className="word-red">折后</span>仅需</p>
                    <p className="second-line"><span className="word-red">499</span>/年</p>
                  </div>
                </div>
                <p className="go-buy-button"
                   onClick={async () => {
                     if (userGuid) {
                       double_eleven.setLoading(true);
                       await double_eleven.setVisible(true, MemberLevel.silver);
                       this.setTimer();
                       this.setPolling();
                     } else {

                       localStorage.setItem('historyUrl', `double-eleven`);
                       this.setState({
                         isLogin: true,
                         message: '您还未登录,请先登录后进行操作',
                       });
                     }
                   }}
                >
                  立即购买</p>
              </div>
              <p className="auth-title">白银会员权限</p>
              <div className="four-auth">
                <div className="auth-item">
                  <p className="item-img"/>
                  <p className="item-title">IP基础数据</p>
                  <p className="item-desc">
                    数据总览/播放趋势/口碑信息
                    互动指数/粉丝趋势/院线票房
                    发布平台/搜索指数/媒体关注度
                  </p>
                </div>
                <div className="auth-item">
                  <p className="item-img"/>
                  <p className="item-title">IP评估数据</p>
                  <p className="item-desc">
                    受众画像（粉丝年龄比例、性别比例）/地区分布/商业价值/关键词云
                  </p>
                </div>
                <div className="auth-item">
                  <p className="item-img"/>
                  <p className="item-title">IP对比数据</p>
                  <p className="item-desc">
                    多个同类型IP的基础数据和评估数据的对比
                  </p>
                </div>
                <div className="auth-item">
                  <p className="item-img"/>
                  <p className="item-title">IP筛选器</p>
                  <p className="item-desc">
                    根据项目设置的受众群体、微博粉丝量及关键词，查看推荐多个IP的匹配度、风险评估、热度&知名度、商业价值、推荐指数等
                  </p>
                </div>

              </div>
              <p className="auth-title">白银会员权限作用</p>
              <div className="auth-content auth-content-basic">
                <div className="auth-content__desc">
                  <p className="desc-title">IP基础数据作用:</p>
                  <div className="desc-words">
                    <span className="img"/>
                    <p>聚合全网数据，让你一站式掌握IP关键指数，节约你的时间成本；</p>
                  </div>
                  <div className="desc-words">
                    <span className="img"/>
                    <p>主流平台数据对比，让你对IP市场行情一目了然，帮你快速判断IP产品化可行性；</p>
                  </div>
                  <div className="desc-words">
                    <span className="img"/>
                    <p>IP粉丝趋势展现，帮你看透每一个IP需求，让你轻松把控IP市场定位。</p>
                  </div>
                </div>
                <div className="auth-content__img"/>
              </div>

            </div>
          }

          <Modal
            wrapClassName='wrap-modal'
            width={'7.2rem'}
            bodyStyle={{
              padding: 0,
              overflow: 'hidden',
              borderRadius: '.06rem',
              backgroundColor: 'white',
            }}
            visible={double_eleven.visible}
            footer={null}
            destroyOnClose
            onCancel={() => double_eleven.setClear()}
            afterClose={async () => {
              await this.updateData();
              this.clearTimer();
            }}
          >
            {
              double_eleven.isLoading
              && <div className="limit-loading justify-content-center align-items-center">
                <img src={icon_load} alt=""/>
              </div>
            }
            <div className='vip-modal-header'>
              <div className='vip-modal-header-title flex-row align-items-center'>
                <img className='modal-header-icon' src={modalIcon[double_eleven.memberLevel]} alt=""/>
                <span className='title'>{modalTitle[double_eleven.memberLevel]}</span>
              </div>
              <div className='header-info-area flex-row align-items-center'>
                <img className='avatar' src={login.userInfo && login.userInfo.picUrl} alt=''/>
                <div className='info-name-area flex-column'>
                  <div className='info-name'>{companyInfo.companyName || personInfo.userRealName}</div>
                  <div className='info-account'>
                    登录账号: {login.userInfo && login.userInfo.mobile && login.userInfo.mobile.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3')}</div>
                </div>
              </div>
            </div>
            <div className='vip-card-area'>
              <div className="vip-coupon">{couponTitle[double_eleven.memberLevel]}</div>
              <img className="arrow-right" src={arrow_right} alt=""/>
              <div className="vip-num">
                <p>卷后<i>应付</i>:</p>
                <p><i>{couponNum[double_eleven.memberLevel]}</i>元</p>
              </div>
            </div>

            <div className='vip-pay-area'>
              <div className='pay-header flex-row'>
                <div
                  onClick={async () => {
                    double_eleven.setPayMethod(PayMethod.WeChatPay);
                    await double_eleven.setCardType();
                  }}
                  className={'pay-header-item' + (double_eleven.payMethod === PayMethod.WeChatPay ? ' pay-header-item-active' : '')}
                >
                  微信支付
                </div>

                <div
                  onClick={async () => {
                    double_eleven.setPayMethod(PayMethod.UnionPay);
                    // await vip.setCardType();
                  }}
                  className={'pay-header-item' + (double_eleven.payMethod === PayMethod.UnionPay ? ' pay-header-item-active' : '')}
                >
                  银行卡支付
                </div>

                <div className="pay-header-blank-item"/>
              </div>

              {/* 二维码区域 */}
              {
                double_eleven.payMethod !== PayMethod.UnionPay &&
                <div className='pay-qr-code-area justify-content-center align-items-center'>
                  <div
                    className='qr-code-area'
                    style={{
                      backgroundImage: `url(${pay_we_chat})`,
                    }}>
                    <img className='qr-code-img' src={double_eleven.qrCode} alt=""/>
                    {
                      double_eleven.showMask &&
                      <div
                        onClick={async () => {
                          double_eleven.setMask();
                          await double_eleven.setCardType();
                          this.clearTimer();
                          this.setTimer();
                          this.setPolling();
                        }}
                        className='qr-code-mask flex-column justify-content-center align-items-center'>
                        <img className='mask-img' src={icon_renovate} alt=""/>
                        <span className='mask-text'>点击刷新</span>
                      </div>
                    }
                  </div>
                  <div className='qr-price-area'>
                    <div className='qr-price'>
                      应付金额:&nbsp;
                      <span className='price-mark'>¥</span>
                      <span className='qr-price-number'>
                        {double_eleven.showPrice || (double_eleven.cards && double_eleven.cards[2] || { paymentAmount: 0 }).paymentAmount}
                      </span>
                    </div>
                    <div className='qr-price-tip'>
                      <img className='icon-tip' src={icon_we_chat} alt=""/>
                      <span>微信扫码支付</span>
                    </div>
                  </div>
                </div>
              }
              {/* 二维码区域结束 */}

              {
                double_eleven.payMethod === PayMethod.UnionPay
                && <div className="union-pay-area flex-column">
                  <div className='union-pay-line'>
                    <span className='line-name'>收款账户名：</span>
                    <span className='line-content'>酷拓文化交流（上海）有限公司</span>
                  </div>

                  <div className='union-pay-line'>
                    <span className='line-name'>开户银行：</span>
                    <span className='line-content'>招商银行上海延西支行</span>
                  </div>

                  <div className='union-pay-line'>
                    <span className='line-name'>收款银行账号：</span>
                    <span className='line-content'>1219&nbsp;1938&nbsp;2010&nbsp;301</span>
                  </div>

                  <div className="bottom-union-pay-line">
                    <img className='exclamation-mark' src={icon_tip} alt=""/>
                    <span className='pay-tip'>打款前，请先联系客户告知您的付款账户及个人/企业网站账户信息，以便于我们能在收款后帮您修改账户权限。</span>
                  </div>
                </div>
              }

            </div>

            <div
              onClick={() => {
                // vip.setAgree()
              }}
              className='clause-area align-items-center'
            >
              {double_eleven.agree ? <img className='ic-select' src={icon_select} alt=""/> :
                <div className='no-ic-select'/>}
              <span
                onClick={() => double_eleven.setAgreement(true)}>支付即同意《VIP会员服务协议》</span>
            </div>
          </Modal>
          <Modal
            className="payment-agreement"
            title="VIP会员服务协议"
            visible={double_eleven.agreementVisible}
            onCancel={() => double_eleven.setAgreement(false)}
            width={'7.2rem'}
            centered={true}
            bodyStyle={{
              height: '7rem',
              overflow: 'auto',
              padding: '0.2rem',
              borderRadius: '.06rem',
              backgroundColor: 'white',
            }}
            footer={null}
          >
            <p> 欢迎使用IP二厂，在您使用IP二厂提供的各项VIP会员及非会员服务（以下简称“服务”）之前，请务必仔细阅读并透彻理解本协议。
              如您不同意本协议及其更新内容，您可以主动取消IP二厂提供的服务；您一旦使用IP二厂的服务，即视为您已了解并完全同意本协议的各项内容，
              并成为IP二厂用户（以下简称“用户”）。IP二厂有权在必要时修改用户协议，协议一旦发生变动，将会以网站公告的形式提示修改内容，
              变动结果将在IP二厂通知之日起生效。如果您不同意所改动的内容，您有权停止使用IP二厂的服务，如果您继续使用IP二厂的各项服务，
              则视为接受服务条款的变动。用户理解并同意：由于数据行业的特殊性，IP二厂具有保留修改或中断部分或全部服务的权利。</p>
            <p>“IP二厂帐户”是指您通过IP二厂的产品或网站注册的帐户，IP二厂所提供的部分服务需要您在登录您的IP二厂帐户之后使用。
              除本协议外，IP二厂发布的其他相关的业务规则也是本协议的一部分，请您仔细阅读。</p>
            <h4>一、 服务内容</h4>
            <p>【IP二厂】作为面向授权行业的服务型平台，将为行业打通上下游信息、实现行业社交、科学理性授权等提供服务与决策依据，并提供后续的营销支持。</p>
            <h4>二、 用户注册及使用规范</h4>
            <p>1、IP二厂账号的所有权归IP二厂所有，您完成申请注册手续后，将获得所注册账号的使用权，该使用权仅限于您使用，您无权赠与、借用、租用、转让或售卖您的账号。</p>
            <p>2、用户应当妥善保管账户及密码信息，由于用户自身行为导致的账户或密码的泄露、遗忘等情形或其他原因所带来的损失， IP二厂将尽量配合用户采取积极措施降低相关损失，但因此造成的不利后果由用户自行承担。</p>
            <p>3、您在使用IP二厂时，所发布的信息（包括用户注册名、用户头像等）时，
              必须遵守国家有关法律规定，并承担一切因自己发布信息不当导致的民事、行政、或刑事法律责任。您在使用IP二厂所发布的消息，不得含有以下内容或用于以下目的：</p>
            <p>违反宪法确定的基本原则的；</p>
            <p>危害国家安全，泄露国家机密，颠覆国家政权，破坏国家统一的；</p>
            <p>损害国家荣誉和利益，攻击党和政府的；</p>
            <p>煽动民族仇恨、民族歧视，破坏民族团结的；</p>
            <p>破坏国家、地区间友好关系的；</p>
            <p> 违背中华民族传统美德、社会公德、论理道德、以及社会主义精神文明的；</p>
            <p> 破坏国家宗教政策，宣扬邪教和封建迷信的；</p>
            <p>散布谣言或不实消息，扰乱社会秩序，破坏社会稳定的；</p>
            <p> 煽动、组织、教唆恐怖活动、非法集会、结社、游行、示威、聚众扰乱社会秩序的；</p>
            <p> 散布淫秽、色情、赌博、暴力、恐怖或者教唆犯罪的；</p>
            <p>侮辱或诽谤他人，侵害他人合法权益的；</p>
            <p>侵犯他人肖像权、姓名权、名誉权、隐私权或其他人身权利的；</p>
            <p>以非法民间组织名义活动的；</p>
            <p>侵犯他人著作权等合法权益的；</p>
            <p>侵犯他人商业秘密等合法权益的；</p>
            <p> 含有其他违反法律、法规、国家政策及公序良俗的法律、行政法规禁止的其他内容的。</p>
            <p>4、如果您在使用IP二厂所提供的的服务时不能履行和遵守协议中的规定，IP二厂有权删除您发布的相关信息，直到封闭您的账号或/和暂时、永久禁止在IP二厂发布信息的处理，
              同时保留依法追究您的法律责任的权利，IP二厂保留将系统内的记录有可能作为您违反法律和本协议的证据加以保存与展示的权利。</p>
            <p>5、未经IP二厂许可，任何单位或个人不得通过任何方式（包括但不限于恶意注册IP二厂账号， 机器抓取、复制、镜像等方式）不合理地获取IP二厂站内信息、资讯、数据等。</p>
            <p>6、信息推送</p>
            <p>6.1您同意IP二厂可以在提供服务的过程中自行或由第三方广告商向您发送广告、推广或宣传信息（包括商业与非商业信息），其方式和范围可不经向您特别通知而变更。</p>
            <p>6.2 IP二厂可能为您提供选择关闭广告信息的功能，但任何时候您都不得以本协议未明确约定或IP二厂未书面许可的方式屏蔽、过滤广告信息（如有）。</p>
            <p>6.3IP二厂依照法律的规定对广告商履行相关义务，您应当自行判断广告信息的真实性并为自己的判断行为负责，除法律明确规定外，您因依该广告信息进行的交易或前述广告商提供的内容而遭受的损失或损害，IP二厂不承担责任。</p>
            <p>6.4您同意，对IP二厂服务中出现的广告信息，您应审慎判断其真实性和可靠性，除法律明确规定外，您应对依该广告信息进行的交易负责。</p>
            <h4>三、 VIP会员服务条款</h4>
            <h4>隐私权政策</h4>
            <p>1.1
              IP二厂向VIP会员提供的全部服务，均仅限于VIP会员在IP二厂平台使用，任何以恶意破解等非法手段将IP二厂提供的服务内容与IP二厂平台分离的行为（例如毫无根据的恶意修改IP二厂展示信息），
              均不属于本协议中约定的IP二厂提供的服务。由此引起的一切法律后果由行为人负责，IP二厂将依法追究行为人的法律责任。</p>
            <p>1.2 当VIP会员使用IP二厂各单项服务时，VIP会员的使用行为视为其对各单项服务的服务条款以及IP二厂在该单项服务中发出各类公告的同意。</p>
            <p> 1.3 您明确了解并同意，IP二厂 VIP会员的付费方式为代收费运营商托收的付款方式，您通过此种付费方式付费可能存在一定的商业风险，
              包括但不限于不法分子利用您账户或银行卡等有价卡进行违法活动，该等风险均会给您造成相应的经济损失。您应自行承担向侵权方追究侵权责任和追究责任不能的后果。</p>
            <p>1.4 您应自行负责妥善且正确地保管、使用、维护您在IP二厂申请取得的账户、账户信息及账户密码。 您应对您账户信息和账户密码采取必要和有效的保密措施，避免与第三人共享账户及相关服务信息。
              非IP二厂原因致使您账户密码泄漏以及因您保管、使用、维护不当造成损失的，IP二厂无须承担与此有关的任何责任。</p>
            <p>1.5 IP二厂不对您因第三方的行为或不作为造成的损失承担任何责任，包括但不限于支付服务和网络接入服务、任意第三方的侵权行为。</p>
            <p>2、成为VIP会员的方式</p>
            <p>2.1 在成为IP二厂 VIP会员之前，您必须先根据真实、准确信息注册成为IP二厂用户。 用户所填写的内容与个人资料必须真实有效，否则IP二厂有权拒绝其申请或撤销其VIP会员资格，
              并不予任何赔偿或退还VIP会员服务费。VIP会员的个人资料发生变化，应及时修改注册的个人资料，
              否则由此造成的VIP会员权利不能全面有效行使的责任由VIP会员自己承担，IP二厂有权因此取消其VIP会员资格，并不予退还VIP会员费或其他任何形式的任何赔偿。</p>
            <p> 2.2 用户可通过各种已有和未来新增的渠道成为IP二厂 VIP会员，包括但不限于：通过网银支付、
              手机支付或第三方支付等方式成为VIP会员。在用户使用具体某种方式成为VIP会员时，须阅读并确认接受相关的服务条款和使用方法。</p>
            <p>2.3 成为VIP会员后，VIP会员有权利不接受IP二厂的服务，可联系客服取消VIP会员服务，但非因双方另行达成约定的则无法获得VIP会员服务费的退还。</p>
            <p>2.4 IP二厂 VIP会员账号所有权归IP二厂所有，VIP会员拥有IP二厂账号的有限使用权。</p>
            <p>2.5 IP二厂仅提供相关的网络服务，除此之外与相关网络服务有关的设备（如个人电脑、手机、及其他与接入互联网或移动网有关的装置）
              及所需的费用（如为接入互联网而支付的电话费及上网费、为使用移动网而支付的手机费）均应由VIP会员自行负担。</p>
            <p>3. VIP会员服务和账号查询</p>
            <p> 3.1 一旦您成为IP二厂 VIP会员，即视为您认可该项服务标明之价格；成为IP二厂 VIP会员后，该项服务即时生效。</p>
            <p>3.2 VIP会员的服务标准以IP二厂网站上标注的详细资费标价为准，IP二厂对会员的服务有修改价格、升级服务、增减功能等权利。</p>
            <p>4. VIP会员的权利及限制</p>
            <p> 4.1 IP二厂在此声明：任何未经授权销售IP二厂 VIP会员的属于无权销售行为，IP二厂有权追究其法律责任并同时封停相关账户的权利，
              因此产生的任何损失由行为人自行承担。VIP会员服务仅限于申请账号自行使用；VIP会员激活后服务期内不能在IP二厂帐号之间转移，禁止赠与、借用、转让或售卖。
              否则IP二厂有权在未经通知的情况下取消转让账户、受让账户的VIP会员服务资格，由此带来的损失由VIP会员自行承担。</p>
            <p> 4.2 IP二厂 VIP账号同一时间同一账号仅可在1台移动通信设备上登录使用，
              超出上述范围使用的，将被强制下线。用户应当自行承担超范围使用而导致的任何损失，同时IP二厂保留追究上述行为人法律责任的权利。</p>
            <p>4.3 若VIP会员的行为持续违反本协议或违反国家相关法律法规，或IP二厂认为VIP会员行为有损IP二厂或他人的声誉及利益，IP二厂公司有权取消该VIP会员的VIP会员资格而无须给与任何补偿。</p>
            <p>4.4 VIP会员不得以盗窃、利用系统漏洞等非法途径以及在未获IP二厂授权的非法销售IP二厂
              VIP会员的网站上获取或购买VIP会员服务，否则IP二厂有权取消VIP会员的服务资格。由此引发的问题由VIP会员自行承担，IP二厂不负任何责任。</p>
            <p>4.6 任何VIP会员不得使用带有非法、淫秽、污辱或人身攻击的含义污辱或人身攻击的昵称和评论，一经发现，IP二厂有权取消其VIP会员资格而无需给与任何补偿和退费。</p>
            <h4> 隐私协议</h4>
            <p>IP二厂尊重并非常注意保护所有使用IP二厂服务用户（“您”）的个人信息及隐私。为了给您提供更加准确、更个性化的服务，IP二厂会按照本隐私权政策的规定使用和披露您的个人信息。
              但IP二厂将以高度的勤勉、审慎的态度对待您的个人信息。除非有法律和政府的强制规定，在事先未征得您许可或者授权的情况下，
              IP二厂不会将您的信息对外披露或者向第三方提供。IP二厂会不时更新本隐私权政策。您在同意IP二厂用户协议之时，即视为您已经同意本隐私权政策全部内容。</p>
            <p>1. 适用范围</p>
            <p>a) 在您注册IP二厂账户时，您根据IP二厂要求提供的个人或组织注册信息；</p>
            <p> b) 在您使用IP二厂服务，或访问indexip.cn网页时，IP二厂自动接收并记录的您的浏览器和计算机上的信息，
              包括但不限于您的IP地址、浏览器的类型、使用的语言、访问日期和时间、软硬件特征信息及您需求的网页记录等数据；</p>
            <p>c) IP二厂通过合法途径从商业伙伴处取得的用户个人隐私数据。</p>
            <p>您了解并同意，以下信息不适用本隐私权政策：</p>
            <p>a) 您在使用indexip.cn提供的服务时，对外公布的信息；</p>
            <p>b) 任何国家官方网站、门户网站及行业性门户网站上的公开信息；</p>
            <p>c) 信用评价、违反法律规定或违反IP二厂规则行为及IP二厂已对您采取的措施。</p>
            <p>2. 信息使用</p>
            <p> a)
              IP二厂不会向任何无关第三方提供、出售、出租、分享或交易您的个人信息，除非事先得到您的许可，或该第三方和IP二厂（含IP二厂关联公司）单独或共同为您提供服务，且在该服务结束后，该第三方将被禁止访问包括其以前能够访问的所有这些资料；</p>
            <p>b) IP二厂亦不允许任何第三方以任何手段收集、编辑、出售或者无偿传播您的个人信息。任何indexip.cn用户如从事上述活动，一经发现，IP二厂有权立即终止与该用户的服务协议并追究其法律责任；</p>
            <p>c)
              为服务用户的目的，IP二厂可能通过使用您的个人信息，向您提供您感兴趣的信息，包括但不限于向您发出产品和服务信息，或者与IP二厂合作伙伴共享信息以便他们向您发送有关其产品和服务的信息（后者需要您的事先同意）。</p>
            <p>3. 信息披露</p>
            <p> 在如下情况下，IP二厂将依据您的个人意愿或法律的规定全部或部分的披露您的个人信息：</p>
            <p>a) 经您事先同意，向第三方披露；</p>
            <p> b) 如您是适格的知识产权投诉人并已提起投诉，应被投诉人要求，向被投诉人披露，以便双方处理可能的权利纠纷；</p>
            <p>c) 根据法律的有关规定，或者行政或司法机构的要求，向第三方或者行政、司法机构披露；</p>
            <p>d) 如您出现违反中国有关法律、法规或者IP二厂服务协议或相关规则的情况，需要向第三方披露；</p>
            <p>e) 为提供您所要求的产品和服务，而必须和第三方分享您的个人信息；</p>
            <p>f) 在indexip.cn上创建的某一交易中，如交易任何一方履行或部分履行了交易义务并提出信息披露请求的，IP二厂有权决定向该用户提供其交易对方的联络方式等必要信息，以促成交易的完成或纠纷的解决；</p>
            <p>g)其它IP二厂根据法律、法规或者网站政策认为合适的披露。</p>
            <p>4. 信息存储和交换</p>
            <p>IP二厂收集的有关您的信息和资料将保存在IP二厂及（或）其关联公司的服务器上。</p>
            <p>5. Cookie的使用</p>
            <p>a)
              在您未拒绝接受cookies的情况下，IP二厂会在您的计算机上设定或取用cookies，以便您能登录或使用依赖于cookies的indexip.cn服务或功能。IP二厂使用cookies可为您提供更加周到的个性化服务，包括推广服务；</p>
            <p>b)
              您有权选择接受或拒绝接受cookies。您可以通过修改浏览器设置的方式拒绝接受cookies。但如果您选择拒绝接受cookies，则您可能无法登录或使用依赖于cookies的indexip.cn服务或功能；</p>
            <p>c) 通过IP二厂所设cookies所取得的有关信息，将适用本政策。</p>
            <p>6. 信息安全</p>
            <p>a)
              IP二厂账户均有安全保护功能，请妥善保管您的账户及密码信息。IP二厂将通过向其它服务器备份、对用户密码进行加密等安全措施确保您的信息不丢失，不被滥用和变造。尽管有前述安全措施，但同时也请您注意在信息网络上不存在绝对完善的安全措施；</p>
            <p>b)
              在使用indexip.cn服务进行网上交易时，您不可避免的要向交易对方或潜在的交易对方披露自己的个人信息，
              如联络方式或者邮政地址。请您妥善保护自己的个人信息，仅在必要的情形下向他人提供。
              如您发现自己的个人信息泄密，尤其是IP二厂账户及密码发生泄露，请您立即联络IP二厂客服，以便IP二厂采取相应措施帮助您避免或减少损失。</p>
            <h4>版权政策</h4>
            <p>除非IP二厂另行声明，IP二厂平台内的本网站（www.indexip.cn）的所有产品、技术、软件、程序、数据及其他信息（包括但不限于文字、图像、图片、照片、音频、视频、图表、色彩、版面设计、电子文档）的所有权利所有知识产权（包括但不限于版权、商标权、专利权、商业秘密及其他所有相关权利）均归IP二厂或其关联公司所有。未经IP二厂许可，任何人不得擅自使用（包括但不限于通过任何机器人、蜘蛛等程序或设备监视、复制、传播、展示、镜像、上载、下载）IP二厂平台内的任何内容。
              IP二厂平台的Logo、“IP二厂”等文字、图形及其组合，以及IP二厂平台的其他标识、徽记、产品和服务名称均为IP二厂及其关联公司在中国和其它国家的商标，未经IP二厂书面授权，任何人不得以任何方式展示、使用或作其他处理，也不得向他人表明您有权展示、使用或作其他处理。
              IP二厂尊重知识产权，反对侵权盗版行为。未经IP二厂许可，任何人不得擅自（包括但不限于：以非法的方式复制、传播、展示、镜像、上载、下载）使用，或通过非常规方式（如：恶意干预IP二厂数据）影响IP二厂的正常服务，任何人不得擅自以软件程序自动获得IP二厂数据。否则，IP二厂有权依法追究其法律责任。
              未经IP二厂许可，任何人禁止转载或商业使用IP二厂网站内文字、图形、表格等信息，否则，IP二厂保留采取一切合法方式维护正当利益的权利。经许可的信息的转载或商业使用时，应当以恰当方式说明，该信息来源于IP二厂。</p>
            <p> 免责声明</p>
            <p>IP二厂是一款公开信息查询系统。根据用户指令，IP二厂的搜索引擎系统会以非人工检索方式自动生成用户检索的已经依法公开的企业信息，以便用户能够找到和使用该已被公开信息。
              IP二厂是基于网络公开信息和行业报告，通过大数据技术分析进行的数据整合，该结果仅可作为用户进行任何判断时的参考之一，若任何人通过使用该数据分析结果做出任何行为，该结行为相关权利义务由行为人自行承担。查询人必须依法使用查询信息，不得用于非法目的和不正当用途。非法使用本网站信息给他人造成损害的，由使用人自行承担相应责任。
              IP二厂自身不主动编辑或修改被所公示网站上的信息的内容或其表现形式，仅对相关网站依法公示的信息如实展示。因此，IP二厂无法保证该数据与信息的完整的真实与时效性。同时，用户在使用IP二厂时说明其已经理解并接受以下情形的免责声明：</p>
            <p>1) IP二厂对由于用户不正当使用本网站服务、或依据本网站信息进行交易引起的对任何第三方的损害不承担任何赔偿责任；</p>
            <p>2) 本网站的内容及提供的服务不含任何明示性或暗示性的声明、保证或条件，包括但不限于关于真实性、 时效性或适用于某一特定用途的明示或暗示性的声明、保证或条件，或者对其使用不会被中断或无误；</p>
            <p>3) IP二厂不声明或保证本网站或可从本网站下载的内容不带有计算机病毒或类似垃圾或破坏功能；</p>
            <p>4) IP二厂不担保本网站服务一定能满足用户的要求，不对页面内容的删除或储存失败负责；</p>
            <p>5) 若IP二厂已经明示本网站运营方式发生变更并提醒用户应当注意事项，用户未按要求操作所产生的一切后果由用户自行承担；</p>
            <p>6) 已经注册为IP二厂会员的用户，在超出会员服务范围外要求的其他服务可能会产生额外的费用由用户自己承担。</p>
            <p>7) IP二厂对由于政府禁令、现行生效的适用法律或法规的变更、火灾、地震、动乱、战争、停电、通讯线路中断、
              黑客攻击、计算机病毒侵入或发作、电信部门技术调整、因政府管制而造成网站的暂时性关闭等任何影响网络正常运营的不可预见、
              不可避免、不可克服和不可控制的事件（“不可抗力事件”），以及他人蓄意破坏、金堤科技工作人员的过失疏忽或不当使用， 正常的系统维护、
              系统升级，或者因网络拥塞而导致本网站不能访问而造成的本站所提供的信息及数据的延误、
              停滞或错误，使用者由此受到的一切损失不承担任何责任。</p>
            <p>8) 用户确认其知悉，对于IP二厂提供的数据服务系统内容涉及根据法律法规或规范性文件需要数据查询或使用者获得数据相关方权利人授权的， 用户及用户相关系统使用人员应当于数据查询与使用前自行获取相关权利人授权，
              尚未获得相关权利人授权而对相关信息进行查询与使用的，因此造成一切不利后果由用户自行承担。</p>
            <p>9) 用户确认其知悉由于您将用户密码告知他人或与他人共享注册帐户，由此导致的任何个人信息的泄漏， 或其他非因IP二厂平台原因导致的个人信息的泄漏，IP二厂概不负责；</p>
            <p>10) 用户确认其知悉，使用本网站提供的服务涉及到互联网服务， 可能会受到各个环节不稳定因素的影响。因此服务存在因国家相关行业主管部门及电信运营商的调整、
              系统不稳定、用户所在位置、用户关机以及其他任何技术、互联网络、通信线路原因等造成的服务中断或不能满足用户要求的风险。
              用户须承担以上风险，IP二厂不作担保。对因此导致用户不能发送、上传和接受阅读消息、或接发错消息，
              或无法实现其他通讯条件，IP二厂不承担任何责任。</p>
            <p>11) 用户确认其知悉，在使用本网站提供的服务存在有来自任何其他人的包括威胁性的、诽谤性的、 令人反感的或非法的内容或行为或对他人权利的侵犯(包括知识产权)
              的匿名或冒名的信息的风险，用户须承担以上风险，对因此导致任何因用户不正当或非法使用服务产生的直接、间接、偶然、 惩罚性的损害，不承担任何责任。</p>
            <p>12) 如果您不是具备完全民事权利能力和完全民事行为能力的自然人，您无权使用IP二厂服务， 因此IP二厂希望您不要向我们提供任何个人信息。</p>
            <h4>禁止事项</h4>
            <p> 如果您同意该项协议，则默认您承诺不做以下行为：</p>
            <p>1) 上载、展示、张贴、传播或以其它方式传送含有下列内容之一的信息 （包括但不限于图片、文字、视频、链接、音乐等）：</p>
            <p>a) 反对宪法所确定的基本原则的</p>；
            <p>b) 危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</p>
            <p>c) 损害国家荣誉和利益的；</p>
            <p>d) 煽动民族仇恨、民族歧视、破坏民族团结的；</p>
            <p>e) 破坏国家宗教政策，宣扬邪教和封建迷信的；</p>
            <p>f) 散布谣言，扰乱社会秩序，破坏社会稳定的；</p>
            <p>g) 散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</p>
            <p>h) 侮辱或者诽谤他人，侵害他人合法权利的；</p>
            <p>i) 含有虚假、欺诈、有害、胁迫、侵害他人隐私、骚扰、侵害、中伤、粗俗、猥亵、与公序良俗不符或其它道德上令人反感的内容；</p>
            <p>j) 含有中国法律、法规、规章、条例以及任何具有法律效力之规范所限制或禁止的其它内容的。</p>
            <p>2) 为任何非法目的而使用IP二厂服务系统；</p>
            <p>3) 利用IP二厂从事以下活动：</p>
            <p>a) 未经书面允许，进入计算机信息网络或者使用计算机信息网络资源的；</p>
            <p>b) 未经书面允许，对计算机信息网络功能进行删除、修改或者增加的；</p>
            <p>c) 未经书面允许，进入计算机信息网络中对存储、处理或者传输的数据和应用程序进行删除、修改或者增加的；</p>
            <p>d) 故意制作、传播计算机病毒（包括木马）等破坏性程序；</p>
            <p>e) 其他危害计算机信息网络安全的行为。</p>
            <p>4) 对IP二厂相关服务任何部分或本服务之使用或获得，进行复制、出售、转售或用于任何其它商业目的。</p>
            <p>用户需对其在使用IP二厂提供数据信息服务过程中的行为承担完全的法律责任。如果IP二厂发现其网站传输的信息明显属于本条规定的内容之一，或IP二厂合理地认为用户的行为可能违反相关法律法规或本协议的规定，IP二厂可以在任何时候、不经事先通知终止本协议，禁止相关用户访问IP二厂提供数据信息，保存有关记录，向有权机关报告，并且删除含有该内容的地址、目录或关闭服务器。用户使用IP二厂提供的其他数据信息的电子服务，也须遵守本协议的规定。
              因用户提供的内容违法或侵犯第三人的合法权益而导致IP二厂对第三方承担任何性质的赔偿、补偿或罚款而遭受损失(包括但不限于直接的、间接的、偶然的、惩罚性的损失)，用户对于IP二厂遭受的上述损失承担完全的赔偿责任。</p>
            <h4> 责任限制</h4>
            <p>鉴于IP二厂平台提供的服务属于公开数据的整理，IP二厂平台上的信息均来自网络公开信息，由信息来源方对信息真实性等负相应责任，IP二厂平台所展示信息出于传递更多信息之目的，并不意味IP二厂赞同其观点或已经证实其内容的真实性。
              鉴于IP二厂搜索引擎系统会以非人工检索方式自动生成用户检索的已经依法公开的企业信息，并将该类公开企业信息向用户进行展示；受限于各信息来源网站信息更新不同步、现有技术水平等各种原因，IP二厂不保证所展示信息完全符合客观事实情况，还请用户自行核实信息的完整与准确并承担使用后果。</p>
            <h4>争议的解决</h4>
            <p>因使用IP二厂的过程所产生的一切争议与纠纷若无法通过协商解决，则可以通过以下方式解决：</p>
            <p> 双方首次就争议解决方法商洽开始30天后仍未就争议解决方式达成一致意见的，则应通过IP二厂所在地有管辖权的人民法院诉讼解决。</p>
            <p>因使用IP二厂所引起的诉讼其程序及实体事宜受中华人民共和国法律管辖并按其进行解释。</p>
            <p>就双方争议解决所产生的一切费用由诉讼的败诉方承担，该费用包括但不限于；冻结资产产生的费用与损失、调查取证费、诉讼费、律师费、工作人员差旅费及其他因诉讼产生的必要费用。</p>
            <h4> 声明接受</h4>
            <p> 1) 用户在使用IP二厂前对本声明的条款已充分阅读，就声明的条款内容进行了充分沟通。 用户已完整、清晰的理解每一条款的真实含义，对声明的条款约定的双方权利义务均不存在异议与保留意见。</p>
            <p>2) 双方在此确认就本声明的条款内容，不存在重大误解、 欺诈胁迫等可能导致本声明的条款可撤销或自始无效等效力瑕疵事宜。明确放弃基于上述及类似理由产生的撤销权。</p>
            <p>3) 用户在使用IP二厂网站或软件时即代表其已经声明基于真实有效的意思表示，接受本声明的条款。</p>
            <p>4) 本协议条款的最终解释权归IP二厂所有。</p>
            <h4>权利通知</h4>
            <p> 鉴于免责声明中公示信息来源网站中的信息数据更新存在一定时间周期，因此任何援引免责申明中所示网站数据信息的展示行为，
              其信息数据均可能存在数据与客观情形存在一定偏差的情形，如果，该信息数据的偏差无法通过IP二厂页面数据更新或其他功能加以纠正，
              且该信息关联方已经与该信息发布单位沟通并取得信息发布方书面更正文件，则该信息关联方有权以以下途径向IP二厂发送权利声明以便IP二厂对相关信息加以修正。
              相关措施和步骤如下：</p>
            <p>1)权利通知的发出
              任何个人或组织如对IP二厂内容存在异议，该个人或组织应以书面的方式向IP二厂提交权利通知。发出权利通知时应当同时符合以下两个条件：</p>
            <p>a)权利人发现并可以证明IP二厂所展示之内容侵犯了其合法权益；</p>
            <p>b) IP二厂以自动检索方式而产生并展示的内容侵犯了上述权利人的合法权益的信息经过网页内信息手动刷新按钮刷新或采取其他措施后仍然无法得到更正。</p>
            <p>2)权利通知的内容</p>
            <p> 为了IP二厂有效处理上述个人或单位的权利通知，请使用以下格式与内容的方式进行权利通知， 否则，IP二厂有权要求该权利通知发出者补充材料或拒绝作出修改：</p>
            <p>a)对任何权利提出的权利声明，都应提供相应完整的书面材料，以证明该权利的真实存在；</p>
            <p>b)权利人对涉嫌侵权行为的相关内容拥有合法权利或其他依法可以行使该权利的权属证明；</p>
            <p>c)权利通知应当充分、明确地描述被侵犯了权利人合法权益的具体内容并提供侵权信息展示页面的完整网页地址以及相关截屏资料。</p>
            <p>d)权利声明需提供权利人具体的联络信息，包括但不限于：</p>
            <p>i.自然人的姓名、身份证或护照复印件；</p>
            <p>ii.企业或其他法人组织的单位登记证明复印件，该组织法定代表人身份证或护照复印件，如果该权利声明内容涉及除法定代表人以外的其他人员，还应当同时附有法定代表人委托书及被委托人身份证或护照复印件；</p>
            <p>iii.权利声明主体的通信地址、电话号码、传真及电子邮箱地址；</p>
            <p>iv.其他可以以书面或电子信息联系到权利声明方的联系方式。</p>
            <p>3)权利声明需加入如下关于通知内容真实性的声明：</p>
            <p>a)我本人（或我单位）是所投诉内容的合法权利人，或，我本人（或我单位）已获授权，有权行使本权利声明中列明内容的权益；</p>
            <p>b)在我本人（或我单位）举报的IP二厂页面上登载的内容侵犯了我本人（或我单位）相应的合法权益；</p>
            <p>c)我本人（或我单位）保证，本通知中所述信息是充分、真实、准确的；</p>
            <p>d)我本人（或我单位）确认：如果本权利通知内容不完全属实，我本人（或我单位）将承担由此产生的一切法律责任。</p>
            <p>4)权利通知的格式</p>
            <p> 请以书面打印件形式制作权利声明，对权利声明的全部内容请权利人及该文件直接关联人员亲自在每页文件纸张上签署姓名并写明签署时间与用途，如果权利声明主体系依法成立的机构或组织，
              请您加盖该组织公章并由法定代表人亲自签署并写明签署时间与用途。
              除前款要求书写内容以外，其他任何形式的涂抹、删改、修正或任何可能引起对该文件被修改产生合理怀疑的行为与情形均有可能导致该文件不被采纳，请务必注意。</p>
            <p> 5)权利通知的送达</p>
            <p> 请您把以上资料和联络方式书面发往以下地址，我们会在收到您的来函并结合实情况予以回复：</p>
            <p> 收信地址：上海市长宁区天山路1900号环东华时尚休闲中心916单元</p>
            <p> 来信请注明：IP二厂运营部收</p>
            <p> 来信请注明客服部接收信息，否则将可能导致对该函件无人签收之情况。</p>
            <p> 请不要发送邮费到付文件或以其他收件方需要另行承担费用的方式寄送，否则，我司将拒绝接受该文件。</p>
            <h4>特别说明：</h4>
            <p>IP二厂一贯高度重视知识产权、商业秘密与个人隐私的保护并遵守中国各项法律、法规和具有约束力的规范性文件。根据法律、法规和规范性文件要求，
              IP二厂制定了旨在保护权利人的合法权益的措施和步骤，
              当权利人发现在IP二厂生成的信息所展示的内容侵犯其合法权益时， 权利人应事先向IP二厂发出书面的“权利通知”，
              IP二厂将根据中国法律法规和政府规范性文件采取措施移除相关内容或以其他技术手段加以处理。
              若权利人及关联方未以该方式发送权利声明，则IP二厂有权拒绝对网站所示数据与信息的修改或技术处理。</p>
            <p>如果您所发出的权利通知的陈述失实，权利通知提交者将承担对由此造成的全部法律责任
              （包括但不限于赔偿各种费用及律师费）。如果您无法确定网络上可获取的资料侵犯了何种法定权利，
              IP二厂建议您首先咨询专业人士。</p>
          </Modal>
          {
            isLogin &&
            <Alert message={message} onClose={() => {
              this.setState({
                isLogin: false
              });
            }} onSubmit={() => {
              this.props.history.push('/login');
            }}/>
          }
        </div>
      </div>
    );
  }
}
