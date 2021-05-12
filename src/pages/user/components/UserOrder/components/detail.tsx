import * as React from "react";
import { observer, inject } from "mobx-react";
import "@assets/scss/user_vip_card.scss";
import { Link } from "react-router-dom";
import Toast from "@components/toast";
import moment from "moment";
import Ic_clear from "@assets/images/vip-card/ic_clear.svg";
import { reaction } from "mobx";

interface IState {
  showModal: boolean;
  showToast: boolean;
  toastMsg: string;
}
@inject("user_order")
@observer
export default class UserOrderDetail extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      showModal: false,
      showToast: false,
      toastMsg: "",
    };
  }

  async componentDidMount() {}

  render() {
    const {
      orderDetail,
      closeDetail,
      reminderShipment,
      confirmReceipt,
    } = this.props;
    return (
      <div className="vip-card user_order_detail">
        <div className="area">
          <div className="title">
            <div>订单详情</div>
            <img src={Ic_clear} onClick={closeDetail} alt="" />
          </div>
          <div className="content">
            <div className="top">
              <div className="sn">{orderDetail.sn}</div>
              {(() => {
                let payStatue = "";
                switch (+orderDetail.payStatue) {
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
                return <div className="payStatue">{payStatue}</div>;
              })()}
            </div>

            <div className="mid">
              <Link to={`/vip-card-buy-detail/${orderDetail.cardGuid}`}>
                <img className="pic" src={orderDetail.cardPic} alt="" />
              </Link>
              <div
                className={`info ${
                  orderDetail.payStatue !== 0 ? "info--flex" : ""
                }`}
              >
                <div className="name">{orderDetail.cardName}</div>
                <div className="create_date">
                  <span className="label">创建时间：</span>
                  <span>
                    {orderDetail.createDateStr}
                    {/* {!!orderDetail.createDate &&
                      moment(orderDetail.createDate).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )} */}
                  </span>
                </div>
                {orderDetail.payStatue !== 0 && (
                  <React.Fragment>
                    <div className="deliver_date">
                      <span className="label">付款时间：</span>
                      <span>
                    {orderDetail.paymentDateStr}

                        {/* {!!orderDetail.paymentDate &&
                          moment(orderDetail.paymentDate).format(
                            "YYYY-MM-DD HH:mm:ss"
                          )} */}
                      </span>
                    </div>
                    <div className="payMethod">
                      <span className="label">付款方式：</span>
                      {(() => {
                        let payMethod;
                        switch (+orderDetail.payMethod) {
                          case 2:
                            payMethod = "微信支付";
                            break;
                          case 7:
                            payMethod = "支付宝支付";
                            break;
                          default:
                            break;
                        }
                        return <span>{payMethod}</span>;
                      })()}
                    </div>
                  </React.Fragment>
                )}
              </div>
              <div className="paymentAmount">¥{orderDetail.paymentAmount}</div>
            </div>

            <div className="bom">
              {(orderDetail.payStatue === 2 || orderDetail.payStatue === 3) && (
                <div>
                  <div className="subject">
                    <div>物流信息 ：</div>
                  </div>
                  <div>
                    <span className="label">送货方式：</span>
                    <span>{orderDetail.logisticsCompany}</span>
                  </div>
                  <div>
                    <span className="label">货运单号：</span>
                    <span>{orderDetail.waybill}</span>
                  </div>
                  <div>
                    <span className="label">发货时间：</span>
                    <span>
                      {orderDetail.deliverGoodsDateStr}
                      {/* {!!orderDetail.deliverGoodsDate &&
                        moment(orderDetail.deliverGoodsDate).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )} */}
                    </span>
                  </div>
                  {orderDetail.payStatue === 3 && (
                    <div>
                      <span className="label">签收时间：</span>
                      <span>
                        {orderDetail.receivingGoodsDateStr}
                        {/* {!!orderDetail.receivingGoodsDate &&
                          moment(orderDetail.receivingGoodsDate).format(
                            "YYYY-MM-DD HH:mm:ss"
                          )} */}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div>
                <div className="subject">
                  <div>收货人信息：</div>
                  {orderDetail.payStatue === 0 && (
                    <div className="btn_default_fl">修改地址</div>
                  )}
                </div>
                <div>
                  <span className="label">收货人：</span>
                  <span>{orderDetail.consignee}</span>
                </div>
                <div>
                  <span className="label">收货地址：</span>
                  <span>{orderDetail.addressDetail}</span>
                </div>
                <div>
                  <span className="label">联系方式：</span>
                  <span>{orderDetail.mobile}</span>
                </div>
              </div>
            </div>
          </div>
          {+orderDetail.payStatue !== 3 && (
            <div className="footer">
              <div className="btn_default_fl" onClick={closeDetail}>取消</div>

              {+orderDetail.payStatue === 1 && (
                <div className="btn_primary_fl" onClick={reminderShipment}>
                  提醒发货
                </div>
              )}
              {+orderDetail.payStatue === 2 && (
                <div className="btn_primary_fl" onClick={confirmReceipt}>
                  确认收货
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}
