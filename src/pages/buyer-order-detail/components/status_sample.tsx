// 订单状态- 邮寄产品样品待卖家(版权方)监修
import * as React from 'react';

let orderState = [
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
    step: '待邮寄产品样品',
  },
  {
    class: 'order4',
    name: '授权交易完成 ',
    step: '',
  },
];
export default (
  { type, buyerOrder }
) => {
  const { detailList } = buyerOrder;
  const { feedback, sampleFigure, againAudit, logisticsInfo, auditFigure,  logisticsInfoHistory, orderSn} = detailList;
  //  againAudit:"再次审核 true是 false不是"

  if (type === 4 && !againAudit) {
    orderState[2].step = '待邮寄样品';
  } else if ((type === 5 && !againAudit) || (type === 4 && againAudit) || ( type === 5 && againAudit  )) {
    orderState[2].step = '待卖家接收监修';
  }

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
        type === 4 && !againAudit &&
        <div className="state-content">
          <div className="icon icon-709"/>
          <p>当前订单状态：您的产品设计图已通过卖家(版权方)监修，进入产品打样阶段 ，请尽快邮寄样品给卖方(版权方)监修 </p>
          <div className="desc">请尽快邮寄产品实物样品给图库版权方进行监修（并上传快递单号以便买家查询接收），样品监修通过即可量产，抢占市场。</div>
          <div className="btn-group">
            <button className="small"
                    onClick={() => {
                      buyerOrder.changeLogisticsModal(true, orderSn);
                    }}
            >填写物流单号
            </button>
            <button className="small bg-white"
                    onClick={() => {
                      buyerOrder.changePostAddressModal(true);
                    }}
            >查看邮寄地址
            </button>
          </div>
        </div>
      }

      {
        type === 5 && !againAudit &&
        <div className="state-content">
          <div className="icon icon-709"/>
          <p>当前订单状态：您已邮寄产品样品（{logisticsInfo}），待卖家(版权方)接收监修 </p>
          <div className="desc">邮寄凭证：</div>
          <div className="img-group">
            {
              auditFigure && auditFigure.split(',').map((item, idx) => {
                return (<img src={item} key={idx} alt=""/>);
              })
            }
          </div>
          <div className="btn-group">
            <button className="small" onClick={() => buyerOrder.remindSellerExamine()}>提醒卖家审核</button>
            <button className="small bg-white"
                    onClick={() => {
                      buyerOrder.changePostAddressModal(true);
                    }}
            >查看邮寄地址
            </button>
          </div>
        </div>
      }

      {
        type === 4 && againAudit &&
        <div className="state-content">
          <div className="icon icon-709"/>
          <p>当前订单状态：您邮寄的产品样品未通过卖家(版权方)监修，请根据拒绝原因重新打样邮寄 </p>
          <div className="desc"><span className="red">拒绝原因:</span>{feedback}</div>
          <div className="img-group">
            {
              auditFigure && auditFigure.split(',').map((item, idx) => {
                return (<img src={item} key={idx} alt=""/>);
              })
            }
          </div>
          <div className="btn-group">
            <button className="small"
                    onClick={() => {
                      buyerOrder.changeLogisticsModal(true, orderSn);
                    }}
            >填写物流单号
            </button>
            <button className="small bg-white"
                    onClick={() => {
                      buyerOrder.changePostAddressModal(true);
                    }}
            >查看邮寄地址
            </button>
          </div>
        </div>
      }

      {
        type === 5 && againAudit &&
        <div className="state-content">
          <div className="icon icon-709"/>
          <p>当前订单状态：您已再次邮寄产品样品（ {logisticsInfo}），待卖家(版权方)监修</p>
          <div className="desc">邮寄凭证 ：</div>
          <div className="img-group">
            {
              auditFigure && auditFigure.split(',').map((item, idx) => {
                return (<img src={item} key={idx} alt=""/>);
              })
            }
          </div>
          <div className="btn-group">
            <button className="small" onClick={() => buyerOrder.remindSellerExamine()}>提醒卖家审核</button>
            <button className="small bg-white" onClick={() => {
              buyerOrder.changePostAddressModal(true);
            }}
            >查看邮寄地址
            </button>
          </div>
          <div className="no-success">
            <p>未通过监修的样品：  {logisticsInfoHistory} </p>
            <div className="desc"><span className="red">拒绝原因:</span>{feedback}</div>
            <div className="img-group">
              {
                sampleFigure && sampleFigure.split(',').map((i, k) => {
                  return (
                    <img key={k} src={i} alt=""
                         onClick={() => {
                           buyerOrder.changeImgShow(true);
                         }}/>
                  );
                })
              }
            </div>
          </div>
        </div>
      }
    </div>
  );
};
