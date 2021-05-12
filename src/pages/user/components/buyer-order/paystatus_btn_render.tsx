import * as React from "react";

export default (item, buyerOrder, userGuid) => {
  const { payStatue, againAudit, orderSn, galleryGuid, logisticsInfo } = item;
  if (payStatue === 0) {
    return (
      <div className="btns">
        <button
          className="btns__top"
          onClick={async () => {
            await buyerOrder.getOrderDetail({ userGuid, orderSn });
            buyerOrder.getPayCode({
              sn: orderSn,
              payMethod: 2,
              userGuid,
            });
            buyerOrder.getPayCode({
              sn: orderSn,
              payMethod: 7,
              userGuid,
            });
          }}
        >
          立即付款
        </button>
        <button
          className="btns__bottom"
          onClick={() => {
            buyerOrder.changeCancelModal(true, orderSn);
          }}
        >
          取消订单
        </button>
      </div>
    );
  } else if (
    (payStatue === 2 && !againAudit) ||
    (payStatue === 2 && againAudit) ||
    payStatue === 1
  ) {
    return (
      <div className="btns">
        <button
          className="btns__top"
          onClick={() => buyerOrder.changeUploadModal(true, orderSn)}
        >
          上传设计图
        </button>
        <button
          className="btns__bottom"
          onClick={async () => {
            console.log("hhh");
            await buyerOrder.downloadFun({ galleryGuid, userGuid });
          }}
        >
          下载IP图库
        </button>
      </div>
    );
  } else if (
    (payStatue === 3 && !againAudit) ||
    (payStatue === 3 && againAudit)
  ) {
    return (
      <div className="btns">
        <button
          className="btns__top"
          onClick={() => buyerOrder.remindSellerRepair()}
        >
          提醒卖家监修
        </button>
        <button
          className="btns__bottom"
          onClick={() => buyerOrder.downloadFun({ galleryGuid, userGuid })}
        >
          下载IP图库
        </button>
      </div>
    );
  } else if (
    (payStatue === 4 && !againAudit) ||
    (payStatue === 4 && againAudit)
  ) {
    return (
      <div className="btns">
        <button className="btns__top" onClick={() => buyerOrder.changeLogisticsModal(true, orderSn)}>填写物流单号</button>
        <button className="btns__bottom" onClick={() => buyerOrder.changePostAddressModal(true)}>查看邮寄地址</button>
      </div>
    );
  } else if (
    (payStatue === 5 && !againAudit) ||
    (payStatue === 5 && againAudit)
  ) {
    return (
      <div className="btns">
        <button
          className="btns__top"
          onClick={() => buyerOrder.remindSellerExamine()}
        >
          提醒卖家审核
        </button>
        <button
          className="btns__bottom"
          onClick={() => buyerOrder.changePostAddressModal(true)}
        >
          查看邮寄地址
        </button>
      </div>
    );
  } else if (payStatue > 5 && !logisticsInfo) {
    return (
      <div className="btns">
        <button
          className="btns__top"
          onClick={() => buyerOrder.changeCodeModal(true)}
        >
          获取防伪码
        </button>
      </div>
    );
  }
};
