// 订单状态 - 授权交易完成
import * as React from 'react';
import { inject, observer } from "mobx-react";

const orderState = [
  {
    class: 'order1',
    name: '买家下单',
    step: '已付款',
  },
  {
    class: 'order2 active',
    name: '上传设计图待卖家(版权方)监修',
    step: '设计图监修通过',
  },
  {
    class: 'order3 active',
    name: '邮寄产品样品待卖家(版权方)监修',
    step: '样品监修通过',
  },
  {
    class: 'order4 active',
    name: '授权交易完成 ',
    step: '获取防伪码',
  },
];

@inject('buyerOrder')
@observer
export default class StatusComplete extends React.Component<any, any> {
  componentDidMount(): void {
    const { type, buyerOrder } = this.props;
    const { detailList: { businessConsignee } } = buyerOrder;
    switch (type) {
      case 6:
        if (!businessConsignee) {
          orderState[3].step = '获取防伪码';
        }else{
          orderState[3].step = '防伪码已寄出，订单完成';
        }
        break;
      case 7:
        orderState[3].step = '防伪码已寄出，订单完成';
        break;
    }
  }

  render() {
    const { buyerOrder, type } = this.props;
    const { detailList } = buyerOrder;
    const { authorizeExpiryDate, securityCodeLogistics, businessConsignee } = detailList;
    return (
      <div>
        <div className="order-state">
          {
            orderState && orderState.map((item, index) => {
              return (
                <div className="state-item" key={index}>
                  <div className={`u-state ${item.class} `}/>
                  <span className="step">{item.name}</span>
                  <span className="step-status">{item.step}</span>
                </div>
              );
            })
          }
        </div>
        {
          type > 5 && !businessConsignee &&
          <div className="state-content">
            <div className="icon icon-994"/>
            <p>当前订单状态：您的产品样品已通过监修，授权将在{authorizeExpiryDate}日结束，请点击获取防伪码尽快量产，我们将在7个工作日内给你邮寄防伪码 </p>
            <div className="desc">请严格根据从平台采购的防伪码数量进行一对一生产，以确保版权方和生产方实现产品全生命周期的追溯管理，每个环节有据可查有责可追。</div>
            <div className="btn-group">
              <button className="small"
                      onClick={() => {
                        buyerOrder.changeCodeModal(true);
                      }}
              >获取防伪码
              </button>
            </div>
          </div>
        }
        {
          type === 7 || (type > 5 && !!businessConsignee) &&
          <div className="state-content">
            <div className="icon icon-994"/>
            <p>当前订单状态：平台已寄出防伪码（{securityCodeLogistics}），请注意查收 ！</p>
            <div className="desc">请严格根据从平台采购的防伪码数量进行一对一生产，以确保版权方和生产方实现产品全生命周期的追溯管理，每个环节有据可查有责可追。</div>
          </div>
        }
      </div>
    );
  }
}
