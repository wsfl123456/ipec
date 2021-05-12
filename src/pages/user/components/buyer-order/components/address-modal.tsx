/**
 * 产品图监修通过-地址填写
 */
import * as React from 'react';
import 'assets/scss/copyright-modal.scss';
import ic_clear from '@assets/images/copyright-center/circle-close.png';
import ic_address from '@assets/images/copyright-center/icon_address_blue.png';
import { inject, observer } from "mobx-react";
import { Link } from 'react-router-dom';

@inject('copyrightCenter')
@observer
export default class AddressModal extends React.Component<any, any> {
  render() {
    const { copyrightCenter } = this.props;
    return (
      <div className={`copyright-modal collection-modal ${copyrightCenter.addressModal ? "show" : "hide"}`}>

        <div className="collection-content">
          <div className="header-bg">
            <div className="bg-top">
              <p className="modal-title">产品图监修通过</p>
              <p>产品图已通过监修，买家将进入产品打样阶段，请提交收货信息，以便买家</p>
              <p>给您邮寄实物产品样品</p>
              <img src={ic_clear} alt="" className="modal-close"
                   onClick={() => {
                     copyrightCenter.changeAddressModal(false);
                   }}/>
            </div>
          </div>

          <div className="modal-body">
            <div className="collection-form">
              <div className="form-group">
                <label>收货人 <span className="dot">*</span></label>
                <Link to="/user/20" className="other-address">
                  <img src={ic_address} alt=""/>
                  选择其他地址</Link>
                <input type="text" className="form-control" placeholder="请输入收货人"/>
              </div>
              <div className="form-group">
                <label>联系方式 <span className="dot">*</span></label>
                <input type="text" className="form-control" placeholder="请输入联系方式"/>
              </div>
              <div className="form-group">
                <label>所在地区 <span className="dot">*</span></label>
                <input type="text" className="form-control" placeholder="请输入省/市/区/街道"/>
              </div>
              <div className="form-group">
                <label>详细地址 <span className="dot">*</span></label>
                <input type="text" className="form-control" placeholder="请输入详细地址信息，如道路、门牌号、小区、楼栋号、单元等信息"/>
              </div>
              <div className="form-operation">
                <div className="thirty-checkbox">
                  <input type="radio"/>
                  <span>设置为默认地址  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="modal-button button-active"> 提交</button>
          </div>

        </div>

      </div>
    );
  }
}
