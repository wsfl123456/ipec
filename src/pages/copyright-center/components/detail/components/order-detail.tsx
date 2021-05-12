import { AnyKindOfDictionary } from "lodash";
import * as React from "react";
import moment from "moment";
import { bytesToSize } from "@utils/util";

export default ({ orderDetail }: { orderDetail: any }) => {
  console.log(orderDetail);
  return (
    <div className="detail">
      <p className="title">订单详情</p>
      <div className="detail-content">
        <div className="msg">
          <p>买家信息</p>
          <div className="msg-div">
            企业名称：
            <span>{orderDetail.buyerCompanyName}</span>
          </div>
          <div className="msg-div">
            经营范围：
            <span>{orderDetail.buyerCompanyDesc}</span>
          </div>
        </div>
        <div className="msg order-msg">
          <p>订单信息</p>
          <div className="msg-div">
            订单号：<span>{orderDetail.orderSn}</span>
          </div>
          <div className="msg-div">
            创建时间：
            <span>
              {moment(new Date(orderDetail.createDate)).format(
                "YYYY-MM-DD HH-MM-SS"
              )}
            </span>
          </div>
          {Number(orderDetail.payStatue) > 0 && (
            <div className="msg-div">
              付款时间：{" "}
              <span>
                {moment(new Date(orderDetail.paymentDate)).format(
                  "YYYY-MM-DD HH-MM-SS"
                )}
              </span>
            </div>
          )}
          {Number(orderDetail.payStatue) > 0 && (
            <div className="msg-div">
              付款方式: <span>支付宝</span>
            </div>
          )}
          <table className="table-detail">
            <thead>
              <tr>
                <td>图库商品</td>
                <td>授权品类</td>
                <td>授权期限</td>
                <td>授权生产数量（个）</td>
                <td>买家预估生产量(个)</td>
                <td>授权金额</td>
                <td>平台服务费</td>
                <td>实收金额</td>
              </tr>
              <tr>
                <td>
                  <div className="pic">
                    <img src={orderDetail.picUrl} alt="" />
                    <div className="pic-desc">
                      <p className="word-ellipsis">
                        {!!orderDetail.ipGallery && orderDetail.ipGallery.title}
                      </p>
                      <p>
                        尺寸、分辨率：
                        {!!orderDetail.ipGallery &&
                          !!orderDetail.ipGallery.ipGalleryFileVO &&
                          orderDetail.ipGallery.ipGalleryFileVO
                            .resolvingPower}{" "}
                      </p>
                      <p>
                        文件大小：
                        {bytesToSize(
                          +(
                            !!orderDetail.ipGallery &&
                            !!orderDetail.ipGallery.ipGalleryFileVO &&
                            orderDetail.ipGallery.ipGalleryFileVO.fileSize
                          )
                        )}{" "}
                      </p>
                      <p>
                        文件格式：
                        {!!orderDetail.ipGallery &&
                          !!orderDetail.ipGallery.ipGalleryFileVO &&
                          orderDetail.ipGallery.ipGalleryFileVO.fileFormat}
                      </p>
                    </div>
                  </div>
                </td>
                <td>{orderDetail.authorizeType}</td>
                <td>{orderDetail.duration}个月</td>
                <td>
                  {orderDetail.productionQuantityMin}-50000
                  {orderDetail.productionQuantityMax}
                </td>
                <td>
                  <div className="num">
                    {orderDetail.productionQuantity}
                    <span>
                      买家已同意从平台采购防伪码便于后续版权方方位溯源
                    </span>
                  </div>
                </td>
                <td>¥{orderDetail.price}</td>
                <td>-{(+orderDetail.price * 0.1).toFixed(2)} （10%）</td>
                <td>¥{orderDetail.price - +orderDetail.price * 0.1}</td>
              </tr>
            </thead>
          </table>
          <div className="table-price">
            <p>
              应收金额：{" "}
              <span>¥{(orderDetail.price - +orderDetail.price * 0.1) * 100 / 100}</span>
            </p>
          </div>
          {Number(orderDetail.payStatue) > 0  && (
            <div className="warning">
              <span className="red">备注：</span>平台已收到买家付款，
              <span className="black">
                平台将根据授权协议约定扣除10%的服务费，
              </span>
              剩余款项授权交易完成后7个工作日内打到IP图库版权方公司指定的账户。
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
