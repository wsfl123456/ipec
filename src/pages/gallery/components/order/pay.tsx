import * as React from "react";
import { observer, inject } from "mobx-react";
import "@assets/scss/vip_card_buy.scss";
import Icclear from "@assets/images/vip-card/ic_clear.svg";
import IcSelect from "@assets/images/vip-card/ic_select.svg";
import ArrowRight from "@assets/images/vip-card/arrow-right.png";
import IcAlipay from "@assets/images/vip-card/ic_alipay.png";
import IcWechat from "@assets/images/vip-card/ic_wechat.png";
import GalleryPayProtocal from "@components/gallery-pay-protocal";
import QRCode from "qrcode.react";
import { withRouter } from "react-router-dom";

interface IPayState {
  timer: any;
  showProtocol: boolean;
}

@inject("gallery_order_store", "login")
@observer
class GalleryPay extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      timer: null,
      showProtocol: false
    };
  }

  componentDidMount() {
    // const { eqMyOrder } = this.props;
    this.setState({
      timer: setInterval(async () => {
        const { code, errorMessage } = await this.props.getPayStatus();
        if (+code === 200) {
          this.props.changepaySuccess(true);
          this.props.closeModal();

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
    const {
      galleryInfo,
      galleryDetail,
      orderParams,
      weChatPay,
      alipay,
      closeModal,
    } = this.props;
    const { paySuccess } = this.state;
    return (
      <div className="gallery-pay">
        <div className="area">
          <div className="title">
            <div className="left">
              <img src={userInfo.picUrl} alt=""/>
              <div>
                <div>{userInfo.userRealName}</div>
                <div className="account">登录账号：{userInfo.userLogin}</div>
              </div>
            </div>
            <img
              className="right"
              onClick={() => {
                closeModal();
                setTimeout(() => {
                  this.props.history.push('/user/22');
                }, 500);
              }}
              src={Icclear}
              alt=""
            />
          </div>
          <div className="content">
            <div className="top">
              <div className="item">
                <div className="item-title">
                  <div>{galleryDetail.title}</div>
                  <div>¥ {galleryInfo.price}</div>
                </div>
                <div className="item-content">
                  授权类型：{galleryInfo.authorizeType}（品类）/
                  {galleryInfo.duration}个月（期限）/
                  {galleryInfo.productionQuantityMin}-
                  {galleryInfo.productionQuantityMax}（数量）
                </div>
              </div>
              <div className="item">
                <div className="item-title">
                  <div>防伪码</div>
                  <div>¥ {+orderParams.productionQuantity * 0.01}</div>
                </div>
                <div className="item-content">
                  价格：{orderParams.productionQuantity}
                  （数量）* 0.01元/个（单价）
                </div>
              </div>
            </div>
            <div className="mid">
              <div>
                应付金额：
                <span style={{ fontSize: "20px" }}>
                  ¥{" "}
                  {+orderParams.productionQuantity * 0.01 +
                  Number(galleryInfo.price)}
                </span>
              </div>
              <div className="pay-code">
                <div>
                  <img
                    className="wechat"
                    src={`data:image/png;base64,${weChatPay}`}
                    alt=""
                  />
                  <div className="text">
                    <img src={`${IcWechat}`} alt=""/>
                    <span>微信扫码支付</span>
                  </div>
                </div>
                <div>
                  <QRCode value={alipay}/>

                  <div className="text">
                    <img src={`${IcAlipay}`} alt=""/>
                    <span>支付宝支付</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom">
              {/* <img src={IcSelect} alt="" /> */}
              <span
                onClick={() => {
                  this.setState({ showProtocol: true });
                }}
              >
                您已阅读并同意
                <span style={{ color: "#4185F3" }}>
                  《IP二厂平台图库商业购买协议》
                </span>
              </span>
            </div>
          </div>
        </div>
        {
          this.state.showProtocol && <GalleryPayProtocal closeProtocol={() => {this.closeProtocol()}}></GalleryPayProtocal>
        }
      </div>
    );
  }
}

export default withRouter(GalleryPay);
