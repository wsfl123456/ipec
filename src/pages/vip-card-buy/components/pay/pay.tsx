import * as React from "react";
import "@assets/scss/vip_card_buy.scss";
import Icclear from "@assets/images/vip-card/ic_clear.svg";
import IcSelect from "@assets/images/vip-card/ic_select.svg";
import ArrowRight from "@assets/images/vip-card/arrow-right.png";
import IcAlipay from "@assets/images/vip-card/ic_alipay.png";
import IcWechat from "@assets/images/vip-card/ic_wechat.png";
import VipCardProtocal from "@components/vip-card-protocal"
import QRCode from 'qrcode.react';

interface IPayState {
  timer: any;
  showProtocol: boolean
}
export default class VipCardBuyPay extends React.Component<any, IPayState> {
  constructor(props: any) {
    super(props);
    this.state = {
      timer: null,
      showProtocol: false
    };
  }

  componentDidMount() {
    const { eqMyOrder } = this.props;
    this.setState({
      timer: setInterval(async () => {
        const { code, errorMessage } = await this.props.getPayStatus();
        if (+code === 200) {
          this.props.closeModal();
          this.props.vm.setState({
            showToast: true,
            toastMsg: errorMessage,
          });
          
          if (!!eqMyOrder) eqMyOrder();
          else setTimeout(() => {
            this.props.history.push(`/user/15`)
          }, 1000);
        }
      }, 2000),
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  closeProtocol() {
    this.setState({showProtocol: false})
  }

  render() {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    const { commodityDetail, weChatPay, alipay, closeModal } = this.props;
    return (
      <div className="vip-card-buy-pay">
        <div className="area">
          <div className="title">
            <div className="left">
              <img src={userInfo.picUrl} alt="" />
              <div>
                <div>{userInfo.userRealName}</div>
                <div className="account">登录账号：{userInfo.userLogin}</div>
              </div>
            </div>
            <img className="right" src={Icclear} onClick={closeModal} alt="" />
          </div>
          <div className="content">
            <div className="top">
              <img src={commodityDetail.cardPic} alt="" />
              <img src={ArrowRight} alt="" />
              <div>
                <div>限时{commodityDetail.discount * 10}折优惠</div>
                <div>仅需</div>
                <div>
                  ¥<span>{commodityDetail.paymentAmount}</span>
                </div>
              </div>
            </div>
            <div className="mid">
              <div>
                应付金额：<span> ¥ {commodityDetail.paymentAmount}</span>
              </div>
              <div className="pay-code">
                <div>
                  <img className='wechat' src={`data:image/png;base64,${weChatPay}`} alt="" />
                  <div className="text">
                    <img src={`${IcWechat}`} alt="" />
                    <span>微信扫码支付</span>
                  </div>
                </div>
                <div>
                  {/* <img src={alipay} alt="" /> */}
                  <QRCode value={alipay} />

                  <div className="text">
                    <img src={`${IcAlipay}`} alt="" />
                    <span>支付宝支付</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom">
              <img src={IcSelect} alt="" />
              <span onClick={() => {this.setState({showProtocol: true})}}>我已阅读并同意《IP二厂VIP数据权限储值卡购买须知》</span>
            </div>
          </div>
        </div>
        {
          this.state.showProtocol && <VipCardProtocal closeProtocol={() => {this.closeProtocol()}}></VipCardProtocal>
        }
      </div>
    );
  }
}
