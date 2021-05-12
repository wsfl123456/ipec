import * as React from "react";
import { observer, inject } from "mobx-react";
import "@assets/scss/vip_card_buy.scss";
import Icclear from "@assets/images/vip-card/ic_clear.svg";
import IcSelect from "@assets/images/vip-card/ic_select.svg";
import ArrowRight from "@assets/images/vip-card/arrow-right.png";
import IcAlipay from "@assets/images/vip-card/ic_alipay.png";
import IcWechat from "@assets/images/vip-card/ic_wechat.png";
import VipCardProtocal from "@components/vip-card-protocal";
import QRCode from "qrcode.react";
import GalleryPayProtocal from "@components/gallery-pay-protocal";

interface IPayState {
  timer: any;
  showProtocol: boolean;
}

@inject("gallery_order_store", "buyerOrder", "login")
@observer
export default class galleryPay extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      timer: null,
      showProtocol: false,
    };
  }

  componentDidMount() {
    const { buyerOrder, login } = this.props;
    this.setState({
      timer: setInterval(async () => {
        const { code, errorMessage } = await buyerOrder.getPayStatus({
          userGuid: login.userInfo.userGuid,
        });
      }, 2000),
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  closeProtocol() {
    this.setState({ showProtocol: false });
  }

  render() {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    const {
      galleryDetail,
      orderParams,
      weChatPay,
      alipay,
      closeModal,
      buyerOrder,
    } = this.props;
    const { detailList } = buyerOrder;
    const { paySuccess } = this.state;
    return (
      <div className="gallery-pay">
        <div className="area">
          <div className="title">
            <div className="left">
              <img src={userInfo.picUrl} alt="" />
              <div>
                <div>{userInfo.userRealName}</div>
                <div className="account">登录账号：{userInfo.userLogin}</div>
              </div>
            </div>
            <img
              className="right"
              onClick={() => {
                buyerOrder.clearPay();
              }}
              src={Icclear}
              alt=""
            />
          </div>
          <div className="content">
            <div className="top">
              <div className="item">
                <div className="item-title">
                  <div>{detailList.title}</div>
                  <div>¥ {detailList.price}</div>
                </div>
                <div className="item-content">
                  授权类型：{detailList.authorizeType}（品类）/
                  {detailList.duration}个月（期限）/
                  {detailList.productionQuantityMin}-
                  {detailList.productionQuantityMax}（数量）
                </div>
              </div>
              <div className="item">
                <div className="item-title">
                  <div>防伪码</div>
                  <div>¥ {+detailList.productionQuantity * 0.01}</div>
                </div>
                <div className="item-content">
                  价格：{detailList.productionQuantity}
                  （数量）* 0.01元/个（单价）
                </div>
              </div>
            </div>
            <div className="mid">
              <div>
                应付金额：
                <span style={{ fontSize: "20px" }}>
                  ¥{" "}
                  {+detailList.productionQuantity * 0.01 +
                    Number(detailList.price)}
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
                    <img src={`${IcWechat}`} alt="" />
                    <span>微信扫码支付</span>
                  </div>
                </div>
                <div>
                  <QRCode value={alipay} />

                  <div className="text">
                    <img src={`${IcAlipay}`} alt="" />
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
        {this.state.showProtocol && (
          <GalleryPayProtocal
            closeProtocol={() => {
              this.closeProtocol();
            }}
          ></GalleryPayProtocal>
        )}
      </div>
    );
  }
}
