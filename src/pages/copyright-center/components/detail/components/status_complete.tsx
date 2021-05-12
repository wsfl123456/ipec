// 订单状态 - 授权交易完成
import * as React from "react";
import { inject, observer } from "mobx-react";

const orderState = [
  {
    class: "order1",
    name: "买家下单",
    step: "买家已付款",
  },
  {
    class: "order2 active",
    name: "监修买家产品设计图",
    step: "产品图监修通过",
  },
  {
    class: "order3 active",
    name: "监修买家产品样品",
    step: "样品监修通过",
  },
  {
    class: "order4 active",
    name: "授权交易完成 ",
    step: "收款开票",
  },
];

@inject("copyrightCenter", "orderDetailStore")
@observer
export default class StatusComplete extends React.Component<any, any> {
  render() {
    const {
      copyrightCenter,
      orderDetailStore: { orderDetail },
      type,
    } = this.props;
    return (
      <div>
        <div className="order-state">
          {orderState &&
            orderState.map((item, index) => {
              return (
                <div className="state-item" key={index}>
                  <div className={`u-state ${item.class} `} />
                  <span className="step">{item.name}</span>
                  <span className="step-status">{item.step}</span>
                </div>
              );
            })}
        </div>
        <div className="state-content">
          <div className="icon icon-994" />
          <p>当前订单状态：线上授权交易已完成，进入收款开票阶段</p>
          <div className="desc">
            实物样品已通过监修，买家将进入商品量产阶段，线上授权交易已完成；
            <span className="red">
              该笔订单授权金额为{orderDetail.price}
              元（根据授权协议，平台将扣除10%的服务费）应收费用为
              {((orderDetail.price - +orderDetail.price * 0.1) * 100) / 100}元
            </span>
            请点具增值税专用发票，平台将在收到发票后的7个工作日内打款到您的指定银行账户。
          </div>
          {/* 有发票信息*/}
          <div className="invoice">
            <p className="invoice-title">发票信息</p>
            <div className="invoice-body">
              <span>发票类型： </span>增值税专用发票
            </div>
            <div className="invoice-body">
              <span>发票抬头： </span>酷拓文化交流（上海）有限公司
            </div>
            <div className="invoice-body">
              <span>纳税识别号： </span>91310118MA1JL55KXL
            </div>
            <div className="invoice-body">
              <span>开户银行： </span>中国建设银行天山支行
            </div>
            <div className="invoice-body">
              <span>银行账户： </span>6217 0038 1002 6896 707
            </div>
            <div className="invoice-body">
              <span>邮寄地址： </span>上海市长宁区天山路1900号910
              /Kelly(收）/13814678960
            </div>
          </div>
          {type === 7 && (
            <div className="invoice">
              <p className="invoice-title">收款信息</p>
              <div className="invoice-body">
                <span>开户人/企业： </span>
                {orderDetail.cardholder}
              </div>
              <div className="invoice-body">
                <span>开户行： </span>
                {orderDetail.bankName}
              </div>
              <div className="invoice-body">
                <span>银行卡号： </span>
                {orderDetail.bankCardNo}
              </div>
              <div className="invoice-body">
                <span>银行预留手机号： </span>
                {orderDetail.cardholderPhone}
              </div>
            </div>
          )}

          {/*没有发票*/}
          {type === 6 && (
            <div className="btn-group">
              <button
                className="small"
                onClick={() => {
                  // 没有发票信息的弹窗
                  copyrightCenter.changeCollectionModal(true);
                }}
              >
                申请收款
              </button>
              {/*<button className="small bg-white">查看发票抬头</button>*/}
            </div>
          )}
        </div>
      </div>
    );
  }
}
