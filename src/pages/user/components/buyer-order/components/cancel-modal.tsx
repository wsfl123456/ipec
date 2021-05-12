/**
 * 取消订单弹窗
 */
import * as React from 'react';
import '@assets/scss/copyright-modal.scss';
import ic_clear from '@assets/images/ic_clear.png';
import info from '@assets/images/user/modal_info.png';
import { inject, observer } from "mobx-react";
import { Select } from 'antd';

const { Option } = Select;

let cancelString;
interface  ICancelProps extends IComponentProps{
  orderSn?: string;
}
@inject('buyerOrder')
@observer
export default class CancelModal extends React.Component<ICancelProps, any> {
  async componentDidMount() {
    const { buyerOrder } = this.props;
    await buyerOrder.getCancelReason();
  }

  render() {
    const { buyerOrder, orderSn } = this.props;
    const { cancelReason } = buyerOrder;
    return (
      <div className={`copyright-modal  ${buyerOrder.cancelModal ? "show" : "hide"}`}>

        <div className=" cancel-content">
          <div className="modal-header">
            <div className="title-box">
              <img src={info} alt=""/>
              <p>温馨提示</p>
            </div>
            <img src={ic_clear} alt="" className="modal-close" onClick={() => {
              buyerOrder.changeCancelModal(false);
            }}/>
          </div>
          <div className="cancel-body">
            <p>您确定要取消订单吗？取消订单后，该订单将在列表中删除，不可恢复</p>
            <div className="form-group">
              <label>请选择取消订单的理由：</label>
              <Select placeholder='请选择取消原因' style={{ width: '100%', height: 48 }} allowClear
                      onChange={value => cancelString = value
                      }>
                {
                  cancelReason && cancelReason.map(item => {
                    return <Option value={item.resourceValue} key={item.resourceKey}>{item.resourceValue}</Option>;
                  })
                }
              </Select>
            </div>
          </div>
          <div className="modal-footer">
            <div className="modal-btn">
              <button className="modal-button button-active"
                      onClick={async () => {
                        const params = { orderSn, remark: cancelString };
                        const { statue }: any = await buyerOrder.cancelOrderState(params);
                        if(statue){
                          buyerOrder.changeCancelModal(false)
                        }
                      }}>确定
              </button>
              <button className="modal-button " onClick={() => buyerOrder.changeCancelModal(false)}>取消</button>
            </div>
          </div>

        </div>

      </div>
    );
  }
}
