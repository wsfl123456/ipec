/**
 * 申请收款-五账户信息
 */
import * as React from "react";
import "assets/scss/copyright-modal.scss";
import ic_clear from "@assets/images/copyright-center/circle-close.png";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";

@inject("copyrightCenter", "login")
@observer
export default class CollectionModal extends React.Component<any, any> {
  render() {
    const { copyrightCenter, visibleToast, login } = this.props;
    const {
      isNOCollection,
      collectionParams,
      changecollectionParams,
      makeCollections,
      detailList: {orderSn}
    } = copyrightCenter;
    return (
      <div
        className={`copyright-modal collection-modal ${
          copyrightCenter.collectionModal ? "show" : "hide"
        }`}
      >
        <div className="collection-content">
          <div className="header-bg">
            <div className="bg-top">
              <p className="modal-title">申请收款</p>
              <p>
                实物样品已通过审核，授权交易完成。卖家可申请开票打款，平台将在收到卖家（版
              </p>
              <p>
                权方）开具的增值税专用发票的7个工作日内将款项打到指定的银行账户
              </p>
              <p>请填写/确认收款账户信息。</p>
              <img
                src={ic_clear}
                alt=""
                className="modal-close"
                onClick={() => {
                  copyrightCenter.changeCollectionModal(false);
                }}
              />
            </div>
          </div>
          {isNOCollection ? (
            <div className="modal-body">
              <div className="collection-form">
                <div className="form-group">
                  <label>
                    开户人/企业 <span className="dot">*</span>
                  </label>
                  <input
                    value={collectionParams.cardholder}
                    onChange={(e) => {
                      changecollectionParams({ cardholder: e.target.value });
                    }}
                    type="text"
                    className="form-control"
                    placeholder="请输入开户人/企业全称"
                  />
                </div>
                <div className="form-group">
                  <label>
                    开户行 <span className="dot">*</span>
                  </label>
                  <input
                    value={collectionParams.bankName}
                    onChange={(e) => {
                      changecollectionParams({ bankName: e.target.value });
                    }}
                    type="text"
                    className="form-control"
                    placeholder="请输入开户行"
                  />
                </div>
                <div className="form-group">
                  <label>
                    银行卡号 <span className="dot">*</span>
                  </label>
                  <input
                    value={collectionParams.bankCardNo}
                    onChange={(e) => {
                      changecollectionParams({ bankCardNo: e.target.value });
                    }}
                    type="text"
                    className="form-control"
                    placeholder="请输入银行卡号"
                  />
                </div>
                <div className="form-group">
                  <label>
                    银行预留手机号 <span className="dot">*</span>
                  </label>
                  <input
                    value={collectionParams.cardholderPhone}
                    onChange={(e) => {
                      changecollectionParams({
                        cardholderPhone: e.target.value,
                      });
                    }}
                    type="text"
                    className="form-control"
                    placeholder="请输入银行预留手机号"
                  />
                </div>
                {/* <div className="form-group code-area">
                    <label>验证码 <span className="dot">*</span></label>
                    <input type="text" className="form-control" placeholder="请输入收到的验证码"/>
                    <button className="btn-primary">获取验证码</button>
                  </div> */}
                <div className="form-operation">
                  <div className="thirty-checkbox">
                    <input type="checkbox" />
                    <span>我已阅读并同意</span>
                    <Link to="/">IP二厂服务协议</Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="modal-body">
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
            </div>
          )}

          <div className="modal-footer">
            <button
              className="modal-button button-active"
              onClick={async () => {
                const { errorCode, errorMsg } = await makeCollections({userGuid: login.userInfo.userGuid, orderSn});
              }}
            >
              {isNOCollection ? "确认提交" : "提交"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
