import * as React from "react";
import { observer, inject } from "mobx-react";
import "@assets/scss/user_vip_card.scss";
import { Link } from "react-router-dom";
import Toast from "@components/toast";
import moment from "moment";
import UserOrderDetail from "./components/detail";
import VipCardBuyPay from "../../../vip-card-buy/components/pay/pay";
import Ic_clear from "@assets/images/vip-card/ic_clear.svg";
import Reminder from "@assets/images/vip-card/reminder.png";
import NoresultOrderBg from "@assets/images/vip-card/noresult-order-bg.png";

interface IState {
  showDetail: boolean;
  showReminder: boolean;
  showDel: boolean;
  showToast: boolean;
  toastMsg: string;
}
@inject("user_order", "login")
@observer
export default class UserOrder extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      showDetail: false,
      showReminder: false,
      showDel: false,
      showToast: false,
      toastMsg: "",
    };
  }

  async componentDidMount() {
    const {user_order, login} = this.props
    const { eqMyOrder } = user_order;
    user_order.changeUserInfo(login.userInfo)
    eqMyOrder();
  }

  tabChange(payStatue) {
    const { user_order } = this.props;
    const { changePayStatue, eqMyOrder } = user_order;
    changePayStatue(payStatue);
    eqMyOrder();
  }

  async toPay(i) {
    const { user_order } = this.props;
    const { getPayCode, getCommodityDetail, setOrderCode } = user_order;
    getCommodityDetail(i.cardGuid);
    setOrderCode(i.sn);
    getPayCode({
      sn: i.sn,
      payMethod: 2,
    });
    getPayCode({
      sn: i.sn,
      payMethod: 7,
    });
  }

  async reminderShipment(...sn) {
    const { user_order } = this.props;
    const { reminderShipment, eqMyOrder } = user_order;
    const { code, errorMsg } = await reminderShipment(sn[0]);
    if (+code === 200) {
      this.setState({
        showDetail: false,
        showReminder: true,
      });
      this.closeDetail();
    } else {
      this.setState({
        showToast: true,
        toastMsg: errorMsg,
      });
    }
  }

  async confirmReceipt(...sn) {
    const { user_order } = this.props;
    const { confirmReceipt, eqMyOrder } = user_order;
    const { code, errorMsg } = await confirmReceipt(sn[0]);
    if (+code === 200) {
      this.setState({
        showDetail: false,
      });
      this.closeDetail();
      eqMyOrder();
    } else {
      this.setState({
        showToast: true,
        toastMsg: errorMsg,
      });
    }
  }

  showDelOrder(sn) {
    const { user_order } = this.props;
    const { setOrderCode } = user_order;
    setOrderCode(sn);
    this.setState({
      showDel: true,
    });
  }

  async delOrder() {
    const { user_order } = this.props;
    const { delOrder, eqMyOrder } = user_order;
    const { code, errorMsg } = await delOrder();
    if (+code === 200) {
      eqMyOrder();
      this.setState({
        showDel: false,
        showToast: true,
        toastMsg: errorMsg,
      });
    } else {
      this.setState({
        showToast: true,
        toastMsg: errorMsg,
      });
    }
  }

  async showDetail(sn) {
    const { user_order } = this.props;
    const { eqOrderDetail, setOrderCode } = user_order;
    setOrderCode(sn);
    const { errorCode } = await eqOrderDetail(sn);
    if (+errorCode === 200) this.setState({ showDetail: true });
  }

  closeDetail() {
    const { user_order } = this.props;
    const { changeOrderDetail, changePayCode } = user_order;
    this.setState({ showDetail: false });
    changeOrderDetail();
    changePayCode();
  }

  closeReminder() {
    this.setState({ showReminder: false });
  }

  closeDel() {
    const { user_order } = this.props;
    const { changePayCode } = user_order;
    this.setState({ showDel: false });
    changePayCode();
  }

  render() {
    const { user_order } = this.props;
    const {
      tabsList,
      payStatue,
      orderList,
      orderDetail,
      weChatPay,
      alipay,
      getPayStatus,
      commodityDetail,
      changePayCode,
      eqMyOrder,
    } = user_order;
    return (
      <div className="vip-card user-order">
        <div className="title">我的订单</div>
        <div className="tabs">
          {!!tabsList &&
            !!tabsList.length &&
            tabsList.map((i, k) => (
              <div
                className={`tab ${i.val === payStatue ? "tab--selected" : ""}`}
                onClick={() => {
                  this.tabChange(i.val);
                }}
                key={k}
              >
                {i.label}
              </div>
            ))}
        </div>
        <div className="list vip">
          {!!orderList &&
            !!orderList.length &&
            orderList.map((i, k) => (
              <div className="item" key={k}>
                <div className="header">
                  <div className="num">订单号：{i.sn}</div>
                  <div className="time">
                    {/* {moment(i.createDate).format("YYYY-MM-DD HH:mm:ss")} */}
                    {i.createDateStr}
                  </div>
                </div>
                <div className="content">
                  <Link to={`/vip-card-buy-detail/${i.cardGuid}`}>
                    <img className="pic" src={i.cardPic} alt="" />
                  </Link>
                  <div className="name"></div>
                  <div className="payAmount">¥{i.payAmount}</div>
                  {(() => {
                    let payStatue = "";
                    switch (+i.payStatue) {
                      case 0:
                        payStatue = "待支付";
                        break;
                      case 1:
                        payStatue = "待发货";
                        break;
                      case 2:
                        payStatue = "待收货";
                        break;
                      case 3:
                        payStatue = "已完成";
                        break;
                      default:
                        break;
                    }
                    return (
                      <div
                        className={`payStatue ${
                          +i.payStatue === 3 ? "payStatue--gray" : ""
                        }`}
                      >
                        {payStatue}
                      </div>
                    );
                  })()}
                  <div className="operate">
                    {i.payStatue === 0 && (
                      <div
                        onClick={() => {
                          this.toPay(i);
                        }}
                      >
                        立即支付
                      </div>
                    )}
                    {i.payStatue === 1 && (
                      <div
                        onClick={() => {
                          this.reminderShipment(i.sn);
                        }}
                      >
                        提醒发货
                      </div>
                    )}
                    {(i.payStatue === 1 ||
                      i.payStatue === 2 ||
                      i.payStatue === 3) && (
                      <div
                        onClick={() => {
                          this.showDetail(i.sn);
                        }}
                      >
                        订单详情
                      </div>
                    )}
                    {i.payStatue === 2 && (
                      <div
                        onClick={() => {
                          this.confirmReceipt(i.sn);
                        }}
                      >
                        确认收货
                      </div>
                    )}
                    {(i.payStatue === 0 || i.payStatue === 3) && (
                      <div
                        onClick={() => {
                          this.showDelOrder(i.sn);
                        }}
                      >
                        删除订单
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          {(!orderList || !orderList.length) && (
            <div className="no-result">
              <img src={NoresultOrderBg} alt="" />
              <div className="tip">
                暂无订单记录，赶紧购买VIP储值卡查看IP数据吧！{" "}
              </div>
              <Link to={`/vip-card-buy`}>
                <div className="btn_default_fl">立即购买</div>
              </Link>
            </div>
          )}
        </div>
        {!!this.state.showDetail && (
          <UserOrderDetail
            orderDetail={orderDetail}
            reminderShipment={() => {
              this.reminderShipment();
            }}
            confirmReceipt={() => {
              this.confirmReceipt();
            }}
            closeDetail={() => {
              this.closeDetail();
            }}
          />
        )}
        {!!weChatPay && !!alipay && (
          <VipCardBuyPay
            weChatPay={weChatPay}
            alipay={alipay}
            closeModal={changePayCode}
            getPayStatus={getPayStatus}
            commodityDetail={commodityDetail}
            eqMyOrder={eqMyOrder}
            history={this.props.history}
            vm={this}
          />
        )}
        {this.state.showReminder && (
          <div className="showReminder">
            <div className="area">
              <div className="clear">
                <img
                  src={Ic_clear}
                  onClick={() => {
                    this.closeReminder();
                  }}
                  alt=""
                />
              </div>
              <div className="content">
                <img src={Reminder} alt="" />
                <div className="msg">发货提醒已收到，加急为您打包中</div>
                <div className="btn_primary_fl" onClick={() => {
                    this.closeReminder();
                  }}>知道了</div>
              </div>
            </div>
          </div>
        )}
        {this.state.showDel && (
          <div className="showDel">
            <div className="area">
              <div className="clear">
                <img
                  src={Ic_clear}
                  onClick={() => {
                    this.closeDel();
                  }}
                  alt=""
                />
              </div>
              <div className="content">
                <img src={Reminder} alt="" />
                <div className="msg">确认要删除该条订单信息么？</div>
                <div className="tip">删除后该订单信息将不可恢复</div>
              </div>
              <div className="btn-group">
                <div
                  className="btn_primary_fl"
                  onClick={() => {
                    this.delOrder();
                  }}
                >
                  确认
                </div>
                <div
                  className="btn_default_fl"
                  onClick={() => {
                    this.closeDel();
                  }}
                >
                  取消
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
