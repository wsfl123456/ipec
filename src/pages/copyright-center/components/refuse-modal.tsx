/**
 * 监修不通过弹窗
 */
import * as React from "react";
import "assets/scss/copyright-modal.scss";
import ic_clear from "@assets/images/ic_clear.png";
import { inject, observer } from "mobx-react";
import Toast from "@components/toast";

@inject("copyrightCenter")
@observer
export default class RefuseModal extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { copyrightCenter, visibleshowRemindPay, type, visibleToast } = this.props;
    const {
      defaultAddress,
      listDistrict,
      changeDefaultAddress,
      reviewDesign,
      changeFeedback,
      feedback,
      reviewSample,
      detailList: {orderSn}
    } = copyrightCenter;
    return (
      <div
        className={`copyright-modal refuse-modal ${
          copyrightCenter.refuseModal ? "show" : "hide"
        }`}
      >
        <div className="modal-content refuse-content">
          <div className="modal-header">
            <p className="modal-title">请填写监修不通过原因</p>
            <img
              src={ic_clear}
              alt=""
              className="modal-close"
              onClick={() => {
                console.log(11);
                copyrightCenter.changeRefuseModal(false);
              }}
            />
          </div>
          <div className="modal-body modal-body-border_top">
            <textarea
              onChange={(e) => changeFeedback(e.target.value)}
              value={feedback}
              placeholder="请填写拒绝通过的原因 (必填)"
            />
          </div>
          <div className="modal-footer">
            <div className="modal-btn">
              <button
                onClick={async () => {
                  if (+type === 3) {
                    const { errorCode, errorMsg } = await reviewDesign({
                      auditStatus: 3,
                      feedback,
                      orderSn: orderSn
                    });
                    // visibleToast(errorMsg);
                  } else if (+type === 5) {
                    const { errorCode, errorMsg } = await reviewSample({
                      auditStatus: 3,
                      feedback,
                      orderSn: orderSn
                    });
                    // visibleToast(errorMsg);
                  }
                }}
                className="modal-button button-active"
              >
                监修不通过
              </button>
              <button
                className="modal-button "
                onClick={() => copyrightCenter.changeRefuseModal(false)}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
