/**
 * 填写物流单号弹窗
 */
import * as React from 'react';
import 'assets/scss/copyright-modal.scss';
import ic_clear from '@assets/images/copyright-center/circle-close.png';
import { inject, observer } from "mobx-react";
import { Icon } from "antd";
import { Link } from 'react-router-dom';

@inject('buyerOrder')
@observer
export default class LogisticsModal extends React.Component<any, any> {
  render() {
    const { buyerOrder } = this.props;
    const { uploadPicList, detailList } = buyerOrder;
    // const {orderSn} = detailList;
    const orderSn = detailList.orderSn || buyerOrder.orderSn;
    return (
      <div className={`copyright-modal  ${buyerOrder.logisticsModal ? "show" : "hide"}`}>

        <div className="logistics-content">
          <div className="header-bg">
            <div className="bg-top">
              <p className="modal-title">样品物流单号 </p>
              <p>请填写实物样品物流信息以便卖家(版权方)更好的收货审核检验，审核通过后</p>
              <p>便可量产投放市场</p>
              <img src={ic_clear} alt="" className="modal-close"
                   onClick={() => {
                     buyerOrder.changeLogisticsModal(false);
                   }}/>
            </div>
          </div>

          <div className="modal-body">
            <div className="logistics-form">
              <div className="form-group">
                <label>物流单号 <span className="dot">*</span></label>
                <input type="text"
                       onChange={e => buyerOrder.logisticsNum = e.currentTarget.value}
                       className="form-control" placeholder="请填写样品物流单号"/>
              </div>
              <div className="form-group">
                <label>物流公司 <span className="dot">*</span></label>
                <input type="text"
                       onChange={e => buyerOrder.logisticsCompany = e.currentTarget.value}
                       className="form-control" placeholder="请填写物流公司"/>
              </div>
              <div className="upload-group">
                <label>上传凭证</label>
                <div className="list">
                  {uploadPicList && uploadPicList.map((i: any, k) =>
                    <img
                      key={k}
                      alt=''
                      src={i}
                    />
                  )}
                  { uploadPicList.length < 5 &&
                    <div className="upload-box">
                      <Icon type="plus"/>
                      <input
                        type="file"
                        name="image_file"
                        accept="image/gif,image/jpg,image/jpeg,image/svg,image/png"
                        onChange={(e) => {
                          buyerOrder.uploadDesign(e, 2);
                        }}
                      />
                      <span>上传凭证最多传5张</span>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="modal-button button-active"
                    onClick={async () => {
                      const data: any = await buyerOrder.submitLogistics(orderSn);
                      if (data.status) {
                        buyerOrder.changeLogisticsModal(false);
                      }
                    }}
            >提交审核</button>
            <button className="modal-button bg-white"
                    onClick={() => {
                      buyerOrder.changeLogisticsModal(false);
                    }}
            >取消
            </button>
          </div>

        </div>

      </div>
    );
  }
}
