// 订单状态- 买家下单
import * as React from "react";
import success from "@assets/images/copyright-center/icon_success.png";
// 订单状态
const orderState = [
  {
    class: "order1",
    name: "买家下单",
    step: "待付款",
  },
  {
    class: "order2",
    name: "上传设计图待版权方(卖方)监修",
    step: "",
  },
  {
    class: "order3",
    name: "邮寄产品样品待版权方(卖家)监修",
    step: "",
  },
  {
    class: "order4",
    name: "授权交易完成 ",
    step: "",
  },
];
export default ({ buyOrder, userGuid, orderSn }) => {
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
        <p>
          当前订单状态：该IP图库授权，请在72小时内付款，若未及时付款，系统将自动取消订单{" "}
        </p>
        <div className="btn-group">
          <button
            className="small"
            onClick={async () => {
              await buyOrder.getOrderDetail({ userGuid, orderSn });
              buyOrder.getPayCode({
                sn: orderSn,
                payMethod: 2,
                userGuid,
              });
              buyOrder.getPayCode({
                sn: orderSn,
                payMethod: 7,
                userGuid,
              });
            }}
          >
            立即付款
          </button>
          <button
            className="small bg-white"
            onClick={() => buyOrder.changeCancelModal(true)}
          >
            取消订单
          </button>
        </div>
      </div>
    </div>
  );
};
