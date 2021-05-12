/**
 * 查看邮寄地址弹窗
 */
import * as React from 'react';
import 'assets/scss/copyright-modal.scss';
import ic_clear from '@assets/images/ic_clear.png';
import { inject, observer } from "mobx-react";
import { Link } from 'react-router-dom';
import info from '@assets/images/user/modal_info.png';

@inject('buyerOrder')
@observer
export default class PostAddress extends React.Component<any, any> {
  render() {
    const { buyerOrder } = this.props;
    const { detailList: i } = buyerOrder;
    return (
      <div className={`copyright-modal collection-modal ${buyerOrder.postAddressModal ? "show" : "hide"}`}>

        <div className="post-content">
          <div className="modal-header">
            <p>温馨提示</p>
            <img src={ic_clear} alt="" className="modal-close"
                 onClick={() => {
                   buyerOrder.changePostAddressModal(false);
                 }}/>
          </div>

          <div className="modal-body">
            <p className="invoice-title">复制地址 </p>
            <div className="invoice">
              <div className="invoice-body"><span>收货人:   </span>{i.businessConsignee}</div>
              <div className="invoice-body"><span>联系方式：  </span>{i.mobile}</div>
              <div className="invoice-body"><span>收货地址：  </span>{i.address}{i.addressDetail}</div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="modal-button button-active"
                    onClick={() => {
                      buyerOrder.changePostAddressModal(false);
                    }}
            >知道了
            </button>
          </div>

        </div>

      </div>
    );
  }
}
