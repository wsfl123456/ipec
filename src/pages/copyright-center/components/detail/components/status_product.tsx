// 订单状态- 监修买家产品设计图
import * as React from "react";
import success from "@assets/images/copyright-center/icon_success.png";
import { inject, observer } from "mobx-react";
/**
 * type: 2(待上传设计稿)已下载原图、3设计稿待审核、4（待上传样品）设计稿审核通过、
 */
interface IProductProps extends IComponentProps {
  type: number;
}
@inject("copyrightCenter")
@observer
export default class StatusProduct extends React.Component<IProductProps, any> {
  constructor(props) {
    super(props);
    this.state = {
      showPassModal: false,
      orderState: [
        {
          class: "order1",
          name: "买家下单",
          step: "买家已付款",
        },
        {
          class: "order2 active",
          name: "监修买家产品设计图",
          step: "",
        },
        {
          class: "order3",
          name: "监修买家产品样品",
          step: "",
        },
        {
          class: "order4",
          name: "授权交易完成 ",
          step: "",
        },
      ],
    };
  }
  componentDidMount(): void {
    const {
      type,
      orderDetail: { againAudit },
    } = this.props;
    switch (type) {
      case 1:
        // orderState[1].step = "待买家提交产品图";
        this.setState({
          orderState: [
            {
              class: "order1",
              name: "买家下单",
              step: "买家已付款",
            },
            {
              class: "order2 active",
              name: "监修买家产品设计图",
              step: "待买家提交产品图",
            },
            {
              class: "order3",
              name: "监修买家产品样品",
              step: "",
            },
            {
              class: "order4",
              name: "授权交易完成 ",
              step: "",
            },
          ],
        });
        break;
      case 2:
        if (againAudit) {
          this.setState({
            orderState: [
              {
                class: "order1",
                name: "买家下单",
                step: "买家已付款",
              },
              {
                class: "order2 active",
                name: "监修买家产品设计图",
                step: "监修不通过",
              },
              {
                class: "order3",
                name: "监修买家产品样品",
                step: "",
              },
              {
                class: "order4",
                name: "授权交易完成 ",
                step: "",
              },
            ],
          });
          // orderState[1].step = "监修不通过";
          break;
        } else {
          this.setState({
            orderState: [
              {
                class: "order1",
                name: "买家下单",
                step: "买家已付款",
              },
              {
                class: "order2 active",
                name: "监修买家产品设计图",
                step: "待买家提交产品图",
              },
              {
                class: "order3",
                name: "监修买家产品样品",
                step: "",
              },
              {
                class: "order4",
                name: "授权交易完成 ",
                step: "",
              },
            ],
          });
          break;
          // orderState[1].step = "待买家提交产品图";
          // break
        }
      case 3:
        this.setState({
          orderState: [
            {
              class: "order1",
              name: "买家下单",
              step: "买家已付款",
            },
            {
              class: "order2 active",
              name: "监修买家产品设计图",
              step: "待监修产品图",
            },
            {
              class: "order3",
              name: "监修买家产品样品",
              step: "",
            },
            {
              class: "order4",
              name: "授权交易完成 ",
              step: "",
            },
          ],
        });
        break;
      // case 4:
      //   break;
      // case 5:
      //   orderState[1].step = "监修不通过";
      //   break;
      default:
        break;
    }
  }

