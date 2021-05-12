// 买家-订单详情

import * as React from "react";
import "@assets/scss/copyright_order-detail.scss";
import arrow_right from "@assets/images/copyright-center/icon_arrow_right.png";
import Address from "@assets/images/copyright-center/icon_address.png";
import {
  OrderDetail,
  StatusOrder,
  StatusProduct,
  StatusSample,
  StatusComplete,
} from "./components/index";
import {
  CancelModal,
  CodeModal,
  PostAddress,
  LogisticsModal,
  UploadModal,
} from "@pages/user/components/buyer-order/components/index";
import { LookBigImg } from "@pages/copyright-center/components";
import { inject, observer } from "mobx-react";
import _isEmpty from "lodash/isEmpty";
import { toJS } from "mobx";
import GalleryPay from "../../pages/user/components/buyer-order/components/pay";
@inject("buyerOrder", "login")
@observer
export default class CopyrightDetail extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      isPay: false, // 未付款
    };
  }

  async componentDidMount() {
    const {
      buyerOrder,
      login,
      match: { params },
    } = this.props;
    // 获取路由参数值this.props.match.params.参数名
    const orderSn = params["orderSn"];
    const { userGuid } = login.userInfo || { userGuid: "" };
    buyerOrder.changeOrderGUid({ userGuid, orderSn })
    await buyerOrder.getOrderDetail({ userGuid, orderSn });
  }

  render() {
    // const { isPay } = this.state;
    const {
      buyerOrder,
      login,
      match: { params },
    } = this.props;
    const { detailList, weChatPay, alipay } = buyerOrder;
    const orderSn = params["orderSn"];
    const { userGuid } = login.userInfo || { userGuid: "" };
    const { payStatue, againAudit } = detailList;
    const order = payStatue === 0; // 买家下单
    const product =
      payStatue === 1 || payStatue === 2 || payStatue === 3 || payStatue === 8; // 设计图
    const sample = payStatue === 4 || payStatue === 5 || payStatue === 9; // 样品
    const complete = payStatue === 6 || payStatue === 7; // 完成
    console.log("buyer-order-detail", payStatue);
    return (
      <div>
        {!_isEmpty(detailList) && (
          <div className="order-detail">
            <div className="title">
              <img src={Address} alt="" />
              当前位置：个人中心
              <img src={arrow_right} alt="" />
              授权订单管理
              <img src={arrow_right} alt="" />
              <span className="purple">已购买的授权 </span>
            </div>
            <div className="state">
              {/*订单状态*/}
              {order && (
                <StatusOrder
                  buyOrder={buyerOrder}
                  userGuid={userGuid}
                  orderSn={orderSn}
                />
              )}
              {product && (
                <StatusProduct type={payStatue} againAudit={againAudit} />
              )}
              {sample && (
                <StatusSample type={payStatue} buyerOrder={buyerOrder} />
              )}
              {complete && <StatusComplete type={payStatue} />}

              {/*订单详情*/}
              {detailList && (
                <OrderDetail isPay={payStatue > 0} buyerOrder={buyerOrder} />
              )}
            </div>

            {/*  查看大图组件*/}
            <LookBigImg />

            {/* 取消订单原因弹窗*/}
            <CancelModal orderSn={orderSn} />

            {/* 获取防伪码提示弹窗*/}
            <CodeModal />

            {/* 查看邮寄地址弹窗*/}
            <PostAddress />

            {/* 物流单号弹窗*/}
            <LogisticsModal />

            {/* 上传弹窗*/}
            <UploadModal orderSn={orderSn} />

            {alipay && weChatPay && (
              <GalleryPay alipay={alipay} weChatPay={weChatPay} />
              // <GalleryPay
              //   galleryInfo={galleryInfo}
              //   galleryDetail={galleryDetail}
              //   orderParams={orderParams}
              //   getPayStatus={getPayStatus}
              //   alipay={alipay}
              //   weChatPay={weChatPay}
              //   closeModal={changePayCode}
              //   downloadGallery={downloadGallery}
              //   changepaySuccess={this.changepaySuccess}
              // />
            )}
          </div>
        )}
      </div>
    );
  }
}
