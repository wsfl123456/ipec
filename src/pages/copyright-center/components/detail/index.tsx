// 订单详情

import * as React from "react";
import { observer, inject } from "mobx-react";
import "@assets/scss/copyright_order-detail.scss";
import arrow_right from "@assets/images/copyright-center/icon_arrow_right.png";
import Address from "@assets/images/copyright-center/icon_address.png";
import Ic_clear from "@assets/images/vip-card/ic_clear.svg";
import Selected from "@assets/images/vip-card/selected.png";
import ic_clear from "@assets/images/ic_clear.png";
import success_icon from "@assets/images/success-icon.png";

import {
  OrderDetail,
  Status,
  Prompt,
  StatusOrder,
  StatusProduct,
  StatusSample,
  StatusComplete,
} from "./components/index";
import {
  LookBigImg,
  RefuseModal,
  CollectionModal,
  AddressModal,
} from "@pages/copyright-center/components";
import Toast from "@components/toast";

const complete = false; // 完成

@inject("copyrightCenter", "orderDetailStore", "login")
@observer
export default class CopyrightDetail extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      isPay: false, // 未付款
      isInvoice: true, // 样品通过，发票
      showRemindPay: false,
      showToast: false,
      toastMsg: "",
      sampleSuccess: false
    };
  }

  async componentDidMount() {
    const {
      orderDetailStore,
      copyrightCenter,
      login,
      location: { search },
      match: { params },
    } = this.props;
    orderDetailStore.changeUserInfo(login.userInfo);
    orderDetailStore.changeOrderDetail(unescape(params["orderSn"]));
    copyrightCenter.changeOrderDetail(unescape(params["orderSn"]));
    orderDetailStore.buyerOrderDetail();
    copyrightCenter.getOrderDetail({userGUid: login.userInfo, orderSn: unescape(params["orderSn"]) })
    
  }

  visibleshowRemindPay = () => {
    this.setState({
      showRemindPay: true,
    });
    setTimeout(() => {
      this.setState({
        showRemindPay: false,
      });
    }, 1500);
  };

  visibleToast = (toastMsg) => {
    this.setState({
      showToast: true,
      toastMsg,
    });
  };

  visiblesampleSuccess = () => {
    this.setState({
      sampleSuccess: true,
    });
  };

  closesample = () => {
    this.setState({
      sampleSuccess: false,
    });
  };

  render() {
    const { isPay, isInvoice, showRemindPay, sampleSuccess } = this.state;
    const { copyrightCenter } = this.props;
    const { imgShow, refuseModal, changeCollectionModal } = copyrightCenter;
    const {
      orderDetailStore,
      login,
      location: { search },
      match: { params },
    } = this.props;
    const { orderDetail, payStatue } = orderDetailStore;

    return (
      <div className="order-detail">
        <div className="title">
          <img src={Address} alt="" />
          当前位置：版权中心
          <img src={arrow_right} alt="" />
          图库订单管理
          <img src={arrow_right} alt="" />
          <span className="purple">已卖出的图库 </span>
        </div>
        <div className="state">
          {/*订单状态*/}
          {payStatue === 0 && (
            <StatusOrder
              visibleshowRemindPay={this.visibleshowRemindPay}
              showRemindPay={showRemindPay}
            />
          )}
          {!!orderDetail.id &&
            (payStatue === 1 || payStatue === 2 || payStatue === 3) && (
              <StatusProduct
                type={payStatue}
                changeImgShow={copyrightCenter.changeImgShow}
                copyrightCenter={copyrightCenter}
                visibleshowRemindPay={this.visibleshowRemindPay}
                showRemindPay={showRemindPay}
                orderDetail={orderDetail}
                orderDetailStore={orderDetailStore}
              />
            )}
          {!!orderDetail.id && (payStatue === 4 || payStatue === 5) && (
            <StatusSample
              type={payStatue}
              visibleshowRemindPay={this.visibleshowRemindPay}
              showRemindPay={showRemindPay}
              orderDetail={orderDetail}
              copyrightCenter={copyrightCenter}
              visiblesampleSuccess={this.visiblesampleSuccess}
              visibleToast={this.visibleToast}
            />
          )}
          {!!orderDetail.id && (payStatue === 6 || payStatue === 7) && <StatusComplete type={payStatue} visibleToast={this.visibleToast} />}

          {/*订单详情*/}
          {!!orderDetail.id && <OrderDetail orderDetail={orderDetail} />}

          {/*样品审核通过-开票收款*/}
          <Prompt />
        </div>

        {/*  查看大图组件*/}
        <LookBigImg />

        {/* 监修不通过弹窗*/}
        <RefuseModal type={payStatue} visibleToast={this.visibleToast} />

        {/*产品图监修通过 填写修改地址*/}
        <AddressModal visibleToast={this.visibleToast} />

        {/*无账户信息-申请收款  */}
        <CollectionModal />

        {this.state.showToast && (
          <Toast
            onClose={() => {
              this.setState({ showToast: false });
            }}
            duration={2}
            message={this.state.toastMsg}
          />
        )}
        {sampleSuccess && (
          <div className="tips-modal">
            <div className="area">
              <img
                className="clear"
                src={ic_clear}
                onClick={() => {
                  this.setState({ sampleSuccess: false });
                }}
                alt=""
              />
              <div className="head">
                <img src={success_icon} alt="" />
                <p
                  style={{
                    fontSize: "18px",
                    fontFamily: "PingFangSC-Medium, PingFang SC",
                    fontWeight: 500,
                    color: "#343A40",
                    lineHeight: "25px",
                  }}
                >
                  样品审核通过
                </p>
              </div>
              <div className="body-error">
              </div>
              <div className="foot">
                <div
                  onClick={() => {
                    this.closesample()
                    changeCollectionModal(true)
                  }}
                  style={{color: "#fff"}}
                >
                  开票收款
                </div>
                {/* <div
                  onClick={() => {
                    this.setState({ paySuccess: false });
                  }}
                >
                  取消
                </div> */}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