  render() {
    const {
      type,
      copyrightCenter,
      showRemindPay,
      visibleshowRemindPay,
      orderDetail,
      orderDetailStore,
    } = this.props;
    const { getAddressList } = orderDetailStore;
    const { showPassModal, orderState } = this.state;
    return (
      <div>
        <div className="order-state">
          {orderState &&
            orderState.map((item, index) => {
              return (
                <div className="state-item" key={index}>
                  <div className={`u-state ${item.class} `} />
                  <span className="step">{item.name}</span>
                  <span className="step-status">{item.step}</span>
                </div>
              );
            })}
        </div>
        {(type === 1 || type === 2) && (
          <div className="state-content">
            <div className="icon icon-421" />
            {!orderDetail.againAudit && (
              <p>
                当前订单状态：买家已付款获得IP图库授权，进入产品设计图设计阶段
              </p>
            )}
            {!!orderDetail.againAudit && (
              <React.Fragment>
                <p>
                  当前订单状态：您未通过买家的产品设计图，待买家再次提交监修
                  <div className="audit-reason">
                    <span>拒绝原因：</span>
                    {orderDetail.feedback}
                  </div>
                </p>
                <div className="img-group">
                  {!!orderDetail.sampleFigure &&
                    orderDetail.sampleFigure
                      .split(",")
                      .map((e, k) => <img src={e} key="k" alt="" />)}
                </div>
              </React.Fragment>
            )}
            <div className="btn-group">
              {!!showRemindPay && (
                <div className="remind-text">
                  <img src={success} alt="" /> 提醒上传设计图成功！
                </div>
              )}
              <button
                onClick={() => {
                  visibleshowRemindPay();
                }}
              >
                提醒买家上传产品图
              </button>
            </div>
          </div>
        )}

        {type === 3 && (
          <div className="state-content">
            <div className="icon icon-421" />
            <p>
              当前订单状态：买家已付款获得IP图库授权，并上传了IP相关产品设计图，待您监修
            </p>
            <div className="desc">
              若产品图一直未监修，将会影响授权交易完成进度，买家有投诉风险，同时也会影响你的授权回款速度，建议您尽快确认产品图是否可以生产。
            </div>
            <div className="img-group">
              {!!orderDetail.auditFigure &&
                orderDetail.auditFigure
                  .split(",")
                  .map((e, k) => <img src={e} key="k" alt="" />)}
            </div>
            <div className="btn-group">
              <button
                onClick={() => copyrightCenter.changeAddressModal(true)}
                className="small"
              >
                监修通过
              </button>
              <button
                className="small bg-white"
                onClick={() => copyrightCenter.changeRefuseModal(true)}
              >
                监修不通过
              </button>
            </div>

            {!!orderDetail.againAudit && (
              <div
                style={{
                  borderTop: "1px dashed #6236FF",
                  marginTop: "24px",
                  paddingTop: "24px",
                }}
              >
                <div className="icon icon-421" />
                <p>未通过监修的产品图</p>
                <div className="desc">
                  <span className="red">拒绝原因：</span>
                  {orderDetail.feedback}
                </div>
                <div className="img-group">
                  {!!orderDetail.sampleFigure &&
                    orderDetail.sampleFigure
                      .split(",")
                      .map((e, k) => <img src={e} key="k" alt="" />)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* {type === 4 && (
          <div className="state-content">
            <div className="icon icon-421" />
            <p>当前订单状态：您未通过买家的产品设计图，待买家再次提交监修 </p>
            <div className="desc">
              <span className="red">拒绝原因</span>
              不能直接使用原图，需提取部分元素进行设计
            </div>
            <div className="img-group">
              <img src="" alt="" />
              <img src="" alt="" />
            </div>
            <div className="btn-group">
              <button>提醒买家上传产品图</button>
            </div>
          </div>
        )} */}

        {/* {type === 5 && (
          <div className="state-content">
            <div className="icon icon-421" />
            <p>当前订单状态：买家已再次上传产品图，待您监修 </p>
            <div className="desc">
              若产品图一直未监修，将会影响授权交易完成进度，买家有投诉风险，同时也会影响你的授权回款速度，建议您尽快确认产品图是否可以生产。
            </div>
            <div className="img-group">
              <img src="" alt="" />
              <img src="" alt="" />
            </div>
            <div className="btn-group">
              <button className="small">监修通过</button>
              <button
                className="small bg-white"
                onClick={() => copyrightCenter.changeRefuseModal(true)}
              >
                监修不通过
              </button>
            </div>
            <div className="no-success">
              <p>未通过监修的产品图 </p>
              <div className="desc">
                <span className="red">拒绝原因:</span>
                不能直接使用原图，需提取部分元素进行设计
              </div>
              <div className="img-group">
                <img src="" alt="" />
                <img src="" alt="" />
              </div>
            </div>
          </div>
        )} */}
      </div>
    );
  }
}
