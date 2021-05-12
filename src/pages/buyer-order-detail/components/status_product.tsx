// 订单状态- 买家上传产品设计图待卖家监修
import * as React from 'react';
import { inject, observer } from "mobx-react";

let orderState = [
  {
    class: 'order1',
    name: '买家下单',
    step: '已付款',
  },
  {
    class: 'order2 active',
    name: '上传设计图待版权方(卖方)监修',
    step: '待上传设计图',
  },
  {
    class: 'order3',
    name: '邮寄产品样品待版权方(卖家)监修',
    step: '',
  },
  {
    class: 'order4',
    name: '授权交易完成 ',
    step: '',
  },
];

/**
 * type: 2(待上传设计稿)已下载原图、3设计稿待审核、4（待上传样品）设计稿审核通过、
 */
interface IProductProps extends IComponentProps {
  type: number,
  againAudit: boolean,
}

@inject("buyerOrder")
@observer
export default class StatusProduct extends React.Component<IProductProps, any> {

  componentDidMount() {
    const { type, againAudit } = this.props;

    if ((type === 2 && !againAudit) || type === 1) {
      orderState[1].step = '待上传设计图';
    } else if ((type === 3 && !againAudit) || (type === 3 && againAudit)) {
      orderState[1].step = '待卖家(版权方)监修产品图';
    } else if (type === 2 && againAudit) {
      orderState[1].step = '设计图未通过监修';
    }

  }

  render() {
    const { type, buyerOrder, againAudit } = this.props;
    const { detailList } = buyerOrder;
    const { feedback, sampleFigure, auditFigure, ipGallery } = detailList;
    // ipGallery.ipGalleryFileVO.fileUrl
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
          ((type === 2 && !againAudit) || type === 1) &&
          <div className="state-content">
            <div className="icon icon-421"/>
            <p>当前订单状态：您已获得授权，请下载图库高清源文件设计图，并上传给产品图给卖家（图库版权方）监修 </p>
            <div className="desc">请尽快上传授权类型的产品设计图给图库版权方进行审核，以便你尽快量产，抢占市场。</div>
            <div className="btn-group">
              <button className="small"
                      onClick={() => {
                        buyerOrder.changeUploadModal(true);
                      }}
              >上传设计图
              </button>
              <button className="small bg-white"
                      onClick={() => buyerOrder.download(ipGallery.ipGalleryFileVO.fileUrl)}
              >下载IP图库
              </button>
            </div>
          </div>
        }

        {
          type === 3 && !againAudit &&
          <div className="state-content">
            <div className="icon icon-421"/>
            <p>当前订单状态：您已上传产品设计图，待卖家（版权方）监修</p>
            <div className="img-group">
              {
                auditFigure && auditFigure.split(',').map((i, k) => {
                  return (
                    <img key={k} src={i} alt=""
                         onClick={() => {
                           // buyerOrder.changeImgShow(true);
                         }}/>
                  );
                })
              }
            </div>
            <div className="btn-group">
              <button className="small" onClick={() => {
                buyerOrder.remindSellerRepair();
              }}>提醒卖家监修
              </button>
              <button className="small bg-white"
                      onClick={() => buyerOrder.download(ipGallery.ipGalleryFileVO.fileUrl)}
              >下载IP图库
              </button>
            </div>
          </div>
        }

        {
          type === 2 && againAudit &&
          <div className="state-content">
            <div className="icon icon-421"/>
            <p>当前订单状态：您已上传产品设计图未通过卖家(版权方)监修，请修改后再次上传提交监修</p>
            <div className="desc"><span className="red">拒绝原因： </span>{feedback}</div>
            <div className="img-group">
              {
                sampleFigure && sampleFigure.split(',').map((i, k) => {
                  return (
                    <img key={k} src={i} alt=""
                         onClick={() => {
                           // buyerOrder.changeImgShow(true);
                         }}/>
                  );
                })
              }
            </div>
            <div className="btn-group">
              <button className="small"
                      onClick={() => {
                        buyerOrder.changeUploadModal(true);
                      }}
              >上传设计图
              </button>
              <button className="small bg-white"
                      onClick={() => buyerOrder.download(ipGallery.ipGalleryFileVO.fileUrl)}>下载IP图库
              </button>
            </div>
          </div>
        }

        {
          type === 3 && againAudit &&
          <div className="state-content">
            <div className="icon icon-421"/>
            <p>当前订单状态：您已再次上传产品设计图，待卖家(版权方)监修 </p>
            <div className="img-group">
              {
                auditFigure && auditFigure.split(',').map((i, k) => {
                  return (
                    <img key={k} src={i} alt=""
                         onClick={() => {
                           // buyerOrder.changeImgShow(true);
                         }}/>
                  );
                })
              }
            </div>
            <div className="btn-group">
              <button className="small" onClick={() => buyerOrder.remindSellerExamine}>提醒卖家审核</button>
              <button className="small bg-white"
                      onClick={() => buyerOrder.download(ipGallery.ipGalleryFileVO.fileUrl)}
              >下载IP图库
              </button>
            </div>
            <div className="no-success">
              <p>未通过监修的产品图 </p>
              <div className="desc"><span className="red">拒绝原因:</span>{feedback}</div>
              <div className="img-group">
                {
                  sampleFigure && sampleFigure.split(',').map((i, k) => {
                    return (
                      <img key={k} src={i} alt=""
                           onClick={() => {
                             // buyerOrder.changeImgShow(true);
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
  }

}
;
