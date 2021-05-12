/**
 * 获取防伪码提示弹窗
 */
import * as React from 'react';
import '@assets/scss/copyright-modal.scss';
import ic_clear from '@assets/images/ic_clear.png';
import info from '@assets/images/user/modal_info.png';
import { inject, observer } from "mobx-react";

@inject('buyerOrder')
@observer
export default class CancelModal extends React.Component<any, any> {
  render() {
    const { buyerOrder } = this.props;
    return (
      <div className={`copyright-modal  ${buyerOrder.codeModal ? "show" : "hide"}`}>
        <div className="code-content">
          <div className="modal-header">
            <div className="title-box">
              <img src={info} alt=""/>
              <p>温馨提示</p>
            </div>
            <img src={ic_clear} alt="" className="modal-close" onClick={() => {
              buyerOrder.changeCodeModal(false);
            }}/>
          </div>
          <div className="cancel-body">
            <p>平台已收到您的发货请求，将在7个工作日内安排防伪码邮寄工作，货物寄出后该订单将会显示发货物流单号，请注意查收！</p>
          </div>
          <div className="modal-footer">
            <button className="modal-button button-active"
                    onClick={() => {
                      buyerOrder.changeCodeModal(false);
                    }}
            >知道了
            </button>
          </div>

        </div>
      </div>
    );
  }
}
