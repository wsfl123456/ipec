// 订单状态- 监修买家产品设计图
import * as React from "react";
import success from "@assets/images/copyright-center/icon_success.png";

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
    step: "",
  },
  {
    class: "order4",
    name: "授权交易完成 ",
    step: "",
  },
];
export default ({
  type,
  orderDetail: { againAudit },
  orderDetail,
  visibleshowRemindPay,
  showRemindPay,
  copyrightCenter,
  visiblesampleSuccess,
  visibleToast,
}) => {
  switch (type) {
    case 4:
      if (againAudit) {
        orderState[2].step = "样品监修不通过";
      } else {
        orderState[2].step = "待邮寄样品";
      }
      break;
    case 5:
      orderState[2].step = "待监修样品";
      break;
    default:
      break;
  }
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
      {type === 4 && (
        <div className="state-content">
          <div className="icon icon-709" />
          {!orderDetail.againAudit && (
            <p>
              当前订单状态：买家产品设计图已通过审核，进入产品打样阶段，待买家邮寄样品审核
            </p>
          )}
          {!!orderDetail.againAudit && (
            <React.Fragment>
              <p>
                当前订单状态：您未通过买家的产品样品检验，待买家再次邮寄样品监修
                <div className="audit-reason">
                  <span>拒绝原因：</span>
                  {orderDetail.feedback}
                </div>
              </p>
              <div className="img-group">
                {!!orderDetail.sampleFigure &&
                  orderDetail.sampleFigure
                    .split(",")
                    .map((e, k) => <img src={e.picUrl} key="k" alt="" />)}
              </div>
            </React.Fragment>
          )}
          <div className="btn-group">
            {!!showRemindPay && (
              <div className="remind-text">
                <img src={success} alt="" /> 提醒邮寄样品成功！
              </div>
            )}
            <button
              onClick={() => {
                visibleshowRemindPay();
              }}
            >
              提醒买家邮寄样品
            </button>
          </div>
        </div>
      )}

      {type === 5 && (
        <div className="state-content">
          {!orderDetail.againAudit && (
            <React.Fragment>
              <div className="icon icon-709" />
              <p>
                当前订单状态：买家已邮寄产品样品，{orderDetail.logisticsInfo}
                ，待您监修
              </p>
              <div className="desc">
                收货后请尽快确认产品是否可以量产，若您一直未监修，将会影响授权交易完成进度，买家有投诉风险，同时也会影响你的授权回款速度，建议您尽快确样品质量是否可以量产。
              </div>
              <div className="img-group">
                {!!orderDetail.auditFigure &&
                  orderDetail.auditFigure
                    .split(",")
                    .map((e, k) => <img src={e} key="k" alt="" />)}
              </div>
              <div className="btn-group">
                <button
                  className="small"
                  onClick={async () => {
                    const {errorCode, errorMsg} = await copyrightCenter.reviewSample({ auditStatus: 2 })
                    if (+errorCode === 200) {
                      visiblesampleSuccess()
                    } else {
                      visibleToast(errorMsg)
                    }
                    // visiblesampleSuccess();
                  }}
                >
                  监修通过
                </button>
                <button
                  className="small bg-white"
                  onClick={() => copyrightCenter.changeRefuseModal(true)}
                >
                  监修不通过
                </button>
              </div>
            </React.Fragment>
          )}
          {!!orderDetail.againAudit && (
            <React.Fragment>
              <div className="icon icon-709" />
              <p>
                当前订单状态：买家已再次邮寄产品样品，
                {orderDetail.logisticsInfo}，待您监修
              </p>
              <div className="desc">
                收货后请尽快确认产品是否可以量产，若您一直未监修，将会影响授权交易完成进度，买家有投诉风险，同时也会影响你的授权回款速度，建议您尽快确样品质量是否可以量产。
              </div>
              <div className="img-group">
                {!!orderDetail.auditFigure &&
                  orderDetail.auditFigure
                    .split(",")
                    .map((e, k) => <img src={e} key="k" alt="" />)}
              </div>
              <div className="btn-group">
                <button
                  className="small"
                  // onClick={async () =>{
                  //   copyrightCenter.reviewSample({ auditStatus: 2 })
                  // }
                  onClick={async () => {
                    const {errorCode, errorMsg} = await copyrightCenter.reviewSample({ auditStatus: 2 })
                    if (+errorCode === 200) {
                      visiblesampleSuccess()
                    } else {
                      visibleToast(errorMsg)
                    }
                    // visiblesampleSuccess();
                  }}
                >
                  监修通过
                </button>
                <button
                  className="small bg-white"
                  onClick={() => copyrightCenter.changeRefuseModal(true)}
                >
                  监修不通过
                </button>
              </div>
              <div
                style={{
                  borderTop: "1px dashed #6236FF",
                  marginTop: "24px",
                  paddingTop: "24px",
                }}
              >
                <div className="icon icon-709" />
                <p>未通过监修的样品：{orderDetail.logisticsInfoHistory}</p>
                <div className="desc">
                  <span className="red">拒绝原因：</span>
                  {orderDetail.feedback}
                </div>
                <div className="img-group">
                  {!!orderDetail.sampleFigure &&
                    orderDetail.sampleFigure
                      .split(",")
                      .map((e, k) => <img src={e.picUrl} key="k" alt="" />)}
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
        // <div className="state-content">
        //   <div className="icon icon-709" />
        //   <p>
        //     当前订单状态：买家已再次 邮寄产品样品，
        //     <span className="text-underline">中通快递767565656565655</span>
        //     ，待您监修{" "}
        //   </p>
        //   <div className="desc">
        //     收货后请尽快确认产品是否可以量产，若您一直未监修，将会影响授权交易完成进度，买家有投诉风险，同时也会影响你的授权回款速度，建议您尽快确样品质量是否可以量产。
        //   </div>
        //   <div className="img-group">
        //     <img src="" alt="" />
        //     <img src="" alt="" />
        //   </div>
        //   <div className="btn-group">
        //     <button className="small">监修通过</button>
        //     <button className="small bg-white">监修不通过</button>
        //   </div>
        //   <div className="no-success">
        //     <p>未通过监修的样品： 中通快递767565656565655 </p>
        //     <div className="desc">
        //       <span className="red">拒绝原因:</span>质量不过关
        //     </div>
        //     <div className="img-group">
        //       <img src="" alt="" />
        //       <img src="" alt="" />
        //     </div>
        //   </div>
        // </div>
      )}
    </div>
  );
};
