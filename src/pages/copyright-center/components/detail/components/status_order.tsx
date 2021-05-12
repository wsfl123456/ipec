// 订单状态- 买家下单
import * as React from "react";
import success from "@assets/images/copyright-center/icon_success.png";
// 订单状态
const orderState = [
  {
    class: "order1 active",
    name: "买家下单",
    step: "待买家付款",
  },
  {
    class: "order2",
    name: "监修买家产品设计图",
    step: "",
  },
  {
    class: "order3",
    name: "监修买家产品样品",
    step: "",
  },
  {
    class: "order4",
    name: "授权交易完成 ",
    step: "",
  },
];

export default ({visibleshowRemindPay, showRemindPay}: {visibleshowRemindPay:any, showRemindPay: any}) => {
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
        <div className="icon icon-132" />
        <p>当前订单状态：买家拍下该IP图库授权，待买家付款</p>
        <div className="btn-group">
          {!!showRemindPay && (
            <div className="remind-text">
              <img src={success} alt="" /> 提醒发送成功！
            </div>
          )}
          <button onClick={() => {visibleshowRemindPay()}}>提醒买家付款</button>
        </div>
      </div>
    </div>
  );
};
