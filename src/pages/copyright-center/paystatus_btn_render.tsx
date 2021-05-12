import * as React from "react";
import { message } from "antd";

export default (item, copyrightCenter, userGuid) => {
  const { payStatue, againAudit, orderSn, galleryGuid } = item;
  if (payStatue === 0) {
    return (
      <div className="btns">
        <button
          className="btns__top"
          onClick={() => {
            message.success("提醒发送成功");
          }}
        >
          提醒买家付款
        </button>
      </div>
    );
  } else if (payStatue === 2 || payStatue === 1) {
    return (
      <div className="btns">
        <button className="btns__top"   style={{height: 'auto'}}
                onClick={() => {
                  message.success('提醒发送成功');
                }}
        >提醒买家<br/>
          上传设计图
        </button>
      </div>
    );
  } else if (payStatue === 3) {
    return (
      <div className="btns">
        <button
          className="btns__top"
          onClick={() => {
            copyrightCenter.changeOrderDetail(orderSn)
            copyrightCenter.changeAddressModal(true)}
          }
        >
          监修通过
        </button>
        <button
          className="btns__bottom"
          onClick={async () => {
            await copyrightCenter.getOrderDetail({ userGuid, orderSn });
            copyrightCenter.changeRefuseModal(true);
          }}
        >
          监修不通过
        </button>
      </div>
    );
  } else if (payStatue === 4) {
    return (
      <div className="btns">
        <button className="btns__top"  style={{height: 'auto'}} onClick={() => {
          message.success('提醒发送成功');
        }}>提醒买家<br/>邮寄样品
        </button>
      </div>
    );
  } else if (payStatue === 5) {
    return (
      <div className="btns">
        <button
          className="btns__top"
          onClick={() => copyrightCenter.reviewSample({ auditStatus: 2 })}
        >
          监修通过
        </button>
        <button
          className="btns__bottom"
          onClick={async () => {
            await copyrightCenter.getOrderDetail({ userGuid, orderSn });
            copyrightCenter.changeRefuseModal(true);
          }}
        >
          监修不通过
        </button>
      </div>
    );
  } else if (payStatue === 6) {
    return (
      <div className="btns">
        <button
          className="btns__top"
          onClick={async () => {
            await copyrightCenter.getOrderDetail({ userGuid, orderSn });
            copyrightCenter.changeCollectionModal(true);
          }}
        >
          开票收款
        </button>
      </div>
    );
  }
};
